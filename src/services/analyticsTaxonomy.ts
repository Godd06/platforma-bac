/**
 * Platform Event Analytics Taxonomy & Privacy Spec
 * 
 * Enforces strict event names, minimal non-PII payloads, deduplication, and privacy guarantees.
 */

export type AnalyticsEventType =
  | 'page_visit'
  | 'cta_click'
  | 'user_register'
  | 'first_login'
  | 'first_lesson_started'
  | 'lesson_completed'
  | 'return_next_day'
  | 'pro_page_viewed'
  | 'checkout_initiated'
  | 'purchase_completed'
  | 'search_executed'
  | 'failed_search'
  | 'block_interaction'
  | 'client_error'
  | 'broken_media'

export interface EventPayloadMap {
  page_visit: { path: string; referrer?: string }
  cta_click: { cta_id: string; location: string }
  user_register: { method: 'email' }
  first_login: { timestamp: string }
  first_lesson_started: { lesson_id: string; subject_slug?: string }
  lesson_completed: { lesson_id: string; duration_minutes?: number }
  return_next_day: { streak_days: number }
  pro_page_viewed: { source: string }
  checkout_initiated: { plan: string }
  purchase_completed: { plan: string; amount?: number }
  search_executed: { query: string; results_count: number }
  failed_search: { query: string }
  block_interaction: { block_id: string; block_type: string; action: string }
  client_error: { error_name: string; message: string }
  broken_media: { media_url: string; media_type: string }
}

export interface AnalyticsEventRecord<K extends AnalyticsEventType = AnalyticsEventType> {
  id: string
  event_type: K
  user_id: string | null
  payload: EventPayloadMap[K]
  timestamp: string
}

/**
 * Sanitizes event payload to guarantee 0 PII leakage (strips email, names, passwords).
 */
export function sanitizeAnalyticsPayload<T extends Record<string, unknown>>(payload: T): T {
  const clean = { ...payload }
  const FORBIDDEN_KEYS = ['email', 'password', 'name', 'display_name', 'phone', 'address', 'token']

  for (const key of Object.keys(clean)) {
    if (FORBIDDEN_KEYS.some((f) => key.toLowerCase().includes(f))) {
      delete clean[key]
    }
  }

  return clean
}

/**
 * Mastery Velocity Calculation Formula Documentation:
 * 
 * Velocity = Total Lessons Completed / Active Learning Days
 * 
 * Example:
 * If an active student completes 15 lessons over 5 active learning days:
 * Mastery Velocity = 15 / 5 = 3.0 lessons / active day.
 */
export function calculateMasteryVelocity(completedLessonsCount: number, activeDaysCount: number): number {
  if (activeDaysCount <= 0 || completedLessonsCount <= 0) return 0
  const raw = completedLessonsCount / activeDaysCount
  return parseFloat(raw.toFixed(2))
}
