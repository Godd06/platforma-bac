import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12 select-none">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-12 h-12" rounded="2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" rounded="lg" />
            <Skeleton className="h-3.5 w-64" rounded="md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28" rounded="xl" />
          <Skeleton className="h-10 w-36" rounded="xl" />
        </div>
      </div>

      {/* Main Grid: 2 cols left (Hero + Progress), 1 col right (Streak + Progress Ring) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Hero Card Skeleton */}
          <div className="p-6 sm:p-7 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" rounded="md" />
              <Skeleton className="h-4 w-28" rounded="md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-48" rounded="md" />
              <Skeleton className="h-7 w-3/4" rounded="lg" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-2 w-full" rounded="full" />
              <div className="pt-2 flex gap-3">
                <Skeleton className="h-11 w-44" rounded="xl" />
                <Skeleton className="h-11 w-40" rounded="xl" />
              </div>
            </div>
          </div>

          {/* Subject Progress Card Skeleton */}
          <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
            <div className="flex items-center justify-between pb-1">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48" rounded="lg" />
                <Skeleton className="h-3.5 w-60" rounded="md" />
              </div>
              <Skeleton className="h-8 w-32" rounded="xl" />
            </div>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl border border-border-subtle glass-subtle space-y-2.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" rounded="md" />
                  <Skeleton className="h-4 w-12" rounded="md" />
                </div>
                <Skeleton className="h-2 w-full" rounded="full" />
                <Skeleton className="h-3.5 w-48" rounded="md" />
              </div>
              <div className="p-4 rounded-xl border border-border-subtle glass-subtle space-y-2.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" rounded="md" />
                  <Skeleton className="h-4 w-12" rounded="md" />
                </div>
                <Skeleton className="h-2 w-full" rounded="full" />
                <Skeleton className="h-3.5 w-48" rounded="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Global Progress Ring Card Skeleton */}
          <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" rounded="md" />
              <Skeleton className="h-4 w-20" rounded="md" />
            </div>
            <div className="py-4 flex justify-center">
              <Skeleton className="w-28 h-28" rounded="full" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border-subtle">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>

          {/* Streak Card Skeleton */}
          <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" rounded="md" />
              <Skeleton className="h-5 w-20" rounded="lg" />
            </div>
            <Skeleton className="h-10 w-24" rounded="lg" />
            <div className="flex justify-between gap-1.5 pt-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="w-7 h-7" rounded="xl" />
              ))}
            </div>
            <Skeleton className="h-9 w-full" rounded="xl" />
          </div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="p-6 rounded-2xl glass-elevated border border-border space-y-3 shadow-subtle">
        <Skeleton className="h-5 w-44" rounded="lg" />
        <div className="space-y-2.5 pt-1">
          <Skeleton className="h-12 w-full" rounded="xl" />
          <Skeleton className="h-12 w-full" rounded="xl" />
          <Skeleton className="h-12 w-full" rounded="xl" />
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
