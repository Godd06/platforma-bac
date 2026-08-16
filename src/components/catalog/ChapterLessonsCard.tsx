import React from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Clock, Lock, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react'
import type { CatalogChapterWithLessons } from '@/services/catalogService'

interface Props {
  chapter: CatalogChapterWithLessons
  isExpanded: boolean
  onToggle: () => void
}

export const ChapterLessonsCard: React.FC<Props> = ({
  chapter,
  isExpanded,
  onToggle,
}) => {
  const { title, short_description, metadata, lessons } = chapter

  // Composition rules for Title & Subtitle from database fields
  const metaObj = (metadata || {}) as Record<string, unknown>
  const author = typeof metaObj.author === 'string' ? metaObj.author : null
  const workType = typeof metaObj.work_type === 'string' ? metaObj.work_type : null

  const displayTitle = author ? `${title} — ${author}` : title
  const displaySubtitle = workType || short_description || 'Operă literară / Capitol'

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 bg-surface/80 shadow-sm overflow-hidden ${
        isExpanded
          ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          : 'border-border/80 hover:border-border-strong hover:bg-surface'
      }`}
    >
      {/* Clickable Header for Collapsing / Expanding Accordion */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${displayTitle} - ${isExpanded ? 'restrânge' : 'extinde'}`}
        className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors hover:bg-surface-hover/50 min-h-[56px]"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              isExpanded
                ? 'bg-cyan-500 text-black shadow-glow font-bold'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-text tracking-tight truncate">
              {displayTitle}
            </h3>
            <p className="text-xs text-text-muted font-medium truncate">
              {displaySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-elevated text-text-muted hidden sm:inline-flex border border-border">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lessons.length} {lessons.length === 1 ? 'lecție' : 'lecții'}</span>
          </span>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isExpanded ? 'bg-cyan-500/15 text-cyan-400' : 'bg-surface-elevated text-text-muted'
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border/60 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider px-1">
            <span>Eseuri și lecții de studiu ({lessons.length})</span>
            <span>Nivel Acces</span>
          </div>

          {lessons.length === 0 ? (
            <div className="p-5 rounded-2xl border border-dashed border-border text-center text-xs text-text-muted">
              Nu există lecții publicate pentru această operă încă.
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isPro = lesson.access_level === 'pro'
                return (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${lesson.id}`}
                    className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-border/70 bg-background/60 hover:border-cyan-500/40 hover:bg-surface-elevated/70 transition-all duration-200 min-h-[48px]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-surface-elevated text-text flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-text group-hover:text-cyan-300 transition-colors truncate">
                          {lesson.title}
                        </h4>
                        {lesson.short_description && (
                          <p className="text-[11px] sm:text-xs text-text-muted truncate hidden sm:block">
                            {lesson.short_description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {lesson.estimated_minutes && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted hidden xs:inline-flex">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{lesson.estimated_minutes} min</span>
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isPro
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {isPro && <Lock className="w-3 h-3" />}
                        <span>{isPro ? 'PRO' : 'FREE'}</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
