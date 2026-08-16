import React from 'react'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
  showText?: boolean
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  className = '',
  showText = true,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clamped / 100) * circumference
  const gradientId = `cyan-progress-grad-${size}`

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-elevated"
          fill="transparent"
        />
        {/* Animated Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.4))' }}
          fill="transparent"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-text tracking-tight">
            {Math.round(clamped)}%
          </span>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Completat
          </span>
        </div>
      )}
    </div>
  )
}
