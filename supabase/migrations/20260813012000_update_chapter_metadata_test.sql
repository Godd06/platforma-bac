-- Migration: 20260813012000_update_chapter_metadata_test.sql
-- Description: Update test chapter record for Moara cu noroc with author and work_type in metadata for visual UI composition.

DO $$
DECLARE
  v_subject_id uuid;
BEGIN
  -- Get Subject ID for romana
  SELECT id INTO v_subject_id FROM public.subjects WHERE slug = 'romana';

  IF v_subject_id IS NOT NULL THEN
    -- Update existing chapter record for Moara cu noroc
    UPDATE public.chapters
    SET title = 'Moara cu noroc',
        slug = 'moara-cu-noroc',
        short_description = 'Nuvela psihologică reprezentativă din literatura română clasică.',
        metadata = jsonb_build_object(
          'author', 'Ioan Slavici',
          'work_type', 'Nuvela psihologică'
        )
    WHERE subject_id = v_subject_id AND (slug = 'nuvela-psihologica' OR slug = 'moara-cu-noroc');
  END IF;
END $$;
