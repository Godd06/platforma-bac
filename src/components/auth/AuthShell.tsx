import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  BookOpen,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { evaluatePassword } from '@/utils/passwordValidation'

export type AuthMode = 'login' | 'register'

interface AuthShellProps {
  initialMode?: AuthMode
}

export const AuthShell: React.FC<AuthShellProps> = ({ initialMode = 'login' }) => {
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine current mode from path or prop
  const currentPathMode: AuthMode = location.pathname.includes('register') ? 'register' : 'login'
  const [mode, setMode] = useState<AuthMode>(initialMode || currentPathMode)

  // Sync mode with route changes (back/forward)
  useEffect(() => {
    const routeMode: AuthMode = location.pathname.includes('register') ? 'register' : 'login'
    setMode(routeMode)
  }, [location.pathname])

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Register form state
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)
  const [regSuccess, setRegSuccess] = useState(false)

  // Redirect destination after successful auth
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate, from])

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    navigate(newMode === 'register' ? '/register' : '/login', {
      replace: true,
      state: location.state,
    })
    setLoginError(null)
    setRegError(null)
  }

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)

    try {
      const { error: signInError } = await signIn(loginEmail, loginPassword)
      if (signInError) {
        setLoginError(signInError.message || 'Datele de conectare sunt incorecte.')
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'A apărut o eroare neașteptată.')
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Register submission
  const passwordEvaluation = evaluatePassword(regPassword)
  const passwordsMatch = regConfirmPassword.length > 0 && regPassword === regConfirmPassword

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError(null)

    if (!passwordEvaluation.isAllValid) {
      setRegError('Parola trebuie să respecte toate cerințele de securitate de mai jos.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Parolele introduse nu coincid.')
      return
    }

    setRegLoading(true)

    try {
      const { error: signUpError } = await signUp(regEmail, regPassword, {
        data: {
          full_name: regFullName.trim(),
        },
      })

      if (signUpError) {
        setRegError(signUpError.message || 'Înregistrarea a eșuat. Verifică datele.')
      } else {
        setRegSuccess(true)
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1800)
      }
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'A apărut o eroare neașteptată.')
    } finally {
      setRegLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isLogin = mode === 'login'

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-3 sm:px-4">
      {/* Outer Shell Card with Responsive Layout */}
      <div className="relative rounded-2xl glass-featured overflow-hidden shadow-floating min-h-[580px]">
        {/* Desktop Container (Two Columns with Sweeping Overlay) */}
        <div className="hidden md:grid md:grid-cols-2 relative z-10 min-h-[580px]">
          {/* LEFT COLUMN: Login Form */}
          <div
            className={`p-8 sm:p-10 flex flex-col justify-center transition-opacity duration-500 ${
              isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            // @ts-ignore inert standard attribute
            inert={!isLogin ? '' : undefined}
            aria-hidden={!isLogin}
          >
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h1 className="font-display text-2xl font-bold text-text">
                  Autentificare Elev
                </h1>
                <p className="text-xs text-text-muted">
                  Continuă pregătirea de unde ai rămas.
                </p>
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="auth-login-email" className="block text-xs font-semibold text-text">
                    Adresă de e-mail
                  </label>
                  <input
                    id="auth-login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="exemplu@liceu.ro"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[40px]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-login-password" className="block text-xs font-semibold text-text">
                      Parolă
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Ai uitat parola?
                    </Link>
                  </div>
                  <PasswordInput
                    id="auth-login-password"
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[40px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs active:scale-[0.98] transition-all shadow-subtle disabled:opacity-50 min-h-[42px] mt-2"
                >
                  {loginLoading ? (
                    <span>Se conectează...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Intră în cont</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-border/60 text-center text-xs text-text-muted">
                Nu ai cont încă?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-0.5 ml-1"
                >
                  <span>Creează cont gratuit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Register Form */}
          <div
            className={`p-8 sm:p-10 flex flex-col justify-center transition-opacity duration-500 ${
              !isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            // @ts-ignore inert standard attribute
            inert={isLogin ? '' : undefined}
            aria-hidden={isLogin}
          >
            {regSuccess ? (
              <div className="text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-lg bg-status-success/15 border border-status-success/30 text-status-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-text">Cont creat cu succes!</h2>
                  <p className="text-xs text-text-muted">
                    Te redirecționăm către panoul tău de studiu...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-text">
                    Creează Cont Gratuit
                  </h1>
                  <p className="text-xs text-text-muted">
                    Începe pregătirea structurată pentru Bacalaureat.
                  </p>
                </div>

                {regError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="auth-reg-fullname" className="block text-xs font-semibold text-text">
                      Nume complet
                    </label>
                    <input
                      id="auth-reg-fullname"
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="ex: Andrei Popescu"
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[38px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="auth-reg-email" className="block text-xs font-semibold text-text">
                      Adresă de e-mail
                    </label>
                    <input
                      id="auth-reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="exemplu@liceu.ro"
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[38px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="auth-reg-password" className="block text-xs font-semibold text-text">
                      Parolă
                    </label>
                    <PasswordInput
                      id="auth-reg-password"
                      required
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minim 8 caractere"
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[38px]"
                    />
                  </div>

                  {regPassword.length > 0 && (
                    <div className="p-2 rounded-lg bg-surface-elevated/40 border border-border-subtle">
                      <PasswordStrength password={regPassword} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="auth-reg-confirm" className="block text-xs font-semibold text-text">
                      Confirmă parola
                    </label>
                    <PasswordInput
                      id="auth-reg-confirm"
                      required
                      autoComplete="new-password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Reintrodu parola"
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[38px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading || !passwordEvaluation.isAllValid || !passwordsMatch}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs active:scale-[0.98] transition-all shadow-subtle disabled:opacity-40 disabled:cursor-not-allowed min-h-[42px] mt-1"
                  >
                    {regLoading ? (
                      <span>Se creează contul...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Creează Cont</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-border/60 text-center text-xs text-text-muted">
                  Ai deja cont?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-0.5 ml-1"
                  >
                    <span>Autentifică-te</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Diagonal Sweeping Blade Overlay */}
        <div
          className={`hidden md:block absolute top-0 bottom-0 w-1/2 bg-surface-elevated border-border z-20 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLogin
              ? 'translate-x-full border-l'
              : 'translate-x-0 border-r'
          }`}
          style={{
            clipPath: isLogin
              ? 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)'
              : 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)',
          }}
          aria-hidden="true"
        >
          {/* Inner Content of the Sweeping Blade */}
          <div className="h-full w-full p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-transparent to-surface-elevated">
            {/* Ambient Corner Accent */}
            <div className="w-40 h-40 rounded-full bg-cyan-500/15 filter blur-3xl absolute top-0 right-0 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                <Sparkles className="w-3 h-3" />
                <span>Bacalaureat 2025–2026</span>
              </span>

              <h2 className="font-display text-2xl font-bold text-text leading-snug">
                {isLogin ? 'Pregătire completă, rezultate sigure.' : 'Metoda structurată de învățare.'}
              </h2>

              <p className="text-xs text-text-muted leading-relaxed max-w-xs">
                {isLogin
                  ? 'Accesează eseurile de 10 la Română și sintezele cronologice la Istorie direct pe profilul tău.'
                  : 'Fără informații redundante. Înveți direct pe baremul oficial de evaluare.'}
              </p>
            </div>

            <div className="space-y-3 relative z-10 pt-6 border-t border-border/40">
              <div className="flex items-center gap-2.5 text-xs text-text">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px]">Conținut actualizat conform programei oficiale</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-text">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px]">Algoritm de retenție și monitorizare streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Clean Responsive Stack (< md) */}
        <div className="md:hidden p-6">
          {/* Mobile Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-surface-elevated p-1 border border-border mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                isLogin
                  ? 'bg-cyan-500 text-black shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Autentificare
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                !isLogin
                  ? 'bg-cyan-500 text-black shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Înregistrare
            </button>
          </div>

          {/* Form Content */}
          {isLogin ? (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h1 className="font-display text-xl font-bold text-text">Autentificare Elev</h1>
                <p className="text-xs text-text-muted">Continuă pregătirea de unde ai rămas.</p>
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="m-login-email" className="block text-xs font-semibold text-text">
                    Adresă de e-mail
                  </label>
                  <input
                    id="m-login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="exemplu@liceu.ro"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 min-h-[42px]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="m-login-password" className="block text-xs font-semibold text-text">
                      Parolă
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Ai uitat parola?
                    </Link>
                  </div>
                  <PasswordInput
                    id="m-login-password"
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 min-h-[42px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs active:scale-[0.98] transition-all shadow-subtle disabled:opacity-50 min-h-[44px]"
                >
                  {loginLoading ? <span>Se conectează...</span> : <span>Intră în cont</span>}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {regSuccess ? (
                <div className="text-center space-y-3 py-6">
                  <CheckCircle2 className="w-10 h-10 text-status-success mx-auto" />
                  <h2 className="font-display text-lg font-bold text-text">Cont creat cu succes!</h2>
                  <p className="text-xs text-text-muted">Te redirecționăm către panoul de studiu...</p>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <h1 className="font-display text-xl font-bold text-text">Creează Cont Gratuit</h1>
                    <p className="text-xs text-text-muted">Pregătire structurată pentru Bacalaureat.</p>
                  </div>

                  {regError && (
                    <div
                      role="alert"
                      className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label htmlFor="m-reg-fullname" className="block text-xs font-semibold text-text">
                        Nume complet
                      </label>
                      <input
                        id="m-reg-fullname"
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="ex: Andrei Popescu"
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 min-h-[40px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="m-reg-email" className="block text-xs font-semibold text-text">
                        Adresă de e-mail
                      </label>
                      <input
                        id="m-reg-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="exemplu@liceu.ro"
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 min-h-[40px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="m-reg-password" className="block text-xs font-semibold text-text">
                        Parolă
                      </label>
                      <PasswordInput
                        id="m-reg-password"
                        required
                        autoComplete="new-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minim 8 caractere"
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 min-h-[40px]"
                      />
                    </div>

                    {regPassword.length > 0 && (
                      <div className="p-2 rounded-lg bg-surface-elevated/40 border border-border-subtle">
                        <PasswordStrength password={regPassword} />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label htmlFor="m-reg-confirm" className="block text-xs font-semibold text-text">
                        Confirmă parola
                      </label>
                      <PasswordInput
                        id="m-reg-confirm"
                        required
                        autoComplete="new-password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Reintrodu parola"
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated/70 border border-border text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 min-h-[40px]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading || !passwordEvaluation.isAllValid || !passwordsMatch}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs active:scale-[0.98] transition-all shadow-subtle disabled:opacity-40 min-h-[44px]"
                    >
                      {regLoading ? <span>Se creează contul...</span> : <span>Creează Cont</span>}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthShell
