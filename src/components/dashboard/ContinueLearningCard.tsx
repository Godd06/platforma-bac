import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, Sparkles, Library } from 'lucide-react'
import type { ContinueLearningItem } from '@/services/dashboardService'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'

interface ContinueLearningCardProps {
  data: ContinueLearningItem | null
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="rounded-2xl border border-cyan-500/25 glass-elevated p-6 sm:p-7 space-y-4 shadow-subtle">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>Pasul Următor</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight">
            Începe prima ta lecție de studiu
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg leading-relaxed">
            Descoperă eseurile structurate pentru Română și sintezele pentru Istorie în catalogul oficial.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs sm:text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(6,182,212,0.30)] min-h-[42px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Deschide Catalogul de Materii</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const { lessonId, lessonTitle, subjectName, chapterTitle, progressPercent, updatedAt } = data
  const isCompleted = progressPercent >= 100

  return (
    <AnimatedBorderCard variant="cyan" glow={true} innerClassName="glass-featured p-6 sm:p-7 space-y-5 light-sweep-hover shadow-raised">
      {/* Top Context Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Continuă de unde ai rămas</span>
        </div>

        {updatedAt && (
          <span className="text-[11px] text-text-subtle font-medium flex items-center gap-1.5 glass-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accesat recent ({new Date(updatedAt).toLocaleDateString('ro-RO')})</span>
          </span>
        )}
      </div>

      {/* Subject & Lesson Title */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-muted">
          <span className="text-cyan-400">{subjectName}</span>
          <span className="text-text-subtle">•</span>
          <span className="truncate max-w-md">{chapterTitle}</span>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight hover:text-cyan-300 transition-colors">
          <Link to={`/lesson/${lessonId}`}>{lessonTitle}</Link>
        </h2>
      </div>

      {/* Progress Line & Action */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted font-medium">Progres asimilat</span>
          <span className="text-cyan-400 font-bold">{Math.round(progressPercent)}%</span>
        </div>

        <ProgressBar percentage={progressPercent} height="h-2" />

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/lesson/${lessonId}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs sm:text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(6,182,212,0.30)] min-h-[42px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isCompleted ? 'Recapitulează lecția' : 'Continuă lecția'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border glass-subtle text-text hover:bg-surface-elevated active:scale-[0.98] transition-all text-xs font-semibold min-h-[42px]"
          >
            <Library className="w-4 h-4 text-cyan-400" />
            <span>Toate materiile în Catalog</span>
          </Link>
        </div>
      </div>
    </AnimatedBorderCard>
  )
}

export default ContinueLearningCard
