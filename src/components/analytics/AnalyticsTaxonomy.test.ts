/**
 * Event Analytics Taxonomy, Privacy & Mastery Velocity Unit Test Suite
 */

import {
  sanitizeAnalyticsPayload,
  calculateMasteryVelocity,
} from '../../services/analyticsTaxonomy'

describe('Analytics Event Taxonomy & Privacy Unit Tests', () => {
  it('Scenario 1: Sanitizes event payload to strip PII fields (email, password, display_name)', () => {
    const rawPayload = {
      path: '/catalog/romana',
      email: 'elev@example.com',
      password: 'SecretPassword123!',
      display_name: 'Elev Test',
      lesson_id: 'lesson-123',
    }

    const clean = sanitizeAnalyticsPayload(rawPayload)

    expect(clean.path).toBe('/catalog/romana')
    expect(clean.lesson_id).toBe('lesson-123')
    expect('email' in clean).toBe(false)
    expect('password' in clean).toBe(false)
    expect('display_name' in clean).toBe(false)
  })

  it('Scenario 2: Computes Mastery Velocity metric using documented formula (completed_lessons / active_days)', () => {
    // 15 lessons completed across 5 active days = 3.0 lessons/day
    const velocity1 = calculateMasteryVelocity(15, 5)
    expect(velocity1).toBe(3)

    // 7 lessons completed across 2 active days = 3.5 lessons/day
    const velocity2 = calculateMasteryVelocity(7, 2)
    expect(velocity2).toBe(3.5)

    // 0 lessons or 0 days returns 0
    expect(calculateMasteryVelocity(0, 5)).toBe(0)
    expect(calculateMasteryVelocity(10, 0)).toBe(0)
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
