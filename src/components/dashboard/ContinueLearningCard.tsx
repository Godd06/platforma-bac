import React from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle, BookOpen, ChevronRight, Sparkles } from 'lucide-react'
import type { ContinueLearningItem } from '@/services/dashboardService'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface ContinueLearningCardProps {
  data: ContinueLearningItem | null
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-surface to-surface p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>Pregătire Bacalaureat</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Începe prima ta lecție de studiu
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg leading-relaxed">
            Descoperă eseurile structurate pentru Română și sintezele pentru Istorie în catalogul complet.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[44px]"
          >
            <span>Explorează Catalogul</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const { lessonId, lessonTitle, subjectName, chapterTitle, progressPercent, updatedAt } = data
  const isCompleted = progressPercent >= 100

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface p-6 sm:p-8 shadow-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <PlayCircle className="w-4 h-4" />
          <span>Continuă de unde ai rămas</span>
        </div>

        {updatedAt && (
          <span className="text-[11px] font-semibold text-text-subtle">
            Ultimul studiu: {new Date(updatedAt).toLocaleDateString('ro-RO')}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {subjectName}
          </span>
          <span className="text-text-subtle">•</span>
          <span className="text-text-muted truncate max-w-xs">{chapterTitle}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight hover:text-cyan-300 transition-colors">
          <Link to={`/lesson/${lessonId}`}>{lessonTitle}</Link>
        </h2>
      </div>

      {/* Progress & CTAs */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">Progres lecție</span>
          <span className="text-cyan-400 font-bold">{Math.round(progressPercent)}%</span>
        </div>

        <ProgressBar percentage={progressPercent} height="h-2.5" />

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/lesson/${lessonId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[44px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isCompleted ? 'Recapitulează lecția' : 'Continuă lecția'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
