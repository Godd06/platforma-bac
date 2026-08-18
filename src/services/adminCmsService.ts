import { supabase } from '../lib/supabase'
import {
  validateMediaFile,
  sanitizeFilename,
  getStorageBucket,
  getSecureMediaUrl,
  type MediaCategory,
} from '../utils/storageSecurity'
import type {
  Subject,
  Chapter,
  Lesson,
  LessonAccessLevel,
  LessonStatus,
} from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'

// ==========================================
// TYPES & EXTENDED INTERFACES
// ==========================================

export function generateSlug(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function reorderItems<T>(items: T[], index: number, direction: 'up' | 'down'): T[] {
  if (!items || items.length === 0) return []
  const result = [...items]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= result.length) return result
  const [removed] = result.splice(index, 1)
  result.splice(targetIndex, 0, removed)
  return result
}

export interface AdminSubjectWithCounts extends Subject {
  chapter_count: number
  lesson_count: number
}

export interface AdminChapterWithCounts extends Chapter {
  lesson_count: number
}

export interface AdminLessonWithCounts extends Lesson {
  block_count: number
}

export interface SubjectFormData {
  name: string
  slug: string
  short_description?: string | null
  description?: string | null
  icon?: string | null
  accent_theme?: string | null
  sort_order: number
  is_published: boolean
}

export interface ChapterFormData {
  subject_id: string
  title: string
  slug: string
  short_description?: string | null
  description?: string | null
  metadata?: Record<string, unknown> | null
  sort_order: number
  is_published: boolean
}

export interface LessonFormData {
  chapter_id: string
  title: string
  slug: string
  short_description?: string | null
  estimated_minutes?: number | null
  access_level: LessonAccessLevel
  status: LessonStatus
  sort_order: number
  published_at?: string | null
}

export interface LessonBlockFormData {
  lesson_id: string
  block_type: string
  sort_order: number
  content: Record<string, unknown>
}

export interface GlobalSearchResult {
  id: string
  type: 'subject' | 'chapter' | 'lesson'
  title: string
  slug: string
  parentTitle?: string
  subjectId?: string
  chapterId?: string
  lessonId?: string
  subjectSlug?: string
  chapterSlug?: string
  status?: string
  accessLevel?: string
}

export interface ExportedLessonData {
  version: '1.0'
  exported_at: string
  type: 'lesson'
  lesson: Omit<Lesson, 'id' | 'chapter_id' | 'created_at' | 'updated_at'>
  blocks: Array<Omit<LessonBlockData, 'id' | 'lesson_id' | 'created_at' | 'updated_at'>>
}

export interface ExportedChapterData {
  version: '1.0'
  exported_at: string
  type: 'chapter'
  chapter: Omit<Chapter, 'id' | 'subject_id' | 'created_at' | 'updated_at'>
  lessons: ExportedLessonData[]
}

export interface ExportedSubjectData {
  version: '1.0'
  exported_at: string
  type: 'subject'
  subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>
  chapters: ExportedChapterData[]
}

// ==========================================
// 1. SUBJECTS SERVICES
// ==========================================

export async function fetchAdminSubjects(): Promise<{
  data: AdminSubjectWithCounts[] | null
  error: string | null
}> {
  try {
    const { data: rawSubjects, error: subjErr } = await supabase
      .from('subjects')
      .select('*')
      .order('sort_order', { ascending: true })

    if (subjErr) {
      console.error('[adminCmsService] Error fetching subjects:', subjErr)
      return { data: null, error: subjErr.message }
    }

    if (!rawSubjects) {
      return { data: [], error: null }
    }

    const subjects = rawSubjects as unknown as Subject[]

    // Attach chapter and lesson counts
    const enrichedSubjects: AdminSubjectWithCounts[] = await Promise.all(
      subjects.map(async (subj) => {
        const { count: chapCount } = await supabase
          .from('chapters')
          .select('id', { count: 'exact', head: true })
          .eq('subject_id', subj.id)

        const { data: chapIds } = await supabase
          .from('chapters')
          .select('id')
          .eq('subject_id', subj.id)

        let lessonCount = 0
        if (chapIds && chapIds.length > 0) {
          const ids = (chapIds as Array<{ id: string }>).map((c) => c.id)
          const { count } = await supabase
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .in('chapter_id', ids)
          lessonCount = count || 0
        }

        return {
          ...subj,
          chapter_count: chapCount || 0,
          lesson_count: lessonCount,
        }
      })
    )

    return { data: enrichedSubjects, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare neașteptată la încărcarea materiilor.'
    console.error('[adminCmsService] Unexpected error in fetchAdminSubjects:', err)
    return { data: null, error: message }
  }
}

export async function fetchAdminSubjectById(id: string): Promise<{
  data: Subject | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) return { data: null, error: error.message }
    return { data: (data as unknown as Subject) || null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea materiei.'
    return { data: null, error: message }
  }
}

export async function createSubject(data: SubjectFormData): Promise<{
  data: Subject | null
  error: string | null
}> {
  try {
    const { data: created, error } = await supabase
      .from('subjects')
      .insert({
        name: data.name.trim(),
        slug: data.slug.trim().toLowerCase(),
        short_description: data.short_description?.trim() || null,
        description: data.description?.trim() || null,
        icon: data.icon?.trim() || null,
        accent_theme: data.accent_theme?.trim() || null,
        sort_order: Number(data.sort_order) || 0,
        is_published: Boolean(data.is_published),
      } as never)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: created as unknown as Subject, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la crearea materiei.'
    return { data: null, error: message }
  }
}

