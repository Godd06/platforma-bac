import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text ambient-bg">
      {/* Public Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-text hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Bacalaureat<span className="text-accent">.ro</span></span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/pro" className="text-sm font-medium text-text-muted hover:text-text transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>PRO</span>
            </Link>
            <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
              Autentificare
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors shadow-glow"
            >
              Creează cont
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-text-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Platformă Bacalaureat. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  )
}
