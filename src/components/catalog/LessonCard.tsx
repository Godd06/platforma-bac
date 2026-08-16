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
      className="group block p-5 rounded-3xl border border-border/80 bg-surface/80 hover:bg-surface hover:border-cyan-500/40 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface-elevated text-text flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-text-muted">
            Lecția #{lesson.sort_order / 10 || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1 text-xs text-text-muted px-2.5 py-0.5 rounded-full bg-surface-elevated border border-border">
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
      </div>

      <h4 className="text-base sm:text-lg font-bold text-text group-hover:text-cyan-300 transition-colors mb-1.5">
        {lesson.title}
      </h4>

      {lesson.short_description && (
        <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-3 leading-relaxed">
          {lesson.short_description}
        </p>
      )}

      <div className="flex items-center text-xs font-bold text-cyan-400 gap-1 group-hover:gap-2 transition-all pt-2 border-t border-border/60">
        <span>{isPro ? 'Deschide lecția PRO' : 'Deschide lecția'}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  )
}
