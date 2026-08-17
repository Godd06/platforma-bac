import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Lock, BookOpen } from 'lucide-react'
import type { SubjectProgressItem } from '@/services/dashboardService'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface SubjectProgressCardProps {
  subjects: SubjectProgressItem[]
}

export const SubjectProgressCard: React.FC<SubjectProgressCardProps> = ({ subjects }) => {
  return (
    <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-display text-base font-bold text-text">Progresul Tău pe Materii</h3>
          <p className="text-xs text-text-muted">Lecții finalizate din programa oficială de Bac</p>
        </div>

        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 border border-cyan-500/25 hover:border-cyan-500/40 transition-colors shrink-0 shadow-subtle"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vezi tot catalogul</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 pt-1">
        {subjects.map((item) => (
          <Link
            key={item.subjectId}
            to={`/catalog/${item.subjectSlug}`}
            className="group block p-4 rounded-xl border border-border-subtle glass-subtle hover:bg-surface-elevated/80 hover:border-cyan-500/40 transition-all duration-200 shadow-subtle"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-text group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                {item.subjectName}
              </h4>
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                {Math.round(item.progressPercent)}%
              </span>
            </div>

            <ProgressBar percentage={item.progressPercent} height="h-2" />

            <div className="flex items-center justify-between text-xs text-text-muted mt-2.5">
              <span className="font-medium">
                <strong className="text-text font-bold">{item.completedLessons}</strong> din {item.totalPublishedLessons} lecții parcurse
              </span>
              {item.proLessonsCount > 0 && (
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                  <Lock className="w-3 h-3" />
                  <span>{item.proLessonsCount} PRO</span>
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SubjectProgressCard
