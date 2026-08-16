import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  FolderTree,
  Image as ImageIcon,
  HelpCircle,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileSidebarOpen(false)
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
  }, [mobileSidebarOpen])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('[AdminLayout] Error during sign out:', err)
    }
  }

  const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/content', label: 'Conținut', icon: FolderTree },
    { to: '/admin/media', label: 'Media', icon: ImageIcon },
    { to: '/admin/quizzes', label: 'Quiz-uri', icon: HelpCircle },
    { to: '/admin/users', label: 'Utilizatori', icon: Users },
    { to: '/admin/subscriptions', label: 'Abonamente', icon: CreditCard },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Setări', icon: Settings },
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between bg-surface border-r border-border">
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-text">Admin CMS</span>
          </div>
          {mobileSidebarOpen && (
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Închide meniul"
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text bg-surface-elevated border border-border"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="px-4 py-4 space-y-1.5">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-text-muted hover:text-text hover:bg-surface-elevated'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/dashboard"
          className="w-full flex items-center justify-center gap-2 text-xs text-text-muted hover:text-cyan-400 transition-colors py-2.5 border border-border rounded-xl min-h-[40px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Înapoi la platformă</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-center text-xs text-status-danger hover:text-red-300 transition-colors py-2.5 border border-status-danger/20 hover:border-status-danger/40 rounded-xl flex items-center justify-center gap-1.5 min-h-[40px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Deconectare</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-text relative">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Sari la conținut
      </a>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Robust Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Meniu Panou Administrare"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-fadeIn">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/70 bg-surface/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Deschide meniu admin"
              className="lg:hidden p-2 rounded-xl text-text-muted hover:text-cyan-400 bg-surface border border-border min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-text">Panou de Administrare</h1>
          </div>
          <span className="text-xs text-text-subtle font-mono truncate max-w-[180px] sm:max-w-none">
            {user?.email}
          </span>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-8 focus:outline-none overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
