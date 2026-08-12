-- Migration: 20260813010000_update_lessons_rls_for_pro_discovery.sql
-- Description: Update lessons SELECT policies to enable public discovery of metadata for all published lessons (free & pro), while preserving strict RLS protection on lesson_blocks and media.

-- 1. Drop existing restricted SELECT policies on lessons
DROP POLICY IF EXISTS "lessons_select_anon" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_authenticated_free" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_authenticated_pro" ON public.lessons;

-- 2. Create updated SELECT policy for anon (all published lessons metadata)
CREATE POLICY "lessons_select_anon" ON public.lessons
  FOR SELECT TO anon
  USING (status = 'published');

-- 3. Create updated SELECT policy for authenticated users (all published lessons metadata or staff roles)
CREATE POLICY "lessons_select_authenticated" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    status = 'published'
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );
