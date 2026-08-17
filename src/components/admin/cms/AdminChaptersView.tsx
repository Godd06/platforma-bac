import React, { useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Search,
  Save,
  X,
} from 'lucide-react'
import type { AdminChapterWithCounts, ChapterFormData } from '@/services/adminCmsService'
import type { Subject, Chapter } from '@/types/database'
import { EmptyState } from '@/components/ui/EmptyState'

interface AdminChaptersViewProps {
  subject: Subject
  chapters: AdminChapterWithCounts[]
  onSelectChapter: (chapterSlug: string) => void
  onOpenCreateChapter: () => void
  onSaveChapter: (formData: ChapterFormData) => Promise<void>
  onDuplicateChapter: (chapterId: string) => void
  onTogglePublished: (chapter: Chapter) => void
  onDeleteChapter: (chapter: Chapter) => void
  onReorderChapter: (chapterId: string, direction: 'up' | 'down') => void
}

export const AdminChaptersView: React.FC<AdminChaptersViewProps> = ({
  subject,
  chapters,
  onSelectChapter,
  onOpenCreateChapter,
  onSaveChapter,
  onDuplicateChapter,
  onTogglePublished,
  onDeleteChapter,
  onReorderChapter,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  // In-place editing chapter state (when editing a specific chapter from the list)
  const [inlineEditingChapterId, setInlineEditingChapterId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [period, setPeriod] = useState('')
  const [relevance, setRelevance] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [saving, setSaving] = useState(false)

  const isRomana = subject.slug === 'limba-romana'

  const handleStartEdit = (chap: Chapter) => {
    setInlineEditingChapterId(chap.id)
    setTitle(chap.title || '')
    setSlug(chap.slug || '')
    setShortDesc(chap.short_description || '')
    const meta = (chap.metadata as Record<string, unknown>) || {}
    setAuthor((meta.author as string) || '')
    setGenre((meta.genre as string) || '')
    setPeriod((meta.period as string) || '')
    setRelevance((meta.relevance as string) || '')
    setIsPublished(chap.is_published ?? true)
    setSortOrder(chap.sort_order ?? 0)
  }

  const handleCancelEdit = () => {
    setInlineEditingChapterId(null)
  }

  const handleSaveInPlace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim() || !inlineEditingChapterId) return

    setSaving(true)
    await onSaveChapter({
      subject_id: subject.id,
      title: title.trim(),
      slug: slug.trim().toLowerCase() || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_description: shortDesc.trim() || null,
      metadata: {
        author: author.trim() || undefined,
        genre: genre.trim() || undefined,
        period: period.trim() || undefined,
        relevance: relevance.trim() || undefined,
      },
      sort_order: sortOrder,
      is_published: isPublished,
    })
    setSaving(false)
    setInlineEditingChapterId(null)
  }

  const filtered = chapters.filter((c) => {
    if (statusFilter === 'published' && !c.is_published) return false
    if (statusFilter === 'draft' && c.is_published) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const metaStr = JSON.stringify(c.metadata || {}).toLowerCase()
    return c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || metaStr.includes(q)
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Subject Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl glass-elevated border border-border flex flex-wrap items-center justify-between gap-4 shadow-subtle">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Materie Activă
            </span>
            <span className="font-mono text-xs text-text-subtle">/{subject.slug}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
            {subject.name}
          </h1>

          <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
            {subject.short_description ||
              (isRomana
                ? 'Gestiune opere canonice, autori, curente literare și eseuri structurate.'
                : 'Gestiune capitole, epoci istorice și izvoare documentare.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreateChapter}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>{isRomana ? 'Adaugă Operă / Autor' : 'Adaugă Capitol'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-elevated border border-border">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRomana ? 'Caută după autor, titlu operă, curent...' : 'Caută după titlu sau tematică...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none shrink-0"
          >
            <option value="all">Toate</option>
            <option value="published">Publicate</option>
            <option value="draft">Ciorne</option>
          </select>
        </div>

        <span className="text-xs text-text-muted font-semibold">
          {filtered.length} {isRomana ? 'opere' : 'capitole'} listate
        </span>
      </div>

      {/* Chapters Grid List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={isRomana ? 'Nicio operă adăugată' : 'Niciun capitol găsit'}
          description="Adaugă un capitol sau o operă canonică pentru a începe structurarea lecțiilor."
          action={
            <button
              type="button"
              onClick={onOpenCreateChapter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>{isRomana ? 'Adaugă Operă Nouă' : 'Adaugă Capitol Nou'}</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((chap, index) => {
            const isEditing = inlineEditingChapterId === chap.id
            const meta = (chap.metadata as Record<string, unknown>) || {}
            const authorVal = meta.author as string | undefined
            const genreVal = meta.genre as string | undefined
            const periodVal = meta.period as string | undefined
            const relevanceVal = meta.relevance as string | undefined

            if (isEditing) {
              /* ==================== INLINE EDIT FORM IN THE CARD ==================== */
              return (
                <div
                  key={chap.id}
                  className="p-5 rounded-2xl bg-surface-elevated border-2 border-amber-500/60 shadow-2xl space-y-3.5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Editare Operă în Pagină
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-1 text-text-muted hover:text-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-text-muted">Titlu Operă</label>
                    <input
                      type="text"
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ex: Moara cu noroc"
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Inline Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Autor</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="ex: Ioan Slavici"
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Gen / Curent</label>
                      <input
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="ex: Realism psihologic"
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Epocă / An</label>
                      <input
                        type="text"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="ex: Secolul XIX"
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Barem BAC</label>
                      <input
                        type="text"
                        value={relevance}
                        onChange={(e) => setRelevance(e.target.value)}
                        placeholder="ex: Subiectul III"
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Descriere Scurtă</label>
                    <textarea
                      rows={2}
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Descriere sintetică..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 rounded-xl glass-subtle border border-border text-xs font-semibold text-text"
                    >
                      Anulează
                    </button>
                    <button
                      type="button"
                      disabled={saving || !title.trim()}
                      onClick={() => handleSaveInPlace()}
                      className="inline-flex items-center gap-1.5 px-4 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? 'Se salvează...' : 'Salvează Modificările'}</span>
                    </button>
                  </div>
                </div>
              )
            }

            /* ==================== VIEW CARD (100% CLICKABLE) ==================== */
            return (
              <div
                key={chap.id}
                onClick={() => onSelectChapter(chap.slug)}
                className="p-5 rounded-2xl glass-elevated border border-border hover:border-amber-500/50 hover:bg-surface-elevated/70 transition-all space-y-3.5 shadow-subtle flex flex-col justify-between group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectChapter(chap.slug)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-display font-bold text-base text-text group-hover:text-amber-300 transition-colors truncate">
                        {chap.title}
                      </h3>
                      <span className="text-[11px] font-mono text-text-subtle">
                        /{chap.slug}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTogglePublished(chap)
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all border shrink-0 ${
                        chap.is_published
                          ? 'bg-status-success/15 text-status-success border-status-success/30 hover:bg-status-success/25'
                          : 'bg-surface-elevated text-text-muted border-border hover:bg-surface'
                      }`}
                    >
                      {chap.is_published ? 'Publicat' : 'Ciornă'}
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {authorVal && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        ✍️ {authorVal}
                      </span>
                    )}
                    {genreVal && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        📖 {genreVal}
                      </span>
                    )}
                    {periodVal && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-surface-elevated text-text-muted border border-border">
                        ⏳ {periodVal}
                      </span>
                    )}
                    {relevanceVal && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        🎯 {relevanceVal}
                      </span>
                    )}
                  </div>

                  {chap.short_description && (
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {chap.short_description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2 border-t border-border-subtle text-xs text-text-muted">
                    <span>
                      <strong className="text-text">{chap.lesson_count}</strong> lecții / eseuri
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-text-subtle">
                      Sort: {chap.sort_order}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div
                  className="flex items-center justify-between pt-3 border-t border-border-subtle"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onReorderChapter(chap.id, 'up')}
                      aria-label="Mută capitol mai sus"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filtered.length - 1}
                      onClick={() => onReorderChapter(chap.id, 'down')}
                      aria-label="Mută capitol mai jos"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDuplicateChapter(chap.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                      title="Duplică Capitolul"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(chap)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                      title="Editează Capitolul în Pagină"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteChapter(chap)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                      title="Șterge Capitolul"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectChapter(chap.slug)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-amber-500 hover:text-black text-xs font-bold text-text transition-all border border-border"
                    >
                      <span>Lecții ({chap.lesson_count})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
