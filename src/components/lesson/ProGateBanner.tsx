import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

interface Props {
  lessonTitle: string
}

export const ProGateBanner: React.FC<Props> = ({ lessonTitle }) => {
  return (
    <div className="my-8 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-surface p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Lecție Exclusivă PRO
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-text">
            Deblochează conținutul complet pentru „{lessonTitle}”
          </h3>
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-text-muted">
        Această lecție face parte din modulul PRO de pregătire intensivă pentru examenul de Bacalaureat.
        Abonează-te la planul PRO pentru a primi acces nelimitat la toate explicațiile, sintezele și eseurile structurate.
      </p>

      <div className="space-y-2 pt-2 border-t border-amber-500/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Ce include abonamentul PRO:
        </h4>
        <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-text">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Explicații aprofundate pe fiecare operă</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Sinteze și caracterizări de personaje</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Eseuri model conform baremului oficial</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Acces complet pe toate materiile</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 flex flex-wrap items-center gap-4">
        <Link
          to="/pro"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-sm text-sm"
        >
          <span>Treci la planul PRO</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/catalog"
          className="text-xs sm:text-sm font-medium text-text-muted hover:text-text underline"
        >
          Înapoi la Catalog
        </Link>
      </div>
    </div>
  )
}
