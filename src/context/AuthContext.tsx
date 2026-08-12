import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, AuthError, AuthResponse, SignUpWithPasswordCredentials } from '@supabase/supabase-js'
import type { UserRole, UserRoleType } from '@/types/database'
import { supabase } from '@/lib/supabase'

export interface AuthContextType {
  user: User | null
  session: Session | null
  roles: UserRoleType[]
  loading: boolean
  isAdmin: boolean
  hasRole: (role: UserRoleType) => boolean
  signUp: (email: string, password: string, options?: SignUpWithPasswordCredentials['options']) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
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
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch real roles from public.user_roles in Supabase database
  const fetchUserRoles = async (userId: string): Promise<UserRoleType[]> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)

      const rolesList = data as UserRole[] | null

      if (error || !rolesList) {
        if (error) {
          console.error('[Supabase Auth] Error fetching user roles:', error.message)
        }
        return []
      }

      return rolesList.map((item) => item.role)
    } catch (err) {
      console.error('[Supabase Auth] Unexpected error fetching user roles:', err)
      return []
    }
  }

  const syncAuthState = async (currentSession: Session | null) => {
    setSession(currentSession)
    const currentUser = currentSession?.user ?? null
    setUser(currentUser)

    if (currentUser) {
      const userRoles = await fetchUserRoles(currentUser.id)
      setRoles(userRoles)
    } else {
      setRoles([])
    }

    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    // Fetch initial active session and roles on mount
    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error }) => {
        if (error) {
          console.error('[Supabase Auth] Initial session fetch error:', error.message)
        }
        if (isMounted) {
          await syncAuthState(session)
        }
      })
      .catch(async (err) => {
        console.error('[Supabase Auth] Unexpected error fetching session:', err)
        if (isMounted) {
          setLoading(false)
        }
      })

    // Listen for real-time authentication changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        await syncAuthState(session)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

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
    return await supabase.auth.signOut()
  }

  const isAdmin = roles.some((role) => ADMIN_ROLES.includes(role))

  const hasRole = (role: UserRoleType): boolean => {
    return roles.includes(role)
  }

  const value: AuthContextType = {
    user,
    session,
    roles,
    loading,
    isAdmin,
    hasRole,
    signUp,
    signIn,
    signOut,
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
