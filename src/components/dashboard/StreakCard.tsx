import React from 'react'
import { Flame, Trophy, CalendarCheck } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'

interface StreakCardProps {
  data: DashboardData['streak']
}

export const StreakCard: React.FC<StreakCardProps> = ({ data }) => {
  const { currentStreak, longestStreak, lastActivityDate } = data
  const isToday =
    lastActivityDate &&
    new Date(lastActivityDate).toDateString() === new Date().toDateString()

  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-surface/80 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text">Ritm de Studiu</h3>
        </div>

        {isToday ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-status-success bg-status-success/15 border border-status-success/30 px-2.5 py-0.5 rounded-full">
            <CalendarCheck className="w-3 h-3" />
            <span>Activ azi</span>
          </span>
        ) : (
          <span className="text-[11px] text-text-subtle font-medium">
            Studiază azi pentru streak
          </span>
        )}
      </div>

      <div className="text-center py-2 space-y-1">
        <div className="inline-flex items-center justify-center gap-2">
          <Flame
            className={`w-10 h-10 ${
              currentStreak > 0
                ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-text-subtle'
            }`}
          />
          <span className="text-4xl font-black text-text tracking-tight">
            {currentStreak}
          </span>
        </div>
        <p className="text-xs font-semibold text-text-muted">
          {currentStreak === 1 ? 'zi consecutivă de studiu' : 'zile consecutive de studiu'}
        </p>
      </div>

      <div className="p-3 rounded-2xl bg-surface-elevated/70 border border-border/60 flex items-center justify-between text-xs">
        <span className="text-text-muted flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Record personal</span>
        </span>
        <span className="font-bold text-text">
          {longestStreak} {longestStreak === 1 ? 'zi' : 'zile'}
        </span>
      </div>
    </div>
  )
}
