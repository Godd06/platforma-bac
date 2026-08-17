import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { ImageBlockContent } from '@/types/blocks'

interface Props {
  content: ImageBlockContent
}

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
  const contentRecord = content as unknown as Record<string, unknown>
  const urlVal = content.url || (contentRecord.src as string) || ''
  const altVal = content.alt || (contentRecord.caption as string) || 'Imagine eseu'
  const captionVal = content.caption || ''
  const [hasError, setHasError] = useState(false)

  const isUrlValid = isSafeImageUrl(urlVal)

  if (!urlVal || !isUrlValid || hasError) {
    return (
      <div className="my-5 flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border bg-surface text-text-muted text-center space-y-2 max-w-prose">
        <ImageOff className="w-8 h-8 opacity-40 text-text-subtle" />
        <p className="text-xs font-semibold text-text-muted">{altVal || 'Imaginea nu a putut fi încărcată.'}</p>
        <span className="text-[10px] text-text-subtle font-mono">{urlVal ? `URL: ${urlVal.substring(0, 40)}...` : 'Niciun URL specificat'}</span>
      </div>
    )
  }

  return (
    <figure className="my-6 space-y-2 max-w-prose animate-fadeIn">
      <div className="overflow-hidden rounded-2xl border border-border shadow-subtle bg-surface-elevated">
        <img
          src={urlVal}
          alt={altVal}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-auto max-h-[460px] object-cover transition-transform duration-300 hover:scale-[1.01]"
        />
      </div>
      {captionVal && (
        <figcaption className="text-center text-xs text-text-muted italic px-2 font-literary-serif">
          {captionVal}
        </figcaption>
      )}
    </figure>
  )
}
