import React from 'react'

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'xl',
}) => {
  const roundedClass =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === '2xl'
      ? 'rounded-2xl'
      : rounded === 'xl'
      ? 'rounded-xl'
      : rounded === 'lg'
      ? 'rounded-lg'
      : rounded === 'md'
      ? 'rounded-md'
      : 'rounded-sm'

  return (
    <div
      className={`skeleton-premium ${roundedClass} ${className}`}
      aria-hidden="true"
    />
  )
}

export default Skeleton
