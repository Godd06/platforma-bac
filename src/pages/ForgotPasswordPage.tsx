import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { BookOpen, AlertCircle, CheckCircle2, ArrowLeft, Mail } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) {
        setError(resetError.message || 'Nu am putut trimite linkul de resetare.')
      } else {
        setSubmitted(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare neașteptată.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="rounded-xl border border-status-success/30 bg-surface p-8 text-center space-y-4 shadow-raised">
          <div className="w-12 h-12 rounded-lg bg-status-success/15 border border-status-success/30 text-status-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-text">Link de resetare trimis</h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Dacă adresa <strong className="text-text">{email}</strong> există în sistem, vei primi un e-mail cu instrucțiuni pentru resetarea parolei.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Înapoi la autentificare</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4 animate-fadeIn">
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-raised">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text">
            Resetare Parolă
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Introdu e-mailul asociat contului tău pentru a primi linkul de recuperare.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="block text-xs font-semibold text-text">
              Adresă de e-mail
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplu@liceu.ro"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs sm:text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[42px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm active:scale-[0.98] transition-all shadow-subtle disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <span>Se trimite linkul...</span>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Trimite link de resetare</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-border/60 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Înapoi la autentificare</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
