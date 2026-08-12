import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { ImageBlockContent } from '@/types/blocks'

interface Props {
  content: ImageBlockContent
}

export const ImageBlock: React.FC<Props> = ({ content }) => {
  const { url, alt = 'Imagine lecție', caption } = content
  const [hasError, setHasError] = useState(false)

  if (!url || hasError) {
    return (
      <div className="my-4 flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-surface text-text-muted text-center space-y-2">
        <ImageOff className="w-8 h-8 opacity-50" />
        <p className="text-xs">{alt || 'Imaginea nu a putut fi încărcată.'}</p>
      </div>
    )
  }

  return (
    <figure className="my-6 space-y-2">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <img
          src={url}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-auto max-h-[500px] object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-xs text-text-muted italic px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
