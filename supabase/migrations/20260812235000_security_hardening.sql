-- Migration: 20260812235000_security_hardening.sql
-- Description: Security hardening with indexes, explicit table RLS policies (replacing FOR ALL), reviewer role semantics, and storage policies

-- 1. Ensure Private Schema & Usage Grants
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Update Helper Functions in Schema Private with SET search_path = ''

-- 2.1 private.has_role
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.user_role_type)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
END;
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.user_role_type) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.user_role_type) TO authenticated, service_role;

-- 2.2 private.is_pro_user (Enhanced PRO validation enforcing plan = 'pro', active/trialing status, and current_period_end)
CREATE OR REPLACE FUNCTION private.is_pro_user(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.user_id = _user_id
      AND s.plan = 'pro'
      AND s.status IN ('active', 'trialing')
      AND (s.current_period_end IS NULL OR s.current_period_end > now())
  );
END;
$$;

REVOKE ALL ON FUNCTION private.is_pro_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_pro_user(uuid) TO authenticated, service_role;

-- 2.3 private.handle_new_user
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.handle_new_user() TO service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

-- 2.4 private.validate_progress_block_lesson
CREATE OR REPLACE FUNCTION private.validate_progress_block_lesson()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.last_block_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      WHERE lb.id = NEW.last_block_id AND lb.lesson_id = NEW.lesson_id
    ) THEN
      RAISE EXCEPTION 'Invalid last_block_id %: does not belong to lesson %', NEW.last_block_id, NEW.lesson_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.validate_progress_block_lesson() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.validate_progress_block_lesson() TO service_role;

DROP TRIGGER IF EXISTS validate_progress_block_lesson_trigger ON public.lesson_progress;
CREATE TRIGGER validate_progress_block_lesson_trigger
  BEFORE INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION private.validate_progress_block_lesson();

