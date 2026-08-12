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
      className="group block p-6 rounded-2xl border border-border bg-surface hover:border-primary/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
          <BookOpen className="w-6 h-6" />
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-border/40 text-text-muted">
          <Layers className="w-3.5 h-3.5" />
          {subject.chapter_count} {subject.chapter_count === 1 ? 'capitol' : 'capitole'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors mb-2">
        {subject.name}
      </h3>

      {subject.short_description && (
        <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
          {subject.short_description}
        </p>
      )}

      <div className="flex items-center text-sm font-semibold text-primary gap-1 group-hover:gap-2 transition-all">
        <span>Explorează capitolele</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