export async function updateSubject(
  id: string,
  data: Partial<SubjectFormData>
): Promise<{
  data: Subject | null
  error: string | null
}> {
  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (data.name !== undefined) payload.name = data.name.trim()
    if (data.slug !== undefined) payload.slug = data.slug.trim().toLowerCase()
    if (data.short_description !== undefined) payload.short_description = data.short_description?.trim() || null
    if (data.description !== undefined) payload.description = data.description?.trim() || null
    if (data.icon !== undefined) payload.icon = data.icon?.trim() || null
    if (data.accent_theme !== undefined) payload.accent_theme = data.accent_theme?.trim() || null
    if (data.sort_order !== undefined) payload.sort_order = Number(data.sort_order)
    if (data.is_published !== undefined) payload.is_published = Boolean(data.is_published)

    const { data: updated, error } = await supabase
      .from('subjects')
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated as unknown as Subject, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea materiei.'
    return { data: null, error: message }
  }
}

export async function deleteSubject(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la ștergerea materiei.'
    return { error: message }
  }
}

export async function duplicateSubject(id: string): Promise<{
  data: Subject | null
  error: string | null
}> {
  try {
    const { data: original, error: fetchErr } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !original) return { data: null, error: fetchErr?.message || 'Materia nu există.' }

    const origObj = original as unknown as Subject
    const newSlug = `${origObj.slug}-copie-${Date.now().toString().slice(-4)}`

    const { data: created, error: insertErr } = await supabase
      .from('subjects')
      .insert({
        name: `${origObj.name} (Copie)`,
        slug: newSlug,
        short_description: origObj.short_description,
        description: origObj.description,
        icon: origObj.icon,
        accent_theme: origObj.accent_theme,
        sort_order: (origObj.sort_order || 0) + 1,
        is_published: false,
      } as never)
      .select('*')
      .single()

    if (insertErr) return { data: null, error: insertErr.message }
    return { data: created as unknown as Subject, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la duplicarea materiei.'
    return { data: null, error: message }
  }
}

export async function reorderSubject(
  subjectId: string,
  direction: 'up' | 'down'
): Promise<{ error: string | null }> {
  try {
    const { data: rawSubjects, error: listErr } = await supabase
      .from('subjects')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })

    if (listErr || !rawSubjects) return { error: listErr?.message || 'Nu s-au putut încărca materiile.' }

    const allSubjects = rawSubjects as Array<{ id: string; sort_order: number }>
    const index = allSubjects.findIndex((s) => s.id === subjectId)
    if (index === -1) return { error: 'Materia nu a fost găsită.' }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= allSubjects.length) {
      return { error: null }
    }

    const current = allSubjects[index]
    const neighbor = allSubjects[targetIndex]

    const currentOrder = current.sort_order
    let neighborOrder = neighbor.sort_order

    if (currentOrder === neighborOrder) {
      neighborOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    }

    const [res1, res2] = await Promise.all([
      supabase.from('subjects').update({ sort_order: neighborOrder } as never).eq('id', current.id),
      supabase.from('subjects').update({ sort_order: currentOrder } as never).eq('id', neighbor.id),
    ])

    if (res1.error) return { error: res1.error.message }
    if (res2.error) return { error: res2.error.message }

    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la reordonarea materiei.'
    return { error: message }
  }
}

// ==========================================
// 2. CHAPTERS SERVICES
// ==========================================

export async function fetchAdminChapters(subjectId: string): Promise<{
  data: AdminChapterWithCounts[] | null
  error: string | null
}> {
  try {
    const { data: rawChapters, error: chapErr } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subjectId)
      .order('sort_order', { ascending: true })

    if (chapErr) {
      console.error('[adminCmsService] Error fetching chapters:', chapErr)
      return { data: null, error: chapErr.message }
    }

    if (!rawChapters) return { data: [], error: null }

    const chapters = rawChapters as unknown as Chapter[]

    const enrichedChapters: AdminChapterWithCounts[] = await Promise.all(
      chapters.map(async (ch) => {
        const { count: lessonCount } = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('chapter_id', ch.id)

        return {
          ...ch,
          lesson_count: lessonCount || 0,
        }
      })
    )

    return { data: enrichedChapters, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea capitolelor.'
    return { data: null, error: message }
  }
}

export async function fetchAdminChapterById(id: string): Promise<{
  data: Chapter | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) return { data: null, error: error.message }
    return { data: (data as unknown as Chapter) || null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea capitolului.'
    return { data: null, error: message }
  }
}

export async function createChapter(data: ChapterFormData): Promise<{
  data: Chapter | null
  error: string | null
}> {
  try {
    const { data: created, error } = await supabase
      .from('chapters')
      .insert({
        subject_id: data.subject_id,
        title: data.title.trim(),
        slug: data.slug.trim().toLowerCase(),
        short_description: data.short_description?.trim() || null,
        description: data.description?.trim() || null,
        metadata: data.metadata || {},
        sort_order: Number(data.sort_order) || 0,
        is_published: Boolean(data.is_published),
      } as never)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: created as unknown as Chapter, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la crearea capitolului.'
    return { data: null, error: message }
  }
}

