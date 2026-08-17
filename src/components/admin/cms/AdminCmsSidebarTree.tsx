import React, { useState } from 'react'
import {
  BookOpen,
  Compass,
  Layers,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react'
import type { AdminSubjectWithCounts, AdminChapterWithCounts } from '@/services/adminCmsService'

interface AdminCmsSidebarTreeProps {
  subjects: AdminSubjectWithCounts[]
  chapters: AdminChapterWithCounts[]
  selectedSubjectId: string | null
  selectedChapterId: string | null
  onSelectSubject: (subjectId: string) => void
  onSelectChapter: (subjectId: string, chapterId: string) => void
  onOpenCreateSubject: () => void
  onOpenCreateChapter: (subjectId: string) => void
}

export const AdminCmsSidebarTree: React.FC<AdminCmsSidebarTreeProps> = ({
  subjects,
  chapters,
  selectedSubjectId,
  selectedChapterId,
  onSelectSubject,
  onSelectChapter,
  onOpenCreateSubject,
  onOpenCreateChapter,
}) => {
  const [filterQuery, setFilterQuery] = useState('')
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    // Automatically expand the active subject
    const initial: Record<string, boolean> = {}
    if (selectedSubjectId) initial[selectedSubjectId] = true
    return initial
  })

  const toggleSubjectExpand = (subjId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjId]: !prev[subjId],
    }))
  }

  const filteredSubjects = subjects.filter((s) => {
    if (!filterQuery.trim()) return true
    const q = filterQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
  })

  return (
    <div className="flex flex-col h-full bg-surface-elevated/40 border border-border rounded-2xl p-3.5 space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-text">
            Arbore Curriculum
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCreateSubject}
          className="p-1 rounded-lg text-text-muted hover:text-amber-400 hover:bg-surface transition-colors"
          title="Adaugă Materie Nouă"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-text-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filtrează materii..."
          className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Tree Content List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
        {filteredSubjects.length === 0 ? (
          <p className="text-[11px] text-text-subtle p-2 text-center">Nicio materie găsită.</p>
        ) : (
          filteredSubjects.map((subj) => {
            const isSubjSelected = selectedSubjectId === subj.id && !selectedChapterId
            const isExpanded = Boolean(expandedSubjects[subj.id] || selectedSubjectId === subj.id)

            // Get chapters for this subject if selected
            const subjChapters = selectedSubjectId === subj.id ? chapters : []

            return (
              <div key={subj.id} className="space-y-0.5">
                {/* Subject Row */}
                <div
                  className={`group flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                    isSubjSelected
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shadow-subtle font-bold'
                      : selectedSubjectId === subj.id
                      ? 'bg-surface text-text font-bold border border-border'
                      : 'text-text-muted hover:text-text hover:bg-surface/80 border border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleSubjectExpand(subj.id)
                      onSelectSubject(subj.id)
                    }}
                    className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  >
                    <span className="p-0.5 text-text-subtle group-hover:text-text">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>

                    <span className="shrink-0 text-amber-600 dark:text-amber-400">
                      {subj.icon === 'Compass' ? (
                        <Compass className="w-3.5 h-3.5" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5" />
                      )}
                    </span>

                    <span className="truncate">{subj.name}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border-subtle font-mono text-text-subtle">
                      {subj.chapter_count}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenCreateChapter(subj.id)
                      }}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface-elevated transition-all"
                      title="Adaugă Capitol în această materie"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Chapters nested list */}
                {isExpanded && selectedSubjectId === subj.id && (
                  <div className="pl-6 space-y-0.5 pt-0.5">
                    {subjChapters.length === 0 ? (
                      <p className="text-[11px] text-text-subtle py-1 pl-2 italic">
                        Niciun capitol adăugat încă.
                      </p>
                    ) : (
                      subjChapters.map((chap) => {
                        const isChapSelected = selectedChapterId === chap.id
                        return (
                          <button
                            key={chap.id}
                            type="button"
                            onClick={() => onSelectChapter(subj.id, chap.id)}
                            className={`w-full flex items-center justify-between p-1.5 pl-2 rounded-lg text-xs transition-all text-left ${
                              isChapSelected
                                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30'
                                : 'text-text-muted hover:text-text hover:bg-surface border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Layers className="w-3 h-3 text-text-subtle shrink-0" />
                              <span className="truncate">{chap.title}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {chap.is_published && (
                                <CheckCircle2 className="w-3 h-3 text-status-success" />
                              )}
                              <span className="text-[10px] font-mono text-text-subtle">
                                {chap.lesson_count}l
                              </span>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
