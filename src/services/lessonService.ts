import { supabase } from '@/lib/supabase'
import type { Lesson, Chapter, Subject } from '@/types/database'
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
 * Strictly implements access state rules based on User Rights & Access Level:
 * - FREE + blocks -> ACCESSIBLE
 * - FREE + zero blocks -> ACCESSIBLE (empty state)
 * - PRO + PRO user -> ACCESSIBLE (even if zero blocks)
 * - PRO + non-PRO user -> PRO_REQUIRED (metadata + PRO Gate)
 * - unpublished/not found -> NOT_FOUND
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
        errorMessage: lessonError.message || 'Eroare la conectarea cu baza de date.',
      }
    }

    const lesson = rawLesson as Lesson | null

    // If lesson metadata does not exist in DB -> NOT_FOUND (404)
    if (!lesson) {
      return {
        lesson: null,
        blocks: [],
        chapter: null,
        subject: null,
        prevLesson: null,
        nextLesson: null,
        accessState: 'NOT_FOUND',
        errorMessage: 'Lecția solicitată nu a fost găsită sau este indisponibilă.',
      }
    }

    // 2. Fetch parent chapter & subject metadata
    let chapter: Chapter | null = null
    let subject: Subject | null = null
    let prevLesson: { id: string; title: string } | null = null
    let nextLesson: { id: string; title: string } | null = null

    if (lesson.chapter_id) {
      const { data: rawChapter } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', lesson.chapter_id)
        .maybeSingle()

      chapter = (rawChapter as Chapter | null) || null

      if (chapter?.subject_id) {
        const { data: rawSubject } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', chapter.subject_id)
          .maybeSingle()

        subject = (rawSubject as Subject | null) || null
      }

      // Fetch adjacent lessons in same chapter for navigation
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

    // 3. Determine Access State based on user rights & access_level (Objective 4 compliance)
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
