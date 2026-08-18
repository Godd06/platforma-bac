import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border shadow-subtle',
    elevated: 'bg-surface-elevated border border-border shadow-subtle',
    glass: 'bg-surface/80 backdrop-blur-md border border-border shadow-subtle',
    interactive:
      'bg-surface border border-border shadow-subtle hover:border-border-strong hover:-translate-y-0.5 transition-all duration-150 cursor-pointer',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
