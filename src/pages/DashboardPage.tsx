import React from 'react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { GlobalProgressCard } from '@/components/dashboard/GlobalProgressCard'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { SubjectProgressCard } from '@/components/dashboard/SubjectProgressCard'
import { RecentActivityList } from '@/components/dashboard/RecentActivityList'
import { ProStatusCard } from '@/components/dashboard/ProStatusCard'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { BackToTop } from '@/components/ui/BackToTop'

export const DashboardPage: React.FC = () => {
  const { data, loading, error, refetch } = useDashboardData()

  // 1. Loading State (Matching exact layout skeleton)
  if (loading) {
    return <DashboardSkeleton />
  }

  // 2. Error State (Actionable error with retry)
  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <ErrorState
          title="Eroare la încărcarea panoului"
          message={error || 'Nu am putut încărca datele tale de progres. Te rugăm să reîncerci.'}
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* 1. Greeting & Identity Header */}
      <div className="animate-stagger-1">
        <DashboardHeader
          profile={data.profile}
          subscription={data.subscription}
        />
      </div>

      {/* 2. Main Operational Workspace: Continue Learning Dominant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Dominant Action & Subject Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning (Immediate Next Step) */}
          <div className="animate-stagger-2">
            <ContinueLearningCard data={data.continueLearning} />
          </div>

          {/* Subjects Progress Breakdown */}
          <div className="animate-stagger-3">
            <SubjectProgressCard subjects={data.subjectProgress} />
          </div>
        </div>

        {/* Right 1 Column: Metrics & PRO Status */}
        <div className="space-y-6">
          {/* Global Bac Progress Ring */}
          <div className="animate-stagger-2">
            <GlobalProgressCard data={data.globalProgress} />
          </div>

          {/* Streak Habit Tracker */}
          <div className="animate-stagger-3">
            <StreakCard data={data.streak} />
          </div>

          {/* PRO Banner / Status */}
          <div className="animate-stagger-4">
            <ProStatusCard subscription={data.subscription} />
          </div>
        </div>
      </div>

      {/* 3. Recent Activity Timeline */}
      <div className="animate-stagger-5">
        <RecentActivityList activities={data.recentActivity} />
      </div>

      {/* Back to Top */}
      <BackToTop />
    </div>
  )
}

export default DashboardPage
