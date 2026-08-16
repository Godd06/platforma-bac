import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, CheckCircle2, Loader2, Mail, User, Check, X, ArrowLeft } from 'lucide-react'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { evaluatePassword } from '@/utils/passwordValidation'

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

  const isMatching = confirmPassword.length > 0 && password === confirmPassword
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setError('Te rugăm să completezi toate câmpurile obligatorii.')
      return
    }

    const evaluation = evaluatePassword(password)
    if (!evaluation.isAllValid) {
      setError('Parola nu îndeplinește toate cele 5 cerințe de securitate obligatorii.')
      return
    }

    if (password !== confirmPassword) {
      setError('Parolele introduse nu coincid.')
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
            <h2 className="text-2xl font-extrabold tracking-tight text-text">Creează cont elev</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Alătură-te gratuit platformei de pregătire pentru Bac.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-xs font-semibold text-text-muted">
              Nume complet
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Popescu Andrei"
                disabled={loading}
                autoComplete="name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface/90 border border-border text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all disabled:opacity-50 min-h-[46px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-xs font-semibold text-text-muted">
              Adresă de e-mail <span className="text-status-danger">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                id="reg-email"
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
            <label htmlFor="reg-password" className="text-xs font-semibold text-text-muted">
              Parolă <span className="text-status-danger">*</span>
            </label>
            <PasswordInput
              id="reg-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              autoComplete="new-password"
            />
            {/* Live Password Strength Meter */}
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="reg-confirm-password" className="text-xs font-semibold text-text-muted">
                Confirmă parola <span className="text-status-danger">*</span>
              </label>
              {isMatching && (
                <span className="text-xs font-semibold text-status-success flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Parolele coincid</span>
                </span>
              )}
              {isMismatch && (
                <span className="text-xs font-semibold text-status-danger flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  <span>Parolele nu coincid</span>
                </span>
              )}
            </div>
            <PasswordInput
              id="reg-confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              autoComplete="new-password"
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
                <span>Se creează contul...</span>
              </>
            ) : (
              <span>Creează cont</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2 border-t border-border/40">
          Ai deja un cont?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold">
            Autentifică-te
          </Link>
        </div>
      </div>
    </div>
  )
}
