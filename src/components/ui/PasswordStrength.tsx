import React from 'react'
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react'
import {
  evaluatePassword,
  PASSWORD_RULES,
  type PasswordEvaluation,
} from '@/utils/passwordValidation'

interface PasswordStrengthProps {
  password: string
  showChecklist?: boolean
  className?: string
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  showChecklist = true,
  className = '',
}) => {
  if (!password) {
    return null
  }

  const evaluation: PasswordEvaluation = evaluatePassword(password)
  const { passedCount, totalCount, label, colorClass, barClass, results } = evaluation

  // 3-step visual meter (0-1: 1 bar red, 2-3: 2 bars amber, 4-5: 3 bars green)
  const activeSegments = passedCount <= 1 ? 1 : passedCount <= 3 ? 2 : 3

  return (
    <div className={`space-y-3 pt-1 animate-fadeIn ${className}`}>
      {/* Strength Bar & Label */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted flex items-center gap-1">
            {passedCount === totalCount ? (
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-text-muted" />
            )}
            <span>Complexitate parolă:</span>
          </span>
          <span className={`font-bold ${colorClass}`} aria-live="polite">
            {label} ({passedCount}/{totalCount})
          </span>
        </div>

        {/* 3-segment strength meter */}
        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              activeSegments >= 1 ? barClass : 'bg-surface-elevated'
            }`}
          />
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              activeSegments >= 2 ? barClass : 'bg-surface-elevated'
            }`}
          />
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              activeSegments >= 3 ? barClass : 'bg-surface-elevated'
            }`}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showChecklist && (
        <ul
          className="space-y-1.5 pt-1 text-xs"
          aria-label="Cerințe obligatorii pentru parolă"
        >
          {PASSWORD_RULES.map((rule) => {
            const isMet = Boolean(results[rule.id])
            return (
              <li
                key={rule.id}
                className={`flex items-center gap-2 transition-colors ${
                  isMet ? 'text-status-success' : 'text-text-muted'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isMet
                      ? 'bg-status-success/20 text-status-success'
                      : 'bg-surface-elevated text-text-subtle'
                  }`}
                >
                  {isMet ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <X className="w-2.5 h-2.5" />
                  )}
                </div>
                <span className={isMet ? 'font-medium' : 'text-text-subtle'}>
                  {rule.label}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
