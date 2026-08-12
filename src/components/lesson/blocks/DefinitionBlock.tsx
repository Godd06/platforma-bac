import React from 'react'
import { BookOpen } from 'lucide-react'
import type { DefinitionBlockContent } from '@/types/blocks'

interface Props {
  content: DefinitionBlockContent
}

export const DefinitionBlock: React.FC<Props> = ({ content }) => {
  const { term, definition, category, example } = content

  return (
    <div className="my-5 rounded-xl border border-border bg-surface p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-bold text-text">{term}</h4>
        </div>
        {category && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {category}
          </span>
        )}
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-text">
        {definition}
      </p>
      {example && (
        <div className="pt-2 text-xs sm:text-sm text-text-muted border-t border-border/40 italic">
          <strong className="not-italic font-semibold text-text">Exemplu: </strong>
          {example}
        </div>
      )}
    </div>
  )
}
