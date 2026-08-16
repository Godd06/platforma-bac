import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'A apărut o eroare',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-xl border border-status-danger/30 bg-status-danger/5 text-center flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-status-danger/15 border border-status-danger/30 text-status-danger flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="font-display text-sm font-bold text-text">{title}</h4>
        <p className="text-xs text-text-muted max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reîncearcă</span>
        </button>
      )}
    </div>
  )
}
