-- Migration: 20260816224500_harden_record_lesson_progress_integrity.sql
-- Description: Hardens record_lesson_progress with strict last_block_id validation, state transition verification, and duplicate completion prevention.

CREATE OR REPLACE FUNCTION public.record_lesson_progress(
  p_lesson_id uuid,
  p_progress_percent integer,
  p_last_block_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, auth, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_lesson record;
  v_is_pro boolean;
  v_status public.progress_status;
  v_now timestamptz := now();
  v_today date := CURRENT_DATE;
  v_existing_progress record;
  v_progress record;
  v_streak record;
  v_new_current integer := 1;
  v_new_longest integer := 1;
  v_is_new_completion boolean := false;
BEGIN
  -- 1. Validate authenticated session
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  -- 2. Validate lesson exists and is published
  SELECT id, access_level, status INTO v_lesson
  FROM public.lessons
  WHERE id = p_lesson_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lesson not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_lesson.status <> 'published' THEN
    IF NOT (
      private.has_role(v_user_id, 'editor') OR
      private.has_role(v_user_id, 'reviewer') OR
      private.has_role(v_user_id, 'super_admin')
    ) THEN
      RAISE EXCEPTION 'Lesson is not published' USING ERRCODE = '42501';
    END IF;
  END IF;

  -- 3. Validate PRO access if lesson is pro
  IF v_lesson.access_level = 'pro' THEN
    v_is_pro := private.is_pro_user(v_user_id) OR
                private.has_role(v_user_id, 'editor') OR
                private.has_role(v_user_id, 'reviewer') OR
                private.has_role(v_user_id, 'super_admin');
    IF NOT v_is_pro THEN
      RAISE EXCEPTION 'PRO subscription required' USING ERRCODE = '42501';
    END IF;
  END IF;

  -- 4. Validate progress percent bounds
  IF p_progress_percent < 0 OR p_progress_percent > 100 THEN
    RAISE EXCEPTION 'Invalid progress percent: %', p_progress_percent USING ERRCODE = '22003';
  END IF;

  -- 5. Validate p_last_block_id if provided
  IF p_last_block_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.lesson_blocks
      WHERE id = p_last_block_id AND lesson_id = p_lesson_id
    ) THEN
      RAISE EXCEPTION 'Invalid last_block_id: block does not belong to lesson' USING ERRCODE = '23503';
    END IF;
  END IF;

  -- 6. Check existing progress record
  SELECT * INTO v_existing_progress
  FROM public.lesson_progress
  WHERE user_id = v_user_id AND lesson_id = p_lesson_id;

  -- 7. Determine target status
  IF p_progress_percent >= 100 THEN
    v_status := 'completed'::public.progress_status;
    IF v_existing_progress IS NULL OR v_existing_progress.status <> 'completed'::public.progress_status THEN
      v_is_new_completion := true;
    END IF;
  ELSE
    -- If previously completed, maintain completed status
    IF v_existing_progress IS NOT NULL AND v_existing_progress.status = 'completed'::public.progress_status THEN
      v_status := 'completed'::public.progress_status;
    ELSE
      v_status := 'in_progress'::public.progress_status;
    END IF;
  END IF;

  -- 8. Upsert lesson_progress with guaranteed transition and non-regression
  INSERT INTO public.lesson_progress (
    user_id,
    lesson_id,
    status,
    progress_percent,
    last_block_id,
    started_at,
    completed_at,
    updated_at
  )
  VALUES (
    v_user_id,
    p_lesson_id,
    v_status,
    p_progress_percent,
    p_last_block_id,
    v_now,
    CASE WHEN v_status = 'completed'::public.progress_status THEN v_now ELSE NULL END,
    v_now
  )
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    status = CASE
      WHEN public.lesson_progress.status = 'completed'::public.progress_status THEN 'completed'::public.progress_status
      ELSE EXCLUDED.status
    END,
    progress_percent = GREATEST(public.lesson_progress.progress_percent, EXCLUDED.progress_percent),
    last_block_id = COALESCE(EXCLUDED.last_block_id, public.lesson_progress.last_block_id),
    started_at = COALESCE(public.lesson_progress.started_at, EXCLUDED.started_at),
    completed_at = CASE
      WHEN public.lesson_progress.completed_at IS NOT NULL THEN public.lesson_progress.completed_at
      WHEN EXCLUDED.status = 'completed'::public.progress_status THEN v_now
      ELSE NULL
    END,
    updated_at = v_now
  RETURNING * INTO v_progress;

  -- 9. If this is a NEW completion, update streak and record user_activity atomically
  IF v_is_new_completion THEN
    SELECT * INTO v_streak
    FROM public.user_streaks
    WHERE user_id = v_user_id;

    IF FOUND THEN
      IF v_streak.last_activity_date = v_today THEN
        -- Idempotent for today
        v_new_current := v_streak.current_streak;
        v_new_longest := v_streak.longest_streak;
      ELSIF v_streak.last_activity_date = v_today - 1 THEN
        -- Continuous day
        v_new_current := v_streak.current_streak + 1;
        v_new_longest := GREATEST(v_streak.longest_streak, v_new_current);
      ELSE
        -- Broken streak -> reset to 1
        v_new_current := 1;
        v_new_longest := GREATEST(v_streak.longest_streak, 1);
      END IF;

      UPDATE public.user_streaks
      SET
        current_streak = v_new_current,
        longest_streak = v_new_longest,
        last_activity_date = v_today,
        updated_at = v_now
      WHERE user_id = v_user_id
      RETURNING * INTO v_streak;
    ELSE
      -- Insert initial streak
      INSERT INTO public.user_streaks (
        user_id,
        current_streak,
        longest_streak,
        last_activity_date,
        updated_at
      )
      VALUES (
        v_user_id,
        1,
        1,
        v_today,
        v_now
      )
      RETURNING * INTO v_streak;
    END IF;

    -- Record activity only on genuine new completion
    INSERT INTO public.user_activity (
      user_id,
      activity_type,
      lesson_id,
      metadata,
      created_at
    )
    VALUES (
      v_user_id,
      'lesson_completed',
      p_lesson_id,
      jsonb_build_object('completed_at', v_now, 'progress_percent', 100),
      v_now
    );
  ELSE
    SELECT * INTO v_streak
    FROM public.user_streaks
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'progress', row_to_json(v_progress),
    'streak', row_to_json(v_streak)
  );
END;
$$;
