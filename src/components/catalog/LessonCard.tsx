import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Lock, ChevronRight, BookOpen } from 'lucide-react'
import type { CatalogLessonMetadata } from '@/services/catalogService'

interface Props {
  lesson: CatalogLessonMetadata
}

export const LessonCard: React.FC<Props> = ({ lesson }) => {
  const isPro = lesson.access_level === 'pro'

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="group block p-5 rounded-2xl border border-border bg-surface hover:border-primary/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-border/40 text-text flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-text-muted">
            Lecția #{lesson.sort_order / 10 || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1 text-xs text-text-muted px-2.5 py-0.5 rounded-full bg-border/30">
              <Clock className="w-3 h-3" />
              {lesson.estimated_minutes} min
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isPro
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isPro && <Lock className="w-3 h-3" />}
            {isPro ? 'PRO 🔒' : 'FREE'}
          </span>
        </div>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors mb-1.5">
        {lesson.title}
      </h4>

      {lesson.short_description && (
        <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-3 leading-relaxed">
          {lesson.short_description}
        </p>
      )}

      <div className="flex items-center text-xs font-semibold text-primary gap-1 group-hover:gap-2 transition-all pt-1 border-t border-border/40">
        <span>{isPro ? 'Deschide lecția PRO' : 'Deschide lecția'}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  )
}
