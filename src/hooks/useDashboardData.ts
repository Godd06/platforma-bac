import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { fetchDashboardData, type DashboardData } from '@/services/dashboardService'

export interface UseDashboardDataResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataResult {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!user?.id) {
      if (!authLoading) {
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      setError(null)
      const dashboardData = await fetchDashboardData(user.id)
      setData(dashboardData)
    } catch (err) {
      console.error('[useDashboardData] Error loading dashboard data:', err)
      setError('Nu am putut încărca datele pentru dashboard. Verifică conexiunea la internet.')
    } finally {
      setLoading(false)
    }
  }, [user?.id, authLoading])

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user?.id, authLoading, loadData])

  return {
    data,
    loading: loading || authLoading,
    error,
    refetch: loadData,
  }
}
