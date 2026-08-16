import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  BookOpen,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  User,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'
import { AmbientBackground } from '@/components/ui/AmbientBackground'

export const StudentLayout: React.FC = () => {
  const { signOut, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isCatalog = location.pathname.startsWith('/catalog')
  const isLesson = location.pathname.startsWith('/lesson')
  const ambientVariant = isLesson ? 'lesson' : isCatalog ? 'catalog' : 'dashboard'

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll and listen for Escape key when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('[StudentLayout] Error during sign out:', err)
    }
  }

  const userDisplayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Elev')

  return (
    <div className="min-h-screen flex flex-col bg-background text-text relative">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Sari la conținut
      </a>

      {/* Student Navigation Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-border/70 backdrop-blur-heavy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 font-extrabold text-lg sm:text-xl text-text hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>
                Platformă <span className="text-cyan-400">Bac</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover/80'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover/80'
                  }`
                }
              >
                <Library className="w-4 h-4" />
                <span>Catalog</span>
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'text-amber-400/80 hover:text-amber-300 hover:bg-surface-hover/80'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin CMS</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/settings"
              className="p-2.5 rounded-xl text-text-muted hover:text-cyan-400 hover:bg-surface-elevated transition-colors"
              title="Setări Cont"
              aria-label="Setări Cont"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border/80 text-xs text-text-muted shadow-sm"
              title={user?.email || 'Cont Elev'}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                {userDisplayName.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
              <span className="max-w-[120px] truncate text-text font-medium">{userDisplayName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
              title="Deconectare"
              aria-label="Deconectare"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="student-mobile-menu"
              aria-label={mobileMenuOpen ? 'Închide meniul de navigare' : 'Deschide meniul de navigare'}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-text-muted hover:text-cyan-400 bg-surface-elevated border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Robust Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="student-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu Navigare Elev"
          className="fixed inset-0 z-50 md:hidden flex justify-end"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-surface border-l border-border z-10 flex flex-col justify-between p-5 shadow-2xl overflow-y-auto animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
                <div className="flex items-center gap-2 font-bold text-base text-text">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Platformă Bac</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Închide meniul"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text bg-surface-elevated border border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[48px] ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-text hover:bg-surface-elevated'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[48px] ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-text hover:bg-surface-elevated'
                    }`
                  }
                >
                  <Library className="w-4 h-4" />
                  <span>Catalog Materii</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[48px] ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-text hover:bg-surface-elevated'
                    }`
                  }
                >
                  <Settings className="w-4 h-4" />
                  <span>Setări Cont</span>
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[48px] ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'text-amber-400 hover:bg-surface-elevated'
                      }`
                    }
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Panou Administrare</span>
                  </NavLink>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-3">
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  {userDisplayName.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{userDisplayName}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-status-danger/10 border border-status-danger/25 text-status-danger font-semibold text-xs hover:bg-status-danger/20 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Deconectare</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Student Workspace with Contextual Ambient Lighting */}
      <AmbientBackground variant={ambientVariant} className="flex-1 flex flex-col">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
        >
          <Outlet />
        </main>
      </AmbientBackground>
    </div>
  )
}
