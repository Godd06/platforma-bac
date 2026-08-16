import React from 'react'

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-surface-elevated via-surface-hover to-surface-elevated rounded-xl ${className}`}
      aria-hidden="true"
    />
  )
}
