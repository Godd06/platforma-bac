import React from 'react'
import { Video, Film } from 'lucide-react'
import type { VideoBlockContent } from '@/types/blocks'

interface Props {
  content: VideoBlockContent
}

export const VideoBlock: React.FC<Props> = ({ content }) => {
  const url = content?.url || ''
  const title = content?.title
  const caption = content?.caption

  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const getYouTubeEmbedUrl = (src: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = src.match(regExp)
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
      : src
  }

  if (!url) {
    return (
      <div className="p-4 rounded-2xl bg-surface border border-border text-xs text-text-muted flex items-center gap-2">
        <Video className="w-4 h-4 text-amber-400" />
        <span>Nicio sursă video configurată.</span>
      </div>
    )
  }

  return (
    <div className="space-y-2.5 my-4">
      {title && (
        <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider">
          <Film className="w-4 h-4 text-amber-400" />
          <span>{title}</span>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden glass-elevated border border-border shadow-2xl aspect-video bg-black/90 flex items-center justify-center">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(url)}
            title={title || 'Lecție Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
          />
        ) : (
          <video
            src={url}
            poster={content.poster}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {caption && (
        <p className="text-center text-xs text-text-muted font-literary-serif italic">
          {caption}
        </p>
      )}
    </div>
  )
}
