import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { PasswordInput } from '@/components/ui/PasswordInput'

export const getSafeRedirectUrl = (rawState: unknown, defaultUrl = '/dashboard'): string => {
  if (!rawState || typeof rawState !== 'object') return defaultUrl
  const fromPath = (rawState as { from?: { pathname?: string } })?.from?.pathname
  if (!fromPath || typeof fromPath !== 'string') return defaultUrl

  // Sanitize: ensure path starts with '/' and does not contain protocol specifiers or '//'
  if (fromPath.startsWith('/') && !fromPath.startsWith('//') && !fromPath.includes(':')) {
    return fromPath
  }

  return defaultUrl
}

export const LoginPage: React.FC = () => {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Te rugăm să introduci atât adresa de e-mail, cât și parola.')
      return
    }

    try {
      setLoading(true)
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message)
        return
      }

      // Successful login -> Redirect safely to intended internal path or /dashboard
      const redirectUrl = getSafeRedirectUrl(location.state)
      navigate(redirectUrl, { replace: true })
    } catch (err) {
      console.error('[LoginPage] Unexpected error during login:', err)
      setError('A apărut o eroare neașteptată la autentificare. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="glass-panel-cyan p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border border-cyan-500/20">
        <div className="space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-cyan-400 transition-colors mb-1 min-h-[32px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Înapoi pe prima pagină</span>
          </Link>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-text">Autentificare</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Conectează-te pentru a-ți continua pregătirea la Bac.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-text-muted">
              Adresă de e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elev@exemplu.ro"
                disabled={loading}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface/90 border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all disabled:opacity-50 min-h-[46px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-text-muted">
                Parolă
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline min-h-[24px] flex items-center"
              >
                Ai uitat parola?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 min-h-[46px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Se conectează...</span>
              </>
            ) : (
              <span>Intră în cont</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2 border-t border-border/40">
          Nu ai încă un cont?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold">
            Creează cont gratuit
          </Link>
        </div>
      </div>
    </div>
  )
}
