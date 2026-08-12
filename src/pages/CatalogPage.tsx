import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, FolderKanban, AlertCircle, RefreshCw } from 'lucide-react'

import {
  fetchPublishedSubjects,
  fetchSubjectWithChaptersAndLessons,
  type CatalogSubjectWithCounts,
  type CatalogSubjectDetail,
} from '@/services/catalogService'
import { SubjectCard } from '@/components/catalog/SubjectCard'
import { ChapterLessonsCard } from '@/components/catalog/ChapterLessonsCard'
import { CatalogBreadcrumbs } from '@/components/catalog/CatalogBreadcrumbs'

export const CatalogPage: React.FC = () => {
  const { subject: subjectSlug } = useParams<{ subject?: string }>()

  const [loading, setLoading] = useState<boolean>(true)
  const [subjectsList, setSubjectsList] = useState<CatalogSubjectWithCounts[]>([])
  const [subjectDetail, setSubjectDetail] = useState<CatalogSubjectDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
        <div className="h-6 bg-border/60 rounded w-48" />
        <div className="h-28 bg-surface border border-border rounded-2xl" />
        <div className="space-y-4">
          <div className="h-24 bg-surface border border-border rounded-2xl" />
          <div className="h-24 bg-surface border border-border rounded-2xl" />
        </div>
      </div>
    )
  }

  // 2. Error State (Invalid subject slug)
  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-text">Materia nu a fost găsită</h2>
        <p className="text-sm text-text-muted">{error}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-sm font-medium hover:bg-border/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reîncearcă
          </button>
          <Link
            to="/catalog"
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Înapoi la Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      {/* LEVEL 2: Subject View (/catalog/:subject) -> Single page with Expandable Chapter Cards */}
      {subjectSlug && subjectDetail ? (
        <div className="space-y-6">
          <CatalogBreadcrumbs subjectName={subjectDetail.subject.name} />

          <header className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <BookOpen className="w-4 h-4" />
              <span>Materie Bacalaureat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              {subjectDetail.subject.name}
            </h1>
            {subjectDetail.subject.description || subjectDetail.subject.short_description ? (
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                {subjectDetail.subject.description || subjectDetail.subject.short_description}
              </p>
            ) : null}
          </header>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <h2 className="text-lg sm:text-xl font-bold text-text flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                Opere și Capitole ({subjectDetail.chapters.length})
              </h2>
            </div>

            {subjectDetail.chapters.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-surface p-6 text-text-muted space-y-2">
                <p className="text-base font-medium">Nu există capitole publicate pentru această materie încă.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subjectDetail.chapters.map((chapter) => (
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
          <header className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Catalog Materii Bacalaureat
            </h1>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Explorează structura oficială a materiilor de examen. Selectează o materie pentru a vedea operele și lecțiile aferente.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Materiile Disponibile ({subjectsList.length})
            </h2>

            {subjectsList.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-surface p-6 text-text-muted space-y-2">
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
    </div>
  )
}

export default CatalogPage
