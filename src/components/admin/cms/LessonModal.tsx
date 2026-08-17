import React, { useState, useEffect } from 'react'
import { X, Loader2, Sparkles, Crown, Unlock } from 'lucide-react'
import type { Lesson, LessonAccessLevel, LessonStatus } from '@/types/database'
import type { LessonFormData } from '@/services/adminCmsService'

interface LessonModalProps {
  isOpen: boolean
  lesson: Lesson | null
  chapterId: string
  chapterTitle?: string
  initialSortOrder?: number
  loading?: boolean
  error?: string | null
  onSave: (data: LessonFormData) => Promise<void>
  onClose: () => void
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ă/g, 'a')
    .replace(/î/g, 'i')
    .replace(/â/g, 'a')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  lesson,
  chapterId,
  chapterTitle,
  initialSortOrder = 0,
  loading = false,
  error = null,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(lesson)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15)
  const [accessLevel, setAccessLevel] = useState<LessonAccessLevel>('free')
  const [status, setStatus] = useState<LessonStatus>('draft')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || '')
      setSlug(lesson.slug || '')
      setShortDescription(lesson.short_description || '')
      setEstimatedMinutes(lesson.estimated_minutes ?? 15)
      setAccessLevel(lesson.access_level || 'free')
      setStatus(lesson.status || 'draft')
      setSortOrder(lesson.sort_order ?? 0)
    } else {
      setTitle('')
      setSlug('')
      setShortDescription('')
      setEstimatedMinutes(15)
      setAccessLevel('free')
      setStatus('draft')
      setSortOrder(initialSortOrder)
    }
    setFormError(null)
  }, [lesson, initialSortOrder, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!isEditing || !slug) {
      setSlug(slugify(val))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Titlul lecției este obligatoriu.')
      return
    }

    const cleanSlug = slugify(slug || title)
    if (!cleanSlug) {
      setFormError('Slug-ul este obligatoriu și trebuie să fie valid.')
      return
    }

    try {
      await onSave({
        chapter_id: chapterId,
        title: title.trim(),
        slug: cleanSlug,
        short_description: shortDescription.trim() || null,
        estimated_minutes: Number(estimatedMinutes) >= 0 ? Number(estimatedMinutes) : 15,
        access_level: accessLevel,
        status,
        sort_order: Number(sortOrder) || 0,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'A apărut o eroare la salvare.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl glass-elevated border border-border p-6 space-y-5 shadow-2xl z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 id="lesson-modal-title" className="font-display font-bold text-lg text-text">
              {isEditing ? 'Editare Lecție' : 'Adaugă Lecție Nouă'}
            </h3>
            <p className="text-xs text-text-muted">
              {chapterTitle ? `Capitol: ${chapterTitle}` : 'Configurează metadatele și nivelul de acces'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Închide fereastra"
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {(formError || error) && (
          <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger">
            {formError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="lesson-title" className="block text-xs font-bold text-text uppercase tracking-wider">
              Titlu Lecție / Eseu <span className="text-status-danger">*</span>
            </label>
            <input
              id="lesson-title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="ex: Caracterizarea personajului principal (Ghiță)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="lesson-slug" className="block text-xs font-bold text-text uppercase tracking-wider">
                Slug URL <span className="text-status-danger">*</span>
              </label>
              <button
                type="button"
                onClick={() => setSlug(slugify(title))}
                className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Generează din titlu
              </button>
            </div>
            <input
              id="lesson-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: caracterizare-ghita"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-mono text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Access Level (FREE vs PRO) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text uppercase tracking-wider">
              Nivel de Acces (Monetizare & Privilegii) <span className="text-status-danger">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  accessLevel === 'free'
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-surface border-border hover:bg-surface-elevated'
                }`}
              >
                <input
                  type="radio"
                  name="access_level"
                  value="free"
                  checked={accessLevel === 'free'}
                  onChange={() => setAccessLevel('free')}
                  className="mt-0.5 text-cyan-500 focus:ring-cyan-400"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>GRATUIT (Free Access)</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Accesibil tuturor elevilor autentificați. Bun pentru mostre și lecții de bază.
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  accessLevel === 'pro'
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-surface border-border hover:bg-surface-elevated'
                }`}
              >
                <input
                  type="radio"
                  name="access_level"
                  value="pro"
                  checked={accessLevel === 'pro'}
                  onChange={() => setAccessLevel('pro')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                    <Crown className="w-3.5 h-3.5" />
                    <span>EXCLUSIV PRO (Abonament)</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Protejat prin paywall; disponibil abonaților activi și echipei editoriale.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Status & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="lesson-status" className="block text-xs font-bold text-text uppercase tracking-wider">
                Stare Editorială (Status)
              </label>
              <select
                id="lesson-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as LessonStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
              >
                <option value="draft">🟡 Ciornă (Draft — needitat)</option>
                <option value="review">🔵 În Revizuire (Review)</option>
                <option value="published">🟢 Publicat (Published — Live)</option>
                <option value="archived">⚫ Arhivat (Archived)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lesson-time" className="block text-xs font-bold text-text uppercase tracking-wider">
                Timp Estimat (Minute)
              </label>
              <input
                id="lesson-time"
                type="number"
                min={1}
                max={180}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lesson-short-desc" className="block text-xs font-bold text-text uppercase tracking-wider">
              Descriere Scurtă (Sumar)
            </label>
            <input
              id="lesson-short-desc"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="ex: Structură în 4 repere, relația dintre personaje și citate relevante"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lesson-sort" className="block text-xs font-bold text-text uppercase tracking-wider">
              Ordine Sortare în Capitol
            </label>
            <input
              id="lesson-sort"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors disabled:opacity-50 min-h-[38px]"
            >
              Anulează
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 min-h-[38px]"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Salvează Lecția' : 'Creează Lecția'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
