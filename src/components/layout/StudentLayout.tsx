import React, { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import { CommandPalette } from '@/components/ui/CommandPalette'

export const StudentLayout: React.FC = () => {
  const { user, signOut, isPro, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Track scroll position for glass header intensification
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      console.error('[StudentLayout] Error during sign out:', err)
    }
  }

  const userDisplayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Elev')

  return (
    <div className="min-h-screen flex flex-col bg-background text-text selection:bg-cyan-500/20 selection:text-cyan-300 relative">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Sari la conținut
      </a>

      {/* Global Luxury Header Bar (h-[72px], Unified Across All Pages) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-floating border-b border-border/80 shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
            : 'bg-background/85 backdrop-blur-xl border-b border-border/50'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-bold text-base text-text hover:opacity-90 transition-opacity group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-text leading-tight">
                Platforma<span className="text-cyan-400">Bac</span>
              </span>
              <span className="text-[10px] text-text-subtle font-semibold -mt-0.5 tracking-wider uppercase">
                Spațiu Digital de Studiu
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Luxury Segmented Pill Bar */}
          <nav className="hidden md:flex items-center p-1.5 rounded-2xl glass-elevated border border-border/80 shadow-subtle gap-1" aria-label="Navigare Principală">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-surface text-cyan-400 border border-border shadow-subtle font-bold'
                    : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Panou Studiu</span>
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-surface text-cyan-400 border border-border shadow-subtle font-bold'
                    : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
                }`
              }
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Catalog Materii</span>
            </NavLink>

            <NavLink
              to="/pro"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-subtle'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Abonament PRO</span>
            </NavLink>
          </nav>

          {/* Desktop Auth/User CTAs + ThemeToggle */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <CommandPalette />
            <ThemeToggle />

            {isPro && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRO</span>
              </span>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="p-2.5 rounded-xl text-amber-400 hover:bg-amber-500/15 border border-amber-500/30 transition-colors"
                title="Panou Administrare"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-elevated border border-transparent hover:border-border transition-colors"
              title="Setări Cont"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shadow-subtle">
                {userDisplayName.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <span className="max-w-[120px] truncate">{userDisplayName}</span>
            </Link>

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
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="student-mobile-drawer"
            aria-label={mobileMenuOpen ? 'Închide meniul principal' : 'Deschide meniul principal'}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl text-text-muted hover:text-text bg-surface border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shadow-subtle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay (Unified & Ergonomic) */}
      {mobileMenuOpen && (
        <div
          id="student-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu Navigare Elev"
          className="fixed inset-0 z-50 md:hidden flex justify-end"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-84 max-w-[90vw] h-full bg-sidebar border-l border-border p-6 flex flex-col justify-between shadow-2xl z-10 animate-fadeIn select-none">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-bold text-base text-text"
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-lg tracking-tight text-text">
                    Platforma<span className="text-cyan-400">Bac</span>
                  </span>
                </Link>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Închide meniul"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text bg-surface border border-border"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <nav className="space-y-2" aria-label="Navigare Mobilă Elev">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all min-h-[52px] ${
                      isActive
                        ? 'bg-surface-active text-cyan-400 font-bold border border-cyan-500/30 shadow-subtle'
                        : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                  <span>Panou Studiu</span>
                </NavLink>

                <NavLink
                  to="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all min-h-[52px] ${
                      isActive
                        ? 'bg-surface-active text-cyan-400 font-bold border border-cyan-500/30 shadow-subtle'
                        : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
                    }`
                  }
                >
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>Catalog Materii</span>
                </NavLink>

                <NavLink
                  to="/pro"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all min-h-[52px] ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-subtle'
                        : 'text-amber-400/90 hover:text-amber-300 hover:bg-surface-elevated/60'
                    }`
                  }
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Abonament PRO</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all min-h-[52px] ${
                      isActive
                        ? 'bg-surface-active text-cyan-400 font-bold border border-cyan-500/30 shadow-subtle'
                        : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
                    }`
                  }
                >
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <span>Setări Cont</span>
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 min-h-[52px]"
                  >
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Panou Administrare</span>
                  </NavLink>
                )}
              </nav>
            </div>

            <div className="space-y-3 pt-5 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-border text-base font-bold text-status-danger hover:bg-status-danger/10 transition-colors min-h-[52px] shadow-subtle"
              >
                <LogOut className="w-5 h-5" />
                <span>Deconectare</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Canvas with Contextual Educational World */}
      <AmbientBackground
        variant={
          location.pathname.startsWith('/catalog')
            ? 'catalog'
            : location.pathname.startsWith('/lesson')
            ? 'lesson'
            : location.pathname.startsWith('/settings')
            ? 'settings'
            : location.pathname.startsWith('/pro')
            ? 'pro'
            : 'dashboard'
        }
        className="flex-1 flex flex-col"
      >
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 focus:outline-none"
        >
          <Outlet />
        </main>
      </AmbientBackground>

      {/* Student Workspace Footer */}
      <footer className="border-t border-border bg-sidebar/90 backdrop-blur-md py-8 text-center text-xs text-text-muted relative z-20">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-sm text-text">
                Platforma<span className="text-cyan-400">Bac</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-text-muted">
              <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Panou Studiu</Link>
              <Link to="/catalog" className="hover:text-cyan-400 transition-colors">Catalog Materii</Link>
              <Link to="/pro" className="hover:text-amber-400 transition-colors">Pachetul PRO</Link>
              <Link to="/settings" className="hover:text-text transition-colors">Setări</Link>
              <ThemeToggle />
            </div>
          </div>

          <p className="text-[11px] text-text-subtle pt-2 border-t border-border-subtle">
            © {new Date().getFullYear()} PlatformaBac.ro · Toate drepturile rezervate. Conform programei oficiale 2025–2026.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default StudentLayout
