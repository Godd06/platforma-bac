import React from 'react'
import { Quote, BookOpen } from 'lucide-react'
import type { QuoteBlockContent } from '@/types/blocks'

interface Props {
  content: QuoteBlockContent
}

export const QuoteBlock: React.FC<Props> = ({ content }) => {
  const quote = content.quote || ''
  const author = content.author
  const work = content.work
  const commentary = content.commentary

  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-featured-pro bg-surface/90 border-l-4 border-amber-500 my-5 shadow-subtle space-y-3 relative overflow-hidden animate-fadeIn">
      <Quote className="w-8 h-8 text-amber-500/20 absolute top-3 right-4 pointer-events-none" />

      <blockquote className="text-sm sm:text-base font-literary-serif italic text-text leading-relaxed">
        „{quote}”
      </blockquote>

      {(author || work) && (
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>
            {author && <span>{author}</span>}
            {author && work && <span> — </span>}
            {work && <span className="italic">{work}</span>}
          </span>
        </div>
      )}

      {commentary && (
        <div className="pt-2 border-t border-border-subtle text-xs text-text-muted font-literary-serif">
          <strong className="text-text">Comentariu stilistic:</strong> {commentary}
        </div>
      )}
    </div>
  )
}
