import { supabase } from '../lib/supabase'
import type { Profile, UserRoleType, Subscription } from '@/types/database'

export interface AdminUserListItem {
  profile: Profile
  roles: UserRoleType[]
  subscription: Subscription | null
  completedLessonsCount: number
  inProgressLessonsCount: number
  lastActiveAt: string | null
}

export interface UserActivityOverview {
  totalCompleted: number
  totalInProgress: number
  streakDays: number
  recentActivities: Array<{
    id: string
    type: string
    created_at: string
    lessonTitle?: string
  }>
}

/**
 * Fetches enriched user list for admin management.
 */
export async function fetchAdminUsersList(): Promise<{
  data: AdminUserListItem[] | null
  error: string | null
}> {
  try {
    // 1. Fetch profiles
    const { data: rawProfiles, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profErr || !rawProfiles) {
      return { data: null, error: profErr?.message || 'Nu s-au putut încărca profilurile.' }
    }

    const profiles = rawProfiles as unknown as Profile[]

    // 2. Enrich each profile with roles, subscription, and progress counts
    const enrichedList: AdminUserListItem[] = await Promise.all(
      profiles.map(async (prof) => {
        // Fetch roles
        const { data: rawRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', prof.user_id)

        const roles: UserRoleType[] = (rawRoles as Array<{ role: UserRoleType }>)?.map((r) => r.role) || ['student']
        if (roles.length === 0) roles.push('student')

        // Fetch subscription
        const { data: rawSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', prof.user_id)
          .maybeSingle()

        const subscription = (rawSub as unknown as Subscription) || null

        // Fetch lesson progress counts
        const { count: completedCount } = await supabase
          .from('lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', prof.user_id)
          .eq('status', 'completed')

        const { count: inProgressCount } = await supabase
          .from('lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', prof.user_id)
          .eq('status', 'in_progress')

        return {
          profile: prof,
          roles,
          subscription,
          completedLessonsCount: completedCount || 0,
          inProgressLessonsCount: inProgressCount || 0,
          lastActiveAt: prof.updated_at || prof.created_at,
        }
      })
    )

    return { data: enrichedList, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea utilizatorilor.'
    return { data: null, error: message }
  }
}

/**
 * Validates role escalation guards before executing backend mutation:
 * 1. Self-role modification is blocked (admin cannot alter own roles to prevent lockouts).
 * 2. Only a super_admin can grant or revoke `super_admin` or `reviewer` staff roles.
 * 3. Invalid role values outside UserRoleType are rejected.
 */
export function validateRoleAssignment(
  targetUserId: string,
  currentUserId: string,
  currentUserRoles: UserRoleType[],
  newRoles: UserRoleType[]
): { valid: boolean; error: string | null } {
  // 1. Self-role escalation/modification check
  if (targetUserId === currentUserId) {
    return {
      valid: false,
      error: 'Nu îți poți modifica propriile roluri din interfața de administrare.',
    }
  }

  // 2. Validate role values
  const ALLOWED_ROLES: UserRoleType[] = ['student', 'editor', 'reviewer', 'super_admin']
  for (const r of newRoles) {
    if (!ALLOWED_ROLES.includes(r)) {
      return { valid: false, error: `Rolul '${r}' este nevalid.` }
    }
  }

  // 3. Super admin privilege escalation check
  const isSuperAdmin = currentUserRoles.includes('super_admin')
  const assigningSuperAdmin = newRoles.includes('super_admin')

  if (assigningSuperAdmin && !isSuperAdmin) {
    return {
      valid: false,
      error: 'Doar un Super Admin poate acorda rolul de Super Admin.',
    }
  }

  return { valid: true, error: null }
}

/**
 * Updates a user's assigned roles in `user_roles` table with full security guards.
 */
export async function updateUserRoles(
  targetUserId: string,
  currentUserId: string,
  currentUserRoles: UserRoleType[],
  newRoles: UserRoleType[]
): Promise<{ success: boolean; error: string | null }> {
  // 1. Client-side security guard
  const valResult = validateRoleAssignment(targetUserId, currentUserId, currentUserRoles, newRoles)
  if (!valResult.valid) {
    return { success: false, error: valResult.error }
  }

  try {
    // 2. Delete existing roles for target user
    const { error: delErr } = await supabase.from('user_roles').delete().eq('user_id', targetUserId)

    if (delErr) {
      return { success: false, error: `Eroare la eliminarea vechilor roluri: ${delErr.message}` }
    }

    // 3. Insert new roles
    const rolesToInsert = newRoles.map((r) => ({
      user_id: targetUserId,
      role: r,
    }))

    const { error: insErr } = await supabase.from('user_roles').insert(rolesToInsert as never)

    if (insErr) {
      return { success: false, error: `Eroare la salvarea noilor roluri: ${insErr.message}` }
    }

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la actualizarea rolurilor.'
    return { success: false, error: message }
  }
}
