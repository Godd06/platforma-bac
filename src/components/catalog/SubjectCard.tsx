import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Layers, Compass } from 'lucide-react'
import type { CatalogSubjectWithCounts } from '@/services/catalogService'

interface Props {
  subject: CatalogSubjectWithCounts
}

export const SubjectCard: React.FC<Props> = ({ subject }) => {
  const isHistory = subject.slug?.includes('istorie')
  const isRomana = subject.slug?.includes('romana')

  const accentColor = isHistory ? 'amber' : isRomana ? 'cyan' : 'cyan'

  return (
    <Link
      to={`/catalog/${subject.slug}`}
      className={`group relative block p-6 rounded-2xl glass-elevated interactive-card border border-border hover:border-${accentColor}-500/40 flex flex-col justify-between overflow-hidden shadow-subtle h-full`}
    >
      {/* Ambient Inner Spot Glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-500 ${
          isHistory
            ? 'bg-amber-500/10 group-hover:bg-amber-500/20'
            : 'bg-cyan-500/10 group-hover:bg-cyan-500/20'
        } blur-2xl`}
      />

      <div className="space-y-4 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-subtle ${
              isHistory
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
            }`}
          >
            {isHistory ? <Compass className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold glass-subtle border border-border text-text-muted shadow-subtle">
            <Layers className={`w-3.5 h-3.5 ${isHistory ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span>{subject.chapter_count} {subject.chapter_count === 1 ? 'capitol' : 'capitole'}</span>
          </span>
        </div>

        <div>
          <h3 className={`font-display text-lg font-bold text-text transition-colors ${
            isHistory ? 'group-hover:text-amber-300' : 'group-hover:text-cyan-300'
          }`}>
            {subject.name}
          </h3>

          {subject.short_description && (
            <p className="text-xs text-text-muted line-clamp-2 mt-1.5 leading-relaxed">
              {subject.short_description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center text-xs font-bold gap-1 pt-4 mt-4 border-t border-border-subtle relative z-10">
        <span className={isHistory ? 'text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300' : 'text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-800 dark:group-hover:text-cyan-300'}>
          Deschide programa completă
        </span>
        <ChevronRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
          isHistory ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'
        }`} />
      </div>
    </Link>
  )
}

export default SubjectCard
