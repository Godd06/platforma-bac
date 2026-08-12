-- Migration: 20260813023000_harden_media_select_policy.sql
-- Description: Hardens media_select_policy to restrict media row access to authorized contextual resources.

-- 1. Drop existing policies on public.media to prevent duplicate policies
DROP POLICY IF EXISTS "media_select_policy" ON public.media;
DROP POLICY IF EXISTS "media_select_authenticated" ON public.media;
DROP POLICY IF EXISTS "media_select_anon" ON public.media;

-- 2. Re-create contextual strict SELECT policy for authenticated users
CREATE POLICY "media_select_authenticated" ON public.media
  FOR SELECT TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.subjects s
      WHERE s.cover_media_id = media.id AND s.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.chapters c
      WHERE c.cover_media_id = media.id AND c.is_published = true
    ) OR EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.cover_media_id = media.id AND l.status = 'published' AND l.access_level = 'free'
    ) OR EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.cover_media_id = media.id AND l.status = 'published' AND l.access_level = 'pro' AND private.is_pro_user((SELECT auth.uid()))
    ) OR EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.lessons l ON l.id = lb.lesson_id
      WHERE l.status = 'published' AND (
        l.access_level = 'free'
        OR (l.access_level = 'pro' AND private.is_pro_user((SELECT auth.uid())))
      ) AND (
        lb.content->>'media_id' = media.id::text
        OR lb.content->>'poster_media_id' = media.id::text
      )
    ) OR private.has_role((SELECT auth.uid()), 'reviewer')
      OR private.has_role((SELECT auth.uid()), 'editor')
      OR private.has_role((SELECT auth.uid()), 'super_admin')
  );
