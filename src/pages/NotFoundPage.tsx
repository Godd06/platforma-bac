import React from 'react'
import { Link } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-4">
      <h2 className="text-4xl font-bold text-accent">404</h2>
      <p className="text-text-muted">Pagina căutată nu a fost găsită.</p>
      <Link
        to="/"
        className="inline-block px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-sm font-medium transition-colors"
      >
        Înapoi la prima pagină
      </Link>
    </div>
  )
}
