import { supabase } from '../lib/supabase'
import type {
  QuizQuestion,
  ConfidenceLevel,
} from '@/types/database'

export interface EvaluationResult {
  isCorrect: boolean
  pointsAwarded: number
  explanationHtml: string
}

/**
 * Evaluates student's answer for all 6 Baccalaureate question types.
 */
export function evaluateAnswer(
  question: QuizQuestion,
  userAnswer: Record<string, unknown>
): EvaluationResult {
  const maxPoints = question.points || 1.0
  const explanation = question.explanation_html || 'Explicația baremului nu este disponibilă.'

  switch (question.question_type) {
    case 'single_choice': {
      const selectedOptionId = String(userAnswer.optionId || '').trim()
      const correctOptionId = String(question.correct_answer?.optionId || '').trim()
      const isCorrect = selectedOptionId.length > 0 && selectedOptionId === correctOptionId
      return {
        isCorrect,
        pointsAwarded: isCorrect ? maxPoints : 0,
        explanationHtml: explanation,
      }
    }

    case 'multiple_choice': {
      const selected = (userAnswer.selectedOptionIds as string[]) || []
      const correct = (question.correct_answer?.selectedOptionIds as string[]) || []
      const isCorrect =
        selected.length === correct.length &&
        selected.every((id) => correct.includes(id)) &&
        correct.every((id) => selected.includes(id))

      return {
        isCorrect,
        pointsAwarded: isCorrect ? maxPoints : 0,
        explanationHtml: explanation,
      }
    }

    case 'true_false_justified': {
      const chosenBool = Boolean(userAnswer.value)
      const correctBool = Boolean(question.correct_answer?.value)
      const isCorrect = chosenBool === correctBool
      return {
        isCorrect,
        pointsAwarded: isCorrect ? maxPoints : 0,
        explanationHtml: explanation,
      }
    }

    case 'text_matching': {
      const userPairs = (userAnswer.pairs as Record<string, string>) || {}
      const correctPairs = (question.correct_answer?.pairs as Record<string, string>) || {}

      const keys = Object.keys(correctPairs)
      if (keys.length === 0) return { isCorrect: false, pointsAwarded: 0, explanationHtml: explanation }

      let matchCount = 0
      for (const k of keys) {
        if (userPairs[k] && userPairs[k].trim() === correctPairs[k].trim()) {
          matchCount++
        }
      }

      const isCorrect = matchCount === keys.length
      const fraction = matchCount / keys.length
      return {
        isCorrect,
        pointsAwarded: parseFloat((maxPoints * fraction).toFixed(2)),
        explanationHtml: explanation,
      }
    }

    case 'fill_in_blank': {
      const userText = String(userAnswer.text || '').toLowerCase().trim()
      const correctText = String(question.correct_answer?.text || '').toLowerCase().trim()
      const allowedSynonyms = (question.correct_answer?.synonyms as string[]) || []

      const cleanUser = userText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const cleanCorrect = correctText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

      const isExact = cleanUser === cleanCorrect
      const isSynonym = allowedSynonyms.some(
        (s) => s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === cleanUser
      )

      const isCorrect = isExact || isSynonym
      return {
        isCorrect,
        pointsAwarded: isCorrect ? maxPoints : 0,
        explanationHtml: explanation,
      }
    }

    case 'short_essay_self_eval': {
      const selfCheckedPoints = Number(userAnswer.selfEvaluatedPoints) || 0
      const isCorrect = selfCheckedPoints >= maxPoints * 0.7
      return {
        isCorrect,
        pointsAwarded: Math.min(maxPoints, selfCheckedPoints),
        explanationHtml: explanation,
      }
    }

    default:
      return { isCorrect: false, pointsAwarded: 0, explanationHtml: explanation }
  }
}

/**
 * Calculates next Spaced Repetition review due date (SM-2 adaptation):
 * - High Confidence + Correct -> 6 Days
 * - Low Confidence + Correct -> 2 Days
 * - Incorrect -> 1 Day (24 hours)
 */
export function calculateNextReviewDate(
  isCorrect: boolean,
  confidence: ConfidenceLevel,
  fromDate: Date = new Date()
): Date {
  const nextDate = new Date(fromDate.getTime())
  if (isCorrect) {
    if (confidence === 'high') {
      nextDate.setDate(nextDate.getDate() + 6) // +6 days
    } else {
      nextDate.setDate(nextDate.getDate() + 2) // +2 days
    }
  } else {
    nextDate.setDate(nextDate.getDate() + 1) // +1 day
  }
  return nextDate
}

/**
 * Evaluates Weak-Topic status: Daca mastery < 70%, capitolul este considerat slab.
 */
export function evaluateWeakTopicStatus(masteryPercent: number): boolean {
  return masteryPercent < 70
}

/**
 * Submits quiz evaluation to backend.
 */
export async function submitQuizAttempt(
  userId: string,
  chapterId: string,
  scorePercent: number
): Promise<{ success: boolean; isWeakTopic: boolean; nextReviewDue: string; error: string | null }> {
  try {
    const isWeak = evaluateWeakTopicStatus(scorePercent)
    const nextDue = calculateNextReviewDate(scorePercent >= 70, scorePercent >= 85 ? 'high' : 'low')

    const { error } = await supabase.from('user_topic_mastery').upsert(
      {
        user_id: userId,
        chapter_id: chapterId,
        mastery_percent: scorePercent,
        total_attempts: 1,
        is_weak_topic: isWeak,
        next_review_due: nextDue.toISOString(),
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: 'user_id,chapter_id' }
    )

    if (error) {
      console.warn('[quizService] Error updating topic mastery:', error.message)
      return { success: false, isWeakTopic: isWeak, nextReviewDue: nextDue.toISOString(), error: error.message }
    }

    return { success: true, isWeakTopic: isWeak, nextReviewDue: nextDue.toISOString(), error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la salvarea încercării.'
    return { success: false, isWeakTopic: false, nextReviewDue: new Date().toISOString(), error: message }
  }
}
