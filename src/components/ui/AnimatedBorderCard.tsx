import React from 'react'

export type AnimatedBorderVariant = 'cyan' | 'pro' | 'subtle'

interface AnimatedBorderCardProps {
  children: React.ReactNode
  variant?: AnimatedBorderVariant
  className?: string
  innerClassName?: string
  glow?: boolean
  roundedClass?: string
}

export const AnimatedBorderCard: React.FC<AnimatedBorderCardProps> = ({
  children,
  variant = 'cyan',
  className = '',
  innerClassName = 'glass-featured p-5 sm:p-6',
  glow = false,
  roundedClass = 'rounded-2xl',
}) => {
  const variantClass =
    variant === 'pro'
      ? 'comet-beam-pro'
      : variant === 'subtle'
      ? 'comet-beam-subtle'
      : 'comet-beam-cyan'

  const glowShadowClass =
    glow && variant === 'pro'
      ? 'shadow-[0_0_32px_-6px_rgba(245,158,11,0.22)]'
      : glow
      ? 'shadow-[0_0_32px_-6px_rgba(6,182,212,0.25)]'
      : ''

  return (
    <div
      className={`comet-beam-wrapper relative ${roundedClass} ${glowShadowClass} ${className}`}
    >
      {/* 
        PERIMETER-ONLY MASKED BEAM RING:
        Uses CSS mask-composite exclusion so the rotating conic gradient physically renders 
        ONLY in the 1.5px border channel. The entire interior has mask alpha = 0.
        Zero beam leakage into the translucent glass interior!
      */}
      <div
        className={`comet-beam-ring ${variantClass} ${roundedClass}`}
        aria-hidden="true"
      />

      {/* 
        TRANSLUCENT TRUE GLASS SURFACE:
        Renders clean backdrop-filter blur and translucent background,
        revealing the background ambient glow and floating symbols with zero beam leakage.
      */}
      <div
        className={`w-full h-full ${roundedClass} ${innerClassName} relative z-10`}
      >
        {children}
      </div>
    </div>
  )
}

export default AnimatedBorderCard
