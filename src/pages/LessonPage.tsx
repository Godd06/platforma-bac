import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  BookOpen,
} from 'lucide-react'

import { fetchLessonWithBlocks, type LessonFetchResult } from '@/services/lessonService'
import { LessonBlockRenderer } from '@/components/lesson/LessonBlockRenderer'
import { ProGateBanner } from '@/components/lesson/ProGateBanner'

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<LessonFetchResult | null>(null)

  const loadLesson = useCallback(async () => {
    if (!lessonId) return
    setLoading(true)
    const res = await fetchLessonWithBlocks(lessonId)
    setData(res)
    setLoading(false)
  }, [lessonId])

  useEffect(() => {
    loadLesson()
  }, [loadLesson])

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
        <div className="h-4 bg-border/60 rounded w-48" />
        <div className="space-y-3 p-6 rounded-2xl bg-surface border border-border">
          <div className="h-8 bg-border/60 rounded w-3/4" />
          <div className="h-4 bg-border/40 rounded w-1/2" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-border/40 rounded w-1/3" />
          <div className="h-20 bg-border/30 rounded-xl" />
          <div className="h-16 bg-border/30 rounded-xl" />
        </div>
      </div>
    )
  }

  // 2. Rule 2 State: NOT_FOUND (404 UI)
  if (!data || data.accessState === 'NOT_FOUND' || !data.lesson) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-text-muted">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text">Lecția nu a fost găsită (404)</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            {data?.errorMessage || 'Lecția pe care o cauți nu există sau a fost mutată.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Catalog
          </Link>
        </div>
      </div>
    )
  }

  // 3. Rule 2 State: ERROR (Error UI)
  if (data.accessState === 'ERROR') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text">Eroare la încărcarea lecției</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            {data.errorMessage || 'Nu s-au putut încărca datele din baza de date.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadLesson}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-text hover:bg-border/40 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Reîncearcă
          </button>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            Înapoi la Catalog
          </Link>
        </div>
      </div>
    )
  }

  const { lesson, blocks, subject, chapter, prevLesson, nextLesson, accessState } = data
  const isProRequired = accessState === 'PRO_REQUIRED'

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la Catalog
        </button>

        <nav className="flex items-center gap-2 text-xs text-text-muted">
          <Link to="/catalog" className="hover:underline">
            Catalog
          </Link>
          {subject && (
            <>
              <span>/</span>
              <span className="font-medium text-text">{subject.name}</span>
            </>
          )}
          {chapter && (
            <>
              <span>/</span>
              <span className="text-text-muted">{chapter.title}</span>
            </>
          )}
        </nav>
      </div>

      {/* Lesson Header Banner (Always visible for Discovery) */}
      <header className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            {subject?.name || 'Materia Bac'}
          </span>

          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-border/50 text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              {lesson.estimated_minutes} minute
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              lesson.access_level === 'pro'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {lesson.access_level === 'pro' && <Lock className="w-3 h-3" />}
            {lesson.access_level === 'pro' ? 'Acces PRO 🔒' : 'Gratuit'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {lesson.short_description && (
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            {lesson.short_description}
          </p>
        )}
      </header>

      {/* Content Area: Either PRO Gate or Lesson Blocks */}
      <main className="space-y-6">
        {isProRequired ? (
          /* Rule 2: PRO + non-PRO -> Metadata + PRO Gate (no blocks, no 404) */
          <ProGateBanner lessonTitle={lesson.title} />
        ) : blocks.length === 0 ? (
          /* Rule 2: FREE/ACCESSIBLE but empty blocks */
          <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-surface p-6 text-text-muted space-y-2">
            <p className="text-base font-medium">Această lecție nu conține blocuri de conținut încă.</p>
          </div>
        ) : (
          /* Rule 2: ACCESSIBLE -> Metadata + Blocks */
          blocks.map((block) => (
            <LessonBlockRenderer key={block.id} block={block} />
          ))
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-text hover:bg-border/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-text-muted" />
            <span className="hidden sm:inline">Anterioara:</span> {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}

        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-sm font-semibold text-text hover:bg-border/40 transition-colors"
        >
          Înapoi la Catalog
        </Link>

        {nextLesson ? (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="hidden sm:inline">Următoarea:</span> {nextLesson.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </div>
  )
}

export default LessonPage
