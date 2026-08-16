import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Brain,
  Headphones,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      title: 'Eseuri Structurate de Nota 10',
      description:
        'Toate operele canonice pentru Limba Română analizate conform baremelor oficiale: temă, viziune, caracterizare și relații între personaje.',
      tag: 'Română',
    },
    {
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      title: 'Sinteze și Scheme Cronologice',
      description:
        'Capitolele de Istorie sintetizate pe cauză-efect, documente fundamentale și spațiul românesc în context european.',
      tag: 'Istorie',
    },
    {
      icon: <Headphones className="w-6 h-6 text-cyan-400" />,
      title: 'Sinteze Audio & Memorare',
      description:
        'Recapitulează oriunde prin sinteze audio narate clar și scheme vizuale ușor de reținut înainte de simulare.',
      tag: 'Audio',
    },
    {
      icon: <Award className="w-6 h-6 text-cyan-400" />,
      title: 'Progres Măsurabil & Streak',
      description:
        'Monitorizează în timp real capitolele parcurse, menține ritmul de învățare zilnic și identifică capitolele care necesită recapitulare.',
      tag: 'Progres',
    },
  ]

  const highlights = [
    'Conținut redactat și verificat conform programei oficiale 2025-2026',
    'Structură clară pentru fiecare subiect de examen',
    'Exerciții și autoevaluări de consolidare',
    'Platformă optimizată pentru telefon, tabletă și desktop',
  ]

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs sm:text-sm font-semibold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Pregătire Inteligentă pentru Bacalaureat</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text leading-[1.15]">
          Examenul de Bacalaureat <br className="hidden sm:inline" />
          învățat <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">simplu, structurat și eficient</span>.
        </h1>

        <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Eseuri complete, scheme logice pentru Istorie, sinteze audio și monitorizare a progresului.
          Tot ce ai nevoie pentru nota dorită, într-un singur loc.
        </p>

        {/* Hero CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[48px]"
          >
            <span>Începe pregătirea gratuit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-border bg-surface/80 text-text hover:bg-surface-elevated hover:border-cyan-500/40 active:scale-[0.98] transition-all text-sm font-semibold min-h-[48px]"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Explorează Catalogul</span>
          </Link>
        </div>

        {/* Fast Trust Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Fără reclame</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Acces instant gratuit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Actualizat conform baremelor</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Tot ce ai nevoie pentru o pregătire de 10
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Creat special pentru a elimina stresul memorării dezorganizate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl border border-border/80 bg-surface/70 hover:bg-surface hover:border-cyan-500/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-elevated text-cyan-400 border border-border">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Value & PRO Preview Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="ambient-glow-cyan top-[-30%] right-[-10%] opacity-30" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pachetul PRO de Excelență</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                Deblochează accesul complet la toate operele și eseurile
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Treci la nivelul următor cu schemele sintetice, eseurile complete de tip rezolvare model și sintezele audio pentru memorare rapidă.
              </p>

              <ul className="space-y-2.5 pt-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-text">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  to="/pro"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[44px]"
                >
                  <span>Vezi beneficiile PRO</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/80 p-6 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Exemplu Progres de Studiu
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5" />
                  <span>5 zile streak</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-text">Limba și Literatura Română</span>
                    <span className="text-cyan-400">75%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-3/4 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-text">Istoria Românilor</span>
                    <span className="text-cyan-400">40%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-2/5 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Recomandat: 2 eseuri / săptămână pentru asimilare optimă.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center max-w-2xl mx-auto px-4 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
          Gata să începi pregătirea eficientă?
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Creează un cont gratuit în câteva secunde și explorează structura completă a examenului.
        </p>
        <div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow min-h-[48px]"
          >
            <span>Creează cont gratuit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
