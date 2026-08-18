import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  // Base unified styles conforming to design system tokens
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/80 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none select-none cursor-pointer'

  // Variant mappings
  const variantStyles = {
    primary:
      'bg-amber-500 text-black hover:bg-amber-400 border border-amber-500/30 shadow-subtle',
    secondary:
      'bg-surface-elevated text-text hover:bg-surface border border-border shadow-subtle',
    outline:
      'bg-transparent text-text border border-border hover:bg-surface-elevated hover:border-border-strong',
    ghost:
      'bg-transparent text-text-muted hover:text-text hover:bg-surface-elevated',
    danger:
      'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30',
    gold:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold shadow-subtle hover:brightness-110 border border-amber-400/40',
  }

  // Size mappings
  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
    md: 'h-10 px-4.5 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-2xl gap-2.5',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
