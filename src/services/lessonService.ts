import { supabase } from '@/lib/supabase'
import type { Lesson, Chapter, Subject, LessonProgress } from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'

// Exact access states required by Rule 2
export type LessonAccessState = 'NOT_FOUND' | 'PRO_REQUIRED' | 'ACCESSIBLE' | 'ERROR'

export interface LessonFetchResult {
  lesson: Lesson | null
  blocks: LessonBlockData[]
  chapter: Chapter | null
  subject: Subject | null
  prevLesson: { id: string; title: string } | null
  nextLesson: { id: string; title: string } | null
  accessState: LessonAccessState
  errorMessage: string | null
}

// Approved discovery fields list for single lesson query
const APPROVED_LESSON_FIELDS =
  'id, chapter_id, slug, title, short_description, estimated_minutes, access_level, cover_media_id, sort_order, status, published_at, created_at, updated_at'

/**
 * Helper to check if a logged-in user has PRO access rights or staff roles.
 */
async function checkIsProUser(userId: string | undefined): Promise<boolean> {
  if (!userId) return false

  try {
    // 1. Staff roles get full access (editor, reviewer, super_admin)
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    if (roles && (roles as Array<{ role: string }>).some((r) => ['editor', 'reviewer', 'super_admin'].includes(r.role))) {
      return true
    }

    // 2. Check active/trialing PRO subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .eq('plan', 'pro')
      .in('status', ['active', 'trialing'])
      .maybeSingle()

    if (sub) {
      const subObj = sub as { plan: string; status: string; current_period_end: string | null }
      if (!subObj.current_period_end || new Date(subObj.current_period_end) > new Date()) {
        return true
      }
    }
  } catch (err) {
    console.error('[lessonService] Error checking PRO status:', err)
  }

  return false
}

/**
 * Service function to fetch a single lesson and its blocks from Supabase.
 */
export async function fetchLessonWithBlocks(lessonId: string): Promise<LessonFetchResult> {
  if (!lessonId || typeof lessonId !== 'string') {
    return {
      lesson: null,
      blocks: [],
      chapter: null,
      subject: null,
      prevLesson: null,
      nextLesson: null,
      accessState: 'NOT_FOUND',
      errorMessage: 'ID-ul lecției nu este valid.',
    }
  }

  try {
    // 1. Fetch lesson metadata (Discovery allowed for published lessons)
    const { data: rawLesson, error: lessonError } = await supabase
      .from('lessons')
      .select(APPROVED_LESSON_FIELDS)
      .eq('id', lessonId)
      .maybeSingle()

    if (lessonError) {
      console.error('[lessonService] Supabase lesson fetch error:', lessonError)
      return {
        lesson: null,
        blocks: [],
        chapter: null,
        subject: null,
        prevLesson: null,
        nextLesson: null,
        accessState: 'ERROR',
        errorMessage: 'Nu am putut încărca lecția din baza de date.',
      }
    }

    if (!rawLesson) {
      return {
        lesson: null,
        blocks: [],
        chapter: null,
        subject: null,
        prevLesson: null,
        nextLesson: null,
        accessState: 'NOT_FOUND',
        errorMessage: 'Lecția căutată nu a fost găsită sau nu este publicată.',
      }
    }

    const lesson = rawLesson as Lesson

    // Fetch parent chapter and subject
    let chapter: Chapter | null = null
    let subject: Subject | null = null
    let prevLesson: { id: string; title: string } | null = null
    let nextLesson: { id: string; title: string } | null = null

    if (lesson.chapter_id) {
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', lesson.chapter_id)
        .maybeSingle()

      chapter = (chapterData as unknown as Chapter) || null

      if (chapter && chapter.subject_id) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', chapter.subject_id)
          .maybeSingle()

        subject = (subjectData as unknown as Subject) || null
      }

      // 2. Fetch sibling lessons for sequential navigation
      const { data: siblingLessons } = await supabase
        .from('lessons')
        .select('id, title, sort_order')
        .eq('chapter_id', lesson.chapter_id)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })

      if (siblingLessons && siblingLessons.length > 1) {
        const siblings = siblingLessons as Array<{ id: string; title: string; sort_order: number }>
        const currentIndex = siblings.findIndex((l) => l.id === lessonId)
        if (currentIndex > 0) {
          prevLesson = {
            id: siblings[currentIndex - 1].id,
            title: siblings[currentIndex - 1].title,
          }
        }
        if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
          nextLesson = {
            id: siblings[currentIndex + 1].id,
            title: siblings[currentIndex + 1].title,
          }
        }
      }
    }

    // 3. Determine Access State based on user rights & access_level
    const { data: sessionData } = await supabase.auth.getSession()
    const currentUserId = sessionData?.session?.user?.id
    const isPro = await checkIsProUser(currentUserId)

    if (lesson.access_level === 'pro' && !isPro) {
      return {
        lesson,
        blocks: [],
        chapter,
        subject,
        prevLesson,
        nextLesson,
        accessState: 'PRO_REQUIRED',
        errorMessage: null,
      }
    }

    // 4. User is authorized (FREE lesson OR PRO lesson with PRO/Staff user) -> Fetch blocks
    const { data: blocksData, error: blocksError } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (blocksError) {
      console.warn('[lessonService] Warning fetching lesson blocks:', blocksError)
    }

    return {
      lesson,
      blocks: (blocksData as LessonBlockData[]) || [],
      chapter,
      subject,
      prevLesson,
      nextLesson,
      accessState: 'ACCESSIBLE',
      errorMessage: null,
    }
  } catch (err) {
    console.error('[lessonService] Unexpected error fetching lesson:', err)
    return {
      lesson: null,
      blocks: [],
      chapter: null,
      subject: null,
      prevLesson: null,
      nextLesson: null,
      accessState: 'ERROR',
      errorMessage: 'A apărut o eroare neașteptată la conectarea cu serverul.',
    }
  }
}

