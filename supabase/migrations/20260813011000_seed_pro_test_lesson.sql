-- Migration: 20260813011000_seed_pro_test_lesson.sql
-- Description: Seed a PRO test lesson (Construcția personajului Ghiță) in Nuvela psihologică to test PRO discovery vs content access.

DO $$
DECLARE
  v_chapter_id uuid;
  v_lesson_id uuid;
BEGIN
  -- 1. Get Chapter ID for Nuvela psihologică
  SELECT c.id INTO v_chapter_id
  FROM public.chapters c
  JOIN public.subjects s ON s.id = c.subject_id
  WHERE s.slug = 'romana' AND c.slug = 'nuvela-psihologica';

  IF v_chapter_id IS NULL THEN
    RAISE NOTICE 'Chapter nuvela-psihologica not found, skipping PRO seed lesson.';
    RETURN;
  END IF;

  -- 2. Insert PRO Lesson: Construcția personajului Ghiță
  INSERT INTO public.lessons (
    chapter_id,
    slug,
    title,
    short_description,
    estimated_minutes,
    access_level,
    status,
    sort_order,
    published_at
  )
  VALUES (
    v_chapter_id,
    'constructia-personajului-ghita',
    'Construcția personajului Ghiță (PRO)',
    'Analiza detaliată a evoluției caracterologice și a etapelor dezumanizării personajului principal din Moara cu noroc.',
    30,
    'pro',
    'published',
    20,
    now()
  )
  ON CONFLICT (chapter_id, slug) DO UPDATE
    SET title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        status = 'published',
        access_level = 'pro'
  RETURNING id INTO v_lesson_id;

  IF v_lesson_id IS NULL THEN
    SELECT id INTO v_lesson_id FROM public.lessons WHERE chapter_id = v_chapter_id AND slug = 'constructia-personajului-ghita';
  END IF;

  -- Clean existing blocks for reproducible re-seeding
  DELETE FROM public.lesson_blocks WHERE lesson_id = v_lesson_id;

  -- 3. Insert PRO Lesson Blocks (Accessible ONLY to PRO users)
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'heading',
    10,
    jsonb_build_object(
      'text', '1. Caracterizarea directă și indirectă a lui Ghiță',
      'level', 2,
      'subtitle', 'Analiză avansată pentru nota 10 la Bacalaureat'
    )
  ),
  (
    v_lesson_id,
    'rich_text',
    20,
    jsonb_build_object(
      'html', '<p>Ghiță este cel mai complex personaj din proza lui Ioan Slavici, asistând la un tragic <strong>proces de înstrăinare și dezumanizare</strong> sub efectul distructiv al tentației înavuțirii rapide.</p>'
    )
  ),
  (
    v_lesson_id,
    'important',
    30,
    jsonb_build_object(
      'title', 'Etapele degradării morale',
      'text', 'Evoluția lui Ghiță parcurge 3 etape majore: (1) Cizmarul cinstit dar nemulțumit, (2) Arendașul de la Moara cu noroc și complicele tăcut al lui Lică, (3) Omul stăpânit de patima banilor care își pierde onoarea, familia și viața.'
    )
  );

END $$;
