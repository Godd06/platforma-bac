import React from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Clock, Lock, ChevronDown, ChevronUp, BookOpen, Layers, ArrowRight } from 'lucide-react'
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
      className={`rounded-xl transition-all duration-200 overflow-hidden ${
        isExpanded
          ? 'glass-elevated border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-raised'
          : 'glass-default border-border hover:border-border-strong hover:-translate-y-0.5'
      }`}
    >
      {/* Clickable Header for Collapsing / Expanding Accordion */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${displayTitle} - ${isExpanded ? 'restrânge' : 'extinde'}`}
        className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors hover:bg-surface-elevated/50 min-h-[52px]"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
              isExpanded
                ? 'bg-cyan-500 text-black font-bold shadow-subtle'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="font-display text-sm sm:text-base font-bold text-text tracking-tight truncate">
              {displayTitle}
            </h3>
            <p className="text-xs text-text-muted font-normal truncate">
              {displaySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-elevated text-text-muted hidden sm:inline-flex border border-border-subtle">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{lessons.length} {lessons.length === 1 ? 'lecție' : 'lecții'}</span>
          </span>

          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-200 ${
              isExpanded ? 'bg-cyan-500/15 text-cyan-400' : 'bg-surface-elevated text-text-subtle'
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="px-4 sm:px-4.5 pb-4 pt-1 border-t border-border/60 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-[10px] font-bold text-text-subtle uppercase tracking-wider px-1 pt-1">
            <span>Eseuri și analize ({lessons.length})</span>
            <span>Acces</span>
          </div>

          {lessons.length === 0 ? (
            <div className="p-3.5 rounded-lg border border-dashed border-border text-center text-xs text-text-muted">
              Nu există lecții publicate pentru această operă încă.
            </div>
          ) : (
            <div className="space-y-1.5">
              {lessons.map((lesson) => {
                const isPro = lesson.access_level === 'pro'
                return (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${lesson.id}`}
                    className="group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-lg border border-border-subtle glass-subtle hover:border-cyan-500/40 hover:bg-surface-elevated/90 interactive-item transition-all duration-150 min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-6 h-6 rounded-md bg-surface-elevated text-text flex items-center justify-center shrink-0 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-text group-hover:text-cyan-300 transition-colors truncate">
                          {lesson.title}
                        </h4>
                        {lesson.short_description && (
                          <p className="text-[11px] text-text-muted truncate hidden sm:block font-normal">
                            {lesson.short_description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {lesson.estimated_minutes && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted hidden xs:inline-flex">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{lesson.estimated_minutes} min</span>
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPro
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                            : 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20'
                        }`}
                      >
                        {isPro && <Lock className="w-2.5 h-2.5" />}
                        <span>{isPro ? 'PRO' : 'GRATUIT'}</span>
                      </span>

                      <ArrowRight className="w-3 h-3 text-text-subtle group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 hidden sm:block" />
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

export default ChapterLessonsCard
