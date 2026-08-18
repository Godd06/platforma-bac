/**
 * Auth UX & Romanian Error Mapping Unit Tests
 */

import { mapAuthError, isValidEmail } from '../../utils/authErrorMapper'

describe('Auth UX Unit Tests (Romanian Microcopy & Validation)', () => {
  it('Scenario 1: Maps "Invalid login credentials" to Romanian message', () => {
    const mapped = mapAuthError('Invalid login credentials')
    expect(mapped).toBe('Adresa de e-mail sau parola este incorectă. Te rugăm să verifici datele.')
  })

  it('Scenario 2: Maps "User already registered" to Romanian message', () => {
    const mapped = mapAuthError('User already registered')
    expect(mapped).toBe('Există deja un cont înregistrat cu această adresă de e-mail. Încearcă să te autentifici.')
  })

  it('Scenario 3: Maps rate limit errors to Romanian wait message', () => {
    const mapped = mapAuthError('Email rate limit exceeded')
    expect(mapped).toBe('Prea multe încercări recente. Te rugăm să aștepți un minut înainte de a reîncerca.')
  })

  it('Scenario 4: Maps network failure to Romanian network error', () => {
    const mapped = mapAuthError('Failed to fetch')
    expect(mapped).toBe('Eroare de rețea. Te rugăm să verifici conexiunea la internet și să reîncerci.')
  })

  it('Scenario 5: Validates email format correctly', () => {
    expect(isValidEmail('elev@liceu.ro')).toBe(true)
    expect(isValidEmail('  student@bac.edu.ro  ')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('')).toBe(false)
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
