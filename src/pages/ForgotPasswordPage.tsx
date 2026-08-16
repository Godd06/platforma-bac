import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle2, Loader2, Mail, ArrowLeft } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Te rugăm să introduci adresa de e-mail.')
      return
    }

    try {
      setLoading(true)

      const redirectUrl = `${window.location.origin}/reset-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (resetError) {
        console.error('[ForgotPasswordPage] Supabase error:', resetError)
        setError('A apărut o eroare la trimiterea solicitării. Încearcă din nou.')
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('[ForgotPasswordPage] Unexpected error:', err)
      setError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="glass-panel-cyan p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border border-cyan-500/20">
        <div className="space-y-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-cyan-400 transition-colors mb-1 min-h-[32px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Înapoi la Autentificare</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-text">Ai uitat parola?</h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Introdu adresa de e-mail asociată contului tău. Îți vom trimite un link securizat pentru resetare.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-status-success/15 text-status-success border border-status-success/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-text">Verifică-ți căsuța poștală</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Dacă adresa <strong className="text-text">{email}</strong> există în sistem, am trimis un link securizat pentru resetarea parolei.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-4 text-xs sm:text-sm font-bold text-cyan-400 hover:underline"
            >
              Revin-o la conectare
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="text-xs font-semibold text-text-muted">
                Adresă de e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="forgot-email"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 min-h-[46px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Se trimite solicitarea...</span>
                </>
              ) : (
                <span>Trimite linkul de resetare</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
