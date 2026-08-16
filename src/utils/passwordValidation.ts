export interface PasswordRule {
  id: string
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: 'Minimum 8 caractere',
    test: (p: string) => p.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'Cel puțin o literă mică (a-z)',
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: 'uppercase',
    label: 'Cel puțin o literă mare (A-Z)',
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: 'digit',
    label: 'Cel puțin o cifră (0-9)',
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    id: 'symbol',
    label: 'Cel puțin un simbol (!@#$%^&*...)',
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
]

export type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong'

export interface PasswordEvaluation {
  passedCount: number
  totalCount: number
  isAllValid: boolean
  level: PasswordStrengthLevel
  label: string
  colorClass: string
  barClass: string
  results: Record<string, boolean>
}

/**
 * Evaluates password strength and checklist based on 5 mandatory rules.
 * 0-1 rules -> Slabă (danger)
 * 2-3 rules -> Medie (warning)
 * 4-5 rules -> Puternică (success)
 */
export function evaluatePassword(password: string): PasswordEvaluation {
  if (!password) {
    const emptyResults: Record<string, boolean> = {}
    for (const rule of PASSWORD_RULES) {
      emptyResults[rule.id] = false
    }
    return {
      passedCount: 0,
      totalCount: PASSWORD_RULES.length,
      isAllValid: false,
      level: 'empty',
      label: '',
      colorClass: 'text-text-muted',
      barClass: 'bg-surface-elevated',
      results: emptyResults,
    }
  }

  const results: Record<string, boolean> = {}
  let passedCount = 0

  for (const rule of PASSWORD_RULES) {
    const passed = rule.test(password)
    results[rule.id] = passed
    if (passed) passedCount++
  }

  const isAllValid = passedCount === PASSWORD_RULES.length

  let level: PasswordStrengthLevel = 'weak'
  let label = 'Slabă'
  let colorClass = 'text-status-danger'
  let barClass = 'bg-status-danger'

  if (passedCount >= 4) {
    level = 'strong'
    label = 'Puternică'
    colorClass = 'text-status-success'
    barClass = 'bg-status-success'
  } else if (passedCount >= 2) {
    level = 'medium'
    label = 'Medie'
    colorClass = 'text-status-warning'
    barClass = 'bg-status-warning'
  }

  return {
    passedCount,
    totalCount: PASSWORD_RULES.length,
    isAllValid,
    level,
    label,
    colorClass,
    barClass,
    results,
  }
}
