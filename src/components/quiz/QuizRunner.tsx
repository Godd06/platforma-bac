import React, { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import type { QuizQuestion, ConfidenceLevel } from '@/types/database'
import { evaluateAnswer, calculateNextReviewDate, evaluateWeakTopicStatus } from '@/services/quizService'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

export interface QuizRunnerProps {
  quizTitle: string
  questions: QuizQuestion[]
  onComplete: (summary: { scorePercent: number; isWeakTopic: boolean; nextReviewDue: Date }) => void
  onCancel?: () => void
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quizTitle,
  questions,
  onComplete,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, Record<string, unknown>>>({})
  const [confidenceLevels, setConfidenceLevels] = useState<Record<string, ConfidenceLevel>>({})
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<Record<string, boolean>>({})
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = questions[currentIndex]

  // Keyboard shortcut handler (1-4 for options, Space for submit, Enter for next)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinished || !currentQuestion) return

      const qId = currentQuestion.id
      const isEvaluated = Boolean(evaluatedQuestions[qId])

      if (isEvaluated && e.key === 'Enter') {
        e.preventDefault()
        handleNextQuestion()
        return
      }

      if (!isEvaluated && currentQuestion.question_type === 'single_choice') {
        const options = (currentQuestion.options?.choices as Array<{ id: string; text: string }>) || []
        const num = parseInt(e.key, 10)
        if (!isNaN(num) && num >= 1 && num <= options.length) {
          e.preventDefault()
          const selected = options[num - 1]
          setUserAnswers((prev) => ({ ...prev, [qId]: { optionId: selected.id } }))
        }
      }
    },
    [currentIndex, currentQuestion, evaluatedQuestions, isFinished]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!currentQuestion && !isFinished) {
    return (
      <div className="p-6 text-center text-text-muted">
        <p className="text-sm font-bold">Nicio întrebare disponibilă în acest test.</p>
      </div>
    )
  }

  const qId = currentQuestion?.id
  const isCurrentEvaluated = Boolean(evaluatedQuestions[qId])
  const currentAnswer = userAnswers[qId] || {}

  const handleSelectOption = (optionId: string) => {
    if (isCurrentEvaluated) return
    setUserAnswers((prev) => ({ ...prev, [qId]: { optionId } }))
  }

  const handleEvaluateCurrent = (confidence: ConfidenceLevel) => {
    if (isCurrentEvaluated) return
    setConfidenceLevels((prev) => ({ ...prev, [qId]: confidence }))
    setEvaluatedQuestions((prev) => ({ ...prev, [qId]: true }))
  }

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Calculate final score
      let totalPoints = 0
      let maxPoints = 0

      for (const q of questions) {
        const ans = userAnswers[q.id] || {}
        const res = evaluateAnswer(q, ans)
        totalPoints += res.pointsAwarded
        maxPoints += q.points || 1.0
      }

      const hasLowConfidence = Object.values(confidenceLevels).includes('low')
      const overallConfidence: ConfidenceLevel = hasLowConfidence ? 'low' : 'high'

      const scorePercent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
      const isWeak = evaluateWeakTopicStatus(scorePercent)
      const nextDue = calculateNextReviewDate(scorePercent >= 70, overallConfidence)

      setIsFinished(true)
      onComplete({ scorePercent, isWeakTopic: isWeak, nextReviewDue: nextDue })
    }
  }

  // Render Finished Summary Screen
  if (isFinished) {
    let totalPoints = 0
    let maxPoints = 0
    for (const q of questions) {
      const ans = userAnswers[q.id] || {}
      const res = evaluateAnswer(q, ans)
      totalPoints += res.pointsAwarded
      maxPoints += q.points || 1.0
    }
    const hasLowConfidence = Object.values(confidenceLevels).includes('low')
    const overallConfidence: ConfidenceLevel = hasLowConfidence ? 'low' : 'high'
    const scorePercent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
    const isWeak = evaluateWeakTopicStatus(scorePercent)
    const nextDue = calculateNextReviewDate(scorePercent >= 70, overallConfidence)

    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-2xl animate-fadeIn text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text">Test Finalizat cu Succes!</h2>
          <p className="text-sm text-text-muted">{quizTitle}</p>
        </div>

        {/* Score Radial Box */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border max-w-sm mx-auto space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Punctaj Obținut</p>
          <p className={`text-4xl font-extrabold ${scorePercent >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {scorePercent}%
          </p>
          <p className="text-xs text-text-muted">
            {totalPoints.toFixed(1)} din {maxPoints.toFixed(1)} puncte totale
          </p>
        </div>

        {/* Spaced Repetition Indicator */}
        <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-border max-w-sm mx-auto text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-1.5 font-semibold">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Programare Recapitulare:
            </span>
            <span className="font-bold text-cyan-400">{nextDue.toLocaleDateString('ro-RO')}</span>
          </div>

          {isWeak ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-left flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Punctajul este sub 70%. Acest capitol a fost adăugat în coada ta de recapitulare recomandată!</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-left flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Excelent! Ai stăpânire bună pe acest subiect. Următoarea revizuire este programată peste 6 zile.</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-text hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Înapoi la Catalog
            </button>
          )}
        </div>
      </div>
    )
  }

  const choices = (currentQuestion.options?.choices as Array<{ id: string; text: string }>) || []
  const evalRes = isCurrentEvaluated ? evaluateAnswer(currentQuestion, currentAnswer) : null

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-2xl animate-fadeIn">
      {/* Header & Progress Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{quizTitle}</span>
          <h3 className="text-lg font-bold text-text">
            Întrebarea {currentIndex + 1} din {questions.length}
          </h3>
        </div>
        <span className="px-3 py-1 rounded-xl bg-surface-elevated border border-border text-xs font-mono font-bold text-text">
          {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </span>
      </div>

      {/* Question Prompt */}
      <div className="space-y-4">
        <p className="text-base sm:text-lg font-bold text-text leading-relaxed">{currentQuestion.prompt}</p>

        {/* Single Choice Options */}
        {currentQuestion.question_type === 'single_choice' && (
          <div className="space-y-2.5">
            {choices.map((choice, idx) => {
              const isSelected = currentAnswer.optionId === choice.id
              let borderStyle = 'border-border bg-surface-elevated hover:border-amber-500/50'

              if (isCurrentEvaluated) {
                const correctOpt = currentQuestion.correct_answer?.optionId
                if (choice.id === correctOpt) {
                  borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                } else if (isSelected) {
                  borderStyle = 'border-rose-500 bg-rose-500/10 text-rose-400'
                }
              } else if (isSelected) {
                borderStyle = 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
              }

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectOption(choice.id)}
                  disabled={isCurrentEvaluated}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${borderStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono text-xs text-text-muted">
                      {idx + 1}
                    </span>
                    <span>{choice.text}</span>
                  </div>
                  {isCurrentEvaluated && choice.id === currentQuestion.correct_answer?.optionId && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {isCurrentEvaluated && isSelected && choice.id !== currentQuestion.correct_answer?.optionId && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Confidence Picker & Submit Button */}
      {!isCurrentEvaluated && (
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface-elevated border border-border">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Cât de sigur ești pe răspuns?
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleEvaluateCurrent('high')}
                disabled={!currentAnswer.optionId}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 hover:bg-emerald-500 hover:text-black disabled:opacity-40 transition-colors cursor-pointer"
              >
                🟢 Sigur
              </button>

              <button
                type="button"
                onClick={() => handleEvaluateCurrent('low')}
                disabled={!currentAnswer.optionId}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 hover:bg-amber-500 hover:text-black disabled:opacity-40 transition-colors cursor-pointer"
              >
                🟡 Incert / Am ghicit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bareme Explanation Box */}
      {isCurrentEvaluated && evalRes && (
        <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Explicația Baremului Oficial:
            </span>
            <span className={`font-bold ${evalRes.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {evalRes.isCorrect ? ' Corect (+1 pt)' : ' Incorect (0 pt)'}
            </span>
          </div>

          <div
            className="text-text-muted leading-relaxed prose prose-invert max-w-none text-xs"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(evalRes.explanationHtml) }}
          />

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-2 cursor-pointer shadow-subtle"
            >
              <span>{currentIndex + 1 === questions.length ? 'Vezi Rezultatul Final' : 'Următoarea Întrebare'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
