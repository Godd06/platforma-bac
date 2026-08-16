import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, BookOpen, Sparkles, ArrowRight, Layers, FileText } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl glass-elevated border border-amber-500/30 space-y-2 shadow-subtle">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Panou Central de Administrare</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text tracking-tight">
          Bun venit în Platforma<span className="text-amber-400">Admin</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
          Monitorizează starea conținutului educațional, gestiunea materiilor de examen, rolurile echipei editoriale și abonamentele active.
        </p>
      </div>

      {/* Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-default border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Materii & Curriculum</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-display text-2xl font-bold text-text">2 Materii</p>
          <p className="text-[11px] text-text-subtle">Română (17 autori) & Istorie</p>
        </div>

        <div className="p-5 rounded-2xl glass-default border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Nivel de Securitate</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-300">RLS Activ</p>
          <p className="text-[11px] text-text-subtle">Politici Supabase consolidate</p>
        </div>

        <div className="p-5 rounded-2xl glass-default border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Pachet PRO</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-300">Stripe & Subscriptions</p>
          <p className="text-[11px] text-text-subtle">Acces canonic & audio sinteze</p>
        </div>
      </div>

      {/* Fast Navigation Quick Links */}
      <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4">
        <h2 className="font-display text-base font-bold text-text flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Module de Administrare Rapidă</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/admin/content"
            className="p-4 rounded-xl glass-subtle border border-border-subtle hover:border-amber-500/40 hover:bg-surface-elevated transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-text group-hover:text-amber-300 transition-colors">
                  Curriculum & Lecții
                </p>
                <p className="text-[11px] text-text-muted">Gestionare capitole și blocuri de text</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-subtle group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/dashboard"
            className="p-4 rounded-xl glass-subtle border border-border-subtle hover:border-cyan-500/40 hover:bg-surface-elevated transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-text group-hover:text-cyan-300 transition-colors">
                  Modul Elev (Student View)
                </p>
                <p className="text-[11px] text-text-muted">Previzualizează experiența utilizatorilor</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-subtle group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
