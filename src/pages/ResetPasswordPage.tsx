import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle2, Loader2, Check, X } from 'lucide-react'
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

  const isMatching = confirmPassword.length > 0 && password === confirmPassword
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError('Te rugăm să introduci și să confirmi noua parolă.')
      return
    }

    const evaluation = evaluatePassword(password)
    if (!evaluation.isAllValid) {
      setError('Noua parolă nu îndeplinește toate cele 5 cerințe de securitate obligatorii.')
      return
    }

    if (password !== confirmPassword) {
      setError('Parolele introduse nu coincid.')
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
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="glass-panel-cyan p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border border-cyan-500/20">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-text">Setare parolă nouă</h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Introdu noua ta parolă securizată mai jos.
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
              <h3 className="text-lg font-bold text-text">Parolă schimbată cu succes!</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Parola ta a fost actualizată. Te redirecționăm către pagina de autentificare...
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-4 text-xs sm:text-sm font-bold text-cyan-400 hover:underline"
            >
              Mergi la Autentificare acum
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-password" className="text-xs font-semibold text-text-muted">
                Parolă nouă <span className="text-status-danger">*</span>
              </label>
              <PasswordInput
                id="reset-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="reset-confirm-password" className="text-xs font-semibold text-text-muted">
                  Confirmă noua parolă <span className="text-status-danger">*</span>
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
                id="reset-confirm-password"
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
