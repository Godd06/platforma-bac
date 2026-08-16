import React from 'react'
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border/80 bg-surface/40 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3.5 shadow-sm">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-bold text-text mb-1">{title}</h4>
      {description && (
        <p className="text-xs sm:text-sm text-text-muted max-w-sm leading-relaxed mb-4">
          {description}
        </p>
      )}
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
