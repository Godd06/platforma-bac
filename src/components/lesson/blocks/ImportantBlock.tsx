import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ImportantBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'

interface Props {
  content: ImportantBlockContent
}

export const ImportantBlock: React.FC<Props> = ({ content }) => {
  const { title = 'Important', text } = content

  return (
    <div className="my-5 rounded-lg border border-amber-500/25 border-l-2 border-l-amber-400 bg-amber-500/5 p-4 space-y-1.5 max-w-prose">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="font-display font-bold text-xs sm:text-sm text-text">
            {title}
          </h4>
        </div>
        <CopyButton text={`${title}: ${text}`} />
      </div>
      <p className="text-xs sm:text-sm leading-relaxed text-text-muted">
        {text}
      </p>
    </div>
  )
}
