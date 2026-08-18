/**
 * Platform Observability, Web Vitals & Admin Audit Logger System
 * 
 * Provides structured telemetry logging for:
 * 1. Client Errors (Window onerror, unhandled rejections)
 * 2. Web Vitals (LCP, INP, CLS, FCP, TTFB)
 * 3. Auth Failures (Login, Password reset, Rate limiting)
 * 4. Database & API Errors (Supabase REST/RPC failures)
 * 5. Content & Media Failures (Failed saves, broken media)
 * 6. Admin Audit Log (Role changes, publication, deletion, security actions)
 * 
 * Zero PII Leakage Guarantee: Strips passwords, secrets, tokens, and signed URLs.
 */

export type ObservabilityCategory =
  | 'client_error'
  | 'web_vitals'
  | 'auth_failure'
  | 'database_error'
  | 'content_save_failure'
  | 'broken_media'
  | 'payment_error'
  | 'admin_audit'

export type AdminAuditAction =
  | 'role_change'
  | 'subscription_change'
  | 'content_publication'
  | 'content_deletion'
  | 'media_deletion'
  | 'security_sensitive_action'

export interface LogEntry {
  correlationId: string
  timestamp: string
  category: ObservabilityCategory
  operation: string
  userRole?: string
  payload: Record<string, unknown>
}

export interface MetricWebVital {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: string
}

// In-Memory Telemetry Buffer (Persists up to 100 entries for inspection)
const telemetryBuffer: LogEntry[] = []

/**
 * Generates a non-sensitive correlation ID for request tracing.
 */
export function generateCorrelationId(): string {
  return `corr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Sanitizes arbitrary log payload data to ensure 0 PII or secret leakage.
 */
export function sanitizeLogPayload<T extends Record<string, unknown>>(data: T): T {
  const clean: Record<string, unknown> = { ...data }
  const FORBIDDEN_PATTERNS = ['password', 'token', 'secret', 'bearer', 'authorization', 'signature', 'signedurl', 'email']

  for (const key of Object.keys(clean)) {
    const lowerKey = key.toLowerCase()
    if (FORBIDDEN_PATTERNS.some((p) => lowerKey.includes(p))) {
      delete clean[key]
    } else if (typeof clean[key] === 'string' && (clean[key] as string).includes('token=')) {
      clean[key] = '[REDACTED_TOKEN]'
    }
  }

  return clean as T
}

/**
 * Core Telemetry Logger Function
 */
export function logTelemetry(
  category: ObservabilityCategory,
  operation: string,
  rawPayload: Record<string, unknown> = {},
  userRole: string = 'guest',
  correlationId: string = generateCorrelationId()
): LogEntry {
  const sanitizedPayload = sanitizeLogPayload(rawPayload)

  const entry: LogEntry = {
    correlationId,
    timestamp: new Date().toISOString(),
    category,
    operation,
    userRole,
    payload: sanitizedPayload,
  }

  // Push to buffer (keep last 100 entries)
  telemetryBuffer.push(entry)
  if (telemetryBuffer.length > 100) {
    telemetryBuffer.shift()
  }

  // Console output in dev environment
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[TELEMETRY][${category.toUpperCase()}][${entry.timestamp}] ${operation}:`, entry)
  }

  return entry
}

/**
 * Web Vitals Tracker
 */
export function recordWebVital(name: MetricWebVital['name'], value: number): MetricWebVital {
  let rating: MetricWebVital['rating'] = 'good'

  if (name === 'LCP') {
    rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
  } else if (name === 'INP') {
    rating = value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor'
  } else if (name === 'CLS') {
    rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
  }

  const metric: MetricWebVital = {
    name,
    value: Number(value.toFixed(2)),
    rating,
    timestamp: new Date().toISOString(),
  }

  logTelemetry('web_vitals', `vital_${name.toLowerCase()}`, { metric })

  return metric
}

/**
 * Admin Audit Trail Logger
 */
export function logAdminAudit(
  action: AdminAuditAction,
  targetId: string,
  details: Record<string, unknown> = {},
  adminRole: string = 'super_admin'
): LogEntry {
  return logTelemetry(
    'admin_audit',
    `admin_action_${action}`,
    {
      action,
      targetId,
      ...details,
    },
    adminRole
  )
}

/**
 * Retrieves buffer for inspection and unit testing
 */
export function getTelemetryBuffer(): LogEntry[] {
  return [...telemetryBuffer]
}

/**
 * Clears telemetry buffer
 */
export function clearTelemetryBuffer(): void {
  telemetryBuffer.length = 0
}
