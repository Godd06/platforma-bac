import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, BookOpen, Sparkles } from 'lucide-react'
import type { CatalogLessonMetadata } from '@/services/catalogService'

interface Props {
  lesson: CatalogLessonMetadata
}

export const LessonCard: React.FC<Props> = ({ lesson }) => {
  const isPro = lesson.access_level === 'pro'

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className={`group relative block p-5 rounded-2xl glass-elevated interactive-card border transition-all ${
        isPro
          ? 'border-border/80 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
          : 'border-border/80 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            isPro
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20'
              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20'
          }`}>
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-text-muted">
            Lecția #{lesson.sort_order / 10 || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1 text-[11px] text-text-muted px-2.5 py-0.5 rounded-lg glass-subtle border border-border-subtle">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{lesson.estimated_minutes} min</span>
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
              isPro
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
            }`}
          >
            {isPro ? <Sparkles className="w-2.5 h-2.5 text-amber-400" /> : null}
            <span>{isPro ? 'PRO' : 'GRATUIT'}</span>
          </span>
        </div>
      </div>

      <h4 className={`font-display text-base font-bold text-text transition-colors mb-1.5 ${
        isPro ? 'group-hover:text-amber-300' : 'group-hover:text-cyan-300'
      }`}>
        {lesson.title}
      </h4>

      {lesson.short_description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed">
          {lesson.short_description}
        </p>
      )}

      <div className={`flex items-center text-xs font-bold gap-1 pt-3 border-t border-border-subtle ${
        isPro ? 'text-amber-400 group-hover:text-amber-300' : 'text-cyan-400 group-hover:text-cyan-300'
      }`}>
        <span>{isPro ? 'Deschide lecția PRO' : 'Deschide lecția'}</span>
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export default LessonCard
