/**
 * Deterministic Unit Test Suite for Dashboard Metric Calculations & State Logic
 */

export interface LessonSummary {
  id: string
  chapter_id: string
  access_level: 'free' | 'pro'
}

export interface ProgressSummary {
  lesson_id: string
  status: 'in_progress' | 'completed'
  progress_percent: number
  updated_at: string
}

export interface StreakSummary {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
}

// 1. Calculate Global Progress
export function calculateGlobalProgress(
  publishedLessons: LessonSummary[],
  completedLessonIds: Set<string>
): { completedLessons: number; totalPublishedLessons: number; progressPercent: number } {
  const totalPublishedLessons = publishedLessons.length
  if (totalPublishedLessons === 0) {
    return { completedLessons: 0, totalPublishedLessons: 0, progressPercent: 0 }
  }

  const completedLessons = publishedLessons.filter((l) => completedLessonIds.has(l.id)).length
  const progressPercent = Math.round((completedLessons / totalPublishedLessons) * 100)

  return { completedLessons, totalPublishedLessons, progressPercent }
}

// 2. Calculate Active Streak (with Rollover Logic)
export function calculateActiveStreak(
  streakRow: StreakSummary | null,
  todayIso: string
): { currentStreak: number; longestStreak: number; isActiveToday: boolean } {
  if (!streakRow || !streakRow.last_activity_date) {
    return { currentStreak: 0, longestStreak: 0, isActiveToday: false }
  }

  const today = new Date(todayIso)
  const lastActive = new Date(streakRow.last_activity_date)

  // Normalize dates to midnight YYYY-MM-DD
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const lastActiveTime = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()).getTime()

  const diffDays = Math.round((todayTime - lastActiveTime) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // Active today
    return { currentStreak: streakRow.current_streak, longestStreak: streakRow.longest_streak, isActiveToday: true }
  } else if (diffDays === 1) {
    // Active yesterday (streak still active for today until day ends)
    return { currentStreak: streakRow.current_streak, longestStreak: streakRow.longest_streak, isActiveToday: false }
  } else {
    // Broken streak (> 1 day gap)
    return { currentStreak: 0, longestStreak: streakRow.longest_streak, isActiveToday: false }
  }
}

// 3. Select Continue Learning Lesson
export function selectContinueLearning(
  progressRows: ProgressSummary[]
): ProgressSummary | null {
  if (!progressRows || progressRows.length === 0) return null

  // 1. Prefer in_progress lesson
  const inProgress = progressRows
    .filter((p) => p.status === 'in_progress')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  if (inProgress.length > 0) return inProgress[0]

  // 2. Fallback to latest updated completed lesson
  const completed = progressRows
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return completed[0] || null
}

describe('Dashboard Metric Calculations & State Logic', () => {
  it('Scenario 1: First-User / Zero Progress returns 0% global progress and null continue learning', () => {
    const publishedLessons: LessonSummary[] = [
      { id: 'l1', chapter_id: 'c1', access_level: 'free' },
      { id: 'l2', chapter_id: 'c1', access_level: 'pro' },
    ]
    const completed = new Set<string>()

    const global = calculateGlobalProgress(publishedLessons, completed)
    expect(global.completedLessons).toBe(0)
    expect(global.totalPublishedLessons).toBe(2)
    expect(global.progressPercent).toBe(0)

    const continueItem = selectContinueLearning([])
    expect(continueItem).toBe(null)
  })

  it('Scenario 2: Calculates partial progress correctly', () => {
    const publishedLessons: LessonSummary[] = [
      { id: 'l1', chapter_id: 'c1', access_level: 'free' },
      { id: 'l2', chapter_id: 'c1', access_level: 'free' },
      { id: 'l3', chapter_id: 'c2', access_level: 'pro' },
      { id: 'l4', chapter_id: 'c2', access_level: 'pro' },
    ]
    const completed = new Set<string>(['l1', 'l3'])

    const global = calculateGlobalProgress(publishedLessons, completed)
    expect(global.completedLessons).toBe(2)
    expect(global.totalPublishedLessons).toBe(4)
    expect(global.progressPercent).toBe(50)
  })

  it('Scenario 3: Evaluates streak rollover accurately (Today vs Yesterday vs Broken)', () => {
    const todayStr = '2026-08-18'

    // Active today
    const streakToday = calculateActiveStreak(
      { current_streak: 5, longest_streak: 10, last_activity_date: '2026-08-18' },
      todayStr
    )
    expect(streakToday.currentStreak).toBe(5)
    expect(streakToday.isActiveToday).toBe(true)

    // Active yesterday
    const streakYesterday = calculateActiveStreak(
      { current_streak: 5, longest_streak: 10, last_activity_date: '2026-08-17' },
      todayStr
    )
    expect(streakYesterday.currentStreak).toBe(5)
    expect(streakYesterday.isActiveToday).toBe(false)

    // Broken streak (>1 day gap)
    const streakBroken = calculateActiveStreak(
      { current_streak: 5, longest_streak: 10, last_activity_date: '2026-08-15' },
      todayStr
    )
    expect(streakBroken.currentStreak).toBe(0)
    expect(streakBroken.longestStreak).toBe(10)
  })

  it('Scenario 4: Selects in_progress lesson over completed lesson for Continue Learning', () => {
    const progressRows: ProgressSummary[] = [
      { lesson_id: 'l1', status: 'completed', progress_percent: 100, updated_at: '2026-08-18T10:00:00Z' },
      { lesson_id: 'l2', status: 'in_progress', progress_percent: 45, updated_at: '2026-08-18T09:00:00Z' },
    ]

    const selected = selectContinueLearning(progressRows)
    expect(selected?.lesson_id).toBe('l2')
    expect(selected?.progress_percent).toBe(45)
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
