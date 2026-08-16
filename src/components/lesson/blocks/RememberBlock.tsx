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
    <div className="my-6 rounded-3xl border border-cyan-500/30 bg-cyan-950/20 p-5 sm:p-7 text-text shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base sm:text-lg text-cyan-300">
            {title}
          </h4>
        </div>
        <CopyButton text={`${title}: ${text}`} />
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-text-muted">
        {text}
      </p>
    </div>
  )
}
