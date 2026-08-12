-- Migration: 20260812170000_initial_schema_and_rls.sql
-- Description: Platforma Bac initial PostgreSQL schema, custom types, secure helper functions, data integrity triggers, storage buckets, and RLS policies

-- 1. Create Private Schema (Unexposed via Data API / PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Custom Enums
DO $$ BEGIN
    CREATE TYPE public.user_role_type AS ENUM ('student', 'editor', 'reviewer', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.lesson_access_level AS ENUM ('free', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.lesson_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.media_type AS ENUM ('image', 'audio', 'video', 'document');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.progress_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Security Definer Helper Functions (using SET search_path = '' and fully-qualified schema names)
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

-- Enhanced PRO Check: requires plan = 'pro', active/trialing status, and valid unexpired current_period_end
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

-- 4. Tables Creation with Strict Data Integrity Check Constraints

-- 4.1 profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.2 user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role_type NOT NULL DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role)
);

-- 4.3 media
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.media_type NOT NULL,
  storage_bucket text NOT NULL,
  storage_path text NOT NULL,
  filename text,
  mime_type text,
  size_bytes bigint CONSTRAINT media_size_bytes_check CHECK (size_bytes IS NULL OR size_bytes >= 0),
  title text,
  description text,
  alt_text text,
  duration_seconds integer CONSTRAINT media_duration_seconds_check CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.4 subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text,
  description text,
  icon text,
  cover_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  accent_theme text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.5 chapters
CREATE TABLE IF NOT EXISTS public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  cover_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chapters_subject_id_slug_key UNIQUE (subject_id, slug)
);

-- 4.6 lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  estimated_minutes integer CONSTRAINT lessons_estimated_minutes_check CHECK (estimated_minutes IS NULL OR estimated_minutes >= 0),
  access_level public.lesson_access_level NOT NULL DEFAULT 'free',
  status public.lesson_status NOT NULL DEFAULT 'draft',
  cover_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lessons_chapter_id_slug_key UNIQUE (chapter_id, slug)
);

-- 4.7 lesson_blocks
CREATE TABLE IF NOT EXISTS public.lesson_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.8 lesson_progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status public.progress_status NOT NULL DEFAULT 'not_started',
  progress_percent integer NOT NULL DEFAULT 0 CONSTRAINT lesson_progress_percent_check CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_block_id uuid REFERENCES public.lesson_blocks(id) ON DELETE SET NULL,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id)
);

-- 4.9 user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0 CONSTRAINT user_streaks_current_check CHECK (current_streak >= 0),
  longest_streak integer NOT NULL DEFAULT 0 CONSTRAINT user_streaks_longest_check CHECK (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.10 subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'stripe',
  provider_customer_id text,
  provider_subscription_id text,
  plan text NOT NULL DEFAULT 'free' CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'pro')),
  status public.subscription_status NOT NULL DEFAULT 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure Check Constraints on Existing Tables
DO $$ BEGIN
    ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_current_check CHECK (current_streak >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_longest_check CHECK (longest_streak >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.lesson_progress ADD CONSTRAINT lesson_progress_percent_check CHECK (progress_percent >= 0 AND progress_percent <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'pro'));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_table THEN NULL;
END $$;

-- 5. Indexes Creation
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON public.chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON public.lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_status_access ON public.lessons(status, access_level);
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_lesson_sort ON public.lesson_blocks(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- 6. Database Triggers for Data Integrity and User Signups

-- 6.1 Trigger for Auto Profile & Student Role Creation in private schema
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

-- 6.2 Trigger enforcing that last_block_id belongs to the corresponding lesson_id
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

-- 7. Table Grants & Explicit Revokes
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles, public.lesson_progress, public.user_streaks TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles, public.subscriptions, public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media FROM authenticated, anon;

-- 8. Enable RLS on All Public Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- 9.1 profiles
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR private.has_role((SELECT auth.uid()), 'super_admin'));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 9.2 user_roles
DROP POLICY IF EXISTS "user_roles_select_own_or_admin" ON public.user_roles;
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR private.has_role((SELECT auth.uid()), 'super_admin'));

DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.3 media (Strict contextual access)
DROP POLICY IF EXISTS "media_select_published" ON public.media;
DROP POLICY IF EXISTS "media_select_anon" ON public.media;
CREATE POLICY "media_select_anon" ON public.media
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects s WHERE s.cover_media_id = media.id AND s.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.chapters c WHERE c.cover_media_id = media.id AND c.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.lessons l WHERE l.cover_media_id = media.id AND l.status = 'published' AND l.access_level = 'free'
    ) OR EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.lessons l ON l.id = lb.lesson_id
      WHERE l.status = 'published' AND l.access_level = 'free'
        AND (lb.content->>'media_id' = media.id::text OR lb.content->>'poster_media_id' = media.id::text)
    )
  );

