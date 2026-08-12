import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, User } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setError('Te rugăm să completezi toate câmpurile obligatorii.')
      return
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere.')
      return
    }

    if (password !== confirmPassword) {
      setError('Parolele introduse nu se potrivesc.')
      return
    }

    try {
      setLoading(true)
      const { data, error: signUpError } = await signUp(email, password, {
        data: {
          full_name: displayName.trim() || null,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session) {
        // Direct auto-login session established
        navigate('/dashboard', { replace: true })
      } else if (data.user) {
        // Email confirmation required by Supabase project configuration
        setSuccessMessage(
          'Contul a fost creat cu succes! Te rugăm să îți verifici e-mailul pentru a confirma înregistrarea.'
        )
      }
    } catch (err) {
      console.error('[RegisterPage] Error during registration:', err)
      setError('A apărut o eroare neașteptată la crearea contului. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-xl space-y-6 shadow-xl border border-border/60">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Creează un cont elev</h2>
          <p className="text-sm text-text-muted">
            Alătură-te platformei pentru pregătirea examenului de Bacalaureat.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Nume complet</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Popescu Andrei"
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Adresă de e-mail *</label>
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
            <label className="text-xs font-medium text-text-muted">Parolă *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minim 6 caractere"
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Confirmă parola *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetă parola"
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
                <span>Se creează contul...</span>
              </>
            ) : (
              <span>Creează cont</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2">
          Ai deja un cont?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Autentifică-te
          </Link>
        </div>
      </div>
    </div>
  )
}
