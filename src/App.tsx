import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProUpgradePage } from '@/pages/ProUpgradePage'

import { DashboardPage } from '@/pages/DashboardPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { SubjectPage } from '@/pages/SubjectPage'
import { ChapterPage } from '@/pages/ChapterPage'
import { LessonPage } from '@/pages/LessonPage'
import { SettingsPage } from '@/pages/SettingsPage'

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminContentPage } from '@/pages/admin/AdminContentPage'
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage'
import { AdminQuizzesPage } from '@/pages/admin/AdminQuizzesPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminSubscriptionsPage } from '@/pages/admin/AdminSubscriptionsPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

import { NotFoundPage } from '@/pages/NotFoundPage'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pro" element={<ProUpgradePage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:subject" element={<SubjectPage />} />
          <Route path="/catalog/:subject/:chapter" element={<ChapterPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