DROP POLICY IF EXISTS "media_select_authenticated" ON public.media;
CREATE POLICY "media_select_authenticated" ON public.media
  FOR SELECT TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.subjects s WHERE s.cover_media_id = media.id AND s.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.chapters c WHERE c.cover_media_id = media.id AND c.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.lessons l WHERE l.cover_media_id = media.id AND l.status = 'published' AND l.access_level = 'free'
    ) OR EXISTS (
      SELECT 1 FROM public.lessons l WHERE l.cover_media_id = media.id AND l.status = 'published' AND l.access_level = 'pro' AND private.is_pro_user((SELECT auth.uid()))
    ) OR EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.lessons l ON l.id = lb.lesson_id
      WHERE l.status = 'published' AND (
        l.access_level = 'free'
        OR (l.access_level = 'pro' AND private.is_pro_user((SELECT auth.uid())))
      ) AND (lb.content->>'media_id' = media.id::text OR lb.content->>'poster_media_id' = media.id::text)
    ) OR private.has_role((SELECT auth.uid()), 'reviewer')
      OR private.has_role((SELECT auth.uid()), 'editor')
      OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "media_editor_all" ON public.media;
CREATE POLICY "media_editor_all" ON public.media
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.4 subjects
DROP POLICY IF EXISTS "subjects_select_published" ON public.subjects;
DROP POLICY IF EXISTS "subjects_select_anon" ON public.subjects;
CREATE POLICY "subjects_select_anon" ON public.subjects
  FOR SELECT TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "subjects_select_authenticated" ON public.subjects;
CREATE POLICY "subjects_select_authenticated" ON public.subjects
  FOR SELECT TO authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "subjects_admin_all" ON public.subjects;
CREATE POLICY "subjects_admin_all" ON public.subjects
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.5 chapters
DROP POLICY IF EXISTS "chapters_select_published" ON public.chapters;
DROP POLICY IF EXISTS "chapters_select_anon" ON public.chapters;
CREATE POLICY "chapters_select_anon" ON public.chapters
  FOR SELECT TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "chapters_select_authenticated" ON public.chapters;
CREATE POLICY "chapters_select_authenticated" ON public.chapters
  FOR SELECT TO authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "chapters_admin_all" ON public.chapters;
CREATE POLICY "chapters_admin_all" ON public.chapters
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.6 lessons
DROP POLICY IF EXISTS "lessons_select_free_published" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_anon" ON public.lessons;
CREATE POLICY "lessons_select_anon" ON public.lessons
  FOR SELECT TO anon
  USING (status = 'published' AND access_level = 'free');

DROP POLICY IF EXISTS "lessons_select_authenticated_free" ON public.lessons;
CREATE POLICY "lessons_select_authenticated_free" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    (status = 'published' AND access_level = 'free')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

DROP POLICY IF EXISTS "lessons_select_pro_published" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_authenticated_pro" ON public.lessons;
CREATE POLICY "lessons_select_authenticated_pro" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    status = 'published' AND access_level = 'pro' AND private.is_pro_user((SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "lessons_admin_all" ON public.lessons;
CREATE POLICY "lessons_admin_all" ON public.lessons
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.7 lesson_blocks
DROP POLICY IF EXISTS "lesson_blocks_select_permitted" ON public.lesson_blocks;
DROP POLICY IF EXISTS "lesson_blocks_select_anon" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_select_anon" ON public.lesson_blocks
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = lesson_blocks.lesson_id
        AND l.status = 'published'
        AND l.access_level = 'free'
    )
  );

DROP POLICY IF EXISTS "lesson_blocks_select_authenticated" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_select_authenticated" ON public.lesson_blocks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = lesson_blocks.lesson_id
        AND (
          (l.status = 'published' AND l.access_level = 'free')
          OR (l.status = 'published' AND l.access_level = 'pro' AND private.is_pro_user((SELECT auth.uid())))
          OR private.has_role((SELECT auth.uid()), 'reviewer')
          OR private.has_role((SELECT auth.uid()), 'editor')
          OR private.has_role((SELECT auth.uid()), 'super_admin')
        )
    )
  );

DROP POLICY IF EXISTS "lesson_blocks_admin_all" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_admin_all" ON public.lesson_blocks
  FOR ALL TO authenticated
  USING (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'))
  WITH CHECK (private.has_role((SELECT auth.uid()), 'editor') OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 9.8 lesson_progress
DROP POLICY IF EXISTS "lesson_progress_select_own" ON public.lesson_progress;
CREATE POLICY "lesson_progress_select_own" ON public.lesson_progress
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lesson_progress_insert_own" ON public.lesson_progress;
CREATE POLICY "lesson_progress_insert_own" ON public.lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lesson_progress_update_own" ON public.lesson_progress;
CREATE POLICY "lesson_progress_update_own" ON public.lesson_progress
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 9.9 user_streaks
DROP POLICY IF EXISTS "user_streaks_select_own" ON public.user_streaks;
CREATE POLICY "user_streaks_select_own" ON public.user_streaks
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_streaks_insert_own" ON public.user_streaks;
CREATE POLICY "user_streaks_insert_own" ON public.user_streaks
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_streaks_update_own" ON public.user_streaks;
CREATE POLICY "user_streaks_update_own" ON public.user_streaks
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 9.10 subscriptions
DROP POLICY IF EXISTS "subscriptions_select_own_or_admin" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own_or_admin" ON public.subscriptions
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR private.has_role((SELECT auth.uid()), 'super_admin'));

-- 10. Storage RLS Policies (storage.objects for public-media and pro-media buckets)

DO $$ BEGIN
    INSERT INTO storage.buckets (id, name, public) VALUES ('public-media', 'public-media', true) ON CONFLICT DO NOTHING;
    INSERT INTO storage.buckets (id, name, public) VALUES ('pro-media', 'pro-media', false) ON CONFLICT DO NOTHING;
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
