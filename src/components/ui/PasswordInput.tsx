import React, { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  className?: string
  autoComplete?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  placeholder = '••••••••••••',
  value,
  onChange,
  disabled = false,
  className = '',
  autoComplete = 'current-password',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
        <Lock className="w-4 h-4" />
      </div>

      <input
        {...rest}
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full pl-10 pr-12 py-3 rounded-xl bg-surface/90 border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all disabled:opacity-50 min-h-[46px] ${className}`}
      />

      <button
        type="button"
        tabIndex={0}
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        aria-label={showPassword ? 'Ascunde parola' : 'Afișează parola'}
        aria-pressed={showPassword}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-cyan-400 hover:bg-surface-elevated/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
