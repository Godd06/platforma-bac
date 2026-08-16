import React, { useState } from 'react'
import { Edit3, Save, Check, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface LessonStudyNotesProps {
  lessonId: string
  lessonTitle: string
}

export const LessonStudyNotes: React.FC<LessonStudyNotesProps> = ({
  lessonId,
  lessonTitle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const storageKey = `bac_study_notes_${lessonId}`

  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) || ''
    } catch {
      return ''
    }
  })

  const [isSaved, setIsSaved] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, notes)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (e) {
      console.error('[LessonStudyNotes] Error saving notes:', e)
    }
  }

  const handleCopy = async () => {
    if (!notes) return
    try {
      await navigator.clipboard.writeText(`Notițe ${lessonTitle}:\n\n${notes}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('[LessonStudyNotes] Error copying notes:', e)
    }
  }

  const handleClear = () => {
    if (window.confirm('Ești sigur că vrei să ștergi aceste notițe?')) {
      setNotes('')
      localStorage.removeItem(storageKey)
    }
  }

  return (
    <section className="rounded-2xl glass-elevated border border-border overflow-hidden shadow-subtle no-print">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 sm:p-6 flex items-center justify-between gap-3 text-left hover:bg-surface-elevated/40 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shadow-subtle">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-text">
              Însemnările Tale & Citate Memorate
            </h3>
            <p className="text-[11px] text-text-muted">
              {notes ? 'Ai notițe salvate pentru această lecție.' : 'Adaugă idei proprii, scheme sau citate preferate.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-text-muted">
          {notes && !isOpen && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Notițe active
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 pt-0 space-y-3 border-t border-border-subtle animate-fadeIn">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Scrie aici idei principale, citate-cheie sau scheme de memorat pentru această operă..."
            rows={5}
            className="w-full p-3.5 rounded-xl bg-surface/70 border border-border text-xs sm:text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 leading-relaxed resize-y min-h-[120px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-subtle"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Salvat!' : 'Salvează'}</span>
              </button>

              {notes && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiat!' : 'Copiază textul'}</span>
                </button>
              )}
            </div>

            {notes && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[11px] text-text-subtle hover:text-status-danger transition-colors p-1"
                title="Șterge notițele"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Șterge</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default LessonStudyNotes
