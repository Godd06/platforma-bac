import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, FolderKanban, AlertCircle, RefreshCw, Search } from 'lucide-react'

import {
  fetchPublishedSubjects,
  fetchSubjectWithChaptersAndLessons,
  type CatalogSubjectWithCounts,
  type CatalogSubjectDetail,
} from '@/services/catalogService'
import { SubjectCard } from '@/components/catalog/SubjectCard'
import { ChapterLessonsCard } from '@/components/catalog/ChapterLessonsCard'
import { CatalogBreadcrumbs } from '@/components/catalog/CatalogBreadcrumbs'
import { BackToTop } from '@/components/ui/BackToTop'

export const CatalogPage: React.FC = () => {
  const { subject: subjectSlug } = useParams<{ subject?: string }>()

  const [loading, setLoading] = useState<boolean>(true)
  const [subjectsList, setSubjectsList] = useState<CatalogSubjectWithCounts[]>([])
  const [subjectDetail, setSubjectDetail] = useState<CatalogSubjectDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Single-expanded accordion state: ID of currently expanded chapter (null by default = all collapsed)
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setExpandedChapterId(null) // Reset accordion expansion on navigation

    if (!subjectSlug) {
      // Level 1: Root /catalog -> Fetch all published subjects
      const list = await fetchPublishedSubjects()
      setSubjectsList(list)
      setSubjectDetail(null)
    } else {
      // Level 2: Subject /catalog/:subjectSlug -> Fetch subject with chapters & lessons inline
      const detail = await fetchSubjectWithChaptersAndLessons(subjectSlug)
      if (!detail) {
        setError(`Materia „${subjectSlug}” nu a fost găsită.`)
      } else {
        setSubjectDetail(detail)
      }
    }

    setLoading(false)
  }, [subjectSlug])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapterId((prev) => (prev === chapterId ? null : chapterId))
  }

  // Filter chapters based on search query if inside a subject
  const filteredChapters = (subjectDetail?.chapters || []).filter((ch) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const matchTitle = ch.title.toLowerCase().includes(query)
    const matchDesc = (ch.short_description || '').toLowerCase().includes(query)
    const matchLessons = ch.lessons.some((l) => l.title.toLowerCase().includes(query))
    return matchTitle || matchDesc || matchLessons
  })

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
        <div className="h-6 bg-surface-elevated rounded w-48" />
        <div className="h-32 bg-surface/80 border border-border rounded-3xl" />
        <div className="space-y-4">
          <div className="h-24 bg-surface/80 border border-border rounded-3xl" />
          <div className="h-24 bg-surface/80 border border-border rounded-3xl" />
        </div>
      </div>
    )
  }

  // 2. Error State (Invalid subject slug)
  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-text">Materia nu a fost găsită</h2>
        <p className="text-xs sm:text-sm text-text-muted">{error}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold hover:bg-surface-elevated transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reîncearcă</span>
          </button>
          <Link
            to="/catalog"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-glow min-h-[44px] inline-flex items-center"
          >
            Înapoi la Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-2 sm:px-4 animate-fadeIn">
      {/* LEVEL 2: Subject View (/catalog/:subject) -> Single page with Expandable Chapter Cards */}
      {subjectSlug && subjectDetail ? (
        <div className="space-y-6">
          <CatalogBreadcrumbs subjectName={subjectDetail.subject.name} />

          <header className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface p-6 sm:p-8 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <BookOpen className="w-4 h-4" />
              <span>Materie Bacalaureat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              {subjectDetail.subject.name}
            </h1>
            {subjectDetail.subject.description || subjectDetail.subject.short_description ? (
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
                {subjectDetail.subject.description || subjectDetail.subject.short_description}
              </p>
            ) : null}
          </header>

          {/* Search filter within subject */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută o operă, autor sau titlu de eseu..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface/90 border border-border text-xs sm:text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all min-h-[44px]"
            />
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h2 className="text-lg sm:text-xl font-bold text-text flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" />
                <span>Opere și Capitole ({filteredChapters.length})</span>
              </h2>
            </div>

            {filteredChapters.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-border rounded-3xl bg-surface/40 p-6 text-text-muted space-y-2">
                <p className="text-base font-medium">
                  {searchQuery
                    ? `Niciun rezultat găsit pentru „${searchQuery}”.`
                    : 'Nu există capitole publicate pentru această materie încă.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChapters.map((chapter) => (
                  <ChapterLessonsCard
                    key={chapter.id}
                    chapter={chapter}
                    isExpanded={expandedChapterId === chapter.id}
                    onToggle={() => handleToggleChapter(chapter.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* LEVEL 1: Catalog Root (/catalog) -> List all Subjects */
        <div className="space-y-6">
          <header className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-surface to-surface p-6 sm:p-8 shadow-xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Catalog Materii Bacalaureat
            </h1>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-2xl">
              Explorează structura oficială a materiilor de examen. Selectează o materie pentru a studia eseurile și sintezele aferente.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Materiile Disponibile ({subjectsList.length})</span>
            </h2>

            {subjectsList.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-border rounded-3xl bg-surface/40 p-6 text-text-muted space-y-2">
                <p className="text-base font-medium">Nu există materii publicate în catalog încă.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjectsList.map((subj) => (
                  <SubjectCard key={subj.id} subject={subj} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Back to Top Floating Button */}
      <BackToTop />
    </div>
  )
}

export default CatalogPage
