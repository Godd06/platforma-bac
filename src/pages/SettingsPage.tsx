import React from 'react'
import { Link } from 'react-router-dom'
import { Settings, User, Mail, Shield, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const SettingsPage: React.FC = () => {
  const { user, roles } = useAuth()

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Elev')

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 px-2 sm:px-4 animate-fadeIn">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-muted hover:text-cyan-400 transition-colors min-h-[36px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Înapoi la Dashboard</span>
      </Link>

      <header className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface p-6 sm:p-8 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <Settings className="w-4 h-4" />
          <span>Cont Elev</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Setări Cont
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Informații despre profilul tău și preferințele contului.
        </p>
      </header>

      <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 space-y-6 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border/60">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              {displayName.charAt(0).toUpperCase() || <User className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{displayName}</h2>
              <p className="text-xs text-text-muted">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Adresă de e-mail</span>
              </div>
              <p className="text-sm font-medium text-text truncate">{user?.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rol în platformă</span>
              </div>
              <p className="text-sm font-semibold text-cyan-400 capitalize">
                {roles.length > 0 ? roles.join(', ') : 'Student'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            Pentru modificarea parolei sau actualizarea datelor de conectare:
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover hover:border-cyan-500/40 border border-border text-xs font-bold text-text transition-colors min-h-[40px]"
          >
            Schimbă parola
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
