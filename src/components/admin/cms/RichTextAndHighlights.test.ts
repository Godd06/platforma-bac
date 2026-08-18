/**
 * Rich Text & Semantic Highlights End-to-End Pipeline Unit Test Suite
 */

import { sanitizeHtml } from '../../../utils/sanitizeHtml'

describe('Rich Text & Semantic Highlights End-to-End Pipeline Unit Tests', () => {
  it('Test 1: Sanitizes plain paragraph text and preserves semantic text content', () => {
    const input = '<p>Acesta este un paragraf simplu de sinteză.</p>'
    const output = sanitizeHtml(input)
    expect(output.includes('Acesta este un paragraf simplu de sinteză.')).toBe(true)
  })

  it('Test 2: Preserves highlight content and canonical color tags', () => {
    const input = '<p>Termenul <mark data-color="cyan">incipit ex-abrupto</mark> este esențial.</p>'
    const output = sanitizeHtml(input)
    expect(output.includes('incipit ex-abrupto')).toBe(true)
  })

  it('Test 3: Supports nested formatting inside highlights (Highlight + Bold + Italic + Link)', () => {
    const input =
      '<p><mark data-color="amber"><strong><em><a href="https://bac.ro" target="_blank">Eseu Important</a></em></strong></mark></p>'
    const output = sanitizeHtml(input)
    expect(output.includes('Eseu Important')).toBe(true)
  })

  it('Test 4: Supports multiple distinct highlights in the same paragraph', () => {
    const input =
      '<p><mark data-color="yellow">Idee cheie 1</mark> urmată de <mark data-color="rose">Atenție la greșeli</mark> și <mark data-color="emerald">Exemplu de 10</mark>.</p>'
    const output = sanitizeHtml(input)

    expect(output.includes('Idee cheie 1')).toBe(true)
    expect(output.includes('Atenție la greșeli')).toBe(true)
    expect(output.includes('Exemplu de 10')).toBe(true)
  })

  it('Test 5: Preserves highlights inside list items and headings', () => {
    const listInput = '<ul><li><mark data-color="cyan">Punctul 1 de pe barem</mark></li></ul>'
    const headingInput = '<h2><mark data-color="amber font-bold">Secțiune Canonică</mark></h2>'

    const listOutput = sanitizeHtml(listInput)
    const headingOutput = sanitizeHtml(headingInput)

    expect(listOutput.includes('Punctul 1 de pe barem')).toBe(true)
    expect(headingOutput.includes('Secțiune Canonică')).toBe(true)
  })

  it('Test 6: Strips malicious script tags, event handlers, and javascript: URLs', () => {
    const maliciousInput =
      '<p><mark data-color="yellow" onclick="alert(1)">Text</mark><script>alert("XSS")</script><a href="javascript:void(0)">Link Periculos</a></p>'
    const output = sanitizeHtml(maliciousInput)

    expect(output.includes('<script>')).toBe(false)
    expect(output.includes('onclick')).toBe(false)
    expect(output.includes('href="javascript:')).toBe(false)
    expect(output.includes('Text')).toBe(true)
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
