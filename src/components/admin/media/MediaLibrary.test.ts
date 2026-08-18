/**
 * Media Library & Storage Security Unit Test Suite
 */

import {
  sanitizeFilename,
  validateMediaFile,
  getStorageBucket,
  isSafeSvgContent,
} from '../../../utils/storageSecurity'

export interface MockMediaItem {
  id: string
  name: string
  bucket: 'public-media' | 'pro-media'
  mime: string
  size: number
  url: string
  alt?: string
}

export function checkMediaDependency(
  mediaUrl: string,
  blocks: Array<{ id: string; lesson_id: string; content: Record<string, unknown> }>
): { isUsed: boolean; count: number; blockIds: string[] } {
  if (!mediaUrl) return { isUsed: false, count: 0, blockIds: [] }

  const cleanTarget = mediaUrl.split('?')[0] // Strip signed URL query tokens
  const matchingBlocks: string[] = []

  for (const block of blocks) {
    const contentStr = JSON.stringify(block.content || {})
    if (contentStr.includes(cleanTarget) || contentStr.includes(mediaUrl)) {
      matchingBlocks.push(block.id)
    }
  }

  return {
    isUsed: matchingBlocks.length > 0,
    count: matchingBlocks.length,
    blockIds: matchingBlocks,
  }
}

describe('Media Library & Storage Security Unit Tests', () => {
  it('Scenario 1: Filename normalization strips path traversal and dangerous characters', () => {
    const dangerousName = '../../etc/passwd_script_v1.0.png'
    const clean = sanitizeFilename(dangerousName)

    expect(clean.includes('..')).toBe(false)
    expect(clean.includes('/')).toBe(false)
    expect(clean.includes('\\')).toBe(false)
    expect(clean.endsWith('.png')).toBe(true)
  })

  it('Scenario 2: Malicious SVG content inspection blocks XSS payloads', () => {
    const maliciousSvg = '<svg><script>alert("XSS")</script></svg>'
    const safeSvg = '<svg><circle cx="50" cy="50" r="40" fill="red"/></svg>'

    expect(isSafeSvgContent(maliciousSvg)).toBe(false)
    expect(isSafeSvgContent(safeSvg)).toBe(true)
  })

  it('Scenario 3: Storage bucket routing separates PRO and FREE content', () => {
    expect(getStorageBucket(true)).toBe('pro-media')
    expect(getStorageBucket(false)).toBe('public-media')
  })

  it('Scenario 4: Dependency checker detects media assets used in lesson blocks', () => {
    const mediaUrl = 'https://supabase.co/storage/v1/object/public/public-media/harta-romania.png'

    const blocks = [
      { id: 'b1', lesson_id: 'l1', content: { text: 'Paragraf simplu' } },
      { id: 'b2', lesson_id: 'l1', content: { url: mediaUrl, caption: 'Harta Romaniei' } },
    ]

    const depCheck = checkMediaDependency(mediaUrl, blocks)
    expect(depCheck.isUsed).toBe(true)
    expect(depCheck.count).toBe(1)
    expect(depCheck.blockIds[0]).toBe('b2')
  })

  it('Scenario 5: File validation rejects oversized images (>10MB)', async () => {
    const fakeFile = {
      name: 'huge_image.png',
      type: 'image/png',
      size: 15 * 1024 * 1024,
    } as File

    const res = await validateMediaFile(fakeFile, 'image')
    expect(res.valid).toBe(false)
    expect(res.error?.includes('depășește limita')).toBe(true)
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
