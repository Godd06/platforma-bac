/**
 * Quiz Engine, Bac Question Types & Spaced Repetition Unit Test Suite
 */

import {
  evaluateAnswer,
  calculateNextReviewDate,
  evaluateWeakTopicStatus,
} from '../../services/quizService'
import type { QuizQuestion } from '../../types/database'

describe('Quiz Engine & Bac Question Types Unit Tests', () => {
  it('Scenario 1: Evaluates single_choice question correctly', () => {
    const q: QuizQuestion = {
      id: 'q1',
      quiz_id: 'quiz1',
      question_type: 'single_choice',
      prompt: 'În ce secol a domnit Mircea cel Bătrân?',
      options: { choices: [{ id: 'opt1', text: 'Secolul XIV-XV' }, { id: 'opt2', text: 'Secolul XVII' }] },
      correct_answer: { optionId: 'opt1' },
      explanation_html: 'Mircea cel Bătrân a domnit între 1386-1418.',
      points: 1.0,
      sort_order: 0,
      created_at: '2026-08-18T00:00:00Z',
    }

    const resCorrect = evaluateAnswer(q, { optionId: 'opt1' })
    expect(resCorrect.isCorrect).toBe(true)
    expect(resCorrect.pointsAwarded).toBe(1.0)

    const resWrong = evaluateAnswer(q, { optionId: 'opt2' })
    expect(resWrong.isCorrect).toBe(false)
    expect(resWrong.pointsAwarded).toBe(0)
  })

  it('Scenario 2: Evaluates fill_in_blank question with diacritic tolerance and synonyms', () => {
    const q: QuizQuestion = {
      id: 'q2',
      quiz_id: 'quiz1',
      question_type: 'fill_in_blank',
      prompt: 'Perspectiva narativă în Moara cu noroc este ___',
      options: null,
      correct_answer: { text: 'obiectivă', synonyms: ['obiectiva', 'omniscienta'] },
      explanation_html: 'Narațiunea este la persoana a III-a, cu un narator omniscient și obiectiv.',
      points: 1.0,
      sort_order: 10,
      created_at: '2026-08-18T00:00:00Z',
    }

    const resExact = evaluateAnswer(q, { text: 'obiectivă' })
    expect(resExact.isCorrect).toBe(true)

    const resWithoutDiacritics = evaluateAnswer(q, { text: 'obiectiva' })
    expect(resWithoutDiacritics.isCorrect).toBe(true)

    const resSynonym = evaluateAnswer(q, { text: 'omniscienta' })
    expect(resSynonym.isCorrect).toBe(true)
  })

  it('Scenario 3: Evaluates text_matching question pairs', () => {
    const q: QuizQuestion = {
      id: 'q3',
      quiz_id: 'quiz1',
      question_type: 'text_matching',
      prompt: 'Asociază opera cu autorul corespunzător:',
      options: null,
      correct_answer: {
        pairs: {
          'Moara cu noroc': 'Ioan Slavici',
          'Luceafărul': 'Mihai Eminescu',
        },
      },
      explanation_html: 'Gruparea operelor cu autorii lor canonici.',
      points: 2.0,
      sort_order: 20,
      created_at: '2026-08-18T00:00:00Z',
    }

    const resAllCorrect = evaluateAnswer(q, {
      pairs: {
        'Moara cu noroc': 'Ioan Slavici',
        'Luceafărul': 'Mihai Eminescu',
      },
    })
    expect(resAllCorrect.isCorrect).toBe(true)
    expect(resAllCorrect.pointsAwarded).toBe(2.0)
  })

  it('Scenario 4: Calculates Spaced Repetition review dates (SM-2 adaptation)', () => {
    const baseDate = new Date('2026-08-18T12:00:00Z')

    // High Confidence + Correct = +6 Days
    const dateHigh = calculateNextReviewDate(true, 'high', baseDate)
    expect(dateHigh.getDate()).toBe(24) // Aug 18 + 6 = Aug 24

    // Low Confidence + Correct = +2 Days
    const dateLow = calculateNextReviewDate(true, 'low', baseDate)
    expect(dateLow.getDate()).toBe(20) // Aug 18 + 2 = Aug 20

    // Incorrect = +1 Day
    const dateWrong = calculateNextReviewDate(false, 'high', baseDate)
    expect(dateWrong.getDate()).toBe(19) // Aug 18 + 1 = Aug 19
  })

  it('Scenario 5: Identifies Weak Topics when mastery score is under 70%', () => {
    expect(evaluateWeakTopicStatus(65)).toBe(true)
    expect(evaluateWeakTopicStatus(85)).toBe(false)
  })
})

function describe(name: string, fn: () => void) {
  console.log(`\n--- Running Test Suite: ${name} ---`)
  fn()
}

function it(scenarioName: string, fn: () => void) {
  try {
    fn()
    console.log(`✅ [PASS] ${scenarioName}`)
  } catch (err) {
    console.error(`❌ [FAIL] ${scenarioName}:`, err)
    process.exit(1)
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected '${expected}' but got '${actual}'`)
      }
    },
  }
}
