import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, ArrowLeft, ShieldCheck, Zap, BookOpen, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'
import { AnimatedBorderButton } from '@/components/ui/AnimatedBorderButton'

export const ProUpgradePage: React.FC = () => {
  const { isAuthenticated, isPro } = useAuth()

  const benefits = [
    'Acces complet la toate eseurile de 10 pentru proba de Limba Română (Subiectul III)',
    'Lecții sintetice și scheme cronologice complete pentru Istorie',
    'Sinteze audio narate clar pentru învățare și recapitulare oriunde',
    'Quiz-uri interactive și teste de autoevaluare cu feedback instant',
    'Actualizări continue conform baremelor oficiale de Bacalaureat 2025–2026',
    'Ghiduri de argumentare și analiză pe citate și scene-cheie',
  ]

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-5 animate-fadeIn">
      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isAuthenticated ? 'Înapoi la Dashboard' : 'Înapoi la Pagina Principală'}</span>
      </Link>

      <AnimatedBorderCard
        variant="pro"
        glow={true}
        innerClassName="glass-featured-pro p-6 sm:p-8 space-y-5 shadow-raised light-sweep-hover"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25">
            <Sparkles className="w-3 h-3" />
            <span>PACHETUL PRO</span>
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight">
            Pregătire Completă de Notă Maximă
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Elimină nesiguranța și învață după eseuri structurate și scheme clare, concepute special pentru a atinge punctajul maxim pe barem.
          </p>
        </div>

        {isPro && (
          <div className="p-3.5 rounded-lg bg-status-success/10 border border-status-success/30 flex items-center gap-2.5 text-status-success text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Ai deja acces complet PRO activ pe acest cont.</span>
          </div>
        )}

        <div className="space-y-2.5 pt-2 border-t border-border-subtle">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Tot ce primești cu accesul PRO:</span>
          </h3>
          <ul className="space-y-2">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-text">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2 h-2" />
                </div>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-border-subtle flex flex-col sm:flex-row items-center gap-3">
          <AnimatedBorderButton
            to="/catalog"
            variant="cyan"
            glow={true}
            className="w-full sm:flex-1"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorează Conținutul PRO în Catalog</span>
          </AnimatedBorderButton>
        </div>
      </AnimatedBorderCard>
    </div>
  )
}

export default ProUpgradePage
