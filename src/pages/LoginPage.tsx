import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react'

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

  // Redirect destination after successful login with open-redirect protection
  const fromLocation = getSafeRedirectUrl(location.state)

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(fromLocation, { replace: true })
    }
  }, [user, navigate, fromLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Te rugăm să introduci e-mailul și parola.')
      return
    }

    try {
      setLoading(true)
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        // Map common Supabase auth errors to friendly Romanian messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Adresa de e-mail sau parola este incorectă.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Adresa de e-mail nu a fost confirmată. Verifică-ți căsuța poștală.')
        } else {
          setError(signInError.message)
        }
        return
      }

      // Successful login -> Redirect
      navigate(fromLocation, { replace: true })
    } catch (err) {
      console.error('[LoginPage] Error during login:', err)
      setError('A apărut o eroare la autentificare. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-xl space-y-6 shadow-xl border border-border/60">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Autentificare</h2>
          <p className="text-sm text-text-muted">
            Intră în contul tău pentru a continua pregătirea.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Adresă de e-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elev@exemplu.ro"
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-muted">Parolă</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                Ai uitat parola?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Se autentifică...</span>
              </>
            ) : (
              <span>Autentificare</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2">
          Nu ai cont?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Creează un cont
          </Link>
        </div>
      </div>
    </div>
  )
}
