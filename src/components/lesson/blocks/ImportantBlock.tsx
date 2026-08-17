import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ImportantBlockContent } from '@/types/blocks'
import { CopyButton } from '@/components/ui/CopyButton'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

interface Props {
  content: ImportantBlockContent
}

export const ImportantBlock: React.FC<Props> = ({ content }) => {
  const contentRecord = content as unknown as Record<string, unknown>
  const title = content.title || 'Atenție la Barem'
  const textVal =
    content.text ||
    contentRecord.message ||
    contentRecord.html ||
    ''

  const isHtml = typeof textVal === 'string' && (textVal.includes('<p>') || textVal.includes('<strong>') || textVal.includes('<mark>'))

  return (
    <div className="my-5 rounded-2xl border border-amber-500/30 border-l-4 border-l-amber-600 dark:border-l-amber-400 bg-amber-500/5 dark:bg-amber-500/10 p-4 sm:p-5 space-y-2 max-w-prose shadow-subtle animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <h4 className="font-display font-bold text-sm text-amber-900 dark:text-amber-300">
            {String(title)}
          </h4>
        </div>
        <CopyButton text={`${title}: ${textVal}`} />
      </div>

      {isHtml ? (
        <div
          className="text-xs sm:text-sm leading-relaxed text-text/90 [&_strong]:font-bold"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(textVal)) }}
        />
      ) : (
        <p className="text-xs sm:text-sm leading-relaxed text-text/90 whitespace-pre-line">
          {String(textVal)}
        </p>
      )}
    </div>
  )
}

export default ImportantBlock
