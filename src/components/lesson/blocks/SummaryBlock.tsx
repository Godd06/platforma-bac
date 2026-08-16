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
    <div className="my-6 rounded-3xl border border-status-success/30 bg-status-success/5 p-5 sm:p-7 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-status-success">
          <div className="p-2 rounded-xl bg-status-success/20 border border-status-success/30">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          </div>
          <h4 className="font-bold text-base sm:text-lg text-text">
            {title}
          </h4>
        </div>
        <CopyButton text={copyText} />
      </div>

      {items && items.length > 0 && (
        <ul className="space-y-2.5 text-sm sm:text-base text-text">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-status-success mt-2 shrink-0" />
              <span className="leading-relaxed text-text-muted">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {textContent && (
        <p className="text-sm sm:text-base leading-relaxed text-text-muted whitespace-pre-line">
          {textContent}
        </p>
      )}
    </div>
  )
}
