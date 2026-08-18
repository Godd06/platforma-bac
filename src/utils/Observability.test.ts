/**
 * Observability, Web Vitals & Admin Audit Trail Unit Test Suite
 */

import {
  logTelemetry,
  recordWebVital,
  logAdminAudit,
  sanitizeLogPayload,
  getTelemetryBuffer,
  clearTelemetryBuffer,
} from './observability'

describe('Observability, Web Vitals & Admin Audit Telemetry Unit Tests', () => {
  beforeEach(() => {
    clearTelemetryBuffer()
  })

  it('Scenario 1: Sanitizes payload to strip passwords, tokens, and PII keys', () => {
    const raw = {
      operation: 'user_login',
      password: 'SuperSecretPassword123!',
      token: 'bearer-xyz-12345',
      user_email: 'elev.test@platforma-bac.ro',
      safeParam: 'public_catalog',
    }

    const clean = sanitizeLogPayload(raw)
    expect(clean.password).toBeUndefined()
    expect(clean.token).toBeUndefined()
    expect(clean.user_email).toBeUndefined()
    expect(clean.safeParam).toBe('public_catalog')
  })

  it('Scenario 2: Logs Web Vitals (LCP, INP, CLS) with accurate ratings', () => {
    const lcpMetric = recordWebVital('LCP', 1800) // Good
    expect(lcpMetric.rating).toBe('good')

    const clsMetric = recordWebVital('CLS', 0.35) // Poor
    expect(clsMetric.rating).toBe('poor')

    const buffer = getTelemetryBuffer()
    expect(buffer.length).toBe(2)
    expect(buffer[0].category).toBe('web_vitals')
  })

  it('Scenario 3: Records Admin Audit Log for security actions, publications, and role changes', () => {
    const entry = logAdminAudit(
      'role_change',
      'user-target-88',
      { oldRole: 'student', newRole: 'editor' },
      'super_admin'
    )

    expect(entry.category).toBe('admin_audit')
    expect(entry.operation).toBe('admin_action_role_change')
    expect(entry.userRole).toBe('super_admin')
    expect(entry.payload.targetId).toBe('user-target-88')
  })

  it('Scenario 4: Captures client errors with correlation IDs and timestamps', () => {
    const entry = logTelemetry('client_error', 'fetch_lesson_failed', {
      lesson_id: 'lesson-101',
      status_code: 500,
    })

    expect(entry.correlationId.startsWith('corr-')).toBe(true)
    expect(entry.category).toBe('client_error')
    expect(entry.payload.lesson_id).toBe('lesson-101')
  })
})

function describe(name: string, fn: () => void) {
  console.log(`\n--- Running Test Suite: ${name} ---`)
  fn()
}

function beforeEach(fn: () => void) {
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
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined but got '${actual}'`)
      }
    },
  }
}