export async function updateChapter(
  id: string,
  data: Partial<ChapterFormData>
): Promise<{
  data: Chapter | null
  error: string | null
}> {
  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (data.title !== undefined) payload.title = data.title.trim()
    if (data.slug !== undefined) payload.slug = data.slug.trim().toLowerCase()
    if (data.short_description !== undefined) payload.short_description = data.short_description?.trim() || null
    if (data.description !== undefined) payload.description = data.description?.trim() || null
    if (data.metadata !== undefined) payload.metadata = data.metadata || {}
    if (data.sort_order !== undefined) payload.sort_order = Number(data.sort_order)
    if (data.is_published !== undefined) payload.is_published = Boolean(data.is_published)

    const { data: updated, error } = await supabase
      .from('chapters')
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated as unknown as Chapter, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea capitolului.'
    return { data: null, error: message }
  }
}

export async function deleteChapter(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('chapters').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la ștergerea capitolului.'
    return { error: message }
  }
}

export async function duplicateChapter(id: string): Promise<{
  data: Chapter | null
  error: string | null
}> {
  try {
    const { data: original, error: fetchErr } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !original) return { data: null, error: fetchErr?.message || 'Capitolul nu există.' }

    const origObj = original as unknown as Chapter
    const newSlug = `${origObj.slug}-copie-${Date.now().toString().slice(-4)}`

    const { data: created, error: insertErr } = await supabase
      .from('chapters')
      .insert({
        subject_id: origObj.subject_id,
        title: `${origObj.title} (Copie)`,
        slug: newSlug,
        short_description: origObj.short_description,
        description: origObj.description,
        metadata: origObj.metadata || {},
        sort_order: (origObj.sort_order || 0) + 1,
        is_published: false,
      } as never)
      .select('*')
      .single()

    if (insertErr) return { data: null, error: insertErr.message }
    return { data: created as unknown as Chapter, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la duplicarea capitolului.'
    return { data: null, error: message }
  }
}

export async function reorderChapter(
  subjectId: string,
  chapterId: string,
  direction: 'up' | 'down'
): Promise<{ error: string | null }> {
  try {
    const { data: rawChapters, error: listErr } = await supabase
      .from('chapters')
      .select('id, sort_order')
      .eq('subject_id', subjectId)
      .order('sort_order', { ascending: true })

    if (listErr || !rawChapters) return { error: listErr?.message || 'Nu s-au putut încărca capitolele.' }

    const chapters = rawChapters as Array<{ id: string; sort_order: number }>
    const index = chapters.findIndex((c) => c.id === chapterId)
    if (index === -1) return { error: 'Capitolul nu a fost găsit.' }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= chapters.length) {
      return { error: null }
    }

    const current = chapters[index]
    const neighbor = chapters[targetIndex]

    const currentOrder = current.sort_order
    let neighborOrder = neighbor.sort_order
    if (currentOrder === neighborOrder) {
      neighborOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    }

    const [res1, res2] = await Promise.all([
      supabase.from('chapters').update({ sort_order: neighborOrder } as never).eq('id', current.id),
      supabase.from('chapters').update({ sort_order: currentOrder } as never).eq('id', neighbor.id),
    ])

    if (res1.error) return { error: res1.error.message }
    if (res2.error) return { error: res2.error.message }

    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la reordonarea capitolului.'
    return { error: message }
  }
}

// ==========================================
// 3. LESSONS SERVICES
// ==========================================

export async function fetchAdminLessons(chapterId: string): Promise<{
  data: AdminLessonWithCounts[] | null
  error: string | null
}> {
  try {
    const { data: rawLessons, error: lessonErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('sort_order', { ascending: true })

    if (lessonErr) {
      console.error('[adminCmsService] Error fetching lessons:', lessonErr)
      return { data: null, error: lessonErr.message }
    }

    if (!rawLessons) return { data: [], error: null }

    const lessons = rawLessons as unknown as Lesson[]

    const enrichedLessons: AdminLessonWithCounts[] = await Promise.all(
      lessons.map(async (les) => {
        const { count: blockCount } = await supabase
          .from('lesson_blocks')
          .select('id', { count: 'exact', head: true })
          .eq('lesson_id', les.id)

        return {
          ...les,
          block_count: blockCount || 0,
        }
      })
    )

    return { data: enrichedLessons, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea lecțiilor.'
    return { data: null, error: message }
  }
}

export async function fetchAdminLessonById(id: string): Promise<{
  data: Lesson | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) return { data: null, error: error.message }
    return { data: (data as unknown as Lesson) || null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea lecției.'
    return { data: null, error: message }
  }
}

export async function createLesson(data: LessonFormData): Promise<{
  data: Lesson | null
  error: string | null
}> {
  try {
    const { data: created, error } = await supabase
      .from('lessons')
      .insert({
        chapter_id: data.chapter_id,
        title: data.title.trim(),
        slug: data.slug.trim().toLowerCase(),
        short_description: data.short_description?.trim() || null,
        estimated_minutes:
          data.estimated_minutes !== null && data.estimated_minutes !== undefined
            ? Math.max(0, Number(data.estimated_minutes))
            : null,
        access_level: data.access_level,
        status: data.status,
        sort_order: Number(data.sort_order) || 0,
        published_at: data.status === 'published' ? data.published_at || new Date().toISOString() : null,
      } as never)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: created as unknown as Lesson, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la crearea lecției.'
    return { data: null, error: message }
  }
}

export async function updateLesson(
  id: string,
  data: Partial<LessonFormData>
): Promise<{
  data: Lesson | null
  error: string | null
}> {
  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (data.title !== undefined) payload.title = data.title.trim()
    if (data.slug !== undefined) payload.slug = data.slug.trim().toLowerCase()
    if (data.short_description !== undefined) payload.short_description = data.short_description?.trim() || null
    if (data.estimated_minutes !== undefined) {
      payload.estimated_minutes =
        data.estimated_minutes !== null ? Math.max(0, Number(data.estimated_minutes)) : null
    }
    if (data.access_level !== undefined) payload.access_level = data.access_level
    if (data.status !== undefined) {
      payload.status = data.status
      if (data.status === 'published' && !data.published_at) {
        payload.published_at = new Date().toISOString()
      } else if (data.status !== 'published') {
        payload.published_at = null
      }
    }
    if (data.published_at !== undefined) payload.published_at = data.published_at
    if (data.sort_order !== undefined) payload.sort_order = Number(data.sort_order)

    const { data: updated, error } = await supabase
      .from('lessons')
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated as unknown as Lesson, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea lecției.'
    return { data: null, error: message }
  }
}

