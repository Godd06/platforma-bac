import React from 'react'
import { LessonAudioBar } from '../LessonAudioBar'
import type { AudioBlockContent } from '@/types/blocks'

interface Props {
  content: AudioBlockContent
}

export const AudioBlock: React.FC<Props> = ({ content }) => {
  return (
    <div className="my-4 space-y-2">
      <LessonAudioBar
        title={content.title || 'Sinteză Audio Lecție'}
        audioUrl={content.url}
        durationMinutes={content.duration ? parseInt(content.duration, 10) || 5 : 5}
      />
      {content.transcript && (
        <details className="p-3.5 rounded-2xl bg-surface/80 border border-border text-xs text-text-muted space-y-2">
          <summary className="font-bold text-text cursor-pointer hover:text-amber-400 transition-colors select-none">
            📄 Vezi transcrierea completă audio
          </summary>
          <div className="pt-2 border-t border-border-subtle font-literary-serif leading-relaxed text-text">
            {content.transcript}
          </div>
        </details>
      )}
    </div>
  )
}
