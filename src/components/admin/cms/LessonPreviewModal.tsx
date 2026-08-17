import React, { useEffect } from 'react'
import { X, Clock, Crown, Unlock, AlertCircle } from 'lucide-react'
import type { Lesson, Chapter, Subject } from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'
import { LessonBlockRenderer } from '@/components/lesson/LessonBlockRenderer'

interface LessonPreviewModalProps {
  isOpen: boolean
  lesson: Lesson | null
  blocks: LessonBlockData[]
  chapter: Chapter | null
  subject: Subject | null
  onClose: () => void
}

export const LessonPreviewModal: React.FC<LessonPreviewModalProps> = ({
  isOpen,
  lesson,
  blocks,
  chapter,
  subject,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !lesson) return null

  const isPro = lesson.access_level === 'pro'
  const sortedBlocks = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl glass-elevated border border-border shadow-2xl z-10 animate-fadeIn overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-surface-elevated/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
              Previzualizare Live Elev (Student View)
            </span>
            <span className="text-xs text-text-muted hidden sm:inline">
              Mod vizualizare fără salvare progres
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Închide previzualizarea"
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Reader Canvas */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 lesson-content selectable-content">
          <div className="max-w-prose mx-auto space-y-6">
            {/* Breadcrumb Context */}
            <div className="flex items-center gap-2 text-xs text-text-muted pb-2 border-b border-border-subtle">
              <span>{subject?.name || 'Materie'}</span>
              <span>/</span>
              <span>{chapter?.title || 'Capitol'}</span>
              <span>/</span>
              <span className="font-semibold text-text truncate">{lesson.title}</span>
            </div>

            {/* Lesson Hero Header */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border space-y-3.5 shadow-subtle ${
                isPro
                  ? 'glass-featured-pro bg-surface/85 border-amber-500/30'
                  : 'glass-elevated bg-surface/85 border-border'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {isPro ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Crown className="w-3 h-3 text-amber-400" />
                    PRO CANONIC
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Unlock className="w-3 h-3 text-cyan-400" />
                    ACCES GRATUIT
                  </span>
                )}

                {lesson.estimated_minutes && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted px-2.5 py-0.5 rounded-full bg-surface-elevated/70 border border-border-subtle">
                    <Clock className="w-3 h-3 text-text-subtle" />
                    {lesson.estimated_minutes} min lectură
                  </span>
                )}

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    lesson.status === 'published'
                      ? 'bg-status-success/15 text-status-success'
                      : lesson.status === 'review'
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'bg-surface-elevated text-text-muted'
                  }`}
                >
                  Status: {lesson.status}
                </span>
              </div>

              <h1 id="preview-modal-title" className="font-display text-xl sm:text-2xl font-extrabold text-text tracking-tight">
                {lesson.title}
              </h1>

              {lesson.short_description && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-literary-serif">
                  {lesson.short_description}
                </p>
              )}
            </div>

            {/* Blocks Content Area */}
            {sortedBlocks.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-border bg-surface/30 space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto opacity-70" />
                <p className="text-sm font-bold text-text">Această lecție nu conține încă blocuri de conținut.</p>
                <p className="text-xs text-text-muted">
                  Adaugă blocuri (Titluri, Paragrafe, Definiții, Sinteze) din panoul de administrare pentru a le previzualiza aici.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {sortedBlocks.map((block) => (
                  <div key={block.id} className="relative group">
                    <LessonBlockRenderer block={block} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Close Bar */}
        <div className="px-6 py-3 border-t border-border bg-surface-elevated/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
          >
            Închide Previzualizarea
          </button>
        </div>
      </div>
    </div>
  )
}