export async function deleteLesson(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la ștergerea lecției.'
    return { error: message }
  }
}

export async function duplicateLesson(id: string): Promise<{
  data: Lesson | null
  error: string | null
}> {
  try {
    // 1. Fetch lesson
    const { data: origLesson, error: fetchErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !origLesson) return { data: null, error: fetchErr?.message || 'Lecția nu a fost găsită.' }

    const original = origLesson as unknown as Lesson
    const newSlug = `${original.slug}-copie-${Date.now().toString().slice(-4)}`

    // 2. Fetch original blocks
    const { data: origBlocks } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', id)
      .order('sort_order', { ascending: true })

    // 3. Create cloned lesson
    const { data: newLesson, error: insertErr } = await supabase
      .from('lessons')
      .insert({
        chapter_id: original.chapter_id,
        title: `${original.title} (Copie)`,
        slug: newSlug,
        short_description: original.short_description,
        estimated_minutes: original.estimated_minutes,
        access_level: original.access_level,
        status: 'draft',
        sort_order: (original.sort_order || 0) + 1,
        published_at: null,
      } as never)
      .select('*')
      .single()

    if (insertErr || !newLesson) return { data: null, error: insertErr?.message || 'Eroare la crearea copiei.' }

    const createdLesson = newLesson as unknown as Lesson

    // 4. Clone all child blocks
    if (origBlocks && origBlocks.length > 0) {
      const blocksToInsert = (origBlocks as unknown as LessonBlockData[]).map((b) => ({
        lesson_id: createdLesson.id,
        block_type: b.block_type,
        sort_order: b.sort_order,
        content: b.content || {},
      }))

      await supabase.from('lesson_blocks').insert(blocksToInsert as never)
    }

    return { data: createdLesson, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la duplicarea lecției.'
    return { data: null, error: message }
  }
}

export async function bulkUpdateLessons(
  ids: string[],
  updates: Partial<LessonFormData>
): Promise<{ count: number; error: string | null }> {
  try {
    if (!ids || ids.length === 0) return { count: 0, error: null }

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (updates.access_level !== undefined) payload.access_level = updates.access_level
    if (updates.status !== undefined) {
      payload.status = updates.status
      if (updates.status === 'published') payload.published_at = new Date().toISOString()
      else payload.published_at = null
    }

    const { error } = await supabase
      .from('lessons')
      .update(payload as never)
      .in('id', ids)

    if (error) return { count: 0, error: error.message }
    return { count: ids.length, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea în masă.'
    return { count: 0, error: message }
  }
}

export async function bulkDeleteLessons(ids: string[]): Promise<{ count: number; error: string | null }> {
  try {
    if (!ids || ids.length === 0) return { count: 0, error: null }

    const { error } = await supabase.from('lessons').delete().in('id', ids)
    if (error) return { count: 0, error: error.message }
    return { count: ids.length, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la ștergerea în masă a lecțiilor.'
    return { count: 0, error: message }
  }
}

export async function reorderLesson(
  chapterId: string,
  lessonId: string,
  direction: 'up' | 'down'
): Promise<{ error: string | null }> {
  try {
    const { data: rawLessons, error: listErr } = await supabase
      .from('lessons')
      .select('id, sort_order')
      .eq('chapter_id', chapterId)
      .order('sort_order', { ascending: true })

    if (listErr || !rawLessons) return { error: listErr?.message || 'Nu s-au putut încărca lecțiile.' }

    const lessons = rawLessons as Array<{ id: string; sort_order: number }>
    const index = lessons.findIndex((l) => l.id === lessonId)
    if (index === -1) return { error: 'Lecția nu a fost găsită.' }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= lessons.length) {
      return { error: null }
    }

    const current = lessons[index]
    const neighbor = lessons[targetIndex]

    const currentOrder = current.sort_order
    let neighborOrder = neighbor.sort_order
    if (currentOrder === neighborOrder) {
      neighborOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    }

    const [res1, res2] = await Promise.all([
      supabase.from('lessons').update({ sort_order: neighborOrder } as never).eq('id', current.id),
      supabase.from('lessons').update({ sort_order: currentOrder } as never).eq('id', neighbor.id),
    ])

    if (res1.error) return { error: res1.error.message }
    if (res2.error) return { error: res2.error.message }

    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la reordonarea lecției.'
    return { error: message }
  }
}

// ==========================================
// 4. LESSON BLOCKS SERVICES
// ==========================================

export async function fetchAdminLessonBlocks(lessonId: string): Promise<{
  data: LessonBlockData[] | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[adminCmsService] Error fetching lesson blocks:', error)
      return { data: null, error: error.message }
    }

    return { data: (data as unknown as LessonBlockData[]) || [], error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea blocurilor.'
    return { data: null, error: message }
  }
}

export async function createLessonBlock(data: LessonBlockFormData): Promise<{
  data: LessonBlockData | null
  error: string | null
}> {
  try {
    const { data: created, error } = await supabase
      .from('lesson_blocks')
      .insert({
        lesson_id: data.lesson_id,
        block_type: data.block_type.trim(),
        sort_order: Number(data.sort_order) || 0,
        content: data.content || {},
      } as never)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: created as unknown as LessonBlockData, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la crearea blocului.'
    return { data: null, error: message }
  }
}

export async function insertLessonBlockAt(
  lessonId: string,
  targetIndex: number,
  blockType: string,
  content: Record<string, unknown>
): Promise<{
  data: LessonBlockData | null
  error: string | null
}> {
  try {
    // 1. Fetch current blocks in exact order
    const { data: existing, error: listErr } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (listErr) return { data: null, error: listErr.message }

    const currentBlocks = (existing as unknown as LessonBlockData[]) || []
    const clampedIndex = Math.max(0, Math.min(targetIndex, currentBlocks.length))

    // 2. Insert the new block
    const { data: created, error: insertErr } = await supabase
      .from('lesson_blocks')
      .insert({
        lesson_id: lessonId,
        block_type: blockType.trim(),
        sort_order: clampedIndex * 10,
        content: content || {},
      } as never)
      .select('*')
      .single()

    if (insertErr || !created) return { data: null, error: insertErr?.message || 'Eroare la crearea blocului.' }

    const newBlock = created as unknown as LessonBlockData

    // 3. Rebuild ordered list with new block at clampedIndex
    const fullList = [...currentBlocks]
    fullList.splice(clampedIndex, 0, newBlock)

    // 4. Update all blocks to have clean normalized sort_orders (0, 10, 20, 30, ...)
    for (let i = 0; i < fullList.length; i++) {
      const b = fullList[i]
      const normalizedOrder = i * 10
      if (b.sort_order !== normalizedOrder) {
        await supabase.from('lesson_blocks').update({ sort_order: normalizedOrder } as never).eq('id', b.id)
      }
    }

    return { data: newBlock, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la inserarea blocului.'
    return { data: null, error: message }
  }
}

export async function updateLessonBlock(
  id: string,
  data: Partial<LessonBlockFormData>
): Promise<{
  data: LessonBlockData | null
  error: string | null
}> {
  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (data.block_type !== undefined) payload.block_type = data.block_type.trim()
    if (data.sort_order !== undefined) payload.sort_order = Number(data.sort_order)
    if (data.content !== undefined) payload.content = data.content

    const { data: updated, error } = await supabase
      .from('lesson_blocks')
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated as unknown as LessonBlockData, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea blocului.'
    return { data: null, error: message }
  }
}

export async function duplicateLessonBlock(blockId: string): Promise<{
  data: LessonBlockData | null
  error: string | null
}> {
  try {
    const { data: original, error: fetchErr } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('id', blockId)
      .single()

    if (fetchErr || !original) return { data: null, error: fetchErr?.message || 'Blocul nu există.' }

    const origObj = original as unknown as LessonBlockData

    // Fetch all blocks to find index
    const { data: allBlocks } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', origObj.lesson_id)
      .order('sort_order', { ascending: true })

    const list = (allBlocks as unknown as LessonBlockData[]) || []
    const origIndex = list.findIndex((b) => b.id === blockId)
    const insertIndex = origIndex === -1 ? list.length : origIndex + 1

    return await insertLessonBlockAt(
      origObj.lesson_id,
      insertIndex,
      origObj.block_type,
      origObj.content || {}
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la duplicarea blocului.'
    return { data: null, error: message }
  }
}

export async function deleteLessonBlock(id: string): Promise<{ error: string | null }> {
  try {
    // Fetch block to know lessonId
    const { data: rawB } = await supabase.from('lesson_blocks').select('lesson_id').eq('id', id).single()
    const targetLessonId = (rawB as unknown as { lesson_id?: string })?.lesson_id

    const { error } = await supabase.from('lesson_blocks').delete().eq('id', id)
    if (error) return { error: error.message }

    if (targetLessonId) {
      const { data: remaining } = await supabase
        .from('lesson_blocks')
        .select('id, sort_order')
        .eq('lesson_id', targetLessonId)
        .order('sort_order', { ascending: true })

      const remList = (remaining as unknown as Array<{ id: string; sort_order: number }>) || []
      for (let idx = 0; idx < remList.length; idx++) {
        const item = remList[idx]
        if (item.sort_order !== idx * 10) {
          await supabase.from('lesson_blocks').update({ sort_order: idx * 10 } as never).eq('id', item.id)
        }
      }
    }

    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la ștergerea blocului.'
    return { error: message }
  }
}

export async function reorderLessonBlock(
  lessonId: string,
  blockId: string,
  direction: 'up' | 'down'
): Promise<{ error: string | null }> {
  try {
    const { data: rawBlocks, error: listErr } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (listErr || !rawBlocks) return { error: listErr?.message || 'Nu s-au putut încărca blocurile.' }

    const blocks = (rawBlocks as unknown as LessonBlockData[]) || []
    const index = blocks.findIndex((b) => b.id === blockId)
    if (index === -1) return { error: 'Blocul nu a fost găsit.' }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= blocks.length) {
      return { error: null }
    }

    // Swap in array
    const reordered = [...blocks]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    // Normalize all sort_orders to 0, 10, 20, 30...
    for (let i = 0; i < reordered.length; i++) {
      const b = reordered[i]
      await supabase.from('lesson_blocks').update({ sort_order: i * 10 } as never).eq('id', b.id)
    }

    return { error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la reordonarea blocului.'
    return { error: message }
  }
}

// ==========================================
// 4B. MEDIA UPLOAD SERVICE (AUDIO / VIDEO / IMAGES)
// ==========================================

export async function uploadMediaFile(
  file: File,
  folder = 'content-media',
  isProContent = false,
  category: MediaCategory = 'image'
): Promise<{ url: string | null; error: string | null }> {
  try {
    // 1. Hardened Validation (MIME allow-list, size limit, malicious SVG inspection)
    const validation = await validateMediaFile(file, category)
    if (!validation.valid) {
      return { url: null, error: validation.error }
    }

    // 2. Filename Normalization & Path Traversal Prevention
    const safeFileName = `${folder}/${sanitizeFilename(file.name)}`
    const bucketName = getStorageBucket(isProContent)

    // 3. Attempt Supabase Storage Upload to appropriate bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(safeFileName, file, { cacheControl: '3600', upsert: true })

    if (!error && data?.path) {
      const secureUrlRes = await getSecureMediaUrl(bucketName, data.path)
      if (secureUrlRes.url) {
        return { url: secureUrlRes.url, error: null }
      }
    }

    // 4. Fallback Data URL reader for local preview if network is offline
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({ url: e.target?.result as string, error: null })
      }
      reader.onerror = () => {
        resolve({ url: null, error: 'Eroare la procesarea fișierului media.' })
      }
      reader.readAsDataURL(file)
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea fișierului.'
    return { url: null, error: message }
  }
}

// ==========================================
// 5. GLOBAL ADMIN SEARCH
// ==========================================

export async function globalAdminSearch(query: string): Promise<GlobalSearchResult[]> {
  if (!query || !query.trim()) return []
  const cleanQ = query.trim().toLowerCase()

  try {
    const [subjsRes, chapsRes, lessRes] = await Promise.all([
      supabase.from('subjects').select('id, name, slug, is_published').order('name'),
      supabase.from('chapters').select('id, subject_id, title, slug, is_published, metadata').order('title'),
      supabase.from('lessons').select('id, chapter_id, title, slug, status, access_level').order('title'),
    ])

    const results: GlobalSearchResult[] = []

    // 1. Subjects
    if (subjsRes.data) {
      for (const s of subjsRes.data as unknown as Subject[]) {
        if (s.name.toLowerCase().includes(cleanQ) || s.slug.toLowerCase().includes(cleanQ)) {
          results.push({
            id: s.id,
            type: 'subject',
            title: s.name,
            slug: s.slug,
            subjectId: s.id,
            subjectSlug: s.slug,
            status: s.is_published ? 'published' : 'draft',
          })
        }
      }
    }

    // 2. Chapters
    if (chapsRes.data) {
      for (const c of chapsRes.data as unknown as Chapter[]) {
        const metaStr = JSON.stringify(c.metadata || {}).toLowerCase()
        if (c.title.toLowerCase().includes(cleanQ) || c.slug.toLowerCase().includes(cleanQ) || metaStr.includes(cleanQ)) {
          const parentSubject = (subjsRes.data as unknown as Subject[])?.find((s) => s.id === c.subject_id)
          results.push({
            id: c.id,
            type: 'chapter',
            title: c.title,
            slug: c.slug,
            parentTitle: parentSubject?.name,
            subjectId: c.subject_id,
            chapterId: c.id,
            subjectSlug: parentSubject?.slug,
            chapterSlug: c.slug,
            status: c.is_published ? 'published' : 'draft',
          })
        }
      }
    }

    // 3. Lessons
    if (lessRes.data) {
      for (const l of lessRes.data as unknown as Lesson[]) {
        if (l.title.toLowerCase().includes(cleanQ) || l.slug.toLowerCase().includes(cleanQ)) {
          const parentChapter = (chapsRes.data as unknown as Chapter[])?.find((c) => c.id === l.chapter_id)
          const parentSubject = parentChapter ? (subjsRes.data as unknown as Subject[])?.find((s) => s.id === parentChapter.subject_id) : null
          results.push({
            id: l.id,
            type: 'lesson',
            title: l.title,
            slug: l.slug,
            parentTitle: parentChapter?.title,
            subjectId: parentChapter?.subject_id,
            chapterId: l.chapter_id,
            lessonId: l.id,
            subjectSlug: parentSubject?.slug,
            chapterSlug: parentChapter?.slug,
            status: l.status,
            accessLevel: l.access_level,
          })
        }
      }
    }

    return results.slice(0, 30)
  } catch (err) {
    console.error('[adminCmsService] Global search error:', err)
    return []
  }
}

// ==========================================
// 6. AI PIPELINE & IMPORT / EXPORT ENGINE
// ==========================================

export async function exportLessonJson(lessonId: string): Promise<{ data: ExportedLessonData | null; error: string | null }> {
  try {
    const { data: les, error: lesErr } = await supabase.from('lessons').select('*').eq('id', lessonId).single()
    if (lesErr || !les) return { data: null, error: lesErr?.message || 'Lecția nu a fost găsită.' }

    const { data: blks, error: blkErr } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })

    if (blkErr) return { data: null, error: blkErr.message }

    const lessonObj = les as unknown as Lesson
    const blocksList = (blks as unknown as LessonBlockData[]) || []

    const exportData: ExportedLessonData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      type: 'lesson',
      lesson: {
        title: lessonObj.title,
        slug: lessonObj.slug,
        short_description: lessonObj.short_description,
        estimated_minutes: lessonObj.estimated_minutes,
        access_level: lessonObj.access_level,
        status: lessonObj.status,
        sort_order: lessonObj.sort_order,
        published_at: lessonObj.published_at,
        cover_media_id: lessonObj.cover_media_id,
      },
      blocks: blocksList.map((b) => ({
        block_type: b.block_type,
        sort_order: b.sort_order,
        content: b.content || {},
      })),
    }

    return { data: exportData, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la exportul lecției.'
    return { data: null, error: message }
  }
}

