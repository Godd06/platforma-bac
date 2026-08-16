import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { ProUpgradePage } from '@/pages/ProUpgradePage'

import { DashboardPage } from '@/pages/DashboardPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { SubjectPage } from '@/pages/SubjectPage'
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
import { SmartScrollRestoration } from '@/components/ui/SmartScrollRestoration'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SmartScrollRestoration />
          <Routes>
            {/* Public Routes (Accessible without authentication) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/pro" element={<ProUpgradePage />} />
            </Route>

            {/* Protected Educational & Student Routes (Requires Authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<StudentLayout />}>
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/catalog/:subject" element={<SubjectPage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Protected Admin Routes (Requires Staff Roles) */}
            <Route element={<AdminProtectedRoute />}>
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
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
