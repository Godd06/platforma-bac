import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, RotateCcw, VolumeX, Sparkles } from 'lucide-react'

interface LessonAudioBarProps {
  title: string
  audioUrl?: string | null
  durationMinutes?: number | null
}

export const LessonAudioBar: React.FC<LessonAudioBarProps> = ({
  title,
  audioUrl,
  durationMinutes = 8,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1)
  const [progressSeconds, setProgressSeconds] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const totalSeconds = (durationMinutes || 8) * 60

  // Real Audio element listener or simulated playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.playbackRate = speed
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
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
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
    return () => clearInterval(interval)
  }, [isPlaying, speed, totalSeconds])

  // Sync speed changes with real audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [speed])

  // Handle seeking / sliding on range slider
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    setProgressSeconds(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const speeds = [0.75, 1, 1.25, 1.5, 2]
  const currentDuration = audioRef.current?.duration || totalSeconds
  const progressPercent = Math.min(100, (progressSeconds / currentDuration) * 100)

  return (
    <div className="p-4 rounded-2xl glass-elevated border border-border space-y-3 shadow-subtle no-print animate-fadeIn select-none">
      {/* Optional Real Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setProgressSeconds(audioRef.current.currentTime)
            }
          }}
          onEnded={() => {
            setIsPlaying(false)
            setProgressSeconds(0)
          }}
        />
      )}

      {/* Main Bar Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Audio Info & Play/Pause */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.35)] shrink-0 cursor-pointer"
            aria-label={isPlaying ? 'Pauză sinteză audio' : 'Redă sinteza audio'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sinteză Audio & Podcast
              </span>
              {isPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-1" />
                  <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-2" />
                  <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-3" />
                  <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-wave-4" />
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-text truncate">{title}</p>
          </div>
        </div>

        {/* Speed & Extra Actions */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-text-muted font-mono text-[11px] hidden sm:inline">
            {formatTime(progressSeconds)} / {formatTime(currentDuration)}
          </span>

          {/* Speed Selector */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-surface border border-border">
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-cyan-500 text-black shadow-subtle'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMuted(!isMuted)
              if (audioRef.current) audioRef.current.muted = !isMuted
            }}
            className="p-1.5 text-text-subtle hover:text-text rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Activează sunetul' : 'Dezactivează sunetul'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-status-danger" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          {progressSeconds > 0 && (
            <button
              type="button"
              onClick={() => {
                setProgressSeconds(0)
                if (audioRef.current) audioRef.current.currentTime = 0
              }}
              className="p-1.5 text-text-subtle hover:text-text rounded-lg transition-colors cursor-pointer"
              title="Reia de la început"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TIMELINE SLIDER (SLIDE ANYWHERE IN AUDIO) */}
      {/* ========================================================================= */}
      <div className="space-y-1 pt-1">
        <div className="relative flex items-center group">
          {/* Custom Track Background */}
          <div className="w-full h-2 rounded-full bg-surface-elevated border border-border overflow-hidden relative">
            <div
              className="h-full bg-cyan-400 transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Native Range Input over Custom Track */}
          <input
            type="range"
            min={0}
            max={currentDuration || 100}
            step={0.1}
            value={progressSeconds}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            title="Trage slider-ul oriunde pentru a sări la minutul dorit"
          />
        </div>

        {/* Mobile Timestamp View */}
        <div className="flex items-center justify-between text-[10px] font-mono text-text-subtle px-0.5 sm:hidden">
          <span>{formatTime(progressSeconds)}</span>
          <span>{formatTime(currentDuration)}</span>
        </div>
      </div>
    </div>
  )
}

export default LessonAudioBar
