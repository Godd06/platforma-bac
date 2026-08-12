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

      // Success state (Generic message to prevent email enumeration)
      setSuccess(true)
    } catch (err) {
      console.error('[ForgotPasswordPage] Unexpected error:', err)
      setError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-xl space-y-6 shadow-xl border border-border/60">
        <div className="space-y-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Înapoi la Autentificare
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Ai uitat parola?</h2>
          <p className="text-sm text-text-muted">
            Introdu adresa de e-mail asociată contului tău. Îți vom trimite un link securizat pentru resetare.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-text">Verifică-ți căsuța poștală</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Dacă adresa <strong className="text-text">{email}</strong> există în sistem, am trimis un link securizat pentru resetarea parolei.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Revin-o la conectare
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
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
