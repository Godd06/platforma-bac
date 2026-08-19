import React, { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Image,
  Users,
  BarChart3,
  HelpCircle,
  CreditCard,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AmbientBackground } from '@/components/ui/AmbientBackground'

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('[AdminLayout] Error during sign out:', err)
    }
  }

  const userDisplayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Administrator')

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="h-full flex flex-col justify-between bg-sidebar border-r border-border p-5 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <Link
            to="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shadow-[0_0_16px_rgba(245,158,11,0.25)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-text leading-tight">
                Platforma<span className="text-amber-600 dark:text-amber-400">Admin</span>
              </span>
              <span className="text-[10px] text-text-subtle font-medium tracking-wider uppercase -mt-0.5">
                CMS & Administrare
              </span>
            </div>
          </Link>

          {onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              aria-label="Închide meniul admin"
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text bg-surface border border-border"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider px-3.5">
              Gestiune Conținut
            </span>
            <nav className="space-y-1 pt-1">
              <NavLink
                to="/admin"
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Panou Control</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/content"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <BookOpen className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Curriculum & Lecții</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/media"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <Image className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Bibliotecă Media</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/quizzes"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Quiz-uri & Teste</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider px-3.5">
              Administrare & Sistem
            </span>
            <nav className="space-y-1 pt-1">
              <NavLink
                to="/admin/users"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <Users className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Utilizatori & Roluri</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/analytics"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <BarChart3 className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Analytics & Telemetrie</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/subscriptions"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <CreditCard className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Abonamente PRO</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/settings"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-active text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <Settings className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Setări Sistem</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom User Row */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border hover:border-cyan-500/30 text-xs font-semibold text-text transition-colors shadow-subtle"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>Înapoi în Modul Elev</span>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2 p-3 rounded-2xl glass-subtle border border-border-subtle">
          <div className="min-w-0">
            <p className="text-xs font-bold text-text truncate">{userDisplayName}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Administrator</p>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
              title="Deconectare"
              aria-label="Deconectare"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background text-text relative">
      {/* Skip to Content */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Sari la conținutul admin
      </a>

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0 z-30">
        <SidebarContent />
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header (< lg, h-[72px]) */}
        <header className="lg:hidden sticky top-0 z-30 h-[72px] border-b border-border glass-floating flex items-center justify-between px-4 sm:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.20)]">
          <Link
            to="/admin"
            className="flex items-center gap-3 font-bold text-sm text-text"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-subtle">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-base tracking-tight">
              Platforma<span className="text-amber-400">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-mobile-drawer"
              aria-label={mobileMenuOpen ? 'Închide meniul admin' : 'Deschide meniul admin'}
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-text-muted hover:text-amber-400 bg-surface border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-subtle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            id="admin-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu Administrare CMS"
            className="fixed inset-0 z-50 lg:hidden flex justify-end"
          >
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="relative w-84 max-w-[90vw] h-full shadow-2xl z-10 animate-fadeIn">
              <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content with Ambient Background */}
        <AmbientBackground variant="admin" className="flex-1 flex flex-col">
          <main
            id="admin-main-content"
            tabIndex={-1}
            className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
          >
            <Outlet />
          </main>
        </AmbientBackground>
      </div>
    </div>
  )
}

export default AdminLayout
