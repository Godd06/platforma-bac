import React from 'react'
import { BookCheck, Sparkles } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface GlobalProgressCardProps {
  data: DashboardData['globalProgress']
}

export const GlobalProgressCard: React.FC<GlobalProgressCardProps> = ({ data }) => {
  const { progressPercent, completedLessons, totalPublishedLessons } = data

  return (
    <div className="p-6 rounded-2xl glass-elevated interactive-card border border-border flex flex-col justify-between space-y-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shadow-subtle">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-display text-sm font-bold text-text">Progres Global Bac</h3>
        </div>
        <span className="text-[11px] font-semibold text-text-subtle px-2 py-0.5 rounded-md glass-subtle border border-border-subtle">
          Toate materiile
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <ProgressRing percentage={progressPercent} size={120} strokeWidth={9} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border-subtle text-center">
        <div className="p-2.5 rounded-xl glass-subtle border border-border-subtle">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-text-muted mb-0.5">
            <BookCheck className="w-3.5 h-3.5 text-status-success" />
            <span>Finalizate</span>
          </div>
          <p className="text-base font-bold text-text">
            {completedLessons} <span className="text-xs text-text-subtle font-normal">/ {totalPublishedLessons}</span>
          </p>
        </div>

        <div className="p-2.5 rounded-xl glass-subtle border border-border-subtle">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-text-muted mb-0.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Rămase</span>
          </div>
          <p className="text-base font-bold text-cyan-400">
            {Math.max(0, totalPublishedLessons - completedLessons)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GlobalProgressCard
