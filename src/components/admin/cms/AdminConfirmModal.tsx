import React, { useEffect } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface AdminConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  stats?: { label: string; count: number }[]
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  description,
  stats,
  confirmText = 'Confirmă',
  cancelText = 'Anulează',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onCancel])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !loading && onCancel()}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl glass-elevated border border-border p-6 space-y-4 shadow-2xl z-10 animate-fadeIn">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-status-danger/15 text-status-danger border border-status-danger/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-modal-title" className="font-display font-bold text-base text-text">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Închide fereastra"
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {description}
        </p>

        {/* Detailed Impact Stats */}
        {stats && stats.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-status-danger/10 border border-status-danger/20 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-status-danger block">
              Elemente care vor fi eliminate definitiv:
            </span>
            <div className="flex flex-wrap gap-3 text-xs">
              {stats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-bold text-text">
                  <span className="text-status-danger">•</span>
                  <span>{s.count} {s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors disabled:opacity-50 min-h-[38px]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-subtle min-h-[38px] ${
              isDestructive
                ? 'bg-status-danger hover:bg-status-danger/90 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
