import { supabase } from '@/lib/supabase'
import {
  type AnalyticsEventType,
  type EventPayloadMap,
  sanitizeAnalyticsPayload,
  calculateMasteryVelocity,
} from './analyticsTaxonomy'

export interface RealAnalyticsOverview {
  totalVisits: number
  totalRegistrations: number
  totalLessonCompletions: number
  totalFailedSearches: number
  totalBrokenMediaErrors: number
  averageMasteryVelocity: number
  topSearches: Array<{ query: string; count: number }>
  recentEvents: Array<{
    id: string
    type: string
    payload: Record<string, unknown>
    timestamp: string
  }>
}

// In-memory deduplication cache (prevents duplicate rapid clicks/events within 3 seconds)
const recentEventsCache = new Map<string, number>()

/**
 * Tracks a real event in database `user_activity` table with deduplication and PII sanitization.
 */
export async function trackAnalyticsEvent<K extends AnalyticsEventType>(
  eventType: K,
  payload: EventPayloadMap[K],
  userId?: string | null
): Promise<{ success: boolean; error: string | null }> {
  try {
    // 1. Deduplication check
    const dedupKey = `${userId || 'anon'}:${eventType}:${JSON.stringify(payload)}`
    const now = Date.now()
    const lastTimestamp = recentEventsCache.get(dedupKey)

    if (lastTimestamp && now - lastTimestamp < 3000) {
      // Duplicate event within 3s window, ignore
      return { success: true, error: null }
    }
    recentEventsCache.set(dedupKey, now)

    // 2. Sanitize payload against PII
    const cleanPayload = sanitizeAnalyticsPayload(payload as Record<string, unknown>)

    // 3. Persist to DB user_activity table
    const { error } = await supabase.from('user_activity').insert({
      user_id: userId || null,
      activity_type: eventType,
      metadata: cleanPayload,
      created_at: new Date().toISOString(),
    } as never)

    if (error) {
      console.warn('[AnalyticsService] Error inserting event:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la înregistrarea evenimentului.'
    return { success: false, error: message }
  }
}

/**
 * Aggregates REAL analytics data from DB `user_activity` & `lesson_progress` tables.
 */
export async function fetchRealAnalyticsMetrics(): Promise<{
  data: RealAnalyticsOverview | null
  error: string | null
}> {
  try {
    // 1. Fetch raw user_activity events
    const { data: rawActivities, error: actErr } = await supabase
      .from('user_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (actErr) {
      return { data: null, error: actErr.message }
    }

    const activities = (rawActivities as Array<{
      id: string
      activity_type: string
      metadata: Record<string, unknown> | null
      created_at: string
    }>) || []

    // 2. Calculate event metrics from real DB rows
    let visits = 0
    let registrations = 0
    let completions = 0
    let failedSearches = 0
    let brokenMedia = 0
    const searchCounts: Record<string, number> = {}

    for (const act of activities) {
      if (act.activity_type === 'page_visit') visits++
      else if (act.activity_type === 'user_register') registrations++
      else if (act.activity_type === 'lesson_completed') completions++
      else if (act.activity_type === 'failed_search') failedSearches++
      else if (act.activity_type === 'broken_media') brokenMedia++
      else if (act.activity_type === 'search_executed' && act.metadata?.query) {
        const q = String(act.metadata.query).toLowerCase().trim()
        searchCounts[q] = (searchCounts[q] || 0) + 1
      }
    }

    // 3. Fetch lesson completions for Mastery Velocity calculation
    const { data: progressRows } = await supabase
      .from('lesson_progress')
      .select('user_id, completed_at')
      .eq('status', 'completed')

    const userActiveDays: Record<string, Set<string>> = {}
    const userCompletedCount: Record<string, number> = {}

    if (progressRows) {
      for (const row of progressRows as Array<{ user_id: string; completed_at: string }>) {
        if (!row.completed_at) continue
        const dateStr = row.completed_at.slice(0, 10)
        if (!userActiveDays[row.user_id]) userActiveDays[row.user_id] = new Set()
        userActiveDays[row.user_id].add(dateStr)

        userCompletedCount[row.user_id] = (userCompletedCount[row.user_id] || 0) + 1
      }
    }

    // Calculate average mastery velocity across active students
    let totalVelocity = 0
    let activeStudentsCount = 0

    for (const uid of Object.keys(userCompletedCount)) {
      const activeDays = userActiveDays[uid]?.size || 1
      const completed = userCompletedCount[uid] || 0
      const velocity = calculateMasteryVelocity(completed, activeDays)

      if (velocity > 0) {
        totalVelocity += velocity
        activeStudentsCount++
      }
    }

    const avgMasteryVelocity = activeStudentsCount > 0 ? parseFloat((totalVelocity / activeStudentsCount).toFixed(2)) : 0

    const topSearches = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const recentEvents = activities.slice(0, 15).map((a) => ({
      id: a.id,
      type: a.activity_type,
      payload: a.metadata || {},
      timestamp: a.created_at,
    }))

    return {
      data: {
        totalVisits: visits,
        totalRegistrations: registrations,
        totalLessonCompletions: completions,
        totalFailedSearches: failedSearches,
        totalBrokenMediaErrors: brokenMedia,
        averageMasteryVelocity: avgMasteryVelocity,
        topSearches,
        recentEvents,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la calcularea metricilor.'
    return { data: null, error: message }
  }
}
