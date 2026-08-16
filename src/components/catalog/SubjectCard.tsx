import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Layers } from 'lucide-react'
import type { CatalogSubjectWithCounts } from '@/services/catalogService'

interface Props {
  subject: CatalogSubjectWithCounts
}

export const SubjectCard: React.FC<Props> = ({ subject }) => {
  return (
    <Link
      to={`/catalog/${subject.slug}`}
      className="group block p-6 rounded-3xl border border-border/80 bg-surface/80 hover:bg-surface hover:border-cyan-500/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-elevated text-text-muted border border-border/80">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{subject.chapter_count} {subject.chapter_count === 1 ? 'capitol' : 'capitole'}</span>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-text group-hover:text-cyan-300 transition-colors mb-2">
          {subject.name}
        </h3>

        {subject.short_description && (
          <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
            {subject.short_description}
          </p>
        )}
      </div>

      <div className="flex items-center text-xs sm:text-sm font-bold text-cyan-400 gap-1 group-hover:gap-2 transition-all pt-3 border-t border-border/60">
        <span>Explorează operele și capitolele</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
