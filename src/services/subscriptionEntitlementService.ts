import type { Subscription, UserRoleType } from '@/types/database'

export interface EntitlementResult {
  isPro: boolean
  reason: 'staff_bypass' | 'active_subscription' | 'trial_active' | 'grace_period_active' | 'period_active_before_cancel' | 'no_active_subscription' | 'subscription_expired'
  gracePeriodDaysRemaining?: number
  accessExpiresAt?: string | null
}

/**
 * Canonical PRO Entitlement Evaluation Logic
 * 
 * Rules:
 * 1. SUBSCRIPTION ≠ ROLE. Roles give administrative staff privileges (editor, reviewer, super_admin), which grant content preview access.
 * 2. Students (Free/PRO) rely strictly on the `subscriptions` table.
 * 3. `active` or `trialing` status = Entitled.
 * 4. `canceled` with `current_period_end` in the future = Entitled until period end.
 * 5. `past_due` within 3 days grace period = Entitled (Grace Period).
 * 6. `expired`, `past_due` (> 3 days), or missing subscription = Not Entitled.
 */
export function evaluateProEntitlement(
  subscription: Subscription | null,
  roles: UserRoleType[] = ['student'],
  now: Date = new Date()
): EntitlementResult {
  // 1. Staff Bypass check (Super Admin, Editor, Reviewer)
  const isStaff = roles.some((r) => ['super_admin', 'editor', 'reviewer'].includes(r))
  if (isStaff) {
    return {
      isPro: true,
      reason: 'staff_bypass',
      accessExpiresAt: null,
    }
  }

  // 2. Missing Subscription
  if (!subscription) {
    return {
      isPro: false,
      reason: 'no_active_subscription',
      accessExpiresAt: null,
    }
  }

  const nowMs = now.getTime()
  const periodEndMs = subscription.current_period_end ? new Date(subscription.current_period_end).getTime() : 0

  // 3. Active Status
  if (subscription.status === 'active') {
    return {
      isPro: true,
      reason: 'active_subscription',
      accessExpiresAt: subscription.current_period_end,
    }
  }

  // 4. Trialing Status
  if (subscription.status === 'trialing') {
    return {
      isPro: true,
      reason: 'trial_active',
      accessExpiresAt: subscription.current_period_end,
    }
  }

  // 5. Canceled status with remaining period
  if (subscription.status === 'canceled' && periodEndMs > nowMs) {
    return {
      isPro: true,
      reason: 'period_active_before_cancel',
      accessExpiresAt: subscription.current_period_end,
    }
  }

  // 6. Past Due with Grace Period (3 Days Grace Period)
  if (subscription.status === 'past_due' && periodEndMs > 0) {
    const gracePeriodMs = 3 * 24 * 60 * 60 * 1000 // 3 days
    const graceDeadlineMs = periodEndMs + gracePeriodMs

    if (nowMs <= graceDeadlineMs) {
      const daysLeft = Math.ceil((graceDeadlineMs - nowMs) / (24 * 60 * 60 * 1000))
      return {
        isPro: true,
        reason: 'grace_period_active',
        gracePeriodDaysRemaining: daysLeft,
        accessExpiresAt: new Date(graceDeadlineMs).toISOString(),
      }
    }
  }

  // 7. Expired / Past Due Beyond Grace / Incomplete
  return {
    isPro: false,
    reason: 'subscription_expired',
    accessExpiresAt: subscription.current_period_end,
  }
}
