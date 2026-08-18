/**
 * SEO & Canonical Indexation Unit Test Suite
 */

import { updateSeoMeta } from '../../utils/seoHelper'

// Mock DOM document object if running in Node.js test environment
if (typeof globalThis.document === 'undefined') {
  const elements = new Map<string, { content?: string; href?: string }>()
  ;(globalThis as unknown as Record<string, unknown>).document = {
    title: '',
    head: {
      appendChild: () => {},
    },
    querySelector: (selector: string) => {
      return elements.get(selector) || null
    },
    createElement: (tag: string) => {
      const el = { name: '', content: '', rel: '', href: '' }
      if (tag === 'meta') elements.set('meta[name="robots"]', el)
      if (tag === 'link') elements.set('link[rel="canonical"]', el)
      return el
    },
  }
}

describe('SEO & Canonical Indexation Unit Tests', () => {
  it('Scenario 1: Formats page title correctly with brand suffix', () => {
    updateSeoMeta({ title: 'Catalog Materii' })
    expect(document.title).toBe('Catalog Materii | Platformă Bacalaureat')
  })

  it('Scenario 2: Adds noindex, nofollow directive for private student and admin routes', () => {
    updateSeoMeta({ title: 'Panou Admin', noIndex: true })

    const metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    expect(metaRobots).not.toBeNull()
    expect(metaRobots?.content).toBe('noindex, nofollow')
  })

  it('Scenario 3: Restores index, follow directive for public product pages', () => {
    updateSeoMeta({ title: 'Abonament PRO', noIndex: false })

    const metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    expect(metaRobots?.content).toBe('index, follow')
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
    not: {
      toBeNull() {
        if (actual === null) {
          throw new Error('Expected value not to be null')
        }
      },
    },
  }
}
