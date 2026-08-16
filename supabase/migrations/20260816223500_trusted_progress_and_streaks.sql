-- Migration: 20260816223500_trusted_progress_and_streaks.sql
-- Description: Enforces canonical rules for user_streaks, user_activity, and lesson_progress.
-- Student = READ ONLY on user_streaks and user_activity.
-- Mutations on streak, activity, and progress validation occur via trusted SECURITY DEFINER RPC functions.

-- 1. Create public.user_activity if not exists
CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON public.user_activity(user_id, created_at DESC);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_activity FROM anon;
GRANT SELECT ON public.user_activity TO authenticated;

DROP POLICY IF EXISTS "user_activity_select_own" ON public.user_activity;
CREATE POLICY "user_activity_select_own" ON public.user_activity
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 2. Lock down user_streaks (Student = READ ONLY)
REVOKE INSERT, UPDATE, DELETE ON public.user_streaks FROM authenticated;
DROP POLICY IF EXISTS "user_streaks_insert_own" ON public.user_streaks;
DROP POLICY IF EXISTS "user_streaks_update_own" ON public.user_streaks;

GRANT SELECT ON public.user_streaks TO authenticated;
DROP POLICY IF EXISTS "user_streaks_select_own" ON public.user_streaks;
CREATE POLICY "user_streaks_select_own" ON public.user_streaks
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.has_role((SELECT auth.uid()), 'editor')
    OR private.has_role((SELECT auth.uid()), 'reviewer')
    OR private.has_role((SELECT auth.uid()), 'super_admin')
  );

-- 3. Trusted Server-Side Function for Progress Recording, Streak Increment & Activity Logging
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
  v_status text;
  v_now timestamptz := now();
  v_today date := CURRENT_DATE;
  v_progress record;
  v_streak record;
  v_new_current integer := 1;
  v_new_longest integer := 1;
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

  -- 4. Validate progress percent
  IF p_progress_percent < 0 OR p_progress_percent > 100 THEN
    RAISE EXCEPTION 'Invalid progress percent: %', p_progress_percent USING ERRCODE = '22003';
  END IF;

  -- 5. Determine status
  IF p_progress_percent >= 100 THEN
    v_status := 'completed';
  ELSE
    v_status := 'in_progress';
  END IF;

  -- 6. Upsert lesson_progress
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
    CASE WHEN v_status = 'completed' THEN v_now ELSE NULL END,
    v_now
  )
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    status = CASE WHEN public.lesson_progress.status = 'completed' THEN 'completed' ELSE EXCLUDED.status END,
    progress_percent = GREATEST(public.lesson_progress.progress_percent, EXCLUDED.progress_percent),
    last_block_id = COALESCE(EXCLUDED.last_block_id, public.lesson_progress.last_block_id),
    completed_at = CASE
      WHEN public.lesson_progress.completed_at IS NOT NULL THEN public.lesson_progress.completed_at
      WHEN EXCLUDED.status = 'completed' THEN v_now
      ELSE NULL
    END,
    updated_at = v_now
  RETURNING * INTO v_progress;

  -- 7. If completed, update streak and record activity atomically
  IF v_status = 'completed' THEN
    SELECT * INTO v_streak
    FROM public.user_streaks
    WHERE user_id = v_user_id;

    IF FOUND THEN
      IF v_streak.last_activity_date = v_today THEN
        -- Idempotent: already logged today
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

    -- Record activity
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

-- Grant EXECUTE to authenticated
GRANT EXECUTE ON FUNCTION public.record_lesson_progress(uuid, integer, uuid) TO authenticated;
