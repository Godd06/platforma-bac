import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, FolderKanban, ArrowLeft, Compass } from 'lucide-react'

export const AdminContentPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <FolderKanban className="w-4 h-4" />
            <span>Curriculum & Structură Editorială</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight mt-1">
            Gestiune Conținut Educațional
          </h1>
          <p className="text-xs text-text-muted">
            Ierarhie oficială conform Ministerului: Materie → Operă/Capitol → Lecție → Block Editor.
          </p>
        </div>

        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Panou Central Admin</span>
        </Link>
      </div>

      {/* Curriculum Trees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Română Column */}
        <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-text">Limba Română</h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              17 Autori
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Proză & Romane</span>
                <p className="text-[11px] text-text-muted">Ion, Moara cu noroc, Moromeții, Enigma Otiliei</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Poezie Canonică</span>
                <p className="text-[11px] text-text-muted">Luceafărul, Plumb, Corola de minuni, Testament</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Dramaturgie & Teatru</span>
                <p className="text-[11px] text-text-muted">O scrisoare pierdută, Iona</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>
          </div>
        </div>

        {/* Istorie Column */}
        <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-text">Istoria Românilor</h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
              Toate Epocile
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Constituțiile din România</span>
                <p className="text-[11px] text-text-muted">1866, 1923, 1938, 1948–1991</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Romanitatea Românilor</span>
                <p className="text-[11px] text-text-muted">Teorii istorice, izvoare bizantine</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-text">Democrație vs Totalitarism</span>
                <p className="text-[11px] text-text-muted">Comunism, rezistență, 1989</p>
              </div>
              <span className="text-status-success font-bold text-[10px]">Publicat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContentPage
