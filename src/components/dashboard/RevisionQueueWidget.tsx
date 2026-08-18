import React from 'react'
import { Calendar, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react'

export interface RevisionTopicItem {
  chapterId: string
  chapterTitle: string
  subjectName: string
  masteryPercent: number
  isWeak: boolean
  nextReviewDue: string
}

export interface RevisionQueueWidgetProps {
  topics: RevisionTopicItem[]
  onStartRevision: (chapterId: string) => void
}

export const RevisionQueueWidget: React.FC<RevisionQueueWidgetProps> = ({
  topics,
  onStartRevision,
}) => {
  if (topics.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-text text-sm">Toate Subiectele sunt la Zi!</h4>
        <p className="text-xs text-text-muted">Nu ai capitole scadente la recapitulare sau cu punctaj sub 70%.</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-text text-base">Coadă Personalizată de Recapitulare</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
          {topics.length} Capitole Recomandate
        </span>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.chapterId}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              topic.isWeak
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-surface-elevated border-border'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {topic.isWeak && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-black font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Capitol Slab (&lt;70%)
                  </span>
                )}
                <span className="text-xs text-text-muted font-semibold">{topic.subjectName}</span>
              </div>
              <h4 className="text-sm font-bold text-text">{topic.chapterTitle}</h4>
              <p className="text-[11px] text-text-muted">
                Stăpânire Barem: <strong className="text-text">{topic.masteryPercent}%</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartRevision(topic.chapterId)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 self-end sm:self-auto cursor-pointer shadow-subtle"
            >
              <span>Recapitulare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