-- 3. Additional Performance Indexes (Objective 7 compliance)
CREATE INDEX IF NOT EXISTS idx_subjects_cover_media_id ON public.subjects(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_chapters_cover_media_id ON public.chapters(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_lessons_cover_media_id ON public.lessons(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_media_created_by ON public.media(created_by);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_last_block_id ON public.lesson_progress(last_block_id);

-- 4. Targeted Remediation for Negative Test Artifacts in user_streaks
UPDATE public.user_streaks SET current_streak = 0 WHERE current_streak < 0;
UPDATE public.user_streaks SET longest_streak = 0 WHERE longest_streak < 0;

-- 5. Idempotent Check Constraints on Existing Tables
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_streaks_current_check') THEN
        ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_current_check CHECK (current_streak >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_streaks_longest_check') THEN
        ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_longest_check CHECK (longest_streak >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lesson_progress_percent_check') THEN
        ALTER TABLE public.lesson_progress ADD CONSTRAINT lesson_progress_percent_check CHECK (progress_percent >= 0 AND progress_percent <= 100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_plan_check') THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'pro'));
    END IF;
END $$;

-- 6. Explicit Table RLS Policies Replacing FOR ALL (Objective 7 & 8 Role Semantics)

-- 6.1 subjects
DROP POLICY IF EXISTS "subjects_select_policy" ON public.subjects;
CREATE POLICY "subjects_select_policy" ON public.subjects
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "subjects_insert_policy" ON public.subjects;
CREATE POLICY "subjects_insert_policy" ON public.subjects
  FOR INSERT TO authenticated
  WITH CHECK (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "subjects_update_policy" ON public.subjects;
CREATE POLICY "subjects_update_policy" ON public.subjects
  FOR UPDATE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "subjects_delete_policy" ON public.subjects;
CREATE POLICY "subjects_delete_policy" ON public.subjects
  FOR DELETE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 6.2 chapters
DROP POLICY IF EXISTS "chapters_select_policy" ON public.chapters;
CREATE POLICY "chapters_select_policy" ON public.chapters
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "chapters_insert_policy" ON public.chapters;
CREATE POLICY "chapters_insert_policy" ON public.chapters
  FOR INSERT TO authenticated
  WITH CHECK (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "chapters_update_policy" ON public.chapters;
CREATE POLICY "chapters_update_policy" ON public.chapters
  FOR UPDATE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "chapters_delete_policy" ON public.chapters;
CREATE POLICY "chapters_delete_policy" ON public.chapters
  FOR DELETE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 6.3 lessons
DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;
CREATE POLICY "lessons_select_policy" ON public.lessons
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lessons_insert_policy" ON public.lessons;
CREATE POLICY "lessons_insert_policy" ON public.lessons
  FOR INSERT TO authenticated
  WITH CHECK (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lessons_update_policy" ON public.lessons;
CREATE POLICY "lessons_update_policy" ON public.lessons
  FOR UPDATE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lessons_delete_policy" ON public.lessons;
CREATE POLICY "lessons_delete_policy" ON public.lessons
  FOR DELETE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 6.4 lesson_blocks
DROP POLICY IF EXISTS "lesson_blocks_select_policy" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_select_policy" ON public.lesson_blocks
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = lesson_blocks.lesson_id
        AND (
          (l.status = 'published' AND l.access_level = 'free')
          OR (l.status = 'published' AND private.is_pro_user((SELECT auth.uid())))
          OR private.has_role((SELECT auth.uid()), 'editor')
          OR private.has_role((SELECT auth.uid()), 'reviewer')
          OR private.has_role((SELECT auth.uid()), 'super_admin')
        )
    )
  );

DROP POLICY IF EXISTS "lesson_blocks_insert_policy" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_insert_policy" ON public.lesson_blocks
  FOR INSERT TO authenticated
  WITH CHECK (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lesson_blocks_update_policy" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_update_policy" ON public.lesson_blocks
  FOR UPDATE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lesson_blocks_delete_policy" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_delete_policy" ON public.lesson_blocks
  FOR DELETE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 6.5 user_roles (Explicit management restricted to super_admin)
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
CREATE POLICY "user_roles_select_policy" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
CREATE POLICY "user_roles_insert_policy" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
CREATE POLICY "user_roles_update_policy" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;
CREATE POLICY "user_roles_delete_policy" ON public.user_roles
  FOR DELETE TO authenticated
  USING (
    private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 7. Idempotent Storage Buckets & Policies
DO $$ BEGIN
    INSERT INTO storage.buckets (id, name, public) VALUES ('public-media', 'public-media', true) ON CONFLICT (id) DO UPDATE SET public = true;
    INSERT INTO storage.buckets (id, name, public) VALUES ('pro-media', 'pro-media', false) ON CONFLICT (id) DO UPDATE SET public = false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DROP POLICY IF EXISTS "storage_public_media_select" ON storage.objects;
CREATE POLICY "storage_public_media_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'public-media');

DROP POLICY IF EXISTS "storage_pro_media_select" ON storage.objects;
CREATE POLICY "storage_pro_media_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'pro-media' AND (
      private.is_pro_user((SELECT auth.uid()))
      OR private.has_role((SELECT auth.uid()), 'editor')
      OR private.has_role((SELECT auth.uid()), 'reviewer')
      OR private.has_role((SELECT auth.uid()), 'super_admin')
    )
  );

DROP POLICY IF EXISTS "storage_media_write_admin" ON storage.objects;
CREATE POLICY "storage_media_write_admin" ON storage.objects
  FOR ALL TO authenticated
  USING (
    (bucket_id IN ('public-media', 'pro-media')) AND (
      private.has_role((SELECT auth.uid()), 'editor')
      OR private.has_role((SELECT auth.uid()), 'super_admin')
    )
  )
  WITH CHECK (
    (bucket_id IN ('public-media', 'pro-media')) AND (
      private.has_role((SELECT auth.uid()), 'editor')
      OR private.has_role((SELECT auth.uid()), 'super_admin')
    )
  );

-- 8. Table Privileges
GRANT SELECT ON public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media TO anon;
REVOKE ALL ON public.profiles, public.user_roles, public.subscriptions, public.lesson_progress, public.user_streaks FROM anon;

GRANT SELECT ON public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media, public.profiles, public.user_roles, public.subscriptions, public.lesson_progress, public.user_streaks TO authenticated;
GRANT INSERT, UPDATE ON public.profiles, public.lesson_progress, public.user_streaks TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles, public.subscriptions, public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media FROM authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
