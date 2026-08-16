import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Sparkles,
  CreditCard,
  Sliders,
  ArrowLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'

export const SettingsPage: React.FC = () => {
  const { user, roles, isPro } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'subscription' | 'preferences'>('account')

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Elev')

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Înapoi la Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text tracking-tight">
          Setări Cont & Preferințe
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Gestiunea profilului tău de studiu, a securității și a opțiunilor de afișare.
        </p>
      </div>

      {/* Settings Workspace: Responsive Left Tabs + Right Content Frame */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation Tabs (Responsive Grid on Mobile, Column on Desktop) */}
        <nav
          className="grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-col gap-1.5 p-1.5 rounded-2xl glass-elevated border border-border shadow-subtle"
          aria-label="Meniu Setări"
        >
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[42px] text-left ${
              activeTab === 'account'
                ? 'bg-surface text-cyan-400 border border-border shadow-subtle font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
            }`}
          >
            <User className="w-4 h-4 shrink-0 text-cyan-400" />
            <span className="truncate">Cont & Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[42px] text-left ${
              activeTab === 'security'
                ? 'bg-surface text-cyan-400 border border-border shadow-subtle font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0 text-cyan-400" />
            <span className="truncate">Securitate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[42px] text-left ${
              activeTab === 'subscription'
                ? 'bg-surface text-amber-300 border border-border shadow-subtle font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">Abonament</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[42px] text-left ${
              activeTab === 'preferences'
                ? 'bg-surface text-cyan-400 border border-border shadow-subtle font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0 text-cyan-400" />
            <span className="truncate">Preferințe</span>
          </button>
        </nav>

        {/* Settings Main Content Area */}
        <div className="md:col-span-3 min-w-0 space-y-5">
          {/* TAB 1: Account / Profile */}
          {activeTab === 'account' && (
            <div className="rounded-2xl glass-elevated border border-border p-6 sm:p-7 space-y-6 animate-fadeIn shadow-raised">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-display text-lg font-bold text-text">Informații Profil</h2>
                  <p className="text-xs text-text-muted">Datele de identificare ale contului tău de studiu.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md glass-subtle text-cyan-400 text-[11px] font-bold border border-cyan-500/25">
                  ACTIV
                </span>
              </div>

              {/* Avatar & Display Name Banner */}
              <div className="flex items-center gap-4 p-4 rounded-xl glass-subtle border border-border-subtle">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-xl text-cyan-400 shadow-subtle shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-text truncate">{displayName}</h3>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1.5">
                  <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Adresă e-mail
                  </span>
                  <p className="text-sm font-semibold text-text truncate">{user?.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1.5">
                  <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Rol în platformă
                  </span>
                  <p className="text-sm font-semibold text-cyan-400 capitalize">
                    {roles.length > 0 ? roles.join(', ') : 'Elev (Student)'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1.5">
                  <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Data înregistrării
                  </span>
                  <p className="text-sm font-semibold text-text">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ro-RO') : 'Recenta'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1.5">
                  <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Stare Cont
                  </span>
                  <p className="text-sm font-semibold text-status-success flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Securizat & Protejat</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Security */}
          {activeTab === 'security' && (
            <div className="rounded-2xl glass-elevated border border-border p-6 sm:p-7 space-y-6 animate-fadeIn shadow-raised">
              <div className="pb-4 border-b border-border-subtle">
                <h2 className="font-display text-lg font-bold text-text">Securitate Parolă</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Gestionează parola contului și protecția datelor de autentificare.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-text">Schimbare Parolă</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Vei primi un link de resetare securizat direct pe adresa ta de e-mail ({user?.email}).
                  </p>
                </div>

                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border hover:border-cyan-500/40 text-xs font-bold text-text hover:bg-surface-elevated transition-colors shadow-subtle min-h-[40px] shrink-0"
                >
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Trimite link de resetare</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: Subscription */}
          {activeTab === 'subscription' && (
            <div className="rounded-2xl glass-elevated border border-border p-6 sm:p-7 space-y-6 animate-fadeIn shadow-raised">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-display text-lg font-bold text-text">Stare Abonament</h2>
                  <p className="text-xs text-text-muted mt-0.5">Tipul tău de acces și pachetele disponibile.</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    isPro
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-surface-elevated text-text-muted border border-border'
                  }`}
                >
                  {isPro ? 'ABONAMENT PRO ACTIV' : 'PLAN GRATUIT'}
                </span>
              </div>

              {isPro ? (
                <div className="p-5 rounded-2xl bg-status-success/10 border border-status-success/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-status-success">Acces Nelimitat PRO</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Contul tău beneficiază de acces complet la toate cele 17 eseuri canonice de 10, sintezele audio și testele de autoevaluare.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatedBorderCard
                  variant="pro"
                  glow={true}
                  innerClassName="glass-featured-pro p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <h3 className="font-display text-base font-bold text-text">Treci la Pachetul Complet PRO</h3>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Deblochează accesul complet la toate eseurile de 10 pentru proba de Limba Română (Subiectul III), schemele cauză-efect pentru Istorie și sintezele audio.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/pro"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shadow-subtle min-h-[40px]"
                    >
                      <span>Vezi Detalii Pachet PRO</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </AnimatedBorderCard>
              )}
            </div>
          )}

          {/* TAB 4: Preferences */}
          {activeTab === 'preferences' && (
            <div className="rounded-2xl glass-elevated border border-border p-6 sm:p-7 space-y-6 animate-fadeIn shadow-raised">
              <div className="pb-4 border-b border-border-subtle">
                <h2 className="font-display text-lg font-bold text-text">Preferințe Mediu de Studiu</h2>
                <p className="text-xs text-text-muted mt-0.5">Configurează aspectul vizual și comportamentul interfeței.</p>
              </div>

              {/* Theme Selector Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-text uppercase tracking-wider">
                  Aspect Vizual (Temă)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dark Mode Option */}
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-2xl glass-default interactive-card flex flex-col items-start gap-2.5 text-left transition-all ${
                      theme === 'dark'
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 text-text shadow-subtle'
                        : 'text-text-muted hover:border-border-strong hover:text-text'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Moon className="w-4 h-4" />
                      </div>
                      {theme === 'dark' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                          Activ
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">Întunecat (Dark Ink)</div>
                      <div className="text-[11px] text-text-muted leading-relaxed mt-1">
                        Optimizat pentru confort vizual și lectură relaxată.
                      </div>
                    </div>
                  </button>

                  {/* Light Mode Option */}
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-2xl glass-default interactive-card flex flex-col items-start gap-2.5 text-left transition-all ${
                      theme === 'light'
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 text-text shadow-subtle'
                        : 'text-text-muted hover:border-border-strong hover:text-text'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Sun className="w-4 h-4" />
                      </div>
                      {theme === 'light' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                          Activ
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">Luminos (Light Paper)</div>
                      <div className="text-[11px] text-text-muted leading-relaxed mt-1">
                        Text clar pe fond alb-neutru pentru lectură de zi.
                      </div>
                    </div>
                  </button>

                  {/* System Mode Option */}
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-2xl glass-default interactive-card flex flex-col items-start gap-2.5 text-left transition-all ${
                      theme === 'system'
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 text-text shadow-subtle'
                        : 'text-text-muted hover:border-border-strong hover:text-text'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Laptop className="w-4 h-4" />
                      </div>
                      {theme === 'system' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                          Activ
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">Automat (Sistem)</div>
                      <div className="text-[11px] text-text-muted leading-relaxed mt-1">
                        Sincronizat cu preferința sistemului tău de operare.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reduced Motion Feedback */}
              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between gap-4 text-xs">
                <div>
                  <h3 className="font-bold text-text">Accesibilitate Animații</h3>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Platforma detectează automat setarea sistem `prefers-reduced-motion`.
                  </p>
                </div>
                <span className="text-status-success font-bold text-xs shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sincronizat</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
