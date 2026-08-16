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
import { Skeleton } from '@/components/ui/Skeleton'

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

  // 1. Premium Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn select-none">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" rounded="md" />
          <Skeleton className="h-4 w-4" rounded="sm" />
          <Skeleton className="h-4 w-36" rounded="md" />
        </div>

        {/* Header card skeleton */}
        <div className="p-6 sm:p-7 rounded-2xl glass-elevated border border-border space-y-2.5 shadow-subtle">
          <Skeleton className="h-4 w-32" rounded="md" />
          <Skeleton className="h-8 w-64" rounded="lg" />
          <Skeleton className="h-4 w-full max-w-xl" rounded="md" />
        </div>

        {/* Search bar skeleton */}
        <Skeleton className="h-11 w-full" rounded="xl" />

        {/* Subject / Chapter Grid Skeleton */}
        <div className="space-y-3.5 pt-2">
          <div className="flex justify-between items-center pb-1">
            <Skeleton className="h-5 w-44" rounded="md" />
            <Skeleton className="h-4 w-20" rounded="md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12" rounded="2xl" />
                <Skeleton className="h-6 w-20" rounded="lg" />
              </div>
              <Skeleton className="h-6 w-36" rounded="lg" />
              <Skeleton className="h-3.5 w-full" rounded="md" />
              <Skeleton className="h-10 w-full" rounded="xl" />
            </div>

            <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12" rounded="2xl" />
                <Skeleton className="h-6 w-20" rounded="lg" />
              </div>
              <Skeleton className="h-6 w-36" rounded="lg" />
              <Skeleton className="h-3.5 w-full" rounded="md" />
              <Skeleton className="h-10 w-full" rounded="xl" />
            </div>

            <div className="p-6 rounded-2xl glass-elevated border border-border space-y-4 shadow-subtle hidden lg:block">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12" rounded="2xl" />
                <Skeleton className="h-6 w-20" rounded="lg" />
              </div>
              <Skeleton className="h-6 w-36" rounded="lg" />
              <Skeleton className="h-3.5 w-full" rounded="md" />
              <Skeleton className="h-10 w-full" rounded="xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Error State (Invalid subject slug)
  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display text-lg font-bold text-text">Materia nu a fost găsită</h2>
        <p className="text-xs text-text-muted">{error}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-elevated transition-colors min-h-[38px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reîncearcă</span>
          </button>
          <Link
            to="/catalog"
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-subtle min-h-[38px] inline-flex items-center"
          >
            Înapoi la Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* LEVEL 2: Subject View (/catalog/:subject) -> Single page with Expandable Chapter Cards */}
      {subjectSlug && subjectDetail ? (
        <div className="space-y-5">
          <CatalogBreadcrumbs subjectName={subjectDetail.subject.name} />

          <header className="rounded-xl glass-elevated p-5 sm:p-6 space-y-1.5 relative">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Programa Oficială</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight">
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
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută o operă, autor sau titlu de eseu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm font-medium text-text placeholder:text-text-muted focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 transition-all shadow-subtle min-h-[44px]"
            />
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h2 className="font-display text-sm sm:text-base font-bold text-text flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                <span>Opere și Capitole ({filteredChapters.length})</span>
              </h2>
            </div>

            {filteredChapters.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border rounded-xl glass-subtle p-4 text-text-muted space-y-1.5">
                <p className="text-xs sm:text-sm font-medium">
                  {searchQuery
                    ? `Niciun rezultat găsit pentru „${searchQuery}”.`
                    : 'Nu există capitole publicate pentru această materie încă.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
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
        <div className="space-y-5">
          <header className="rounded-xl glass-elevated p-5 sm:p-6 space-y-1">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-text tracking-tight">
              Catalog Materii Bacalaureat
            </h1>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-2xl">
              Structura oficială a materiilor de examen. Alege o materie pentru a accesa eseurile și sintezele aferente.
            </p>
          </header>

          <section className="space-y-3.5">
            <h2 className="font-display text-sm sm:text-base font-bold text-text flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Materii Disponibile ({subjectsList.length})</span>
            </h2>

            {subjectsList.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border rounded-xl bg-surface/30 p-4 text-text-muted space-y-1">
                <p className="text-xs sm:text-sm font-medium">Nu există materii publicate în catalog încă.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
