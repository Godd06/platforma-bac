import React, { useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Crown,
  Unlock,
  Clock,
  ChevronUp,
  ChevronDown,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  ChevronRight,
  Save,
  X,
} from 'lucide-react'
import type { AdminLessonWithCounts, ChapterFormData } from '@/services/adminCmsService'
import type { Chapter, Lesson, LessonStatus, LessonAccessLevel } from '@/types/database'
import { EmptyState } from '@/components/ui/EmptyState'

interface AdminLessonsViewProps {
  chapter: Chapter
  lessons: AdminLessonWithCounts[]
  onSelectLesson: (lessonSlug: string) => void
  onOpenCreateLesson: () => void
  onOpenEditLesson: (lesson: Lesson) => void
  onOpenEditChapter?: (chapter: Chapter) => void
  onSaveChapter?: (formData: ChapterFormData) => Promise<void>
  onDuplicateLesson: (lessonId: string) => void
  onPreviewLesson: (lesson: Lesson) => void
  onDeleteLesson: (lesson: Lesson) => void
  onReorderLesson: (lessonId: string, direction: 'up' | 'down') => void
  onQuickStatusChange: (lesson: Lesson, status: LessonStatus) => void
  onQuickAccessChange: (lesson: Lesson, access: LessonAccessLevel) => void
  onBulkUpdate: (lessonIds: string[], updates: { status?: LessonStatus; access_level?: LessonAccessLevel }) => Promise<void>
  onBulkDelete: (lessonIds: string[]) => void
  onOpenAiImport: () => void
}

