import React, { useState, useEffect } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'
import type { Subject } from '@/types/database'
import type { SubjectFormData } from '@/services/adminCmsService'

interface SubjectModalProps {
  isOpen: boolean
  subject: Subject | null
  initialSortOrder?: number
  loading?: boolean
  error?: string | null
  onSave: (data: SubjectFormData) => Promise<void>
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

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  subject,
  initialSortOrder = 0,
  loading = false,
  error = null,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(subject)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('BookOpen')
  const [accentTheme, setAccentTheme] = useState('cyan')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [isPublished, setIsPublished] = useState<boolean>(true)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (subject) {
      setName(subject.name || '')
      setSlug(subject.slug || '')
      setShortDescription(subject.short_description || '')
      setDescription(subject.description || '')
      setIcon(subject.icon || 'BookOpen')
      setAccentTheme(subject.accent_theme || 'cyan')
      setSortOrder(subject.sort_order ?? 0)
      setIsPublished(subject.is_published ?? true)
    } else {
      setName('')
      setSlug('')
      setShortDescription('')
      setDescription('')
      setIcon('BookOpen')
      setAccentTheme('cyan')
      setSortOrder(initialSortOrder)
      setIsPublished(true)
    }
    setFormError(null)
  }, [subject, initialSortOrder, isOpen])

  if (!isOpen) return null

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!isEditing || !slug) {
      setSlug(slugify(val))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError('Numele materiei este obligatoriu.')
      return
    }

    const cleanSlug = slugify(slug || name)
    if (!cleanSlug) {
      setFormError('Slug-ul este obligatoriu și trebuie să fie valid (ex: limba-romana).')
      return
    }

    try {
      await onSave({
        name: name.trim(),
        slug: cleanSlug,
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
        icon: icon.trim() || null,
        accent_theme: accentTheme.trim() || null,
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
      aria-labelledby="subject-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl glass-elevated border border-border p-6 space-y-5 shadow-2xl z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 id="subject-modal-title" className="font-display font-bold text-lg text-text">
              {isEditing ? 'Editare Materie' : 'Adaugă Materie Nouă'}
            </h3>
            <p className="text-xs text-text-muted">
              {isEditing ? `Modifică configurarea pentru ${subject?.name}` : 'Creează o materie nouă în catalogul oficial.'}
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
            <label htmlFor="subject-name" className="block text-xs font-bold text-text uppercase tracking-wider">
              Nume Materie <span className="text-status-danger">*</span>
            </label>
            <input
              id="subject-name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="ex: Limba și Literatura Română"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="subject-slug" className="block text-xs font-bold text-text uppercase tracking-wider">
                Slug URL <span className="text-status-danger">*</span>
              </label>
              <button
                type="button"
                onClick={() => setSlug(slugify(name))}
                className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Generează din nume
              </button>
            </div>
            <input
              id="subject-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: limba-romana"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-mono text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject-short-desc" className="block text-xs font-bold text-text uppercase tracking-wider">
              Descriere Scurtă
            </label>
            <input
              id="subject-short-desc"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="ex: Eseuri structurate pe barem, curente literare și autori canonici"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject-desc" className="block text-xs font-bold text-text uppercase tracking-wider">
              Descriere Detaliată (Opțional)
            </label>
            <textarea
              id="subject-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalii suplimentare despre programa oficială..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="subject-icon" className="block text-xs font-bold text-text uppercase tracking-wider">
                Pictogramă / Icon
              </label>
              <select
                id="subject-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
              >
                <option value="BookOpen">BookOpen (Literatură / Română)</option>
                <option value="Compass">Compass (Istorie / Geografie)</option>
                <option value="Calculator">Calculator (Matematică)</option>
                <option value="Atom">Atom (Fizică / Științe)</option>
                <option value="Brain">Brain (Filosofie / Psihologie)</option>
                <option value="FileText">FileText (General)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject-theme" className="block text-xs font-bold text-text uppercase tracking-wider">
                Temă Cromatică Accent
              </label>
              <select
                id="subject-theme"
                value={accentTheme}
                onChange={(e) => setAccentTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
              >
                <option value="cyan">Cyan Electric (Română)</option>
                <option value="amber">Amber Academic (Istorie)</option>
                <option value="emerald">Emerald Verde (Real)</option>
                <option value="purple">Purple Clasic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="subject-sort" className="block text-xs font-bold text-text uppercase tracking-wider">
                Ordine Sortare (Sort Order)
              </label>
              <input
                id="subject-sort"
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
                <span className="text-xs font-bold text-text">Publicat în Catalog</span>
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
              <span>{isEditing ? 'Salvează Modificările' : 'Creează Materia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
