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

  // Composition rules for Title & Subtitle from database fields (Rule 3 compliant)
  const metaObj = (metadata || {}) as Record<string, unknown>
  const author = typeof metaObj.author === 'string' ? metaObj.author : null
  const workType = typeof metaObj.work_type === 'string' ? metaObj.work_type : null

  const displayTitle = author ? `${title} — ${author}` : title
  const displaySubtitle = workType || short_description || 'Operă literară / Capitol'

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-surface shadow-sm ${
        isExpanded ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border hover:border-border/80'
      }`}
    >
      {/* Clickable Header for Collapsing / Expanding Accordion */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors hover:bg-border/20"
      >
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isExpanded
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-text tracking-tight truncate">
              {displayTitle}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-medium truncate">
              {displaySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-border/40 text-text-muted hidden sm:inline-flex">
            <Layers className="w-3.5 h-3.5" />
            {lessons.length} {lessons.length === 1 ? 'lecție' : 'lecții'}
          </span>

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isExpanded ? 'bg-primary/10 text-primary' : 'bg-border/40 text-text-muted'
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content Area (Hidden until expanded) */}
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border/50 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider px-1">
            <span>Eseuri și lecții de studiu ({lessons.length})</span>
            <span>Acces</span>
          </div>

          {lessons.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-text-muted">
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
                    className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-background hover:border-primary/50 hover:bg-surface transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-border/40 text-text flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-text group-hover:text-primary transition-colors truncate">
                          {lesson.title}
                        </h4>
                        {lesson.short_description && (
                          <p className="text-xs text-text-muted truncate hidden sm:block">
                            {lesson.short_description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.estimated_minutes && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.estimated_minutes} min
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPro
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPro && <Lock className="w-3 h-3" />}
                        {isPro ? 'PRO 🔒' : 'FREE'}
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
