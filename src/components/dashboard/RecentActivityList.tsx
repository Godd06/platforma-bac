import React from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Award,
  PlayCircle,
  Activity as ActivityIcon,
  Brain,
  BookOpen,
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
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />,
        badgeBg: 'bg-status-success/10 border-status-success/20 text-status-success',
        label: 'Lecție finalizată',
      }
    case 'quiz_completed':
      return {
        icon: <Award className="w-3.5 h-3.5 text-amber-400" />,
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        label: 'Quiz parcurs',
      }
    case 'lesson_started':
      return {
        icon: <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />,
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        label: 'Lecție începută',
      }
    case 'lesson_progress':
      return {
        icon: <ActivityIcon className="w-3.5 h-3.5 text-cyan-400" />,
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        label: 'Progres salvat',
      }
    case 'hidden_answer_revealed':
    case 'self_assessment':
      return {
        icon: <Brain className="w-3.5 h-3.5 text-purple-400" />,
        badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        label: 'Autoevaluare',
      }
    default:
      return {
        icon: <BookOpen className="w-3.5 h-3.5 text-text-muted" />,
        badgeBg: 'bg-surface-elevated border-border text-text-muted',
        label: 'Activitate',
      }
  }
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  return (
    <div className="p-5 rounded-xl glass-default space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-sm font-bold text-text">Activitate Recentă</h3>
        <span className="text-[11px] text-text-subtle font-medium">Ultimele acțiuni</span>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="Nicio activitate înregistrată"
          description="Activitățile tale recente vor apărea aici pe măsură ce parcurgi eseuri și lecții."
          className="border-dashed bg-transparent p-4 min-h-[120px]"
        />
      ) : (
        <div className="space-y-1.5">
          {activities.map((item) => {
            const config = getActivityConfig(item.activityType)
            const timeAgo = formatRelativeTime(item.createdAt)

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border-subtle glass-subtle hover:bg-surface-elevated/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${config.badgeBg}`}
                  >
                    {config.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text truncate">
                      {config.label}
                    </p>
                    {item.lessonTitle ? (
                      item.lessonId ? (
                        <Link
                          to={`/lesson/${item.lessonId}`}
                          className="text-[11px] text-text-muted hover:text-cyan-400 truncate block transition-colors"
                        >
                          {item.lessonTitle}
                        </Link>
                      ) : (
                        <span className="text-[11px] text-text-muted truncate block">
                          {item.lessonTitle}
                        </span>
                      )
                    ) : null}
                  </div>
                </div>

                <span className="text-[10px] text-text-subtle font-medium shrink-0 whitespace-nowrap">
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
