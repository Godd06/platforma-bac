import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { SummaryBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'

interface Props {
  content: SummaryBlockContent
}

export const SummaryBlock: React.FC<Props> = ({ content }) => {
  const { title = 'Sinteză și idei principale', items, content: textContent } = content

  const copyText = `${title}\n${(items || []).map((i) => `• ${i}`).join('\n')}${
    textContent ? `\n${textContent}` : ''
  }`

  return (
    <div className="my-5 rounded-lg border border-status-success/25 bg-status-success/5 p-4 sm:p-5 space-y-2.5 max-w-prose">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-status-success">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <h4 className="font-display font-bold text-xs sm:text-sm text-text">
            {title}
          </h4>
        </div>
        <CopyButton text={copyText} />
      </div>

      {items && items.length > 0 && (
        <ul className="space-y-1.5 text-xs sm:text-sm text-text">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-1.5 shrink-0" />
              <span className="leading-relaxed text-text-muted">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {textContent && (
        <p className="text-xs sm:text-sm leading-relaxed text-text-muted whitespace-pre-line">
          {textContent}
        </p>
      )}
    </div>
  )
}
