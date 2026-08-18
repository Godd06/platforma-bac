// Approved discovery fields list for lessons (Rule 1 compliance)
export const APPROVED_LESSON_DISCOVERY_FIELDS =
  'id, chapter_id, slug, title, short_description, estimated_minutes, access_level, cover_media_id, sort_order, status'

export interface MockSubject {
  id: string
  name: string
  slug: string
  is_published: boolean
}

export interface MockChapter {
  id: string
  subject_id: string
  title: string
  slug: string
  is_published: boolean
  short_description?: string | null
}

export interface MockLessonMetadata {
  id: string
  chapter_id: string
  title: string
  slug: string
  access_level: 'free' | 'pro'
  status: 'draft' | 'published'
}

// Search filtering logic for Catalog Root & Subject Detail views
export function filterSubjects(subjects: MockSubject[], query: string): MockSubject[] {
  if (!query || !query.trim()) return subjects.filter((s) => s.is_published)
  const q = query.trim().toLowerCase()
  return subjects.filter(
    (s) => s.is_published && (s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
  )
}

export function filterChaptersWithLessons(
  chapters: MockChapter[],
  lessonsMap: Map<string, MockLessonMetadata[]>,
  query: string
): Array<MockChapter & { lessons: MockLessonMetadata[] }> {
  const publishedChapters = chapters.filter((c) => c.is_published)
  const q = query.trim().toLowerCase()

  return publishedChapters
    .map((ch) => {
      const chapterLessons = (lessonsMap.get(ch.id) || []).filter((l) => l.status === 'published')
      return { ...ch, lessons: chapterLessons }
    })
    .filter((ch) => {
      if (!q) return true
      const matchTitle = ch.title.toLowerCase().includes(q)
      const matchDesc = (ch.short_description || '').toLowerCase().includes(q)
      const matchLessons = ch.lessons.some((l) => l.title.toLowerCase().includes(q))
      return matchTitle || matchDesc || matchLessons
    })
}

describe('Catalog Hierarchy, Discovery Security & Search Unit Tests', () => {
  it('Scenario 1: Approved discovery fields list contains strictly allowed fields (no lesson_blocks)', () => {
    expect(APPROVED_LESSON_DISCOVERY_FIELDS.includes('lesson_blocks')).toBe(false)
    expect(APPROVED_LESSON_DISCOVERY_FIELDS.includes('content')).toBe(false)
    expect(APPROVED_LESSON_DISCOVERY_FIELDS.includes('title')).toBe(true)
    expect(APPROVED_LESSON_DISCOVERY_FIELDS.includes('access_level')).toBe(true)
  })

  it('Scenario 2: Root catalog filters out unpublished subjects', () => {
    const subjects: MockSubject[] = [
      { id: 's1', name: 'Limba Română', slug: 'romana', is_published: true },
      { id: 's2', name: 'Istorie Draft', slug: 'istorie-draft', is_published: false },
    ]

    const filtered = filterSubjects(subjects, '')
    expect(filtered.length).toBe(1)
    expect(filtered[0].slug).toBe('romana')
  })

  it('Scenario 3: Subject view filters out unpublished chapters & draft lessons', () => {
    const chapters: MockChapter[] = [
      { id: 'c1', subject_id: 's1', title: 'Poezia Pașoptistă', slug: 'poezia-pasoptista', is_published: true },
      { id: 'c2', subject_id: 's1', title: 'Capitol Secret', slug: 'capitol-secret', is_published: false },
    ]

    const lessonsMap = new Map<string, MockLessonMetadata[]>()
    lessonsMap.set('c1', [
      { id: 'l1', chapter_id: 'c1', title: 'Luceafărul', slug: 'luceafarul', access_level: 'free', status: 'published' },
      { id: 'l2', chapter_id: 'c1', title: 'Draft Essay', slug: 'draft-essay', access_level: 'free', status: 'draft' },
    ])

    const result = filterChaptersWithLessons(chapters, lessonsMap, '')
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('Poezia Pașoptistă')
    expect(result[0].lessons.length).toBe(1)
    expect(result[0].lessons[0].title).toBe('Luceafărul')
  })

  it('Scenario 4: Search query filters chapters and lessons in real-time', () => {
    const chapters: MockChapter[] = [
      { id: 'c1', subject_id: 's1', title: 'Poezia Modernistă', slug: 'poezia-modernista', is_published: true },
      { id: 'c2', subject_id: 's1', title: 'Proza Interbelică', slug: 'proza-interbelica', is_published: true },
    ]

    const lessonsMap = new Map<string, MockLessonMetadata[]>()
    lessonsMap.set('c1', [
      { id: 'l1', chapter_id: 'c1', title: 'Eu nu strivesc corola de minuni a lumii', slug: 'corola', access_level: 'free', status: 'published' },
    ])
    lessonsMap.set('c2', [
      { id: 'l2', chapter_id: 'c2', title: 'Ion de Liviu Rebreanu', slug: 'ion', access_level: 'pro', status: 'published' },
    ])

    const searchIon = filterChaptersWithLessons(chapters, lessonsMap, 'Ion')
    expect(searchIon.length).toBe(1)
    expect(searchIon[0].title).toBe('Proza Interbelică')

    const searchCorola = filterChaptersWithLessons(chapters, lessonsMap, 'corola')
    expect(searchCorola.length).toBe(1)
    expect(searchCorola[0].title).toBe('Poezia Modernistă')
  })
})

function describe(name: string, fn: () => void) {
  console.log(`\n--- Running Test Suite: ${name} ---`)
  fn()
}

function it(scenarioName: string, fn: () => void) {
  try {
    fn()
    console.log(`✅ [PASS] ${scenarioName}`)
  } catch (err) {
    console.error(`❌ [FAIL] ${scenarioName}:`, err)
    process.exit(1)
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected '${expected}' but got '${actual}'`)
      }
    },
  }
}
