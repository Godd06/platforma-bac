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
    <div className="my-5 rounded-2xl border border-border border-l-4 border-l-cyan-600 dark:border-l-cyan-400 bg-cyan-500/5 dark:bg-surface/85 p-5 sm:p-6 space-y-3 max-w-prose shadow-subtle animate-fadeIn">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0" />
          <h4 className="font-display text-base font-bold text-text truncate">
            {term}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {category && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-elevated text-cyan-800 dark:text-cyan-300 border border-border">
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
        <div className="pt-2 text-xs sm:text-sm text-text-muted border-t border-border-subtle italic">
          <strong className="not-italic font-bold text-cyan-800 dark:text-cyan-300">Exemplu: </strong>
          {example}
        </div>
      )}
    </div>
  )
}

export default DefinitionBlock
