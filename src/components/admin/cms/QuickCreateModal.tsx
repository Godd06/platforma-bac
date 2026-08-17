import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  FileText,
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  fetchAdminSubjects,
  fetchAdminChapters,
  createLesson,
  createChapter,
  createSubject,
  type AdminSubjectWithCounts,
  type AdminChapterWithCounts,
} from '@/services/adminCmsService'

interface QuickCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenImportAi?: () => void
}

type EntityType = 'lesson' | 'chapter' | 'subject'

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  onOpenImportAi,
}) => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<EntityType>('lesson')

  const [subjects, setSubjects] = useState<AdminSubjectWithCounts[]>([])
  const [chapters, setChapters] = useState<AdminChapterWithCounts[]>([])

  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedChapterId, setSelectedChapterId] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setError(null)
      loadInitialData()
    }
  }, [isOpen])

  const loadInitialData = async () => {
    setLoading(true)
    const subjsRes = await fetchAdminSubjects()
    if (subjsRes.data && subjsRes.data.length > 0) {
      setSubjects(subjsRes.data)
      setSelectedSubjectId(subjsRes.data[0].id)
      // Load chapters for first subject
      const chapRes = await fetchAdminChapters(subjsRes.data[0].id)
      if (chapRes.data && chapRes.data.length > 0) {
        setChapters(chapRes.data)
        setSelectedChapterId(chapRes.data[0].id)
      } else {
        setChapters([])
        setSelectedChapterId('')
      }
    }
    setLoading(false)
  }

  const handleSubjectChange = async (subjId: string) => {
    setSelectedSubjectId(subjId)
    setLoading(true)
    const chapRes = await fetchAdminChapters(subjId)
    if (chapRes.data && chapRes.data.length > 0) {
      setChapters(chapRes.data)
      setSelectedChapterId(chapRes.data[0].id)
    } else {
      setChapters([])
      setSelectedChapterId('')
    }
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Introduceți un titlu.')
      return
    }

    setSubmitting(true)
    setError(null)

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`

    try {
      if (selectedType === 'lesson') {
        if (!selectedChapterId) {
          setError('Selectați un capitol sau o operă părinte.')
          setSubmitting(false)
          return
        }

        const res = await createLesson({
          chapter_id: selectedChapterId,
          title: title.trim(),
          slug: uniqueSlug,
          access_level: 'free',
          status: 'draft',
          sort_order: 0,
        })

        if (res.error || !res.data) throw new Error(res.error || 'Eroare la crearea lecției.')

        // Find parent slugs
        const targetSubj = subjects.find((s) => s.id === selectedSubjectId)
        const targetChap = chapters.find((c) => c.id === selectedChapterId)

        onClose()
        // Immediately navigate to the new Lesson in Studio in edit mode!
        if (targetSubj && targetChap) {
          navigate(`/admin/content/${targetSubj.slug}/${targetChap.slug}/${res.data.slug}?mode=edit`)
        } else {
          navigate(`/admin/editor/${res.data.id}`)
        }
      } else if (selectedType === 'chapter') {
        if (!selectedSubjectId) {
          setError('Selectați o materie părinte.')
          setSubmitting(false)
          return
        }

        const res = await createChapter({
          subject_id: selectedSubjectId,
          title: title.trim(),
          slug: uniqueSlug,
          sort_order: 0,
          is_published: false,
        })

        if (res.error || !res.data) throw new Error(res.error || 'Eroare la crearea capitolului.')

        const targetSubj = subjects.find((s) => s.id === selectedSubjectId)
        onClose()
        if (targetSubj) {
          navigate(`/admin/content/${targetSubj.slug}/${res.data.slug}`)
        } else {
          navigate('/admin/content')
        }
      } else if (selectedType === 'subject') {
        const res = await createSubject({
          name: title.trim(),
          slug: uniqueSlug,
          sort_order: 0,
          is_published: false,
        })

        if (res.error || !res.data) throw new Error(res.error || 'Eroare la crearea materiei.')

        onClose()
        navigate(`/admin/content/${res.data.slug}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare neașteptată.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-create-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl glass-elevated border border-border p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl z-10 animate-fadeIn flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 id="quick-create-title" className="font-display font-bold text-lg text-text">
              Creare Rapidă
            </h3>
            <p className="text-xs text-text-muted">
              Pornește direct un nou document și intră instant în spațiul de lucru.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-surface border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedType('lesson')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedType === 'lesson'
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lecție / Eseu</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('chapter')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedType === 'chapter'
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Operă / Capitol</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('subject')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedType === 'subject'
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materie</span>
          </button>
        </div>

        {/* AI Import Shortcut Option */}
        {onOpenImportAi && (
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenImportAi()
            }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Vrei să imporți un eseu complet generat de AI?</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Parent Selectors for Lesson */}
          {selectedType === 'lesson' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">
                  Materie Părinte
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">
                  Capitol / Operă Părinte
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  disabled={chapters.length === 0}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none disabled:opacity-50"
                >
                  {chapters.length === 0 ? (
                    <option value="">Niciun capitol găsit</option>
                  ) : (
                    chapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Parent Selector for Chapter */}
          {selectedType === 'chapter' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text-muted">
                Materie Părinte
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text">
              {selectedType === 'lesson'
                ? 'Titlul Lecției / Eseului'
                : selectedType === 'chapter'
                ? 'Titlul Operei / Capitolului'
                : 'Numele Materiei'}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                selectedType === 'lesson'
                  ? 'ex: Relația dintre două personaje — Moara cu noroc'
                  : selectedType === 'chapter'
                  ? 'ex: Moara cu noroc (Ioan Slavici)'
                  : 'ex: Filosofie'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors"
            >
              Anulează
            </button>

            <button
              type="submit"
              disabled={submitting || loading || !title.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 min-h-[38px]"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Creează și Deschide Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
