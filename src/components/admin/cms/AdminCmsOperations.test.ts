/**
 * Admin CMS Operations & Content Management Unit Test Suite
 */

export interface MockLesson {
  id: string
  chapter_id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'review'
  access_level: 'free' | 'pro'
  sort_order: number
}

export interface MockBlock {
  id: string
  lesson_id: string
  block_type: string
  sort_order: number
  content: Record<string, unknown>
}

// 1. Slug Generator Helper
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ă|â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș|ş/g, 's')
    .replace(/ț|ţ/g, 't')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// 2. Duplicate Lesson Logic
export function duplicateLessonInMemory(original: MockLesson, blocks: MockBlock[]): {
  lesson: MockLesson
  blocks: MockBlock[]
} {
  const newId = `lesson-copy-${Date.now()}`
  const newSlug = `${original.slug}-copie`

  const clonedLesson: MockLesson = {
    ...original,
    id: newId,
    title: `${original.title} (Copie)`,
    slug: newSlug,
    status: 'draft',
    sort_order: original.sort_order + 1,
  }

  const clonedBlocks: MockBlock[] = blocks.map((b, idx) => ({
    id: `block-copy-${idx}-${Date.now()}`,
    lesson_id: newId,
    block_type: b.block_type,
    sort_order: b.sort_order,
    content: JSON.parse(JSON.stringify(b.content)),
  }))

  return { lesson: clonedLesson, blocks: clonedBlocks }
}

// 3. Bulk Status Update
export function bulkUpdateStatusInMemory(
  lessons: MockLesson[],
  targetIds: Set<string>,
  newStatus: 'draft' | 'published'
): MockLesson[] {
  return lessons.map((l) => (targetIds.has(l.id) ? { ...l, status: newStatus } : l))
}

// 4. Reorder Helper
export function reorderItemsInMemory<T extends { id: string; sort_order: number }>(
  items: T[],
  id: string,
  direction: 'up' | 'down'
): T[] {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
  const idx = sorted.findIndex((item) => item.id === id)
  if (idx === -1) return sorted

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= sorted.length) return sorted

  const tempOrder = sorted[idx].sort_order
  sorted[idx].sort_order = sorted[targetIdx].sort_order
  sorted[targetIdx].sort_order = tempOrder

  return sorted.sort((a, b) => a.sort_order - b.sort_order)
}

describe('Admin CMS Operations & Content Management Unit Tests', () => {
  it('Scenario 1: Slug generator produces clean URL-friendly slugs for Romanian diacritics', () => {
    const title = 'Moara cu noroc — Viziunea despre lume & Eseu'
    const slug = generateSlug(title)
    expect(slug).toBe('moara-cu-noroc-viziunea-despre-lume-eseu')
  })

  it('Scenario 2: Lesson duplication clones metadata as draft and copies all blocks', () => {
    const originalLesson: MockLesson = {
      id: 'l1',
      chapter_id: 'c1',
      title: 'Eseu Moara cu noroc',
      slug: 'eseu-moara-cu-noroc',
      status: 'published',
      access_level: 'free',
      sort_order: 10,
    }

    const originalBlocks: MockBlock[] = [
      { id: 'b1', lesson_id: 'l1', block_type: 'heading', sort_order: 0, content: { text: 'Titlu' } },
      { id: 'b2', lesson_id: 'l1', block_type: 'rich_text', sort_order: 10, content: { html: '<p>Text</p>' } },
    ]

    const result = duplicateLessonInMemory(originalLesson, originalBlocks)

    expect(result.lesson.title).toBe('Eseu Moara cu noroc (Copie)')
    expect(result.lesson.status).toBe('draft')
    expect(result.lesson.slug.startsWith('eseu-moara-cu-noroc-copie')).toBe(true)
    expect(result.blocks.length).toBe(2)
    expect(result.blocks[0].lesson_id).toBe(result.lesson.id)
  })

  it('Scenario 3: Bulk status update toggles lessons status accurately', () => {
    const lessons: MockLesson[] = [
      { id: 'l1', chapter_id: 'c1', title: 'L1', slug: 'l1', status: 'draft', access_level: 'free', sort_order: 0 },
      { id: 'l2', chapter_id: 'c1', title: 'L2', slug: 'l2', status: 'draft', access_level: 'free', sort_order: 10 },
      { id: 'l3', chapter_id: 'c1', title: 'L3', slug: 'l3', status: 'draft', access_level: 'free', sort_order: 20 },
    ]

    const updated = bulkUpdateStatusInMemory(lessons, new Set(['l1', 'l3']), 'published')
    expect(updated[0].status).toBe('published')
    expect(updated[1].status).toBe('draft')
    expect(updated[2].status).toBe('published')
  })

  it('Scenario 4: Reorders items up and down cleanly', () => {
    const items = [
      { id: 'b1', sort_order: 0 },
      { id: 'b2', sort_order: 10 },
      { id: 'b3', sort_order: 20 },
    ]

    const reorderedUp = reorderItemsInMemory(items, 'b2', 'up')
    expect(reorderedUp[0].id).toBe('b2')
    expect(reorderedUp[1].id).toBe('b1')

    const reorderedDown = reorderItemsInMemory(reorderedUp, 'b2', 'down')
    expect(reorderedDown[0].id).toBe('b1')
    expect(reorderedDown[1].id).toBe('b2')
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
