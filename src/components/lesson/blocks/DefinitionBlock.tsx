import React from 'react'
import { BookOpen } from 'lucide-react'
import type { DefinitionBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'

interface Props {
  content: DefinitionBlockContent
}

export const DefinitionBlock: React.FC<Props> = ({ content }) => {
  const { term, definition, category, example } = content

  const copyText = `${term}: ${definition}${example ? `\nExemplu: ${example}` : ''}`

  return (
    <div className="my-5 rounded-lg border border-border border-l-2 border-l-cyan-400 bg-surface/80 p-4 space-y-2 max-w-prose">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <h4 className="font-display text-sm font-bold text-text truncate">
            {term}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {category && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-elevated text-cyan-400 border border-border-subtle">
              {category}
            </span>
          )}
          <CopyButton text={copyText} />
        </div>
      </div>
      <p className="text-xs sm:text-sm leading-relaxed text-text/90">
        {definition}
      </p>
      {example && (
        <div className="pt-1 text-xs text-text-muted border-t border-border-subtle italic">
          <strong className="not-italic font-semibold text-cyan-300">Exemplu: </strong>
          {example}
        </div>
      )}
    </div>
  )
}
