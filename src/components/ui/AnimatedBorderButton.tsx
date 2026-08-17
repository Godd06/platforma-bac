import React from 'react'
import { Link } from 'react-router-dom'

export type ButtonBeamVariant = 'cyan' | 'pro'

interface AnimatedBorderButtonProps {
  children: React.ReactNode
  to?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonBeamVariant
  className?: string
  innerClassName?: string
  glow?: boolean
  disabled?: boolean
  roundedClass?: string
}

export const AnimatedBorderButton: React.FC<AnimatedBorderButtonProps> = ({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'cyan',
  className = '',
  innerClassName = '',
  glow = true,
  disabled = false,
  roundedClass = 'rounded-xl',
}) => {
  const variantBeamClass = variant === 'pro' ? 'comet-beam-pro' : 'comet-beam-cyan'
  const glowClass =
    glow && variant === 'pro'
      ? 'shadow-[0_0_24px_-2px_rgba(245,158,11,0.45)]'
      : glow
      ? 'shadow-[0_0_24px_-2px_rgba(6,182,212,0.45)]'
      : ''

  const wrapperClasses = `group relative inline-flex ${roundedClass} ${glowClass} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
  } transition-transform duration-200 ${className}`

  const defaultInner =
    variant === 'pro'
      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold px-6 py-3 text-xs sm:text-sm'
      : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold px-6 py-3 text-xs sm:text-sm'

  const contentClasses = `relative z-10 w-full inline-flex items-center justify-center gap-2 ${roundedClass} ${
    innerClassName || defaultInner
  } backdrop-blur-md transition-colors duration-150 shadow-subtle min-h-[44px]`

  const beamRing = (
    <span
      className={`comet-beam-ring !z-20 ${variantBeamClass} ${roundedClass} pointer-events-none`}
      aria-hidden="true"
    />
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={wrapperClasses}>
        {beamRing}
        <span className={contentClasses}>{children}</span>
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={wrapperClasses}
    >
      {beamRing}
      <span className={contentClasses}>{children}</span>
    </button>
  )
}

export default AnimatedBorderButton
