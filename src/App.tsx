import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SmartScrollRestoration } from '@/components/ui/SmartScrollRestoration'
import { Skeleton } from '@/components/ui/Skeleton'

// Critical Path Pages (Eagerly Loaded for Instant Initial Load)
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

// Lazy-Loaded Student & Public Pages
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
)
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
)
const ProUpgradePage = lazy(() =>
  import('@/pages/ProUpgradePage').then((m) => ({ default: m.ProUpgradePage }))
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const CatalogPage = lazy(() =>
  import('@/pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
)
const SubjectPage = lazy(() =>
  import('@/pages/SubjectPage').then((m) => ({ default: m.SubjectPage }))
)
const LessonPage = lazy(() =>
  import('@/pages/LessonPage').then((m) => ({ default: m.LessonPage }))
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)

// Lazy-Loaded Legal & Trust Pages
const TermsPage = lazy(() => import('@/pages/legal/TermsPage').then((m) => ({ default: m.TermsPage })))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const SubscriptionTermsPage = lazy(() =>
  import('@/pages/legal/SubscriptionTermsPage').then((m) => ({ default: m.SubscriptionTermsPage }))
)
const ContactPage = lazy(() => import('@/pages/legal/ContactPage').then((m) => ({ default: m.ContactPage })))

// Lazy-Loaded Admin Suite (Heavy CMS, Media, Studio, User Admin, Analytics)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
)
const AdminContentPage = lazy(() =>
  import('@/pages/admin/AdminContentPage').then((m) => ({ default: m.AdminContentPage }))
)
const AdminMediaPage = lazy(() =>
  import('@/pages/admin/AdminMediaPage').then((m) => ({ default: m.AdminMediaPage }))
)
const AdminQuizzesPage = lazy(() =>
  import('@/pages/admin/AdminQuizzesPage').then((m) => ({ default: m.AdminQuizzesPage }))
)
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
)
const AdminSubscriptionsPage = lazy(() =>
  import('@/pages/admin/AdminSubscriptionsPage').then((m) => ({ default: m.AdminSubscriptionsPage }))
)
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage }))
)
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const PageFallback: React.FC = () => (
  <div className="p-6 sm:p-12 space-y-4 max-w-5xl mx-auto animate-fadeIn">
    <Skeleton className="h-10 w-48 rounded-xl" />
    <Skeleton className="h-6 w-96 rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  </div>
)

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SmartScrollRestoration />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public Discovery (PublicLayout) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/pro" element={<ProUpgradePage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/subscription-terms" element={<SubscriptionTermsPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Legacy Romanian Legal Route Aliases */}
                <Route path="/termeni" element={<Navigate to="/terms" replace />} />
                <Route path="/confidentialitate" element={<Navigate to="/privacy" replace />} />
                <Route path="/abonament" element={<Navigate to="/subscription-terms" replace />} />
              </Route>

              {/* Student & Learning Environment (StudentLayout) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<StudentLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/catalog/:subject" element={<SubjectPage />} />
                  <Route path="/catalog/:subject/:chapter" element={<SubjectPage />} />
                  <Route path="/lesson/:lessonId" element={<LessonPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Admin CMS (AdminProtectedRoute + AdminLayout) */}
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/content" element={<AdminContentPage />} />
                  <Route path="/admin/content/:subjectSlug" element={<AdminContentPage />} />
                  <Route path="/admin/content/:subjectSlug/:chapterSlug" element={<AdminContentPage />} />
                  <Route path="/admin/content/:subjectSlug/:chapterSlug/:lessonSlug" element={<AdminContentPage />} />
                  <Route path="/admin/editor/:lessonId" element={<AdminContentPage />} />
                  <Route path="/admin/media" element={<AdminMediaPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                  <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
                  <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Route>
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

