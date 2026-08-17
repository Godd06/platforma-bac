import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export interface AdminProtectedRouteProps {
  children?: React.ReactNode
  redirectTo?: string
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const { loading } = useAuth()

  // 1. Loading state while session is verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted font-bold">Se încarcă Panoul AdminCMS...</p>
        </div>
      </div>
    )
  }

  // 2. Grant access to AdminCMS Studio workspace
  return children ? <>{children}</> : <Outlet />
}
