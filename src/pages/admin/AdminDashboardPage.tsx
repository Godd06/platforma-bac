import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Sparkles,
  FileText,
  Clock,
  ChevronRight,
  FolderKanban,
  Crown,
  Unlock,
  Layers,
} from 'lucide-react'
import {
  fetchRecentLessons,
  fetchLessonsNeedingAttention,
  type EnrichedRecentLesson,
} from '@/services/adminCmsService'
import { AdminGlobalSearchModal } from '@/components/admin/cms/AdminGlobalSearchModal'
import { QuickCreateModal } from '@/components/admin/cms/QuickCreateModal'
import { AdminImportExportModal } from '@/components/admin/cms/AdminImportExportModal'
import { Skeleton } from '@/components/ui/Skeleton'

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()

  const [recentLessons, setRecentLessons] = useState<EnrichedRecentLesson[]>([])
  const [attentionLessons, setAttentionLessons] = useState<{
    drafts: EnrichedRecentLesson[]
    review: EnrichedRecentLesson[]
  }>({ drafts: [], review: [] })

  const [loading, setLoading] = useState(true)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)
  const [importExportOpen, setImportExportOpen] = useState(false)

  // Keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    const [recent, attention] = await Promise.all([
      fetchRecentLessons(8),
      fetchLessonsNeedingAttention(),
    ])
    setRecentLessons(recent)
    setAttentionLessons(attention)
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Command Bar */}
      <div className="p-6 sm:p-7 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <FolderKanban className="w-4 h-4" />
              <span>Admin Home & Content Command Center</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text tracking-tight mt-0.5">
              Administrare Conținut Educațional
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setImportExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-subtle border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all min-h-[40px]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Import AI / Export</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[40px]"
            >
              <Plus className="w-4 h-4" />
              <span>Creează Conținut</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar Button (100% clickable) */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="w-full p-3.5 rounded-xl bg-surface border border-border hover:border-amber-400/60 transition-all flex items-center justify-between text-left group shadow-subtle cursor-pointer"
        >
          <div className="flex items-center gap-3 text-text-muted group-hover:text-text transition-colors">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              Caută o lecție, autor, operă sau slug pentru a deschide direct editorul...
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] font-mono text-text-subtle">
              Ctrl+K
            </kbd>
            <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Main Grid: Recent & Attention */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <Skeleton className="h-8 w-48" rounded="xl" />
            <Skeleton className="h-32 w-full" rounded="2xl" />
            <Skeleton className="h-32 w-full" rounded="2xl" />
          </div>
          <div className="lg:col-span-5 space-y-3">
            <Skeleton className="h-8 w-48" rounded="xl" />
            <Skeleton className="h-64 w-full" rounded="2xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Continuă Editarea (Recent Lessons) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="font-display font-bold text-base text-text">
                  Continuă Editarea (Recente)
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/content')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Deschide Content Browser</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentLessons.length === 0 ? (
              <div className="p-8 rounded-2xl glass-elevated border border-border text-center space-y-3">
                <p className="text-xs text-text-muted font-medium">Nicio lecție editată recent.</p>
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Creează prima lecție</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentLessons.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(item.fullPath)}
                    className="p-4 rounded-2xl glass-elevated border border-border hover:border-amber-500/40 hover:bg-surface-elevated/80 transition-all flex items-center justify-between gap-4 shadow-subtle group cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(item.fullPath)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          <span className="truncate">{item.subjectName}</span>
                          <span>/</span>
                          <span className="truncate font-medium text-text">{item.chapterTitle}</span>
                        </div>

                        <h3 className="font-display font-bold text-sm text-text group-hover:text-amber-300 transition-colors truncate">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {item.access_level === 'pro' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                          <Unlock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                          FREE
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.status === 'published'
                            ? 'bg-status-success/15 text-status-success border-status-success/30'
                            : item.status === 'review'
                            ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30'
                            : 'bg-surface-elevated text-text-muted border-border'
                        }`}
                      >
                        {item.status === 'published'
                          ? 'Publicat'
                          : item.status === 'review'
                          ? 'Review'
                          : 'Draft'}
                      </span>

                      <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Necesită Atenție (Drafts & Review) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="font-display font-bold text-base text-text">
                  Necesită Atenție
                </h2>
              </div>

              <span className="text-xs text-text-subtle font-mono">
                {attentionLessons.drafts.length + attentionLessons.review.length} în lucru
              </span>
            </div>

            <div className="p-5 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
              {/* Review Section */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block">
                  🔵 În Așteptare Review ({attentionLessons.review.length})
                </span>

                {attentionLessons.review.length === 0 ? (
                  <p className="text-[11px] text-text-subtle italic pl-1">
                    Nicio lecție în stadiul de review.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {attentionLessons.review.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(item.fullPath)}
                        className="p-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(item.fullPath)}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-text-muted truncate block">
                            {item.chapterTitle}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border-subtle pt-3 space-y-2">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  🟡 Ciorne în Redactare ({attentionLessons.drafts.length})
                </span>

                {attentionLessons.drafts.length === 0 ? (
                  <p className="text-[11px] text-text-subtle italic pl-1">Nicio ciornă activă.</p>
                ) : (
                  <div className="space-y-1.5">
                    {attentionLessons.drafts.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(item.fullPath)}
                        className="p-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(item.fullPath)}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text group-hover:text-amber-300 transition-colors truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-text-muted truncate block">
                            {item.chapterTitle}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AdminGlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={(res) => {
          if (res.type === 'lesson') {
            if (res.subjectSlug && res.chapterSlug && res.slug) {
              navigate(`/admin/content/${res.subjectSlug}/${res.chapterSlug}/${res.slug}`)
            } else if (res.lessonId) {
              navigate(`/admin/editor/${res.lessonId}`)
            }
          } else if (res.type === 'chapter' && res.subjectSlug && res.slug) {
            navigate(`/admin/content/${res.subjectSlug}/${res.slug}`)
          } else if (res.type === 'subject' && res.slug) {
            navigate(`/admin/content/${res.slug}`)
          }
        }}
      />

      <QuickCreateModal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        onOpenImportAi={() => setImportExportOpen(true)}
      />

      <AdminImportExportModal
        isOpen={importExportOpen}
        activeSubject={null}
        activeChapter={null}
        activeLesson={null}
        onClose={() => setImportExportOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  )
}

export default AdminDashboardPage
