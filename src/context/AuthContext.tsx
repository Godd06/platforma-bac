import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { User, Session, AuthError, AuthResponse, SignUpWithPasswordCredentials } from '@supabase/supabase-js'
import type { UserRoleType } from '@/types/database'
import { supabase } from '@/lib/supabase'

export interface AuthContextType {
  user: User | null
  session: Session | null
  roles: UserRoleType[]
  loading: boolean
  isAdmin: boolean
  isPro: boolean
  isAuthenticated: boolean
  hasRole: (role: UserRoleType) => boolean
  signUp: (email: string, password: string, options?: SignUpWithPasswordCredentials['options']) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: React.ReactNode
}

export const ADMIN_ROLES: UserRoleType[] = ['editor', 'reviewer', 'super_admin']

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [roles, setRoles] = useState<UserRoleType[]>([])
  const [isPro, setIsPro] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Track active fetch requests to avoid race conditions
  const fetchCounterRef = useRef(0)

  // Fetch real roles & subscription status from Supabase database
  const loadUserDetails = useCallback(async (userId: string, requestId: number) => {
    try {
      const [rolesRes, subRes] = await Promise.all([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId),
        supabase
          .from('subscriptions')
          .select('plan, status, current_period_end')
          .eq('user_id', userId)
          .eq('plan', 'pro')
          .in('status', ['active', 'trialing'])
          .maybeSingle(),
      ])

      // If a newer auth change occurred in the meantime, ignore this response
      if (requestId !== fetchCounterRef.current) return

      // Process roles
      const rolesList = (rolesRes.data as Array<{ role: UserRoleType }>) || []
      const userRoles = rolesList.map((r) => r.role)
      setRoles(userRoles)

      // Determine PRO status: staff roles or valid active/trialing subscription
      const isStaff = userRoles.some((r) => ADMIN_ROLES.includes(r))
      let proActive = isStaff

      if (!proActive && subRes.data) {
        const sub = subRes.data as { current_period_end: string | null }
        if (!sub.current_period_end || new Date(sub.current_period_end) > new Date()) {
          proActive = true
        }
      }

      setIsPro(proActive)
    } catch (err) {
      console.error('[AuthContext] Error loading user details:', err)
      if (requestId === fetchCounterRef.current) {
        setRoles([])
        setIsPro(false)
      }
    }
  }, [])

  const handleSessionChange = useCallback(
    async (currentSession: Session | null) => {
      const currentRequestId = ++fetchCounterRef.current
      setSession(currentSession)
      const currentUser = currentSession?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await loadUserDetails(currentUser.id, currentRequestId)
      } else {
        setRoles([])
        setIsPro(false)
      }

      if (currentRequestId === fetchCounterRef.current) {
        setLoading(false)
      }
    },
    [loadUserDetails]
  )

  const refreshUserData = useCallback(async () => {
    if (user) {
      const currentRequestId = ++fetchCounterRef.current
      await loadUserDetails(user.id, currentRequestId)
    }
  }, [user, loadUserDetails])

  useEffect(() => {
    let isMounted = true

    // Set up auth state change listener (which automatically emits INITIAL_SESSION in Supabase v2)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        await handleSessionChange(session)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [handleSessionChange])

  const signUp = async (
    email: string,
    password: string,
    options?: SignUpWithPasswordCredentials['options']
  ): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email,
      password,
      options,
    })
  }

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    setLoading(true)
    const res = await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setRoles([])
    setIsPro(false)
    setLoading(false)
    return res
  }

  const isAdmin = roles.some((role) => ADMIN_ROLES.includes(role))

  const hasRole = (role: UserRoleType): boolean => {
    return roles.includes(role)
  }

  const isAuthenticated = Boolean(user)

  const value: AuthContextType = {
    user,
    session,
    roles,
    loading,
    isAdmin,
    isPro,
    isAuthenticated,
    hasRole,
    signUp,
    signIn,
    signOut,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