export async function exportChapterJson(chapterId: string): Promise<{ data: ExportedChapterData | null; error: string | null }> {
  try {
    const { data: chap, error: chapErr } = await supabase.from('chapters').select('*').eq('id', chapterId).single()
    if (chapErr || !chap) return { data: null, error: chapErr?.message || 'Capitolul nu a fost găsit.' }

    const { data: less } = await supabase.from('lessons').select('id').eq('chapter_id', chapterId).order('sort_order', { ascending: true })

    const lessonExports: ExportedLessonData[] = []
    if (less && less.length > 0) {
      for (const l of less as Array<{ id: string }>) {
        const { data: lesExp } = await exportLessonJson(l.id)
        if (lesExp) lessonExports.push(lesExp)
      }
    }

    const chapterObj = chap as unknown as Chapter
    const exportData: ExportedChapterData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      type: 'chapter',
      chapter: {
        title: chapterObj.title,
        slug: chapterObj.slug,
        short_description: chapterObj.short_description,
        description: chapterObj.description,
        cover_media_id: chapterObj.cover_media_id,
        sort_order: chapterObj.sort_order,
        is_published: chapterObj.is_published,
        metadata: chapterObj.metadata || {},
      },
      lessons: lessonExports,
    }

    return { data: exportData, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la exportul capitolului.'
    return { data: null, error: message }
  }
}

