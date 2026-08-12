import { supabase } from '@/lib/supabase'
import type { Lesson, Chapter, Subject } from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'

export interface LessonFetchResult {
  lesson: Lesson | null
  blocks: LessonBlockData[]
  chapter: Chapter | null
  subject: Subject | null
  prevLesson: { id: string; title: string } | null
  nextLesson: { id: string; title: string } | null
  errorType: 'NONE' | 'NOT_FOUND' | 'FORBIDDEN' | 'FETCH_ERROR'
  errorMessage: string | null
}

/**
 * Service function to fetch a lesson and its blocks in strict sort_order ASC from Supabase.
 * Respects RLS and handles errors gracefully.
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
      errorType: 'NOT_FOUND',
      errorMessage: 'ID-ul lecției nu este valid.',
    }
  }

  try {
    // 1. Fetch lesson
    const { data: rawLesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle()

    if (lessonError) {
      console.error('[lessonService] Supabase lesson fetch error:', lessonError)
      const errStatus = (lessonError as unknown as { status?: number }).status
      if (lessonError.code === '42501' || errStatus === 403 || errStatus === 401) {
        return {
          lesson: null,
          blocks: [],
          chapter: null,
          subject: null,
          prevLesson: null,
          nextLesson: null,
          errorType: 'FORBIDDEN',
          errorMessage: 'Nu aveți permisiunea de a accesa această lecție (este necesar abonament PRO sau autentificare).',
        }
      }

      return {
        lesson: null,
        blocks: [],
        chapter: null,
        subject: null,
        prevLesson: null,
        nextLesson: null,
        errorType: 'FETCH_ERROR',
        errorMessage: lessonError.message || 'Eroare la încărcarea lecției din baza de date.',
      }
    }

    const lesson = rawLesson as Lesson | null

    if (!lesson) {
      return {
        lesson: null,
        blocks: [],
        chapter: null,
        subject: null,
        prevLesson: null,
        nextLesson: null,
        errorType: 'NOT_FOUND',
        errorMessage: 'Lecția solicitată nu a fost găsită sau este indisponibilă.',
      }
    }

    // 2. Fetch lesson blocks ordered by sort_order ASC
    const { data: blocksData, error: blocksError } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (blocksError) {
      console.warn('[lessonService] Could not load lesson blocks:', blocksError)
    }

    // 3. Fetch parent chapter & subject metadata
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

    return {
      lesson,
      blocks: (blocksData as LessonBlockData[]) || [],
      chapter,
      subject,
      prevLesson,
      nextLesson,
      errorType: 'NONE',
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
      errorType: 'FETCH_ERROR',
      errorMessage: 'A apărut o eroare neașteptată la conectarea cu serverul.',
    }
  }
}
