import React, { useMemo } from 'react'
import type { RichTextBlockContent } from '@/types/blocks'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

interface Props {
  content: RichTextBlockContent
}

export const RichTextBlock: React.FC<Props> = ({ content }) => {
  const { html, text } = content

  const sanitizedContent = useMemo(() => {
    if (html) {
      return sanitizeHtml(html)
    }
    return null
  }, [html])

  if (sanitizedContent) {
    return (
      <div
        className="prose prose-slate max-w-none text-text leading-relaxed space-y-3 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-text [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  return (
    <div className="text-text leading-relaxed whitespace-pre-line">
      {text || ''}
    </div>
  )
}
