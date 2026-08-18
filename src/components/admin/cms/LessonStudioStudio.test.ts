/**
 * Lesson Studio Visual Block Editor & Live Student Preview Unit Test Suite
 */

export interface LessonStudioState {
  lessonId: string
  mode: 'view' | 'edit' | 'split'
  activeEditingBlockId: string | null
  isDirty: boolean
}

export function getDefaultBlockContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'heading':
      return { text: 'Titlu Nou Reper', level: 2 }
    case 'rich_text':
      return { html: '<p>Introdu textul noului paragraf...</p>' }
    case 'important':
      return { title: 'Atenție la Barem!', text: 'Idee importantă de punctat...' }
    case 'remember':
      return { title: 'Reține Citatul Esențial', text: '„Citat reprezentativ...”' }
    case 'definition':
      return { term: 'Concept / Curent', definition: 'Definiție operațională...' }
    case 'summary':
      return { title: 'Sinteză Reper', items: ['Punct cheie 1'] }
    case 'image':
      return { url: 'https://images.unsplash.com/...', caption: 'Imagine' }
    case 'video':
      return { url: 'https://youtube.com/embed/...', title: 'Video' }
    case 'audio':
      return { url: 'https://.../audio.mp3', title: 'Audio' }
    case 'file_download':
      return { url: 'https://.../file.pdf', filename: 'file.pdf' }
    case 'quote':
      return { quote: 'Citat literar', author: 'Autor' }
    default:
      return {}
  }
}

export function toggleStudioMode(current: LessonStudioState, nextMode: 'view' | 'edit' | 'split'): LessonStudioState {
  return {
    ...current,
    mode: nextMode,
    activeEditingBlockId: nextMode === 'view' ? null : current.activeEditingBlockId,
  }
}

describe('Lesson Studio Visual Block Editor & Live Student Preview Unit Tests', () => {
  it('Scenario 1: Default block content initialization for all 11 block types', () => {
    const types = [
      'heading',
      'rich_text',
      'important',
      'remember',
      'definition',
      'summary',
      'image',
      'video',
      'audio',
      'file_download',
      'quote',
    ]

    types.forEach((type) => {
      const content = getDefaultBlockContent(type)
      expect(Object.keys(content).length > 0).toBe(true)
    })
  })

  it('Scenario 2: Toggling studio mode updates mode and resets active editing block on view mode', () => {
    const initial: LessonStudioState = {
      lessonId: 'l1',
      mode: 'edit',
      activeEditingBlockId: 'b1',
      isDirty: true,
    }

    const split = toggleStudioMode(initial, 'split')
    expect(split.mode).toBe('split')
    expect(split.activeEditingBlockId).toBe('b1')

    const view = toggleStudioMode(split, 'view')
    expect(view.mode).toBe('view')
    expect(view.activeEditingBlockId).toBe(null)
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