export async function importLessonJson(
  chapterId: string,
  payload: Partial<ExportedLessonData> | Record<string, unknown>
): Promise<{ data: Lesson | null; error: string | null }> {
  try {
    // Validate schema
    const lessonData = (payload.lesson || payload) as Partial<Lesson>
    if (!lessonData.title || typeof lessonData.title !== 'string') {
      return { data: null, error: 'JSON-ul este invalid: câmpul "title" lipsește sau nu este text.' }
    }

    const rawSlug = lessonData.slug || lessonData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const uniqueSlug = `${rawSlug.trim().toLowerCase()}-${Date.now().toString().slice(-4)}`

    // Create lesson
    const { data: createdLesson, error: lesErr } = await supabase
      .from('lessons')
      .insert({
        chapter_id: chapterId,
        title: lessonData.title.trim(),
        slug: uniqueSlug,
        short_description: lessonData.short_description || null,
        estimated_minutes: Number(lessonData.estimated_minutes) || 15,
        access_level: lessonData.access_level || 'free',
        status: lessonData.status || 'draft',
        sort_order: Number(lessonData.sort_order) || 0,
        published_at: null,
      } as never)
      .select('*')
      .single()

    if (lesErr || !createdLesson) return { data: null, error: lesErr?.message || 'Nu s-a putut insera lecția.' }

    const lessonObj = createdLesson as unknown as Lesson

    // Insert blocks
    const rawBlocks = (payload.blocks as Array<{ block_type: string; sort_order?: number; content: Record<string, unknown> }>) || []
    if (Array.isArray(rawBlocks) && rawBlocks.length > 0) {
      const blocksToInsert = rawBlocks.map((b, idx) => ({
        lesson_id: lessonObj.id,
        block_type: b.block_type || 'rich_text',
        sort_order: b.sort_order ?? idx * 10,
        content: b.content || {},
      }))

      await supabase.from('lesson_blocks').insert(blocksToInsert as never)
    }

    return { data: lessonObj, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la importul lecției din JSON.'
    return { data: null, error: message }
  }
}

// ==========================================
// 7. DASHBOARD & NATURAL HIERARCHY RESOLVERS
// ==========================================

export interface EnrichedRecentLesson {
  id: string
  title: string
  slug: string
  short_description?: string | null
  status: LessonStatus
  access_level: LessonAccessLevel
  updated_at?: string
  chapterId: string
  chapterTitle: string
  chapterSlug: string
  subjectId: string
  subjectName: string
  subjectSlug: string
  fullPath: string
}

export async function fetchRecentLessons(limit = 10): Promise<EnrichedRecentLesson[]> {
  try {
    const { data: rawLessons, error: lesErr } = await supabase
      .from('lessons')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (lesErr || !rawLessons) return []

    const lessons = rawLessons as unknown as Lesson[]
    if (lessons.length === 0) return []

    const { data: rawChapters } = await supabase.from('chapters').select('id, subject_id, title, slug')
    const { data: rawSubjects } = await supabase.from('subjects').select('id, name, slug')

    const chapters = (rawChapters as Array<{ id: string; subject_id: string; title: string; slug: string }>) || []
    const subjects = (rawSubjects as Array<{ id: string; name: string; slug: string }>) || []

    return lessons.map((les) => {
      const chap = chapters.find((c) => c.id === les.chapter_id)
      const subj = chap ? subjects.find((s) => s.id === chap.subject_id) : null

      const subjectSlug = subj?.slug || 'curriculum'
      const chapterSlug = chap?.slug || 'capitol'
      const fullPath = `/admin/content/${subjectSlug}/${chapterSlug}/${les.slug}`

      return {
        id: les.id,
        title: les.title,
        slug: les.slug,
        short_description: les.short_description,
        status: les.status,
        access_level: les.access_level,
        updated_at: les.updated_at,
        chapterId: les.chapter_id,
        chapterTitle: chap?.title || 'Capitol',
        chapterSlug,
        subjectId: chap?.subject_id || '',
        subjectName: subj?.name || 'Materie',
        subjectSlug,
        fullPath,
      }
    })
  } catch (err) {
    console.error('[adminCmsService] Error fetching recent lessons:', err)
    return []
  }
}

export async function fetchLessonsNeedingAttention(): Promise<{
  drafts: EnrichedRecentLesson[]
  review: EnrichedRecentLesson[]
}> {
  try {
    const { data: rawLessons, error: lesErr } = await supabase
      .from('lessons')
      .select('*')
      .in('status', ['draft', 'review'])
      .order('updated_at', { ascending: false })

    if (lesErr || !rawLessons) return { drafts: [], review: [] }

    const lessons = rawLessons as unknown as Lesson[]
    const { data: rawChapters } = await supabase.from('chapters').select('id, subject_id, title, slug')
    const { data: rawSubjects } = await supabase.from('subjects').select('id, name, slug')

    const chapters = (rawChapters as Array<{ id: string; subject_id: string; title: string; slug: string }>) || []
    const subjects = (rawSubjects as Array<{ id: string; name: string; slug: string }>) || []

    const enriched: EnrichedRecentLesson[] = lessons.map((les) => {
      const chap = chapters.find((c) => c.id === les.chapter_id)
      const subj = chap ? subjects.find((s) => s.id === chap.subject_id) : null
      const subjectSlug = subj?.slug || 'curriculum'
      const chapterSlug = chap?.slug || 'capitol'

      return {
        id: les.id,
        title: les.title,
        slug: les.slug,
        short_description: les.short_description,
        status: les.status,
        access_level: les.access_level,
        updated_at: les.updated_at,
        chapterId: les.chapter_id,
        chapterTitle: chap?.title || 'Capitol',
        chapterSlug,
        subjectId: chap?.subject_id || '',
        subjectName: subj?.name || 'Materie',
        subjectSlug,
        fullPath: `/admin/content/${subjectSlug}/${chapterSlug}/${les.slug}`,
      }
    })

    return {
      drafts: enriched.filter((l) => l.status === 'draft'),
      review: enriched.filter((l) => l.status === 'review'),
    }
  } catch (err) {
    console.error('[adminCmsService] Error fetching attention lessons:', err)
    return { drafts: [], review: [] }
  }
}

export async function resolveHierarchyBySlugs(
  subjectSlug?: string,
  chapterSlug?: string,
  lessonSlug?: string
): Promise<{
  subject: Subject | null
  chapter: Chapter | null
  lesson: Lesson | null
  error: string | null
}> {
  try {
    let subject: Subject | null = null
    let chapter: Chapter | null = null
    let lesson: Lesson | null = null

    if (subjectSlug) {
      const { data: subjData } = await supabase.from('subjects').select('*').eq('slug', subjectSlug).maybeSingle()
      subject = (subjData as unknown as Subject) || null
    }

    if (subject && chapterSlug) {
      const { data: chapData } = await supabase
        .from('chapters')
        .select('*')
        .eq('subject_id', subject.id)
        .eq('slug', chapterSlug)
        .maybeSingle()
      chapter = (chapData as unknown as Chapter) || null
    }

    if (chapter && lessonSlug) {
      const { data: lesData } = await supabase
        .from('lessons')
        .select('*')
        .eq('chapter_id', chapter.id)
        .eq('slug', lessonSlug)
        .maybeSingle()
      lesson = (lesData as unknown as Lesson) || null
    }

    return { subject, chapter, lesson, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la rezolvarea căii.'
    return { subject: null, chapter: null, lesson: null, error: message }
  }
}

export async function fetchLessonWithParents(lessonId: string): Promise<{
  lesson: Lesson | null
  chapter: Chapter | null
  subject: Subject | null
  error: string | null
}> {
  try {
    const { data: lesData, error: lesErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle()

    if (lesErr || !lesData) return { lesson: null, chapter: null, subject: null, error: lesErr?.message || 'Lecția nu există.' }

    const lesson = lesData as unknown as Lesson
    const { data: chapData } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', lesson.chapter_id)
      .maybeSingle()

    const chapter = (chapData as unknown as Chapter) || null
    let subject: Subject | null = null

    if (chapter) {
      const { data: subjData } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', chapter.subject_id)
        .maybeSingle()
      subject = (subjData as unknown as Subject) || null
    }

    return { lesson, chapter, subject, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea lecției.'
    return { lesson: null, chapter: null, subject: null, error: message }
  }
}


