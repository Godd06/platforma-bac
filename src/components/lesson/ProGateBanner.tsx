import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'

interface Props {
  lessonTitle: string
}

export const ProGateBanner: React.FC<Props> = ({ lessonTitle }) => {
  return (
    <AnimatedBorderCard
      variant="pro"
      glow={true}
      className="max-w-prose mx-auto"
      innerClassName="glass-featured-pro p-6 sm:p-8 text-center space-y-5"
    >
      <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto">
        <Lock className="w-5 h-5" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
          <Sparkles className="w-3 h-3" />
          <span>Conținut Inclus în Pachetul PRO</span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-text tracking-tight">
          Lecția „{lessonTitle}” este rezervată membrilor PRO
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">
          Deblochează eseul redactat conform baremului oficial, analiza pe scene/citate și sintezele audio narate.
        </p>
      </div>

      <div className="p-3.5 rounded-xl glass-subtle text-left space-y-1.5 max-w-md mx-auto">
        <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider block mb-1">
          Ce include pachetul complet:
        </span>
        <div className="flex items-center gap-2 text-xs text-text">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Eseul model redactat la nivel de 10 pe barem</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Sinteza audio pentru recapitulare</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Grile și teste de autoevaluare</span>
        </div>
      </div>

      <div className="pt-1">
        <Link
          to="/pro"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-subtle min-h-[42px]"
        >
          <span>Deblochează accesul PRO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </AnimatedBorderCard>
  )
}
