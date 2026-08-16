import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-5 px-4 animate-fadeIn">
      <div className="w-16 h-16 rounded-3xl bg-surface-elevated border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-4xl sm:text-5xl font-black text-text tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-text">Pagina nu a fost găsită</h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
      </div>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl text-sm transition-all shadow-glow min-h-[46px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Înapoi la prima pagină</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
