import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Sparkles, Menu, X, ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { AmbientBackground } from '@/components/ui/AmbientBackground'

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
    location.pathname
  )

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-text relative">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Sari la conținut
      </a>

      {/* Public Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-border/70 backdrop-blur-heavy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-extrabold text-lg sm:text-xl text-text hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>
              Bacalaureat<span className="text-cyan-400">.ro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-3 sm:gap-5">
            <Link
              to="/pro"
              className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRO</span>
            </Link>

            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-text-muted hover:text-cyan-400 transition-colors px-3 py-1.5"
            >
              Autentificare
            </Link>

            <Link
              to="/register"
              className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow flex-shrink-0 min-h-[40px] inline-flex items-center gap-1.5"
            >
              <span>Creează cont</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-menu"
              aria-label={mobileMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-text-muted hover:text-cyan-400 bg-surface-elevated border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Robust Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          id="public-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu Navigare"
          className="fixed inset-0 z-50 sm:hidden flex justify-end"
        >
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Slide-over Panel */}
          <div className="relative w-72 max-w-[85vw] h-full bg-surface border-l border-border z-10 flex flex-col justify-between p-5 shadow-2xl overflow-y-auto animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
                <div className="flex items-center gap-2 font-bold text-base text-text">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Bacalaureat.ro</span>
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

              <nav className="space-y-2">
                <Link
                  to="/pro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm font-semibold min-h-[48px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Abonament PRO</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-text hover:bg-surface-elevated text-sm font-medium min-h-[48px]"
                >
                  <LogIn className="w-4 h-4 text-text-muted" />
                  <span>Autentificare</span>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 text-sm font-bold shadow-glow min-h-[48px]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Creează cont gratuit</span>
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-border/60 text-xs text-text-muted text-center">
              Pregătire examen Bacalaureat
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Contextual Ambient Lighting */}
      <AmbientBackground variant={isAuthPage ? 'auth' : 'landing'} className="flex-1 flex flex-col">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 focus:outline-none"
        >
          <Outlet />
        </main>
      </AmbientBackground>

      {/* Public Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-text-subtle relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} Platformă Bacalaureat. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  )
}
