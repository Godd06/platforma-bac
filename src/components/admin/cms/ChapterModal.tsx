import React, { useState, useEffect } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'
import type { Chapter } from '@/types/database'
import type { ChapterFormData } from '@/services/adminCmsService'

interface ChapterModalProps {
  isOpen: boolean
  chapter: Chapter | null
  subjectId: string
  subjectName?: string
  initialSortOrder?: number
  loading?: boolean
  error?: string | null
  onSave: (data: ChapterFormData) => Promise<void>
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

export const ChapterModal: React.FC<ChapterModalProps> = ({
  isOpen,
  chapter,
  subjectId,
  subjectName,
  initialSortOrder = 0,
  loading = false,
  error = null,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(chapter)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [isPublished, setIsPublished] = useState<boolean>(true)

  // Metadata fields (especially for Română / Istorie)
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [period, setPeriod] = useState('')
  const [relevance, setRelevance] = useState('Subiectul III (30p)')
  const [audioAvailable, setAudioAvailable] = useState(false)

  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || '')
      setSlug(chapter.slug || '')
      setShortDescription(chapter.short_description || '')
      setDescription(chapter.description || '')
      setSortOrder(chapter.sort_order ?? 0)
      setIsPublished(chapter.is_published ?? true)

      const meta = (chapter.metadata as Record<string, unknown>) || {}
      setAuthor((meta.author as string) || '')
      setGenre((meta.genre as string) || (meta.category as string) || '')
      setPeriod((meta.period as string) || (meta.epoch as string) || '')
      setRelevance((meta.relevance as string) || 'Subiectul III (30p)')
      setAudioAvailable(Boolean(meta.audio_available))
    } else {
      setTitle('')
      setSlug('')
      setShortDescription('')
      setDescription('')
      setSortOrder(initialSortOrder)
      setIsPublished(true)
      setAuthor('')
      setGenre('')
      setPeriod('')
      setRelevance('Subiectul III (30p)')
      setAudioAvailable(false)
    }
    setFormError(null)
  }, [chapter, initialSortOrder, isOpen])

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
      setFormError('Titlul operei / capitolului este obligatoriu.')
      return
    }

    const cleanSlug = slugify(slug || title)
    if (!cleanSlug) {
      setFormError('Slug-ul este obligatoriu și trebuie să fie valid.')
      return
    }

    // Build metadata dictionary
    const metadata: Record<string, unknown> = {
      ...(chapter?.metadata || {}),
      ...(author.trim() ? { author: author.trim() } : {}),
      ...(genre.trim() ? { genre: genre.trim() } : {}),
      ...(period.trim() ? { period: period.trim() } : {}),
      ...(relevance.trim() ? { relevance: relevance.trim() } : {}),
      audio_available: audioAvailable,
    }

    try {
      await onSave({
        subject_id: subjectId,
        title: title.trim(),
        slug: cleanSlug,
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
        metadata,
        sort_order: Number(sortOrder) || 0,
        is_published: isPublished,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'A apărut o eroare la salvare.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-modal-title"
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
            <h3 id="chapter-modal-title" className="font-display font-bold text-lg text-text">
              {isEditing ? 'Editare Operă / Capitol' : 'Adaugă Operă / Capitol'}
            </h3>
            <p className="text-xs text-text-muted">
              {subjectName ? `Materie: ${subjectName}` : 'Configurează structura capitolului'}
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
            <label htmlFor="chapter-title" className="block text-xs font-bold text-text uppercase tracking-wider">
              Titlu Operă / Capitol <span className="text-status-danger">*</span>
            </label>
            <input
              id="chapter-title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="ex: Moara cu noroc — Ioan Slavici"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="chapter-slug" className="block text-xs font-bold text-text uppercase tracking-wider">
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
              id="chapter-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: moara-cu-noroc"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-mono text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Editorial Metadata (Author, Genre, Period) */}
          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Informații Editoriale & BAC (Metadata)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="chapter-author" className="block text-xs text-text-muted">
                  Autor Canonic / Istoric
                </label>
                <input
                  id="chapter-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="ex: Ioan Slavici"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="chapter-genre" className="block text-xs text-text-muted">
                  Gen Literar / Curent / Tematică
                </label>
                <input
                  id="chapter-genre"
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="ex: Nuvelă psihologică, Realism"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="chapter-period" className="block text-xs text-text-muted">
                  Epocă / Secol / An Apariție
                </label>
                <input
                  id="chapter-period"
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="ex: 1881 / Epoca Marilor Clasici"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="chapter-relevance" className="block text-xs text-text-muted">
                  Relevanță Barem BAC
                </label>
                <input
                  id="chapter-relevance"
                  type="text"
                  value={relevance}
                  onChange={(e) => setRelevance(e.target.value)}
                  placeholder="ex: Subiectul III (30p)"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={audioAvailable}
                onChange={(e) => setAudioAvailable(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs text-text font-medium">Disponibilă sinteză audio pentru acest capitol</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="chapter-short-desc" className="block text-xs font-bold text-text uppercase tracking-wider">
              Descriere Scurtă (Rezumat)
            </label>
            <input
              id="chapter-short-desc"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="ex: Nuvelă realist-psihologică inclusă în volumul 'Novele din popor'"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="chapter-desc" className="block text-xs font-bold text-text uppercase tracking-wider">
              Descriere Detaliată (Opțional)
            </label>
            <textarea
              id="chapter-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informații suplimentare pentru elevi..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="chapter-sort" className="block text-xs font-bold text-text uppercase tracking-wider">
                Ordine Sortare
              </label>
              <input
                id="chapter-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border cursor-pointer hover:bg-surface-elevated transition-colors">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-xs font-bold text-text">Publicat în Platformă</span>
              </label>
            </div>
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
              <span>{isEditing ? 'Salvează Capitolul' : 'Creează Capitolul'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
