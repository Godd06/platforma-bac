import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'pro'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-extrabold uppercase tracking-wider rounded-lg border'

  const variantStyles = {
    default: 'bg-surface-elevated text-text-muted border-border',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    pro: 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-400/40 shadow-subtle',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </span>
  )
}
