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
        className="prose prose-invert max-w-prose text-text/90 leading-relaxed space-y-3.5 text-sm sm:text-base [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-text [&_em]:italic [&_em]:text-cyan-300 [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-400/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-muted"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  return (
    <div className="max-w-prose text-text/90 leading-relaxed whitespace-pre-line text-sm sm:text-base">
      {text || ''}
    </div>
  )
}
