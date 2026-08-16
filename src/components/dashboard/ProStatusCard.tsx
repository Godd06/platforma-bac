import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import type { DashboardData } from '@/services/dashboardService'
import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'

interface ProStatusCardProps {
  subscription: DashboardData['subscription']
}

export const ProStatusCard: React.FC<ProStatusCardProps> = ({ subscription }) => {
  if (subscription.isPro) {
    return (
      <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-text">Abonament PRO Activ</h4>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                Nelimitat
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Acces complet la toate eseurile, schemele și testele platformei.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatedBorderCard
      variant="pro"
      glow={true}
      innerClassName="glass-featured-pro p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-start gap-2.5 max-w-xl">
        <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-xs sm:text-sm font-bold text-text">Deblochează accesul complet PRO</h4>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25 uppercase tracking-wider">
              Recomandat
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Accesează toate eseurile de 10 pentru Română, sintezele complete pentru Istorie și materialele audio.
          </p>
        </div>
      </div>

      <Link
        to="/pro"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 active:scale-[0.98] transition-all shadow-subtle shrink-0 min-h-[36px]"
      >
        <span>Pachetul PRO</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </AnimatedBorderCard>
  )
}

export default ProStatusCard
