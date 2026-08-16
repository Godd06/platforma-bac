import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'

interface ProStatusCardProps {
  subscription: DashboardData['subscription']
}

export const ProStatusCard: React.FC<ProStatusCardProps> = ({ subscription }) => {
  if (subscription.isPro) {
    return (
      <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-surface shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-text">Abonament PRO Activ</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Nelimitat
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Ai acces complet la toate eseurile, sintezele și testele platformei.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="flex items-start gap-3.5 max-w-xl">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-text">Deblochează accesul complet PRO</h4>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Recomandat
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Accesează toate eseurile de 10 pentru Română, sintezele complete pentru Istorie și materialele audio fără limitări.
          </p>
        </div>
      </div>

      <Link
        to="/pro"
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow flex-shrink-0 min-h-[42px]"
      >
        <span>Vezi pachetul PRO</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
