import { supabase } from '@/lib/supabase'
import type { Subject, Chapter, LessonAccessLevel, LessonStatus } from '@/types/database'

export interface CatalogLessonMetadata {
  id: string
  chapter_id: string
  slug: string
  title: string
  short_description: string | null
  estimated_minutes: number | null
  access_level: LessonAccessLevel
  cover_media_id: string | null
  sort_order: number
  status: LessonStatus
}

export interface CatalogSubjectWithCounts extends Subject {
  chapter_count: number
}

export interface CatalogChapterWithLessons extends Chapter {
  lessons: CatalogLessonMetadata[]
}

export interface CatalogChapterWithCounts extends Chapter {
  lesson_count: number
}

export interface CatalogSubjectDetail {
  subject: Subject
  chapters: CatalogChapterWithLessons[]
}

// Approved discovery fields list for lessons (Rule 1 compliance)
const APPROVED_LESSON_DISCOVERY_FIELDS =
  'id, chapter_id, slug, title, short_description, estimated_minutes, access_level, cover_media_id, sort_order, status'

/**
 * Fetch published subjects for the Catalog root view (/catalog)
 */
export async function fetchPublishedSubjects(): Promise<CatalogSubjectWithCounts[]> {
  try {
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (subjectsError || !subjectsData) {
      console.error('[catalogService] Error fetching subjects:', subjectsError)
      return []
    }

    // Attach chapter count per subject
    const subjectsWithCounts = await Promise.all(
      (subjectsData as Subject[]).map(async (subj) => {
        const { count } = await supabase
          .from('chapters')
          .select('id', { count: 'exact', head: true })
          .eq('subject_id', subj.id)
          .eq('is_published', true)

        return {
          ...subj,
          chapter_count: count || 0,
        }
      })
    )

    return subjectsWithCounts
  } catch (err) {
    console.error('[catalogService] Unexpected error fetching subjects:', err)
    return []
  }
}

/**
 * Fetch a subject with all its published chapters AND their nested lessons inline (/catalog/:subjectSlug)
 * Strictly complies with Rule 1 (selecting only approved discovery fields for lessons).
 */
export async function fetchSubjectWithChaptersAndLessons(
  subjectSlug: string
): Promise<CatalogSubjectDetail | null> {
  try {
    // 1. Fetch Subject
    const { data: rawSubject, error: subjectErr } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', subjectSlug)
      .eq('is_published', true)
      .maybeSingle()

    if (subjectErr || !rawSubject) {
      console.error('[catalogService] Subject not found or error:', subjectErr)
      return null
    }

    const subject = rawSubject as Subject

    // 2. Fetch Chapters for Subject
    const { data: rawChapters, error: chaptersErr } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subject.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (chaptersErr || !rawChapters) {
      console.error('[catalogService] Error fetching chapters:', chaptersErr)
      return { subject, chapters: [] }
    }

    const chapters = rawChapters as Chapter[]

    // 3. For each chapter, fetch its published lessons metadata (Rule 1 compliant)
    const chaptersWithLessons: CatalogChapterWithLessons[] = await Promise.all(
      chapters.map(async (chap) => {
        const { data: rawLessons } = await supabase
          .from('lessons')
          .select(APPROVED_LESSON_DISCOVERY_FIELDS)
          .eq('chapter_id', chap.id)
          .eq('status', 'published')
          .order('sort_order', { ascending: true })

        return {
          ...chap,
          lessons: (rawLessons as CatalogLessonMetadata[]) || [],
        }
      })
    )

    return {
      subject,
      chapters: chaptersWithLessons,
    }
  } catch (err) {
    console.error('[catalogService] Unexpected error fetching subject detail:', err)
    return null
  }
}
