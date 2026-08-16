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
    <div className="my-6 rounded-3xl border border-cyan-500/30 bg-surface/80 p-5 sm:p-7 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-text truncate">{term}</h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {category && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {category}
            </span>
          )}
          <CopyButton text={copyText} />
        </div>
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-text">
        {definition}
      </p>
      {example && (
        <div className="pt-2 text-xs sm:text-sm text-text-muted border-t border-border/40 italic">
          <strong className="not-italic font-bold text-cyan-300">Exemplu: </strong>
          {example}
        </div>
      )}
    </div>
  )
}
