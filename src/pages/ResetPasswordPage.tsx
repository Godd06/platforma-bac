import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError('Te rugăm să introduci și să confirmi noua parolă.')
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

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error('[ResetPasswordPage] Supabase update password error:', updateError)
        setError(updateError.message || 'Nu s-a putut actualiza parola. Verifică valabilitatea linkului.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
    } catch (err) {
      console.error('[ResetPasswordPage] Unexpected error:', err)
      setError('A apărut o eroare neașteptată la resetarea parolei.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-xl space-y-6 shadow-xl border border-border/60">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Setare parolă nouă</h2>
          <p className="text-sm text-text-muted">
            Introdu noua ta parolă mai jos.
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
              <h3 className="text-lg font-bold text-text">Parolă schimbată cu succes!</h3>
              <p className="text-sm text-text-muted">
                Parola ta a fost actualizată. Te redirecționăm către pagina de autentificare...
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Mergi la Autentificare acum
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted">Parolă nouă</label>
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
              <label className="text-xs font-medium text-text-muted">Confirmă noua parolă</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmă noua parolă"
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
                  <span>Se salvează noua parolă...</span>
                </>
              ) : (
                <span>Salvează noua parolă</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
