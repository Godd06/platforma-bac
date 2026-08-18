/**
 * Subscription Model & PRO Entitlement Audit Unit Test Suite
 */

import { evaluateProEntitlement } from '../../services/subscriptionEntitlementService'
import type { Subscription } from '../../types/database'

describe('Subscription Model & PRO Entitlement Audit Unit Tests', () => {
  const mockNow = new Date('2026-08-18T12:00:00Z')

  it('Test 1: Active subscription returns PRO entitled with active_subscription reason', () => {
    const sub: Subscription = {
      id: 'sub-1',
      user_id: 'u-1',
      provider: 'stripe',
      provider_customer_id: 'cus_1',
      provider_subscription_id: 'sub_1',
      plan: 'pro_monthly',
      status: 'active',
      current_period_start: '2026-08-01T00:00:00Z',
      current_period_end: '2026-09-01T00:00:00Z',
      cancel_at_period_end: false,
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    }

    const res = evaluateProEntitlement(sub, ['student'], mockNow)
    expect(res.isPro).toBe(true)
    expect(res.reason).toBe('active_subscription')
  })

  it('Test 2: Trialing subscription returns PRO entitled with trial_active reason', () => {
    const sub: Subscription = {
      id: 'sub-2',
      user_id: 'u-2',
      provider: 'stripe',
      provider_customer_id: 'cus_2',
      provider_subscription_id: 'sub_2',
      plan: 'pro_trial',
      status: 'trialing',
      current_period_start: '2026-08-15T00:00:00Z',
      current_period_end: '2026-08-22T00:00:00Z',
      cancel_at_period_end: false,
      created_at: '2026-08-15T00:00:00Z',
      updated_at: '2026-08-15T00:00:00Z',
    }

    const res = evaluateProEntitlement(sub, ['student'], mockNow)
    expect(res.isPro).toBe(true)
    expect(res.reason).toBe('trial_active')
  })

  it('Test 3: Canceled subscription with future period end remains PRO entitled until period end', () => {
    const sub: Subscription = {
      id: 'sub-3',
      user_id: 'u-3',
      provider: 'stripe',
      provider_customer_id: 'cus_3',
      provider_subscription_id: 'sub_3',
      plan: 'pro_monthly',
      status: 'canceled',
      current_period_start: '2026-08-01T00:00:00Z',
      current_period_end: '2026-08-25T00:00:00Z',
      cancel_at_period_end: true,
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-10T00:00:00Z',
    }

    const res = evaluateProEntitlement(sub, ['student'], mockNow)
    expect(res.isPro).toBe(true)
    expect(res.reason).toBe('period_active_before_cancel')
  })

  it('Test 4: Past due subscription within 3 days grace period remains PRO entitled', () => {
    const sub: Subscription = {
      id: 'sub-4',
      user_id: 'u-4',
      provider: 'stripe',
      provider_customer_id: 'cus_4',
      provider_subscription_id: 'sub_4',
      plan: 'pro_monthly',
      status: 'past_due',
      current_period_start: '2026-07-17T00:00:00Z',
      current_period_end: '2026-08-17T00:00:00Z', // 1 day ago
      cancel_at_period_end: false,
      created_at: '2026-07-17T00:00:00Z',
      updated_at: '2026-08-17T00:00:00Z',
    }

    const res = evaluateProEntitlement(sub, ['student'], mockNow)
    expect(res.isPro).toBe(true)
    expect(res.reason).toBe('grace_period_active')
  })

  it('Test 5: Past due subscription beyond 3 days grace period revokes PRO access', () => {
    const sub: Subscription = {
      id: 'sub-5',
      user_id: 'u-5',
      provider: 'stripe',
      provider_customer_id: 'cus_5',
      provider_subscription_id: 'sub_5',
      plan: 'pro_monthly',
      status: 'past_due',
      current_period_start: '2026-07-01T00:00:00Z',
      current_period_end: '2026-08-01T00:00:00Z', // 17 days ago
      cancel_at_period_end: false,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    }

    const res = evaluateProEntitlement(sub, ['student'], mockNow)
    expect(res.isPro).toBe(false)
    expect(res.reason).toBe('subscription_expired')
  })

  it('Test 6: Staff members (editor/super_admin) receive staff_bypass PRO entitlement regardless of subscription state', () => {
    const resEditor = evaluateProEntitlement(null, ['editor'], mockNow)
    expect(resEditor.isPro).toBe(true)
    expect(resEditor.reason).toBe('staff_bypass')

    const resAdmin = evaluateProEntitlement(null, ['super_admin'], mockNow)
    expect(resAdmin.isPro).toBe(true)
    expect(resAdmin.reason).toBe('staff_bypass')
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
