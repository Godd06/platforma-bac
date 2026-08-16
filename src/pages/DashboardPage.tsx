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

  // 1. Loading State (Matching Skeleton)
  if (loading) {
    return <DashboardSkeleton />
  }

  // 2. Error State (Actionable error with retry)
  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <ErrorState
          title="Eroare la încărcarea panoului"
          message={error || 'Nu am putut încărca datele tale de progres. Te rugăm să reîncerci.'}
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. Header & Identity */}
      <DashboardHeader
        profile={data.profile}
        subscription={data.subscription}
      />

      {/* 2. PRO Banner (if not already Pro) */}
      <ProStatusCard subscription={data.subscription} />

      {/* 3. Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Action & Subject Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning (Dominant action) */}
          <ContinueLearningCard data={data.continueLearning} />

          {/* Subjects Progress */}
          <SubjectProgressCard subjects={data.subjectProgress} />
        </div>

        {/* Right 1 Column: Progress & Streak Metrics */}
        <div className="space-y-6">
          {/* Global Bac Progress Ring */}
          <GlobalProgressCard data={data.globalProgress} />

          {/* Streak Card */}
          <StreakCard data={data.streak} />
        </div>
      </div>

      {/* 4. Recent Activity Timeline */}
      <RecentActivityList activities={data.recentActivity} />

      {/* Back to Top */}
      <BackToTop />
    </div>
  )
}

export default DashboardPage
