import React from 'react'
import { Lightbulb } from 'lucide-react'
import type { RememberBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

interface Props {
  content: RememberBlockContent
}

export const RememberBlock: React.FC<Props> = ({ content }) => {
  const contentRecord = content as unknown as Record<string, unknown>
  const title = content.title || 'De reținut'
  const textVal =
    content.text ||
    contentRecord.message ||
    contentRecord.html ||
    contentRecord.quote ||
    ''

  const isHtml = typeof textVal === 'string' && (textVal.includes('<p>') || textVal.includes('<strong>') || textVal.includes('<mark>'))

  return (
    <div className="my-5 rounded-2xl border border-cyan-500/30 border-l-4 border-l-cyan-600 dark:border-l-cyan-400 bg-cyan-500/5 dark:bg-cyan-500/10 p-4 sm:p-5 text-text space-y-2 max-w-prose shadow-subtle animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0" />
          <h4 className="font-display font-bold text-sm text-cyan-900 dark:text-cyan-300">
            {String(title)}
          </h4>
        </div>
        <CopyButton text={`${title}: ${textVal}`} />
      </div>

      {isHtml ? (
        <div
          className="text-xs sm:text-sm leading-relaxed text-text/90 italic [&_strong]:font-bold"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(textVal)) }}
        />
      ) : (
        <p className="text-xs sm:text-sm leading-relaxed text-text/90 whitespace-pre-line italic">
          {String(textVal)}
        </p>
      )}
    </div>
  )
}

export default RememberBlock
