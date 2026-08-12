-- Migration: 20260813000000_seed_romana_test_lesson.sql
-- Description: Seed initial test subject (Română), chapter (Nuvela psihologică), lesson (Moara cu noroc), and 7 real lesson blocks

DO $$
DECLARE
  v_subject_id uuid;
  v_chapter_id uuid;
  v_lesson_id uuid;
BEGIN
  -- 1. Insert Subject: Română
  INSERT INTO public.subjects (
    slug,
    name,
    short_description,
    description,
    icon,
    sort_order,
    is_published
  )
  VALUES (
    'romana',
    'Limba și literatura română',
    'Pregătire completă pentru proba scrisă de Bacalaureat la Limba și literatura română.',
    'Module structurate pe genuri și specii literare, curente literare, eseuri de sinteză și redactare conform baremului oficial edupedu și ministerului.',
    'BookOpen',
    10,
    true
  )
  ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        short_description = EXCLUDED.short_description,
        is_published = true
  RETURNING id INTO v_subject_id;

  IF v_subject_id IS NULL THEN
    SELECT id INTO v_subject_id FROM public.subjects WHERE slug = 'romana';
  END IF;

  -- 2. Insert Chapter: Nuvela psihologică
  INSERT INTO public.chapters (
    subject_id,
    slug,
    title,
    short_description,
    description,
    sort_order,
    is_published
  )
  VALUES (
    v_subject_id,
    'nuvela-psihologica',
    'Nuvela psihologică',
    'Studiul nuvelei psihologice reprezentative din literatura română pasșoptistă și marilor clasici.',
    'Analiza detaliată a conflictului interior, a evoluției caracterologice și a valorilor morale din proza scurtă.',
    10,
    true
  )
  ON CONFLICT (subject_id, slug) DO UPDATE
    SET title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        is_published = true
  RETURNING id INTO v_chapter_id;

  IF v_chapter_id IS NULL THEN
    SELECT id INTO v_chapter_id FROM public.chapters WHERE subject_id = v_subject_id AND slug = 'nuvela-psihologica';
  END IF;

  -- 3. Insert Lesson: Moara cu noroc - Ioan Slavici
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
    'moara-cu-noroc',
    'Moara cu noroc - Ioan Slavici',
    'Studiul aprofundat al operei: conflict interior, tragic moral, momentele subiectului și caracterizarea lui Ghiță.',
    25,
    'free',
    'published',
    10,
    now()
  )
  ON CONFLICT (chapter_id, slug) DO UPDATE
    SET title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        status = 'published',
        access_level = 'free'
  RETURNING id INTO v_lesson_id;

  IF v_lesson_id IS NULL THEN
    SELECT id INTO v_lesson_id FROM public.lessons WHERE chapter_id = v_chapter_id AND slug = 'moara-cu-noroc';
  END IF;

  -- Clean existing blocks for reproducible re-seeding of this specific test lesson
  DELETE FROM public.lesson_blocks WHERE lesson_id = v_lesson_id;

  -- 4. Insert Lesson Blocks
  -- Block 1: Heading
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'heading',
    10,
    jsonb_build_object(
      'text', '1. Contextul publicării și încadrarea în specie',
      'level', 2,
      'subtitle', 'Repere de bază pentru Subiectul al III-lea la Bacalaureat'
    )
  );

  -- Block 2: Rich Text
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'rich_text',
    20,
    jsonb_build_object(
      'html', '<p>Opera <strong>„Moara cu noroc”</strong> de Ioan Slavici a fost publicată în volumul de debut <em>„Novele din popor”</em> (1881) și reprezintă o <u>nuvelă psihologică realistă</u> clasică din literatura română.</p><p>Slavici este un scriitor moralist, care construiește trama narativă pe baza ordinii morale din satul ardelean tradițional: depășirea măsurii și lăcomia de bani atrag inevitabil sancțiunea etică și tragică.</p>'
    )
  );

  -- Block 3: Definition
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'definition',
    30,
    jsonb_build_object(
      'term', 'Nuvelă psihologică',
      'category', 'Specie literară',
      'definition', 'Nuvela psihologică este o specie a genului epic în proză, cu un fir narativ central și complex, în care accentul cade pe investigarea stărilor de conștiință, a motivațiilor interioare și pe degradarea morală a personajului principal sub presiunea factorilor externi.',
      'example', 'Ghiță trece de la statutul de cizmar cinstit la cel de complice al lui Lică Sămădăul, victima propriului conflict interior între dorința de înavuțire și conștiința curată.'
    )
  );

  -- Block 4: Important
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'important',
    40,
    jsonb_build_object(
      'title', 'Avertismentul tezei moralizatoare',
      'text', 'Discursul bătrânei din incipit și final constituie cadrul simetric al operei: „Omul să fie mulțumit cu sărăcia sa, căci, dacă-i vorba, nu bogăția, ci liniștea colibei tale te face fericit.” Ocălcatul acestei reguli de aur atrage prăbușirea tuturor personajelor implicate.'
    )
  );

  -- Block 5: Remember
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'remember',
    50,
    jsonb_build_object(
      'title', 'Secvențe cheie pentru analiză',
      'text', 'La examenul de Bacalaureat, ilustrează tema prin două secvențe relevante: (1) Scenele frământărilor interioare în care Ghiță își numără banii singur și (2) Scena de la serbarea de Paște și uciderea Anei la Moara cu noroc.'
    )
  );

  -- Block 6: Image
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'image',
    60,
    jsonb_build_object(
      'url', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      'alt', 'Manuscris și cărți vechi simbolizând proza clasică',
      'caption', 'Structura simetrică a nuvelei începe și se încheie cu vorbele bătrânei (mama Anei).'
    )
  );

  -- Block 7: Summary
  INSERT INTO public.lesson_blocks (lesson_id, block_type, sort_order, content)
  VALUES (
    v_lesson_id,
    'summary',
    70,
    jsonb_build_object(
      'title', 'Sinteză rapidă pentru redactare',
      'items', jsonb_build_array(
        'Specia: Nuvelă psihologică realistă (publicată în 1881)',
        'Tema: Consecințele dezastroase ale lăcomiei și înstrăinarea de valorile etice',
        'Conflictul: Conflict exterior (Ghiță vs. Lică Sămădăul) dublat de un puternic conflict interior',
        'Compoziția: Simetrică, formată din 17 capitole încadrate de replicile bătrânei',
        'Finalul: Tragic și purificator (catharsis moral) – hanul este ars, iar răul este eliminat'
      )
    )
  );

END $$;
