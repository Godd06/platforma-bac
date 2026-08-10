import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { BookOpen, LayoutDashboard, Library, Settings, User } from 'lucide-react'

export const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      {/* Student Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-text">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>Platformă Bac</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-surface-elevated text-accent' : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-surface-elevated text-accent' : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  }`
                }
              >
                <Library className="w-4 h-4" />
                <span>Catalog</span>
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              title="Setări"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-medium text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Student Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
