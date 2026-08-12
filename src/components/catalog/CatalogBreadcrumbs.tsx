import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'

interface Props {
  subjectName?: string
}

export const CatalogBreadcrumbs: React.FC<Props> = ({ subjectName }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
      <button
        onClick={() => navigate('/catalog')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Înapoi la Catalog
      </button>

      <nav className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link to="/catalog" className="hover:underline hover:text-text">
          Catalog
        </Link>

        {subjectName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
            <span className="font-semibold text-text">{subjectName}</span>
          </>
        )}
      </nav>
    </div>
  )
}
