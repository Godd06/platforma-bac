import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export interface AdminProtectedRouteProps {
  children?: React.ReactNode
  redirectTo?: string
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  // 1. Loading state while session and DB roles are fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Se verifică permisiunile de administrator...</p>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated visitor -> Redirect to /login with state
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // 3. Authenticated user without administrative roles (e.g. 'student') -> Access Denied (redirect to /dashboard)
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // 4. Authorized user with administrative role ('editor', 'reviewer', 'super_admin') -> Access Granted
  return children ? <>{children}</> : <Outlet />
}
