import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react'

interface LessonAudioBarProps {
  title: string
  durationMinutes?: number | null
}

export const LessonAudioBar: React.FC<LessonAudioBarProps> = ({
  title,
  durationMinutes = 8,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1)
  const [progressSeconds, setProgressSeconds] = useState<number>(0)

  const totalSeconds = (durationMinutes || 8) * 60

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false)
            return 0
          }
          return prev + speed
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, speed, totalSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const speeds = [0.75, 1, 1.25, 1.5]

  return (
    <div className="p-4 rounded-2xl glass-elevated border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-subtle no-print animate-fadeIn">
      {/* Audio Playback Controls */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.35)] shrink-0"
          aria-label={isPlaying ? 'Pauză sinteză audio' : 'Redă sinteza audio'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              Sinteză Audio Explicativă
            </span>
            {isPlaying && (
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-1" />
                <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-2" />
                <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-3" />
                <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-4" />
                <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-5" />
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-text truncate max-w-xs">{title}</p>
        </div>
      </div>

      {/* Progress & Speed Selector */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs border-t sm:border-t-0 border-border-subtle pt-2 sm:pt-0">
        <span className="text-text-muted font-mono text-[11px]">
          {formatTime(progressSeconds)} / {formatTime(totalSeconds)}
        </span>

        {/* Speed selector tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-surface border border-border">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                speed === s
                  ? 'bg-cyan-500 text-black shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {progressSeconds > 0 && (
          <button
            type="button"
            onClick={() => setProgressSeconds(0)}
            className="p-1.5 text-text-subtle hover:text-text rounded-lg transition-colors"
            title="Reia de la început"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default LessonAudioBar
