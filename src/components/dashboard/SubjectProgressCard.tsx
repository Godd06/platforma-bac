import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Lock } from 'lucide-react'
import type { SubjectProgressItem } from '@/services/dashboardService'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface SubjectProgressCardProps {
  subjects: SubjectProgressItem[]
}

export const SubjectProgressCard: React.FC<SubjectProgressCardProps> = ({ subjects }) => {
  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-surface/80 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text">Progres pe Materii</h3>
        </div>

        <Link
          to="/catalog"
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <span>Vezi catalogul</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {subjects.map((item) => (
          <Link
            key={item.subjectId}
            to={`/catalog/${item.subjectSlug}`}
            className="group block p-4 rounded-2xl border border-border/70 bg-surface-elevated/40 hover:bg-surface-elevated/80 hover:border-cyan-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-text group-hover:text-cyan-300 transition-colors">
                {item.subjectName}
              </h4>
              <span className="text-xs font-bold text-cyan-400">
                {Math.round(item.progressPercent)}%
              </span>
            </div>

            <ProgressBar percentage={item.progressPercent} height="h-2" />

            <div className="flex items-center justify-between text-[11px] text-text-muted mt-2.5">
              <span>
                {item.completedLessons} din {item.totalPublishedLessons} lecții finalizate
              </span>
              {item.proLessonsCount > 0 && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
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
