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
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // 1. Loading state while session and user roles are verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted font-bold">Se verifică permisiunile administrative...</p>
        </div>
      </div>
    )
  }

  // 2. Guest user (unauthenticated) -> redirect to login with return location
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // 3. Authenticated non-admin student -> redirect to student dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // 4. Grant access to authorized staff/admin (editor, reviewer, super_admin)
  return children ? <>{children}</> : <Outlet />
}

