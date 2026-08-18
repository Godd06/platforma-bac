/**
 * Storage Security Test Suite (TASK P0.5)
 *
 * Tests:
 * 1. Filename normalization & path traversal stripping
 * 2. Malicious SVG script inspection (<script>, onload, javascript: hrefs)
 * 3. MIME allow-list validation & fake MIME type rejection
 * 4. File-size limits per media category
 * 5. Public vs Private PRO bucket routing and access control matrix
 */

import {
  sanitizeFilename,
  isSafeSvgContent,
  ALLOWED_MIME_TYPES,
  FILE_SIZE_LIMITS_BYTES,
  getStorageBucket,
} from '../../utils/storageSecurity'

describe('TASK P0.5 — Supabase Storage Security Unit Tests', () => {
  it('Scenario 1: Sanitizes dangerous filenames and strips path traversal', () => {
    const malicious = '../../../etc/passwd.exe'
    const clean = sanitizeFilename(malicious)
    expect(clean.includes('..')).toBe(false)
    expect(clean.includes('/')).toBe(false)
    expect(clean.includes('\\')).toBe(false)
    expect(clean.endsWith('.exe')).toBe(true)
  })

  it('Scenario 2: Detects and blocks malicious SVG files containing embedded scripts or onload event handlers', () => {
    const maliciousSvg1 = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('xss')</script></svg>`
    const maliciousSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>`
    const maliciousSvg3 = `<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><circle r="10"/></a></svg>`
    const safeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>`

    expect(isSafeSvgContent(maliciousSvg1)).toBe(false)
    expect(isSafeSvgContent(maliciousSvg2)).toBe(false)
    expect(isSafeSvgContent(maliciousSvg3)).toBe(false)
    expect(isSafeSvgContent(safeSvg)).toBe(true)
  })

  it('Scenario 3: Rejects fake or disallowed MIME types', () => {
    const allowedImages = ALLOWED_MIME_TYPES.image
    expect(allowedImages.includes('image/png')).toBe(true)
    expect(allowedImages.includes('application/x-msdownload')).toBe(false)
    expect(allowedImages.includes('text/html')).toBe(false)
    expect(allowedImages.includes('application/javascript')).toBe(false)
  })

  it('Scenario 4: Enforces strict file-size limits per category', () => {
    expect(FILE_SIZE_LIMITS_BYTES.image).toBe(10 * 1024 * 1024) // 10MB
    expect(FILE_SIZE_LIMITS_BYTES.audio).toBe(50 * 1024 * 1024) // 50MB
    expect(FILE_SIZE_LIMITS_BYTES.video).toBe(100 * 1024 * 1024) // 100MB
    expect(FILE_SIZE_LIMITS_BYTES.document).toBe(25 * 1024 * 1024) // 25MB
  })

  it('Scenario 5: Routes PRO content to private pro-media bucket and FREE content to public-media bucket', () => {
    const freeBucket = getStorageBucket(false)
    const proBucket = getStorageBucket(true)

    expect(freeBucket).toBe('public-media')
    expect(proBucket).toBe('pro-media')
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
