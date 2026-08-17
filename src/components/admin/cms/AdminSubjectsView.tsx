import React, { useState } from 'react'
import {
  BookOpen,
  Compass,
  Plus,
  Edit,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  Save,
  X,
} from 'lucide-react'
import type { AdminSubjectWithCounts, SubjectFormData } from '@/services/adminCmsService'
import type { Subject } from '@/types/database'
import { EmptyState } from '@/components/ui/EmptyState'

interface AdminSubjectsViewProps {
  subjects: AdminSubjectWithCounts[]
  onSelectSubject: (subjectSlug: string) => void
  onOpenCreateSubject: () => void
  onSaveSubject: (formData: SubjectFormData) => Promise<void>
  onDuplicateSubject: (subjectId: string) => void
  onTogglePublished: (subject: Subject) => void
  onDeleteSubject: (subject: Subject) => void
  onReorderSubject: (subjectId: string, direction: 'up' | 'down') => void
}

export const AdminSubjectsView: React.FC<AdminSubjectsViewProps> = ({
  subjects,
  onSelectSubject,
  onOpenCreateSubject,
  onSaveSubject,
  onDuplicateSubject,
  onTogglePublished,
  onDeleteSubject,
  onReorderSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // In-place editing state
  const [inlineEditingSubjectId, setInlineEditingSubjectId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [icon, setIcon] = useState('BookOpen')
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleStartEdit = (subj: Subject) => {
    setInlineEditingSubjectId(subj.id)
    setName(subj.name || '')
    setSlug(subj.slug || '')
    setShortDesc(subj.short_description || '')
    setIcon(subj.icon || 'BookOpen')
    setIsPublished(subj.is_published ?? true)
    setSortOrder(subj.sort_order ?? 0)
  }

  const handleCancelEdit = () => {
    setInlineEditingSubjectId(null)
  }

  const handleSaveInPlace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim() || !inlineEditingSubjectId) return

    setSaving(true)
    await onSaveSubject({
      name: name.trim(),
      slug: slug.trim().toLowerCase() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_description: shortDesc.trim() || null,
      icon,
      sort_order: sortOrder,
      is_published: isPublished,
    })
    setSaving(false)
    setInlineEditingSubjectId(null)
  }

  const filtered = subjects.filter((s) => {
    if (statusFilter === 'published' && !s.is_published) return false
    if (statusFilter === 'draft' && s.is_published) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
  })

  // Summary Metrics
  const totalChapters = subjects.reduce((acc, s) => acc + (s.chapter_count || 0), 0)
  const totalLessons = subjects.reduce((acc, s) => acc + (s.lesson_count || 0), 0)
  const publishedCount = subjects.filter((s) => s.is_published).length

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Studio Overview Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl glass-elevated border border-border space-y-1">
          <span className="text-xs font-bold text-text-muted">Total Materii de Examen</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-text">{subjects.length}</p>
          <span className="text-[11px] text-text-subtle">{publishedCount} active în catalogul public</span>
        </div>

        <div className="p-5 rounded-3xl glass-elevated border border-border space-y-1">
          <span className="text-xs font-bold text-text-muted">Capitole & Opere Canonice</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-300">{totalChapters}</p>
          <span className="text-[11px] text-text-subtle">Structurate pe autori și epoci</span>
        </div>

        <div className="p-5 rounded-3xl glass-elevated border border-border space-y-1">
          <span className="text-xs font-bold text-text-muted">Eseuri & Lecții Totale</span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-cyan-700 dark:text-cyan-300">{totalLessons}</p>
          <span className="text-[11px] text-text-subtle">Blocuri interactive de învățare</span>
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
              placeholder="Caută materie după nume sau slug..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none shrink-0"
          >
            <option value="all">Toate stările</option>
            <option value="published">Doar publicate</option>
            <option value="draft">Doar ciorne</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface border border-border text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold' : 'text-text-muted hover:text-text'
              }`}
              title="Afișare Grilă"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold' : 'text-text-muted hover:text-text'
              }`}
              title="Afișare Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCreateSubject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>Adaugă Materie</span>
          </button>
        </div>
      </div>

      {/* Grid or Table Display */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Nicio materie găsită"
          description="Apasă pe butonul de adăugare pentru a crea prima materie în catalogul oficial."
          action={
            <button
              type="button"
              onClick={onOpenCreateSubject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Materie</span>
            </button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((subj, index) => {
            const isEditing = inlineEditingSubjectId === subj.id

            if (isEditing) {
              /* ==================== INLINE EDIT FORM IN THE CARD ==================== */
              return (
                <div
                  key={subj.id}
                  className="p-5 rounded-2xl bg-surface-elevated border-2 border-amber-500/60 shadow-2xl space-y-3.5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Editare Materie în Pagină
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
                    <label className="block text-[11px] font-bold text-text-muted">Nume Materie</label>
                    <input
                      type="text"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex: Limba și Literatura Română"
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Icon</label>
                      <select
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      >
                        <option value="BookOpen">📖 Carte (BookOpen)</option>
                        <option value="Compass">🧭 Busolă (Compass)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted">Stare</label>
                      <select
                        value={isPublished ? 'true' : 'false'}
                        onChange={(e) => setIsPublished(e.target.value === 'true')}
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none"
                      >
                        <option value="true">🟢 Publicat</option>
                        <option value="false">🟡 Ciornă</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Descriere Scurtă</label>
                    <textarea
                      rows={2}
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Descriere materie..."
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
                      disabled={saving || !name.trim()}
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
                key={subj.id}
                onClick={() => onSelectSubject(subj.slug)}
                className="p-5 rounded-2xl glass-elevated border border-border hover:border-amber-500/50 hover:bg-surface-elevated/70 transition-all space-y-4 shadow-subtle flex flex-col justify-between group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectSubject(subj.slug)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center font-bold">
                        {subj.icon === 'Compass' ? <Compass className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-text group-hover:text-amber-300 transition-colors">
                          {subj.name}
                        </h3>
                        <span className="text-[11px] font-mono text-text-subtle">
                          /{subj.slug}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTogglePublished(subj)
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all border ${
                        subj.is_published
                          ? 'bg-status-success/15 text-status-success border-status-success/30 hover:bg-status-success/25'
                          : 'bg-surface-elevated text-text-muted border-border hover:bg-surface'
                      }`}
                      title="Apasă pentru a schimba starea de publicare"
                    >
                      {subj.is_published ? 'Publicat' : 'Ciornă'}
                    </button>
                  </div>

                  {subj.short_description && (
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {subj.short_description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2 border-t border-border-subtle text-xs text-text-muted">
                    <span>
                      <strong className="text-text">{subj.chapter_count}</strong> capitole
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-text">{subj.lesson_count}</strong> lecții
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-text-subtle">
                      Sort: {subj.sort_order}
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
                      onClick={() => onReorderSubject(subj.id, 'up')}
                      aria-label="Mută mai sus"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filtered.length - 1}
                      onClick={() => onReorderSubject(subj.id, 'down')}
                      aria-label="Mută mai jos"
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDuplicateSubject(subj.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                      title="Duplică Materia"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(subj)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-amber-400 hover:bg-surface-elevated transition-colors"
                      title="Editează Materia în Pagină"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSubject(subj)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                      title="Șterge Materia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectSubject(subj.slug)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-amber-500 hover:text-black text-xs font-bold text-text transition-all border border-border"
                    >
                      <span>Capitole ({subj.chapter_count})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl glass-elevated border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated/70 border-b border-border text-text-muted uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Materie</th>
                  <th className="p-3.5">Slug</th>
                  <th className="p-3.5">Capitole</th>
                  <th className="p-3.5">Lecții</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Sort</th>
                  <th className="p-3.5 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((subj, index) => (
                  <tr
                    key={subj.id}
                    onClick={() => onSelectSubject(subj.slug)}
                    className="hover:bg-surface-elevated/60 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-bold text-text flex items-center gap-2">
                      <span className="text-amber-400">
                        {subj.icon === 'Compass' ? <Compass className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </span>
                      <span>{subj.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-text-subtle">/{subj.slug}</td>
                    <td className="p-3.5 font-bold text-text">{subj.chapter_count}</td>
                    <td className="p-3.5 font-bold text-text">{subj.lesson_count}</td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onTogglePublished(subj)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          subj.is_published
                            ? 'bg-status-success/15 text-status-success border-status-success/30'
                            : 'bg-surface-elevated text-text-muted border-border'
                        }`}
                      >
                        {subj.is_published ? 'Publicat' : 'Ciornă'}
                      </button>
                    </td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-text-subtle mr-1">{subj.sort_order}</span>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => onReorderSubject(subj.id, 'up')}
                          className="p-0.5 rounded hover:bg-surface disabled:opacity-30"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === filtered.length - 1}
                          onClick={() => onReorderSubject(subj.id, 'down')}
                          className="p-0.5 rounded hover:bg-surface disabled:opacity-30"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDuplicateSubject(subj.id)}
                          className="p-1 rounded text-text-muted hover:text-amber-400"
                          title="Duplică"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(subj)}
                          className="p-1 rounded text-text-muted hover:text-amber-400"
                          title="Editează în Pagină"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSubject(subj)}
                          className="p-1 rounded text-text-muted hover:text-status-danger"
                          title="Șterge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectSubject(subj.slug)}
                          className="px-2.5 py-1 rounded-lg bg-surface hover:bg-amber-500 hover:text-black font-bold text-[11px] border border-border ml-1"
                        >
                          Deschide
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
