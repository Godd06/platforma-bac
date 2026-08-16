import React from 'react'
import { Sparkles, User as UserIcon } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'
import { useAuth } from '@/hooks/useAuth'

interface DashboardHeaderProps {
  profile: DashboardData['profile']
  subscription: DashboardData['subscription']
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  subscription,
}) => {
  const { user } = useAuth()

  // Calculate friendly display name
  const displayName =
    profile.displayName ||
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Elev')

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
      <div className="flex items-center gap-3.5 sm:gap-4">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            {initial || <UserIcon className="w-6 h-6" />}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              Salut, {displayName}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Continuă pregătirea pentru Bacalaureat. Fiecare sesiune de studiu contează!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        {subscription.isPro ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membru PRO Activ</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-elevated text-text-muted border border-border">
            <span>Plan Gratuit</span>
          </span>
        )}
      </div>
    </div>
  )
}
