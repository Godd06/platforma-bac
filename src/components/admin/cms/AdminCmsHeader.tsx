import React from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Search,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react'
import type { Subject, Chapter, Lesson } from '@/types/database'

interface AdminCmsHeaderProps {
  subjects: Subject[]
  selectedSubject: Subject | null
  selectedChapter: Chapter | null
  selectedLesson: Lesson | null
  onNavigate: (params: { subjectId?: string; chapterId?: string; lessonId?: string }) => void
  onRefresh: () => void
  onOpenGlobalSearch: () => void
  onOpenImportExport: () => void
  onOpenCreateSubject: () => void
  onOpenCreateChapter: () => void
  onOpenCreateLesson: () => void
}

export const AdminCmsHeader: React.FC<AdminCmsHeaderProps> = ({
  subjects,
  selectedSubject,
  selectedChapter,
  selectedLesson,
  onNavigate,
  onRefresh,
  onOpenGlobalSearch,
  onOpenImportExport,
  onOpenCreateSubject,
  onOpenCreateChapter,
  onOpenCreateLesson,
}) => {
  return (
    <div className="space-y-3 pb-3 border-b border-border">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <FolderKanban className="w-4 h-4" />
            <span>Content Studio & Structură Editorială</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight mt-0.5">
            Gestiune Conținut Educațional
          </h1>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text-muted hover:text-text hover:border-amber-400/50 transition-all shadow-subtle min-h-[38px]"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Caută în tot curriculumul...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-mono text-text-subtle">
              Ctrl+K
            </kbd>
          </button>

          {/* AI Import / Export */}
          <button
            type="button"
            onClick={onOpenImportExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-subtle border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all min-h-[38px]"
            title="Importă sau exportă conținut AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Import AI / Export</span>
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
            title="Reîmprospătează datele"
            aria-label="Reîmprospătează datele"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Back to Admin */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panou Admin</span>
          </Link>
        </div>
      </div>

      {/* Breadcrumb Hierarchy Navigation with Contextual Quick Create */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl glass-subtle border border-border text-xs">
        <nav aria-label="Breadcrumb Curriculum" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate({})}
            className={`font-semibold transition-colors ${
              !selectedSubject ? 'text-amber-400 font-bold' : 'text-text-muted hover:text-text'
            }`}
          >
            Materii ({subjects.length})
          </button>

          {selectedSubject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
              <button
                type="button"
                onClick={() => onNavigate({ subjectId: selectedSubject.id })}
                className={`font-semibold transition-colors truncate max-w-[180px] sm:max-w-xs ${
                  !selectedChapter ? 'text-amber-400 font-bold' : 'text-text-muted hover:text-text'
                }`}
              >
                {selectedSubject.name}
              </button>
            </>
          )}

          {selectedChapter && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
              <button
                type="button"
                onClick={() => onNavigate({ subjectId: selectedSubject?.id, chapterId: selectedChapter.id })}
                className={`font-semibold transition-colors truncate max-w-[180px] sm:max-w-xs ${
                  !selectedLesson ? 'text-amber-400 font-bold' : 'text-text-muted hover:text-text'
                }`}
              >
                {selectedChapter.title}
              </button>
            </>
          )}

          {selectedLesson && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
              <span className="font-bold text-amber-400 truncate max-w-[180px] sm:max-w-xs">
                {selectedLesson.title}
              </span>
            </>
          )}
        </nav>

        {/* Quick Add Action for the active level */}
        <div className="flex items-center gap-2">
          {!selectedSubject && (
            <button
              type="button"
              onClick={onOpenCreateSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adaugă Materie</span>
            </button>
          )}

          {selectedSubject && !selectedChapter && (
            <button
              type="button"
              onClick={onOpenCreateChapter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adaugă Capitol</span>
            </button>
          )}

          {selectedChapter && !selectedLesson && (
            <button
              type="button"
              onClick={onOpenCreateLesson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adaugă Lecție</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
