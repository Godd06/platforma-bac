import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

interface Props {
  lessonTitle: string
}

export const ProGateBanner: React.FC<Props> = ({ lessonTitle }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-surface p-6 sm:p-10 shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.25)]">
        <Lock className="w-8 h-8" />
      </div>

      <div className="max-w-lg mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Conținut Exclusiv PRO</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight">
          Lecția „{lessonTitle}” face parte din pachetul PRO
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Deblochează eseul complet, analiza aprofundată pe scene și citate, schemele de memorare și materialele audio pentru această operă.
        </p>
      </div>

      <div className="max-w-md mx-auto p-4 rounded-2xl bg-surface-elevated/70 border border-border/80 text-left space-y-2">
        <span className="text-xs font-bold text-text uppercase tracking-wider block mb-2">
          Ce include pachetul complet:
        </span>
        <div className="flex items-center gap-2.5 text-xs text-text">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Eseul model redactat la nivel de 10 pe barem</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Sinteza audio pentru învățare oriunde</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Quiz-uri interactive de verificare rapidă</span>
        </div>
      </div>

      <div className="pt-2">
        <Link
          to="/pro"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[48px]"
        >
          <span>Deblochează accesul PRO</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
