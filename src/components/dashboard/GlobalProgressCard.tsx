import React from 'react'
import { Award, BookCheck } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface GlobalProgressCardProps {
  data: DashboardData['globalProgress']
}

export const GlobalProgressCard: React.FC<GlobalProgressCardProps> = ({ data }) => {
  const { progressPercent, completedLessons, totalPublishedLessons } = data

  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-surface/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text">Progres Global Bac</h3>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <ProgressRing percentage={progressPercent} size={130} strokeWidth={10} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60 text-center">
        <div className="p-3 rounded-2xl bg-surface-elevated/70 border border-border/60">
          <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mb-1">
            <BookCheck className="w-3.5 h-3.5 text-status-success" />
            <span>Finalizate</span>
          </div>
          <p className="text-lg font-black text-text">
            {completedLessons} <span className="text-xs text-text-subtle">/ {totalPublishedLessons}</span>
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-surface-elevated/70 border border-border/60">
          <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Rămase</span>
          </div>
          <p className="text-lg font-black text-cyan-400">
            {Math.max(0, totalPublishedLessons - completedLessons)}
          </p>
        </div>
      </div>
    </div>
  )
}
