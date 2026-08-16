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
    <div className="my-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-7 text-amber-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base sm:text-lg text-amber-200">
            {title}
          </h4>
        </div>
        <CopyButton text={`${title}: ${text}`} />
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-amber-100/90">
        {text}
      </p>
    </div>
  )
}
