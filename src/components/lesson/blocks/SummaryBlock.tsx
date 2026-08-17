import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { SummaryBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'

interface Props {
  content: SummaryBlockContent
}

export const SummaryBlock: React.FC<Props> = ({ content }) => {
  const title = content.title || 'Sinteză și idei principale'
  const items: string[] =
    content.items ||
    (content as Record<string, unknown>).points as string[] ||
    []
  const textContent = content.content || (content as Record<string, unknown>).text as string || ''

  const copyText = `${title}\n${items.map((i) => `• ${i}`).join('\n')}${
    textContent ? `\n${textContent}` : ''
  }`

  return (
    <div className="my-5 rounded-2xl border border-emerald-500/30 border-l-4 border-l-emerald-600 dark:border-l-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 sm:p-6 space-y-3 max-w-prose shadow-subtle animate-fadeIn">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-display font-bold text-sm text-emerald-950 dark:text-emerald-200">
            {String(title)}
          </h4>
        </div>
        <CopyButton text={copyText} />
      </div>

      {items && items.length > 0 && (
        <ul className="space-y-2 text-xs sm:text-sm text-text">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed text-text/90">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {textContent && (
        <p className="text-xs sm:text-sm leading-relaxed text-text-muted whitespace-pre-line pt-1">
          {textContent}
        </p>
      )}
    </div>
  )
}

export default SummaryBlock
