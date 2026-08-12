import React from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, ChevronRight, FileText } from 'lucide-react'
import type { CatalogChapterWithCounts } from '@/services/catalogService'

interface Props {
  chapter: CatalogChapterWithCounts
  subjectSlug: string
}

export const ChapterCard: React.FC<Props> = ({ chapter, subjectSlug }) => {
  return (
    <Link
      to={`/catalog/${subjectSlug}/${chapter.slug}`}
      className="group block p-6 rounded-2xl border border-border bg-surface hover:border-primary/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg bg-border/50 text-text flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <FolderKanban className="w-5 h-5" />
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-border/40 text-text-muted">
          <FileText className="w-3.5 h-3.5" />
          {chapter.lesson_count} {chapter.lesson_count === 1 ? 'lecție' : 'lecții'}
        </span>
      </div>

      <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-2">
        {chapter.title}
      </h4>

      {chapter.short_description && (
        <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
          {chapter.short_description}
        </p>
      )}

      <div className="flex items-center text-sm font-semibold text-primary gap-1 group-hover:gap-2 transition-all">
        <span>Vezi lecțiile</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
