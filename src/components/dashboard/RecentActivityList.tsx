import React from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Award,
  PlayCircle,
  Activity as ActivityIcon,
  Brain,
  BookOpen,
  Clock,
} from 'lucide-react'
import type { UserActivityItem } from '@/services/dashboardService'
import { formatRelativeTime } from '@/utils/formatDate'
import { EmptyState } from '@/components/ui/EmptyState'

interface RecentActivityListProps {
  activities: UserActivityItem[]
}

function getActivityConfig(activityType: string) {
  switch (activityType) {
    case 'lesson_completed':
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-status-success" />,
        badgeBg: 'bg-status-success/10 border-status-success/20 text-status-success',
        label: 'Lecție finalizată',
      }
    case 'quiz_completed':
      return {
        icon: <Award className="w-4 h-4 text-amber-400" />,
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        label: 'Quiz de verificare parcurs',
      }
    case 'lesson_started':
      return {
        icon: <PlayCircle className="w-4 h-4 text-cyan-400" />,
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        label: 'Lecție începută',
      }
    case 'lesson_progress':
      return {
        icon: <ActivityIcon className="w-4 h-4 text-cyan-400" />,
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        label: 'Progres lecție salvat',
      }
    case 'hidden_answer_revealed':
    case 'self_assessment':
      return {
        icon: <Brain className="w-4 h-4 text-purple-400" />,
        badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        label: 'Autoevaluare recapitulativă',
      }
    default:
      return {
        icon: <BookOpen className="w-4 h-4 text-text-muted" />,
        badgeBg: 'bg-surface-elevated border-border text-text-muted',
        label: 'Activitate de învățare',
      }
  }
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-surface/80 shadow-card space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text">Activitate Recentă</h3>
        </div>

        <span className="text-xs text-text-muted">
          Ultimele evenimente
        </span>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="Nicio activitate înregistrată"
          description="Activitățile tale recente vor apărea aici pe măsură ce înveți și parcurgi lecții."
          className="border-dashed bg-transparent p-6 min-h-[160px]"
        />
      ) : (
        <div className="space-y-2.5">
          {activities.map((item) => {
            const config = getActivityConfig(item.activityType)
            const timeAgo = formatRelativeTime(item.createdAt)

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/60 bg-surface-elevated/40 hover:bg-surface-elevated/80 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.badgeBg}`}
                  >
                    {config.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text truncate">
                      {config.label}
                    </p>
                    {item.lessonTitle ? (
                      item.lessonId ? (
                        <Link
                          to={`/lesson/${item.lessonId}`}
                          className="text-xs text-text-muted hover:text-cyan-400 truncate block transition-colors font-medium"
                        >
                          {item.lessonTitle}
                        </Link>
                      ) : (
                        <span className="text-xs text-text-muted truncate block font-medium">
                          {item.lessonTitle}
                        </span>
                      )
                    ) : null}
                  </div>
                </div>

                <span className="text-[11px] text-text-subtle font-semibold flex-shrink-0 whitespace-nowrap">
                  {timeAgo}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
