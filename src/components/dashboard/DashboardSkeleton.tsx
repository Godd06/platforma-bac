import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-full hidden sm:block" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning & Subjects */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>

        {/* Right 1 Col: Global Progress & Streak */}
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  )
}
