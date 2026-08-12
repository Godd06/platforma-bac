-- Migration: 20260813022000_enforce_authenticated_educational_content.sql
-- Description: Enforces the canonical rule "EDUCATIONAL CONTENT REQUIRES AUTHENTICATION" server-side.
-- Revokes SELECT privileges on educational content tables from anon and updates RLS policies to require authenticated session.

-- 1. Revoke SELECT on Educational Content Tables from anon
REVOKE SELECT ON public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media FROM anon;

-- Ensure authenticated role retains SELECT on educational content tables
GRANT SELECT ON public.subjects, public.chapters, public.lessons, public.lesson_blocks, public.media TO authenticated;

-- 2. Update RLS SELECT Policies to Require Authenticated Session

-- 2.1 public.subjects
DROP POLICY IF EXISTS "subjects_select_policy" ON public.subjects;
CREATE POLICY "subjects_select_policy" ON public.subjects
  FOR SELECT TO authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 2.2 public.chapters
DROP POLICY IF EXISTS "chapters_select_policy" ON public.chapters;
CREATE POLICY "chapters_select_policy" ON public.chapters
  FOR SELECT TO authenticated
  USING (
    is_published = true
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 2.3 public.lessons
DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;
CREATE POLICY "lessons_select_policy" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    status = 'published'
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 2.4 public.lesson_blocks
DROP POLICY IF EXISTS "lesson_blocks_select_policy" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_select_policy" ON public.lesson_blocks
  FOR SELECT TO authenticated
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

-- 2.5 public.media
DROP POLICY IF EXISTS "media_select_policy" ON public.media;
CREATE POLICY "media_select_policy" ON public.media
  FOR SELECT TO authenticated
  USING (true);
