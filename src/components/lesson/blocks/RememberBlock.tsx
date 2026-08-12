import React from 'react'
import { Lightbulb } from 'lucide-react'
import type { RememberBlockContent } from '@/types/blocks'

interface Props {
  content: RememberBlockContent
}

export const RememberBlock: React.FC<Props> = ({ content }) => {
  const { title = 'De reținut', text } = content

  return (
    <div className="my-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 sm:p-5 text-indigo-950 dark:text-indigo-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-base text-indigo-950 dark:text-indigo-100">
            {title}
          </h4>
          <p className="text-sm leading-relaxed text-indigo-900/90 dark:text-indigo-200/90">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
