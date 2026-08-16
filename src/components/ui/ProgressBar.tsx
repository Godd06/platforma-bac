import React from 'react'

interface ProgressBarProps {
  percentage: number
  height?: string
  className?: string
  colorClass?: string
  showLabel?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 'h-2',
  className = '',
  colorClass = 'bg-gradient-to-r from-cyan-500 to-cyan-400',
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1 font-semibold">
          <span className="text-text-muted">Progres</span>
          <span className="text-cyan-400">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-elevated rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(6,182,212,0.35)] ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
