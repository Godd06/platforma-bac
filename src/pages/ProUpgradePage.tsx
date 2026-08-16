import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, ArrowLeft, ShieldCheck, Zap, BookOpen } from 'lucide-react'

export const ProUpgradePage: React.FC = () => {
  const benefits = [
    'Acces complet la toate eseurile de 10 pentru proba de Limba Română',
    'Lecții sintetice și scheme cronologice complete pentru Istorie',
    'Sinteze audio narate clar pentru învățare și recapitulare oriunde',
    'Quiz-uri interactive și teste de autoevaluare cu feedback instant',
    'Actualizări continue conform baremelor oficiale de Bacalaureat 2025-2026',
    'Ghiduri de argumentare și analiză pe citate și scene-cheie',
  ]

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fadeIn">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-muted hover:text-cyan-400 transition-colors min-h-[36px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Înapoi la Dashboard</span>
      </Link>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-cyan-950/20 shadow-2xl space-y-7 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>PACHETUL PRO</span>
          </span>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-text tracking-tight">
            Pregătire Completă de Notă Maximă
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Elimină nesiguranța și învață după eseuri structurate și scheme clare, concepute special pentru a atinge punctajul maxim la examen.
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/60">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Tot ce primești cu accesul PRO:</span>
          </h3>
          <ul className="space-y-3">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-text">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/catalog"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[48px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorează Conținutul PRO în Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProUpgradePage
