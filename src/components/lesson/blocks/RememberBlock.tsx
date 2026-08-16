import React from 'react'
import { Lightbulb } from 'lucide-react'
import type { RememberBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'

interface Props {
  content: RememberBlockContent
}

export const RememberBlock: React.FC<Props> = ({ content }) => {
  const { title = 'De reținut', text } = content

  return (
    <div className="my-5 rounded-lg border border-cyan-500/25 border-l-2 border-l-cyan-400 bg-surface/70 p-4 text-text space-y-1.5 max-w-prose">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
          <h4 className="font-display font-bold text-xs sm:text-sm text-cyan-300">
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