/**
 * Fetch progress record for a single lesson for the authenticated user
 */
export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    if (!userId || !lessonId) return null

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as unknown as LessonProgress
  } catch (err) {
    console.error('[lessonService] Error fetching lesson progress:', err)
    return null
  }
}

/**
 * Record reading progress for a lesson via trusted server-side RPC (record_lesson_progress)
 */
export async function recordLessonProgress(
  lessonId: string,
  progressPercent: number,
  lastBlockId?: string | null
): Promise<LessonProgress | null> {
  try {
    const { data, error } = await supabase.rpc('record_lesson_progress', {
      p_lesson_id: lessonId,
      p_progress_percent: Math.min(100, Math.max(0, Math.round(progressPercent))),
      p_last_block_id: lastBlockId || null,
    } as never)

    if (error) {
      console.error('[lessonService] Error recording lesson progress via RPC:', error.message)
      return null
    }

    const res = data as { success: boolean; progress: LessonProgress } | null
    return res?.progress || null
  } catch (err) {
    console.error('[lessonService] Unexpected error recording progress:', err)
    return null
  }
}

/**
 * Mark a lesson as fully completed via trusted server-side RPC (record_lesson_progress with 100%)
 */
export async function markLessonCompleted(
  lessonId: string
): Promise<{ progress: LessonProgress; streak: { currentStreak: number; longestStreak: number } } | null> {
  try {
    const { data, error } = await supabase.rpc('record_lesson_progress', {
      p_lesson_id: lessonId,
      p_progress_percent: 100,
      p_last_block_id: null,
    } as never)

    if (error) {
      console.error('[lessonService] Error marking lesson completed via RPC:', error.message)
      return null
    }

    const res = data as {
      success: boolean
      progress: LessonProgress
      streak: { current_streak: number; longest_streak: number }
    } | null

    if (!res || !res.progress) {
      return null
    }

    return {
      progress: res.progress,
      streak: {
        currentStreak: res.streak?.current_streak || 1,
        longestStreak: res.streak?.longest_streak || 1,
      },
    }
  } catch (err) {
    console.error('[lessonService] Unexpected error marking lesson completed:', err)
    return null
  }
}
