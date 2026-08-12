import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { SummaryBlockContent } from '@/types/blocks'

interface Props {
  content: SummaryBlockContent
}

export const SummaryBlock: React.FC<Props> = ({ content }) => {
  const { title = 'Sinteză și idei principale', items, content: textContent } = content

  return (
    <div className="my-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
      <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <h4 className="font-bold text-base sm:text-lg text-emerald-950 dark:text-emerald-100">
          {title}
        </h4>
      </div>

      {items && items.length > 0 && (
        <ul className="space-y-2 text-sm text-text">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {textContent && (
        <p className="text-sm leading-relaxed text-text whitespace-pre-line">
          {textContent}
        </p>
      )}
    </div>
  )
}
