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
        className="max-w-prose text-text/90 font-literary-serif leading-relaxed space-y-3.5 text-base sm:text-lg [&_p]:mb-3.5 [&_strong]:font-bold [&_strong]:text-text [&_em]:italic [&_em]:text-inherit [&_u]:underline [&_u]:underline-offset-2 [&_s]:line-through [&_s]:text-text-muted [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:bg-amber-500/5 dark:[&_blockquote]:bg-surface-elevated/60 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-text-muted [&_blockquote]:shadow-subtle [&_a]:text-amber-700 dark:[&_a]:text-amber-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-amber-600 dark:hover:[&_a]:text-amber-300 [&_a]:font-semibold"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  return (
    <div className="max-w-prose text-text/90 font-literary-serif leading-relaxed whitespace-pre-line text-base sm:text-lg">
      {text || ''}
    </div>
  )
}

export default RichTextBlock
