import React, { useState, useEffect } from 'react'
import { CheckSquare, Square, Award, Sparkles, RotateCcw } from 'lucide-react'

interface BaremCriterion {
  id: string
  label: string
  description: string
  points: number
}

interface LessonBaremChecklistProps {
  lessonId: string
  isHistory?: boolean
}

export const LessonBaremChecklist: React.FC<LessonBaremChecklistProps> = ({
  lessonId,
  isHistory = false,
}) => {
  const criteria: BaremCriterion[] = isHistory
    ? [
        {
          id: 'c1',
          label: 'Încadrarea în contextul istoric & epocă',
          description: 'Precizarea secolului, spațiului istoric și a cauzelor principale ale evenimentului.',
          points: 2,
        },
        {
          id: 'c2',
          label: 'Două relații cauză-efect & documente oficiale',
          description: 'Argumentarea cu noțiuni de specialitate și menționarea a cel puțin două documente sau tratate.',
          points: 4,
        },
        {
          id: 'c3',
          label: 'Consecințe pe termen lung & perspective istorice',
          description: 'Analiza impactului asupra societății românești sau relațiilor internaționale.',
          points: 2,
        },
        {
          id: 'c4',
          label: 'Limbaj istoric adecvat & coerența argumentării',
          description: 'Utilizarea termenilor consacrați, claritatea cronologică și structurarea pe paragrafe.',
          points: 2,
        },
      ]
    : [
        {
          id: 'c1',
          label: 'Încadrarea operei în curent literar / context',
          description: 'Numirea a două trăsături ale curentului și contextul apariției operei canonice.',
          points: 2,
        },
        {
          id: 'c2',
          label: 'Prezentarea temei prin 2 secvențe / scene-cheie',
          description: 'Ilustrarea viziunii despre lume prin comentarea detaliată a două episoade semnificative.',
          points: 4,
        },
        {
          id: 'c3',
          label: 'Două elemente de structură, compoziție & limbaj',
          description: 'Conflict, titlu, incipit/final, perspectivă narativă, relații temporale sau figuri de stil.',
          points: 2,
        },
        {
          id: 'c4',
          label: 'Concluzie nuanțată & respectarea normelor de redactare',
          description: 'Formularea unei opinii critice fundamentate, fluență și ortografie corectă.',
          points: 2,
        },
      ]

  const storageKey = `bac_barem_checklist_${lessonId}`

  // State to track checked criteria
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedIds))
    } catch (e) {
      console.error('[LessonBaremChecklist] Failed to save state:', e)
    }
  }, [checkedIds, storageKey])

  const toggleCriterion = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleReset = () => {
    setCheckedIds([])
  }

  // Calculate current score
  const totalScore = criteria.reduce(
    (acc, c) => (checkedIds.includes(c.id) ? acc + c.points : acc),
    0
  )

  const isFullScore = totalScore === 10

  return (
    <section className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle no-print">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shadow-subtle">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-text">
              Autoevaluare Interactivă pe Barem Oficial (10 Puncte)
            </h3>
            <p className="text-[11px] text-text-muted">
              Bifează criteriile pe care le stăpânești pentru a-ți evalua nivelul de pregătire.
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
              isFullScore
                ? 'bg-status-success/20 text-status-success border-status-success/40 shadow-[0_0_16px_rgba(34,197,94,0.30)]'
                : totalScore >= 6
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                : 'bg-surface text-text-muted border-border'
            }`}
          >
            Punctaj estimat: {totalScore} / 10 p
          </span>

          {checkedIds.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-text-subtle hover:text-text rounded-lg transition-colors"
              title="Resetează autoevaluarea"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {criteria.map((c) => {
          const isChecked = checkedIds.includes(c.id)
          return (
            <div
              key={c.id}
              onClick={() => toggleCriterion(c.id)}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 ${
                isChecked
                  ? 'bg-cyan-500/10 border-cyan-500/35 text-text shadow-subtle'
                  : 'bg-surface-elevated/40 border-border-subtle hover:bg-surface-elevated/80 text-text-muted'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-cyan-400 shrink-0 focus:outline-none"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 fill-cyan-500/20 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-text-subtle" />
                )}
              </button>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isChecked ? 'text-cyan-300' : 'text-text'}`}>
                    {c.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border text-cyan-400 shrink-0">
                    +{c.points}p
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{c.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 10/10 Success Message */}
      {isFullScore && (
        <div className="p-3 rounded-xl bg-status-success/10 border border-status-success/30 flex items-center gap-2 text-status-success text-xs font-semibold animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Felicitări! Ai asimilat toate cele 4 repere fundamentale pentru punctaj maxim pe barem.</span>
        </div>
      )}
    </section>
  )
}

export default LessonBaremChecklist
