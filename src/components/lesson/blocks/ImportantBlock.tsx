import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ImportantBlockContent } from '@/types/blocks'

interface Props {
  content: ImportantBlockContent
}

export const ImportantBlock: React.FC<Props> = ({ content }) => {
  const { title = 'Important', text } = content

  return (
    <div className="my-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-base text-amber-950 dark:text-amber-100">
            {title}
          </h4>
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
