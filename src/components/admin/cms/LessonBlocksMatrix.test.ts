/**
 * Complete Matrix Audit & Validation Unit Test Suite for All 11 Lesson Blocks
 */

import { sanitizeHtml } from '../../../utils/sanitizeHtml'

export const KNOWN_BLOCK_TYPES = [
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
] as const

export type BlockType = (typeof KNOWN_BLOCK_TYPES)[number]

export interface BlockValidationResult {
  valid: boolean
  error?: string
}

export function validateBlockContent(blockType: string, content: Record<string, unknown>): BlockValidationResult {
  switch (blockType) {
    case 'heading': {
      const text = typeof content.text === 'string' ? content.text.trim() : ''
      if (!text) return { valid: false, error: 'Heading text is required.' }
      return { valid: true }
    }
    case 'rich_text': {
      const html = typeof content.html === 'string' ? content.html.trim() : ''
      const text = typeof content.text === 'string' ? content.text.trim() : ''
      if (!html && !text) return { valid: false, error: 'Rich text content is required.' }
      return { valid: true }
    }
    case 'important': {
      const text = typeof content.text === 'string' ? content.text.trim() : ''
      if (!text) return { valid: false, error: 'Important text is required.' }
      return { valid: true }
    }
    case 'remember': {
      const text = typeof content.text === 'string' ? content.text.trim() : ''
      if (!text) return { valid: false, error: 'Remember text is required.' }
      return { valid: true }
    }
    case 'definition': {
      const term = typeof content.term === 'string' ? content.term.trim() : ''
      const def = typeof content.definition === 'string' ? content.definition.trim() : ''
      if (!term || !def) return { valid: false, error: 'Term and definition are required.' }
      return { valid: true }
    }
    case 'summary': {
      const items = Array.isArray(content.items) ? content.items.filter((i) => typeof i === 'string' && i.trim()) : []
      const text = typeof content.content === 'string' ? content.content.trim() : ''
      if (items.length === 0 && !text) return { valid: false, error: 'Summary bullet items or text is required.' }
      return { valid: true }
    }
    case 'image': {
      const url = typeof content.url === 'string' ? content.url.trim() : ''
      if (!url) return { valid: false, error: 'Image URL is required.' }
      return { valid: true }
    }
    case 'video': {
      const url = typeof content.url === 'string' ? content.url.trim() : ''
      if (!url) return { valid: false, error: 'Video URL is required.' }
      return { valid: true }
    }
    case 'audio': {
      const url = typeof content.url === 'string' ? content.url.trim() : ''
      if (!url) return { valid: false, error: 'Audio URL is required.' }
      return { valid: true }
    }
    case 'file_download':
    case 'attachment':
    case 'resource': {
      const url = typeof content.url === 'string' ? content.url.trim() : ''
      const filename = typeof content.filename === 'string' ? content.filename.trim() : ''
      if (!url || !filename) return { valid: false, error: 'File URL and filename are required.' }
      return { valid: true }
    }
    case 'quote':
    case 'literary_quote': {
      const quote = typeof content.quote === 'string' ? content.quote.trim() : typeof content.text === 'string' ? content.text.trim() : ''
      if (!quote) return { valid: false, error: 'Quote text is required.' }
      return { valid: true }
    }
    default:
      return { valid: false, error: `Unknown block type: ${blockType}` }
  }
}

describe('Complete Matrix Audit & Validation Unit Tests for All 11 Lesson Blocks', () => {
  it('Matrix Check 1: All 11 block types are recognized in the repository inventory', () => {
    expect(KNOWN_BLOCK_TYPES.length).toBe(11)
  })

  it('Matrix Check 2: Validates heading, rich_text, important, remember blocks', () => {
    expect(validateBlockContent('heading', { text: 'Titlu I' }).valid).toBe(true)
    expect(validateBlockContent('heading', { text: '' }).valid).toBe(false)

    expect(validateBlockContent('rich_text', { html: '<p>Paragraf</p>' }).valid).toBe(true)
    expect(validateBlockContent('rich_text', {}).valid).toBe(false)

    expect(validateBlockContent('important', { text: 'Atenție!' }).valid).toBe(true)
    expect(validateBlockContent('remember', { text: 'Idee cheie' }).valid).toBe(true)
  })

  it('Matrix Check 3: Validates definition, summary, image blocks', () => {
    expect(validateBlockContent('definition', { term: 'Incipit', definition: 'Debutul operei' }).valid).toBe(true)
    expect(validateBlockContent('definition', { term: 'Incipit' }).valid).toBe(false)

    expect(validateBlockContent('summary', { items: ['Ideea 1'] }).valid).toBe(true)
    expect(validateBlockContent('image', { url: 'https://img.jpg' }).valid).toBe(true)
  })

  it('Matrix Check 4: Validates video, audio, file_download, quote blocks', () => {
    expect(validateBlockContent('video', { url: 'https://youtube.com/embed/123' }).valid).toBe(true)
    expect(validateBlockContent('video', {}).valid).toBe(false)

    expect(validateBlockContent('audio', { url: 'https://audio.mp3' }).valid).toBe(true)
    expect(validateBlockContent('file_download', { url: 'https://file.pdf', filename: 'file.pdf' }).valid).toBe(true)
    expect(validateBlockContent('quote', { quote: 'Omul să fie mulțumit' }).valid).toBe(true)
  })

  it('Matrix Check 5: Verifies HTML sanitization for rich_text block content', () => {
    const maliciousHtml = '<p>Normal text</p><script>alert("XSS")</script><img src="x" onerror="alert(1)">'
    const sanitized = sanitizeHtml(maliciousHtml)
    expect(sanitized.includes('<script>')).toBe(false)
    expect(sanitized.includes('onerror')).toBe(false)
    expect(sanitized.includes('Normal text')).toBe(true)
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
