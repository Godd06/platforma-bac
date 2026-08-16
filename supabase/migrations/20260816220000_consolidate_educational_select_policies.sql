-- Migration: 20260816220000_consolidate_educational_select_policies.sql
-- Description: Cleans up obsolete/overlapping legacy SELECT policies on subjects, chapters, lessons, lesson_blocks, media, and user_roles to resolve Supabase Advisor multiple permissive policy warnings.

-- 1. Clean up legacy subjects policies
DROP POLICY IF EXISTS "subjects_select_anon" ON public.subjects;
DROP POLICY IF EXISTS "subjects_select_authenticated" ON public.subjects;
DROP POLICY IF EXISTS "subjects_admin_all" ON public.subjects;

-- 2. Clean up legacy chapters policies
DROP POLICY IF EXISTS "chapters_select_anon" ON public.chapters;
DROP POLICY IF EXISTS "chapters_select_authenticated" ON public.chapters;
DROP POLICY IF EXISTS "chapters_admin_all" ON public.chapters;

-- 3. Clean up legacy lessons policies
DROP POLICY IF EXISTS "lessons_select_anon" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_authenticated_free" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_authenticated_pro" ON public.lessons;
DROP POLICY IF EXISTS "lessons_admin_all" ON public.lessons;

-- 4. Clean up legacy lesson_blocks policies
DROP POLICY IF EXISTS "lesson_blocks_select_anon" ON public.lesson_blocks;
DROP POLICY IF EXISTS "lesson_blocks_select_authenticated" ON public.lesson_blocks;
DROP POLICY IF EXISTS "lesson_blocks_admin_all" ON public.lesson_blocks;

-- 5. Clean up legacy media policies
DROP POLICY IF EXISTS "media_select_anon" ON public.media;
DROP POLICY IF EXISTS "media_select_authenticated" ON public.media;
DROP POLICY IF EXISTS "media_editor_all" ON public.media;

-- 6. Clean up legacy user_roles policies
DROP POLICY IF EXISTS "user_roles_select_own_or_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;
