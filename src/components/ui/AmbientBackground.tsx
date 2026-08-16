import React from 'react'

export type AmbientVariant = 'landing' | 'auth' | 'dashboard' | 'catalog' | 'lesson' | 'admin'

interface AmbientBackgroundProps {
  variant?: AmbientVariant
  children?: React.ReactNode
  className?: string
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  variant = 'landing',
  children,
  className = '',
}) => {
  return (
    <div className={`relative min-h-full w-full overflow-hidden ${className}`}>
      {/* Layer 1: Ambient Dot Grid (very subtle) */}
      {(variant === 'landing' || variant === 'auth') && (
        <div className="absolute inset-0 ambient-grid pointer-events-none opacity-40 z-0" />
      )}

      {/* Layer 2: Contextual Ambient Glow Orbs */}
      {variant === 'landing' && (
        <>
          <div className="ambient-glow-cyan top-[-10%] left-[15%] animate-float-slow" />
          <div className="ambient-glow-blue top-[30%] right-[-5%] animate-float-reverse" />
          <div className="ambient-glow-cyan bottom-[-10%] left-[30%] opacity-40 animate-pulse-subtle" />
        </>
      )}

      {variant === 'auth' && (
        <>
          <div className="ambient-glow-cyan top-[-15%] left-[50%] -translate-x-1/2 opacity-70 animate-pulse-subtle" />
          <div className="ambient-glow-blue bottom-[-20%] right-[10%] opacity-40" />
        </>
      )}

      {variant === 'dashboard' && (
        <>
          <div className="ambient-glow-cyan top-[-20%] right-[5%] opacity-45 animate-pulse-subtle" />
          <div className="ambient-glow-blue bottom-[-20%] left-[-10%] opacity-30" />
        </>
      )}

      {variant === 'catalog' && (
        <>
          <div className="ambient-glow-cyan top-[-25%] left-[50%] -translate-x-1/2 opacity-35" />
        </>
      )}

      {variant === 'lesson' && (
        <>
          <div className="ambient-glow-cyan top-[-30%] right-[10%] opacity-20" />
        </>
      )}

      {/* Content Container on Top */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
