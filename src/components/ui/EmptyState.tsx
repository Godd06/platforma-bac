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
      className={`flex flex-col items-center justify-center text-center p-6 rounded-xl border border-dashed border-border bg-surface/40 ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-surface-elevated text-cyan-400 border border-border flex items-center justify-center mb-3">
        {icon || <FolderOpen className="w-5 h-5" />}
      </div>
      <h4 className="font-display text-sm font-bold text-text mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-text-muted max-w-sm leading-relaxed mb-3">
          {description}
        </p>
      )}
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