export const AdminLessonsView: React.FC<AdminLessonsViewProps> = ({
  chapter,
  lessons,
  onSelectLesson,
  onOpenCreateLesson,
  onOpenEditLesson,
  onOpenEditChapter,
  onSaveChapter,
  onDuplicateLesson,
  onPreviewLesson,
  onDeleteLesson,
  onReorderLesson,
  onQuickStatusChange,
  onQuickAccessChange,
  onBulkUpdate,
  onBulkDelete,
  onOpenAiImport,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LessonStatus>('all')
  const [accessFilter, setAccessFilter] = useState<'all' | LessonAccessLevel>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)

  // In-place Chapter Editing State
  const [isEditingChapter, setIsEditingChapter] = useState(false)
  const [chapTitle, setChapTitle] = useState(chapter.title || '')
  const [chapSlug, setChapSlug] = useState(chapter.slug || '')
  const [chapShortDesc, setChapShortDesc] = useState(chapter.short_description || '')
  const [chapAuthor, setChapAuthor] = useState(() => {
    const meta = (chapter.metadata as Record<string, unknown>) || {}
    return (meta.author as string) || ''
  })
  const [chapGenre, setChapGenre] = useState(() => {
    const meta = (chapter.metadata as Record<string, unknown>) || {}
    return (meta.genre as string) || ''
  })
  const [chapPeriod, setChapPeriod] = useState(() => {
    const meta = (chapter.metadata as Record<string, unknown>) || {}
    return (meta.period as string) || ''
  })
  const [chapRelevance, setChapRelevance] = useState(() => {
    const meta = (chapter.metadata as Record<string, unknown>) || {}
    return (meta.relevance as string) || ''
  })
  const [chapIsPublished, setChapIsPublished] = useState(chapter.is_published ?? true)
  const [savingChapter, setSavingChapter] = useState(false)

  const handleStartEditChapter = () => {
    setChapTitle(chapter.title || '')
    setChapSlug(chapter.slug || '')
    setChapShortDesc(chapter.short_description || '')
    const meta = (chapter.metadata as Record<string, unknown>) || {}
    setChapAuthor((meta.author as string) || '')
    setChapGenre((meta.genre as string) || '')
    setChapPeriod((meta.period as string) || '')
    setChapRelevance((meta.relevance as string) || '')
    setChapIsPublished(chapter.is_published ?? true)
    setIsEditingChapter(true)
  }

  const handleSaveChapterInPlace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chapTitle.trim() || !onSaveChapter) return

    setSavingChapter(true)
    await onSaveChapter({
      subject_id: chapter.subject_id,
      title: chapTitle.trim(),
      slug: chapSlug.trim().toLowerCase() || chapTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_description: chapShortDesc.trim() || null,
      metadata: {
        author: chapAuthor.trim() || undefined,
        genre: chapGenre.trim() || undefined,
        period: chapPeriod.trim() || undefined,
        relevance: chapRelevance.trim() || undefined,
      },
      sort_order: chapter.sort_order ?? 0,
      is_published: chapIsPublished,
    })
    setSavingChapter(false)
    setIsEditingChapter(false)
  }

  const filtered = lessons.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (accessFilter !== 'all' && l.access_level !== accessFilter) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q) || (l.short_description || '').toLowerCase().includes(q)
  })

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((l) => l.id))
    }
  }

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleApplyBulkStatus = async (status: LessonStatus) => {
    if (selectedIds.length === 0) return
    setBulkLoading(true)
    await onBulkUpdate(selectedIds, { status })
    setBulkLoading(false)
    setSelectedIds([])
  }

  const handleApplyBulkAccess = async (access: LessonAccessLevel) => {
    if (selectedIds.length === 0) return
    setBulkLoading(true)
    await onBulkUpdate(selectedIds, { access_level: access })
    setBulkLoading(false)
    setSelectedIds([])
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Chapter Context Banner (with In-Place Editing) */}
      {isEditingChapter ? (
        <div className="p-6 rounded-3xl bg-surface-elevated border-2 border-amber-500/60 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Editare Capitol / Operă în Pagină
            </span>
            <button
              type="button"
              onClick={() => setIsEditingChapter(false)}
              className="p-1 text-text-muted hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-text">Titlu Capitol / Operă</label>
              <input
                type="text"
                autoFocus
                value={chapTitle}
                onChange={(e) => setChapTitle(e.target.value)}
                placeholder="ex: Moara cu noroc"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-text-muted">Autor Canonic (Opțional)</label>
              <input
                type="text"
                value={chapAuthor}
                onChange={(e) => setChapAuthor(e.target.value)}
                placeholder="ex: Ioan Slavici"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-text-muted">Gen / Specie Literară</label>
              <input
                type="text"
                value={chapGenre}
                onChange={(e) => setChapGenre(e.target.value)}
                placeholder="ex: Nuvelă psihologică realistă"
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-text-muted">Epocă / Curent Literar</label>
              <input
                type="text"
                value={chapPeriod}
                onChange={(e) => setChapPeriod(e.target.value)}
                placeholder="ex: Marii clasici / Epoca marilor clasici"
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-text-muted">Stare Publicare</label>
              <select
                value={chapIsPublished ? 'true' : 'false'}
                onChange={(e) => setChapIsPublished(e.target.value === 'true')}
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
              >
                <option value="true">🟢 Publicat (Live)</option>
                <option value="false">🟡 Ciornă (Ascuns)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-text-muted">Descriere Scurtă / Sinteză Operă</label>
            <textarea
              rows={2}
              value={chapShortDesc}
              onChange={(e) => setChapShortDesc(e.target.value)}
              placeholder="Descriere sintetică a operei sau a capitolului istoric..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsEditingChapter(false)}
              className="px-3.5 py-1.5 rounded-xl glass-subtle border border-border text-xs font-semibold text-text"
            >
              Anulează
            </button>
            <button
              type="button"
              disabled={savingChapter || !chapTitle.trim()}
              onClick={() => handleSaveChapterInPlace()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle min-h-[36px]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingChapter ? 'Se salvează...' : 'Salvează Modificările'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl glass-elevated border border-border flex flex-wrap items-center justify-between gap-4 shadow-subtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Operă / Capitol Activ
              </span>
              <span className="font-mono text-xs text-text-subtle">/{chapter.slug}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-text">
              {chapter.title}
            </h2>

            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              {chapter.short_description || 'Gestiune eseuri structurate pe barem, sinteze pedagogice și blocuri explicative.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAiImport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-subtle border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all min-h-[38px]"
              title="Importă un eseu generat de AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Importă AI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSaveChapter) handleStartEditChapter()
                else if (onOpenEditChapter) onOpenEditChapter(chapter)
              }}
              className="px-3.5 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
            >
              Editează Capitol
            </button>

            <button
              type="button"
              onClick={onOpenCreateLesson}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Lecție / Eseu</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-elevated border border-border">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[240px] max-w-xl">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută lecție după titlu sau rezumat..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | LessonStatus)}
            className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none shrink-0"
          >
            <option value="all">Toate Stările</option>
            <option value="draft">🟡 Draft (Ciornă)</option>
            <option value="review">🔵 În Review</option>
            <option value="published">🟢 Publicat</option>
            <option value="archived">⚫ Arhivat</option>
          </select>

          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value as 'all' | LessonAccessLevel)}
            className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none shrink-0"
          >
            <option value="all">Toate Tipurile</option>
            <option value="free">🔓 Doar FREE</option>
            <option value="pro">👑 Doar PRO</option>
          </select>
        </div>

        {/* Select All Checkbox */}
        {filtered.length > 0 && (
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors"
          >
            {selectedIds.length === filtered.length && filtered.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Square className="w-4 h-4 text-text-subtle" />
            )}
            <span>Selectează toate ({filtered.length})</span>
          </button>
        )}
      </div>

      {/* ========================================== */}
      {/* BULK ACTION STICKY BAR (when rows selected) */}
      {/* ========================================== */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-20 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-text">
              lecții selectate pentru acțiuni în masă
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Set Status */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleApplyBulkStatus('published')}
                className="px-2.5 py-1 rounded-lg bg-status-success/20 hover:bg-status-success/30 text-status-success border border-status-success/30 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                Setează Publicat
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleApplyBulkStatus('review')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                Setează Review
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleApplyBulkStatus('draft')}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-elevated text-text-muted border border-border text-[11px] font-bold transition-all disabled:opacity-50"
              >
                Setează Draft
              </button>
            </div>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Quick Set Access */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleApplyBulkAccess('pro')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                👑 Set PRO
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleApplyBulkAccess('free')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                🔓 Set FREE
              </button>
            </div>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Bulk Delete */}
            <button
              type="button"
              disabled={bulkLoading}
              onClick={() => onBulkDelete(selectedIds)}
              className="px-2.5 py-1 rounded-lg bg-status-danger/20 hover:bg-status-danger/30 text-status-danger border border-status-danger/30 text-[11px] font-bold transition-all disabled:opacity-50"
            >
              Șterge Selecția
            </button>

            {/* Deselect All */}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 rounded-lg text-text-muted hover:text-text text-[11px] font-semibold"
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      {/* Lessons List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Nicio lecție găsită"
          description="Adaugă un eseu structurat pe barem sau folosește asistentul AI de import."
          action={
            <button
              type="button"
              onClick={onOpenCreateLesson}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Creează Lecție Nouă</span>
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((les, index) => {
            const isPro = les.access_level === 'pro'
            const isSelected = selectedIds.includes(les.id)

            return (
              <div
                key={les.id}
                onClick={() => onSelectLesson(les.slug)}
                className={`p-4 sm:p-5 rounded-2xl glass-elevated border transition-all shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group ${
                  isSelected
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : 'border-border hover:border-amber-500/50 hover:bg-surface-elevated/70'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectLesson(les.slug)}
              >
                {/* Left Col: Checkbox & Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleSelectOne(les.id)
                    }}
                    className="mt-1 p-0.5 text-text-subtle hover:text-amber-400 transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Access Toggle Pill */}
                      <button
                        type="button"
                        onClick={() => onQuickAccessChange(les, isPro ? 'free' : 'pro')}
                        title="Apasă pentru a comuta FREE / PRO"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          isPro
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                            : 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
                        }`}
                      >
                        {isPro ? <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Unlock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />}
                        <span>{isPro ? 'EXCLUSIV PRO' : 'ACCES GRATUIT'}</span>
                      </button>

                      {/* Status Selector */}
                      <select
                        value={les.status}
                        onChange={(e) => onQuickStatusChange(les, e.target.value as LessonStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                          les.status === 'published'
                            ? 'bg-status-success/15 text-status-success border-status-success/30'
                            : les.status === 'review'
                            ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30'
                            : les.status === 'archived'
                            ? 'bg-surface text-text-subtle border-border'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="draft">🟡 Draft (Ciornă)</option>
                        <option value="review">🔵 În Review</option>
                        <option value="published">🟢 Publicat (Live)</option>
                        <option value="archived">⚫ Arhivat</option>
                      </select>

                      {les.estimated_minutes && (
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {les.estimated_minutes} min
                        </span>
                      )}

                      <span className="text-[11px] text-text-subtle font-mono">
                        {les.block_count} blocuri
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-text group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {les.title}
                      </h3>
                      <span className="text-[11px] font-mono text-text-subtle">
                        /{les.slug}
                      </span>
                    </div>

                    {les.short_description && (
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-1">
                        {les.short_description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Col: Secondary Actions (stopPropagation) */}
                <div
                  className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onReorderLesson(les.id, 'up')}
                      aria-label="Mută lecție mai sus"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filtered.length - 1}
                      onClick={() => onReorderLesson(les.id, 'down')}
                      aria-label="Mută lecție mai jos"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    onClick={() => onDuplicateLesson(les.id)}
                    className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                    title="Duplică Lecția (inclusiv toate blocurile)"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => onPreviewLesson(les)}
                    className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                    title="Previzualizează Lecția Live"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit Metadata */}
                  <button
                    type="button"
                    onClick={() => onOpenEditLesson(les)}
                    className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                    title="Editează Metadate Lecție"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDeleteLesson(les)}
                    className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                    title="Șterge Lecția"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Open Studio Indicator */}
                  <button
                    type="button"
                    onClick={() => onSelectLesson(les.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-amber-500 hover:text-black text-xs font-bold text-text transition-all border border-border min-h-[36px]"
                  >
                    <span>Editor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminLessonsView
