import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-4 px-4 animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-cyan-400">
        <FileQuestion className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold text-text tracking-tight">404</h1>
        <h2 className="text-base font-bold text-text">Pagina nu a fost găsită</h2>
        <p className="text-xs text-text-muted">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
      </div>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs sm:text-sm transition-all shadow-glow min-h-[42px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Înapoi la prima pagină</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
