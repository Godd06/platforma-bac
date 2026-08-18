import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-text uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-text-muted flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full h-10 sm:h-11 ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${
              rightIcon ? 'pr-10' : 'pr-3.5'
            } rounded-xl bg-surface-elevated border text-sm text-text placeholder:text-text-subtle transition-all duration-150 focus:outline-none ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
            } disabled:opacity-50 disabled:pointer-events-none disabled:bg-surface/50 ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-text-muted flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-400 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-text-muted">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
