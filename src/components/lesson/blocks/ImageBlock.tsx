import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { ImageBlockContent } from '@/types/blocks'

interface Props {
  content: ImageBlockContent
}

/**
 * Validates image URLs to prevent malicious scheme injection (javascript:, data:, vbscript:, //).
 * Allows HTTPS, HTTP, and safe relative paths.
 */
function isSafeImageUrl(rawUrl: unknown): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  const trimmed = rawUrl.trim()
  if (!trimmed) return false

  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    trimmed.startsWith('//')
  ) {
    return false
  }

  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true
  }

  try {
    const parsed = new URL(trimmed)
    return ['https:', 'http:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export const ImageBlock: React.FC<Props> = ({ content }) => {
  const { url, alt = 'Imagine lecție', caption } = content
  const [hasError, setHasError] = useState(false)

  const isUrlValid = isSafeImageUrl(url)

  if (!url || !isUrlValid || hasError) {
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
