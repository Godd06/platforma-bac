import React, { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Activity,
  Zap,
  Search,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  BookOpen,
  Eye,
} from 'lucide-react'
import { fetchRealAnalyticsMetrics, type RealAnalyticsOverview } from '@/services/analyticsService'
import { EmptyState } from '@/components/ui/EmptyState'

export const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RealAnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchRealAnalyticsMetrics()
    if (res.error) {
      setError(res.error)
    } else if (res.data) {
      setMetrics(res.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-subtle">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            Analytics & Telemetrie Reală (Admin Dashboard)
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Statistici calculate exclusiv din evenimente reale stocate în baza de date. 0 date fictive sau PII nesigure.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAnalytics}
          className="px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-text font-bold text-sm hover:bg-surface transition-colors flex items-center gap-2 shadow-subtle cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Reîmprospătează
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-surface-elevated animate-pulse border border-border" />
          ))}
        </div>
      ) : metrics ? (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Page Visits */}
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Vizite Pagini</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text">{metrics.totalVisits}</p>
              <p className="text-[11px] text-text-muted">Evenimente reale `page_visit`</p>
            </div>

            {/* 2. Registrations */}
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Înregistrări Noi</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text">{metrics.totalRegistrations}</p>
              <p className="text-[11px] text-text-muted">Conturi nou create în DB</p>
            </div>

            {/* 3. Lesson Completions */}
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Lecții Completate</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text">{metrics.totalLessonCompletions}</p>
              <p className="text-[11px] text-text-muted">Finalizări de lecții verificate</p>
            </div>

            {/* 4. Mastery Velocity (FEATURED METRIC) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border-2 border-amber-500/40 shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  Mastery Velocity
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Formula Canonică
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {metrics.averageMasteryVelocity} <span className="text-sm font-normal text-text-muted">lecții / zi</span>
              </p>
              <p className="text-[11px] text-text-muted" title="Progres mediu calculat ca lecții completate împărțit la zilele active de învățare ale fiecărui elev.">
                Formula: Vitesa = Lecții / Zile Active
              </p>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Search Queries & Failed Searches */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Performanță Căutare & Termeni Căutați
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-elevated border border-border flex justify-between items-center text-xs">
                  <span className="text-text-muted font-semibold">Căutări fără Rezultate (Failed Searches):</span>
                  <span className={`font-bold ${metrics.totalFailedSearches > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {metrics.totalFailedSearches}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-elevated border border-border flex justify-between items-center text-xs">
                  <span className="text-text-muted font-semibold">Media Defectă / Neîncărcată (Broken Media):</span>
                  <span className={`font-bold ${metrics.totalBrokenMediaErrors > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {metrics.totalBrokenMediaErrors}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-2">Top Căutări Executate:</h4>
                  {metrics.topSearches.length === 0 ? (
                    <p className="text-xs text-text-muted italic">Nicio căutare înregistrată încă.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {metrics.topSearches.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-surface-elevated/60">
                          <span className="font-mono text-text">„{s.query}”</span>
                          <span className="font-bold text-amber-400">{s.count} căutări</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real Event Telemetry Stream */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                Flux Live Telemetrie (Ultimele Evenimente)
              </h3>

              {metrics.recentEvents.length === 0 ? (
                <p className="text-xs text-text-muted italic">Niciun eveniment recent înregistrat.</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {metrics.recentEvents.map((evt) => (
                    <div key={evt.id} className="p-2.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-400 font-mono uppercase text-[11px]">{evt.type}</span>
                        <p className="text-[11px] text-text-muted truncate max-w-[200px]" title={JSON.stringify(evt.payload)}>
                          {JSON.stringify(evt.payload)}
                        </p>
                      </div>
                      <span className="text-[10px] text-text-muted">{new Date(evt.timestamp).toLocaleTimeString('ro-RO')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="Nu există date analytics" description="Nu s-au putut încărca metricile de telemetrie." />
      )}
    </div>
  )
}
