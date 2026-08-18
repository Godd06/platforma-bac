/**
 * Lesson Viewer & Block Renderer Security & Logic Unit Tests
 */

export interface MockLessonBlock {
  id: string
  lesson_id: string
  block_type: string
  content: Record<string, unknown>
  sort_order: number
}

export type AccessState = 'NOT_FOUND' | 'PRO_REQUIRED' | 'ACCESSIBLE' | 'ERROR'

export function evaluateLessonAccess(
  lesson: { id: string; access_level: 'free' | 'pro'; status: string } | null,
  isProUser: boolean,
  isStaff: boolean
): AccessState {
  if (!lesson || lesson.status !== 'published') {
    return 'NOT_FOUND'
  }

  if (lesson.access_level === 'pro' && !isProUser && !isStaff) {
    return 'PRO_REQUIRED'
  }

  return 'ACCESSIBLE'
}

export function computeSiblingLessons(
  siblings: Array<{ id: string; title: string; sort_order: number }>,
  currentId: string
): { prev: { id: string; title: string } | null; next: { id: string; title: string } | null } {
  const sorted = [...siblings].sort((a, b) => a.sort_order - b.sort_order)
  const idx = sorted.findIndex((s) => s.id === currentId)

  if (idx === -1) return { prev: null, next: null }

  const prev = idx > 0 ? { id: sorted[idx - 1].id, title: sorted[idx - 1].title } : null
  const next = idx < sorted.length - 1 ? { id: sorted[idx + 1].id, title: sorted[idx + 1].title } : null

  return { prev, next }
}

describe('Lesson Viewer & Block Renderer Security & Logic Unit Tests', () => {
  it('Scenario 1: Returns PRO_REQUIRED for non-PRO student accessing PRO lesson', () => {
    const proLesson = { id: 'l-pro', access_level: 'pro' as const, status: 'published' }
    const access = evaluateLessonAccess(proLesson, false, false)
    expect(access).toBe('PRO_REQUIRED')
  })

  it('Scenario 2: Returns ACCESSIBLE for PRO student accessing PRO lesson', () => {
    const proLesson = { id: 'l-pro', access_level: 'pro' as const, status: 'published' }
    const access = evaluateLessonAccess(proLesson, true, false)
    expect(access).toBe('ACCESSIBLE')
  })

  it('Scenario 3: Returns ACCESSIBLE for staff accessing PRO lesson regardless of subscription', () => {
    const proLesson = { id: 'l-pro', access_level: 'pro' as const, status: 'published' }
    const access = evaluateLessonAccess(proLesson, false, true)
    expect(access).toBe('ACCESSIBLE')
  })

  it('Scenario 4: Returns NOT_FOUND for draft/unpublished lesson', () => {
    const draftLesson = { id: 'l-draft', access_level: 'free' as const, status: 'draft' }
    const access = evaluateLessonAccess(draftLesson, true, true)
    expect(access).toBe('NOT_FOUND')
  })

  it('Scenario 5: Computes previous and next sibling lessons accurately', () => {
    const siblings = [
      { id: 'l1', title: 'Lecția 1', sort_order: 1 },
      { id: 'l2', title: 'Lecția 2', sort_order: 2 },
      { id: 'l3', title: 'Lecția 3', sort_order: 3 },
    ]

    const navL2 = computeSiblingLessons(siblings, 'l2')
    expect(navL2.prev?.id).toBe('l1')
    expect(navL2.next?.id).toBe('l3')

    const navL1 = computeSiblingLessons(siblings, 'l1')
    expect(navL1.prev).toBe(null)
    expect(navL1.next?.id).toBe('l2')
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
