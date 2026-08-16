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
      className={`p-6 rounded-2xl border border-status-danger/30 bg-status-danger/10 text-center flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-status-danger/20 border border-status-danger/30 text-status-danger flex items-center justify-center shadow-sm">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-text">{title}</h4>
        <p className="text-xs sm:text-sm text-text-muted max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[40px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reîncearcă</span>
        </button>
      )}
    </div>
  )
}
