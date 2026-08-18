import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silent telemetry & error logging (No raw stack traces shown to end-user)
    console.error('[GlobalErrorBoundary] Unhandled UI Exception caught:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-subtle">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-text tracking-tight">
                A apărut o problemă neașteptată
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Platforma a întâmpinat o eroare temporară la afișarea acestei pagini. Datele tale sunt în siguranță.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors shadow-subtle cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reîmprospătează pagina</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-surface-elevated border border-border text-text font-bold text-sm hover:bg-surface transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Mergi la Prima Pagină</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
