import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderTree,
  Image as ImageIcon,
  HelpCircle,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ShieldAlert
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
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

  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <span className="font-bold text-lg">Admin CMS</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/dashboard"
            className="block text-center text-xs text-text-muted hover:text-text transition-colors py-2 border border-border rounded-md"
          >
            ← Înapoi la platformă
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-surface/50 px-8 flex items-center justify-between">
          <h1 className="text-sm font-medium text-text-muted">Panou de Administrare</h1>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
