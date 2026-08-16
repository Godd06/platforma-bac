import React from 'react'
import { Link } from 'react-router-dom'
import { User, Sparkles, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'

interface DashboardHeaderProps {
  profile: DashboardData['profile']
  subscription: DashboardData['subscription']
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  subscription,
}) => {
  const displayName = profile.displayName || 'Elev'
  const isPro = subscription.isPro

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-subtle">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase() || <User className="w-5 h-5" />
            )}
          </div>
          {isPro && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-sm"
              title="Membru PRO"
            >
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight">
            Salut, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Panoul tău de pregătire pentru Bacalaureat
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isPro ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-subtle">
            <ShieldCheck className="w-4 h-4" />
            <span>PRO Activ</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface text-text-muted border border-border">
            <span>Cont Gratuit</span>
          </span>
        )}

        {/* Direct Path to Catalog */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs sm:text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(6,182,212,0.30)] min-h-[40px]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Catalog Materii</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default DashboardHeader
