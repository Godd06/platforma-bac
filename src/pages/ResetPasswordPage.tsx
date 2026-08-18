import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { BookOpen, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { evaluatePassword } from '@/utils/passwordValidation'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordEvaluation = evaluatePassword(password)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!passwordEvaluation.isAllValid) {
      setError('Noua parolă trebuie să respecte toate cerințele de securitate de mai jos.')
      return
    }

    if (password !== confirmPassword) {
      setError('Parolele introduse nu coincid.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message || 'Nu am putut actualiza parola. Linkul ar putea fi expirat sau nevalid.')
      } else {
        // Hardening: Revoke all active sessions across all devices for security
        await supabase.auth.signOut({ scope: 'global' })
        setSuccess(true)
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2500)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare neașteptată.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="rounded-xl border border-status-success/30 bg-surface p-8 text-center space-y-4 shadow-raised">
          <div className="w-12 h-12 rounded-lg bg-status-success/15 border border-status-success/30 text-status-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-text">Parolă actualizată!</h2>
            <p className="text-xs text-text-muted">
              Parola ta a fost schimbată cu succes. Te redirecționăm către autentificare...
            </p>
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
            Setează Noua Parolă
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Alege o parolă sigură pentru a-ți proteja contul.
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
            <label htmlFor="new-password" className="block text-xs font-semibold text-text">
              Noua parolă
            </label>
            <PasswordInput
              id="new-password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs sm:text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[42px]"
            />
          </div>

          {password.length > 0 && (
            <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border-subtle">
              <PasswordStrength password={password} />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-text">
              Confirmă noua parolă
            </label>
            <PasswordInput
              id="confirm-new-password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated/70 border border-border text-xs sm:text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all min-h-[42px]"
            />
            {confirmPassword.length > 0 && (
              <p
                className={`text-[11px] font-medium flex items-center gap-1 ${
                  passwordsMatch ? 'text-status-success' : 'text-status-danger'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Parolele coincid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Parolele nu coincid</span>
                  </>
                )}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordEvaluation.isAllValid || !passwordsMatch}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm active:scale-[0.98] transition-all shadow-subtle disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? (
              <span>Se actualizează...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Actualizează parola</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-border/60 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-cyan-400 transition-colors"
          >
            <span>Mergi la autentificare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
