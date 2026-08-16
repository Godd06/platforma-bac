import React from 'react'
import { Trophy, CalendarCheck, Check, Flame } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'

interface StreakCardProps {
  data: DashboardData['streak']
}

export const StreakCard: React.FC<StreakCardProps> = ({ data }) => {
  const { currentStreak, longestStreak, lastActivityDate } = data
  const isToday =
    lastActivityDate &&
    new Date(lastActivityDate).toDateString() === new Date().toDateString()

  // Days of week short representation (L, M, M, J, V, S, D)
  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  const todayDayIndex = (new Date().getDay() + 6) % 7 // 0 = Luni, 6 = Duminică

  return (
    <div className="p-6 rounded-2xl glass-elevated interactive-card border border-border flex flex-col justify-between space-y-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shadow-subtle">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <h3 className="font-display text-sm font-bold text-text">Ritm de Studiu</h3>
        </div>

        {isToday ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-status-success bg-status-success/15 border border-status-success/30 px-2.5 py-1 rounded-lg">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Activ azi</span>
          </span>
        ) : (
          <span className="text-[11px] text-text-subtle font-semibold px-2 py-0.5 rounded bg-surface-elevated">
            Studiază azi
          </span>
        )}
      </div>

      {/* Streak Count */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-extrabold text-gradient-gold tracking-tight">
            {currentStreak}
          </span>
          <span className="text-xs font-bold text-text-muted">
            {currentStreak === 1 ? 'zi consecutivă' : 'zile consecutive'}
          </span>
        </div>
        <p className="text-[11px] text-text-subtle leading-tight">
          Menține consecvența zilnică pentru asimilare de durată.
        </p>
      </div>

      {/* Weekly Rhythm Mini Habit Tracker */}
      <div className="pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between gap-1.5">
          {daysOfWeek.map((day, idx) => {
            const isDayToday = idx === todayDayIndex
            const isCompletedInStreak =
              isToday && idx <= todayDayIndex && todayDayIndex - idx < currentStreak

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] text-text-subtle font-semibold">{day}</span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isCompletedInStreak
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-subtle'
                      : isDayToday
                      ? 'bg-surface-elevated border border-cyan-500/40 text-cyan-400'
                      : 'bg-surface-elevated/40 border border-border-subtle text-text-subtle'
                  }`}
                >
                  {isCompletedInStreak ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>•</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Personal Record */}
      <div className="p-2.5 rounded-xl glass-subtle flex items-center justify-between text-xs border border-border-subtle">
        <span className="text-text-muted flex items-center gap-2 text-xs font-medium">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Record personal</span>
        </span>
        <span className="font-bold text-text text-xs">
          {longestStreak} {longestStreak === 1 ? 'zi' : 'zile'}
        </span>
      </div>
    </div>
  )
}

export default StreakCard
