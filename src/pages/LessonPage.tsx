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
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { BackToTop } from '@/components/ui/BackToTop'

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
        <div className="h-4 bg-surface-elevated rounded w-48" />
        <div className="space-y-3 p-8 rounded-3xl bg-surface/80 border border-border">
          <div className="h-8 bg-surface-elevated rounded w-3/4" />
          <div className="h-4 bg-surface-elevated/60 rounded w-1/2" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-surface-elevated rounded w-1/3" />
          <div className="h-24 bg-surface-elevated/50 rounded-2xl" />
          <div className="h-20 bg-surface-elevated/50 rounded-2xl" />
        </div>
      </div>
    )
  }

  // 2. Rule 2 State: NOT_FOUND (404 UI)
  if (!data || data.accessState === 'NOT_FOUND' || !data.lesson) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-surface border border-border flex items-center justify-center mx-auto text-text-muted">
          <FileQuestion className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text">Lecția nu a fost găsită (404)</h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            {data?.errorMessage || 'Lecția pe care o cauți nu există sau a fost mutată.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors shadow-glow min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Înapoi la Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  // 3. Rule 2 State: ERROR (Error UI)
  if (data.accessState === 'ERROR') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text">Eroare la încărcarea lecției</h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            {data.errorMessage || 'Nu s-au putut încărca datele din baza de date.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadLesson}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-text hover:bg-surface-elevated transition-colors text-xs font-semibold min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reîncearcă</span>
          </button>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-glow min-h-[44px]"
          >
            <span>Înapoi la Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  const { lesson, blocks, subject, chapter, prevLesson, nextLesson, accessState } = data
  const isProRequired = accessState === 'PRO_REQUIRED'

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-2 sm:px-4 animate-fadeIn">
      {/* Scroll Progress Indicator for Calm Reading Experience */}
      <ScrollProgressBar />

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-muted hover:text-cyan-400 transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Înapoi la Catalog</span>
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-text-muted truncate max-w-[280px] sm:max-w-md">
          <Link to="/catalog" className="hover:underline hover:text-text transition-colors">
            Catalog
          </Link>
          {subject && (
            <>
              <span>/</span>
              <span className="font-semibold text-text truncate">{subject.name}</span>
            </>
          )}
          {chapter && (
            <>
              <span>/</span>
              <span className="text-text-muted truncate hidden sm:inline">{chapter.title}</span>
            </>
          )}
        </nav>
      </div>

      {/* Lesson Header Banner */}
      <header className="rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-surface to-surface p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{subject?.name || 'Materia Bac'}</span>
          </span>

          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated text-text-muted border border-border">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lesson.estimated_minutes} minute</span>
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              lesson.access_level === 'pro'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {lesson.access_level === 'pro' && <Lock className="w-3 h-3" />}
            <span>{lesson.access_level === 'pro' ? 'Acces PRO 🔒' : 'Gratuit'}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {lesson.short_description && (
          <p className="text-xs sm:text-base text-text-muted leading-relaxed">
            {lesson.short_description}
          </p>
        )}
      </header>

      {/* Content Area: Either PRO Gate or Lesson Blocks */}
      <div className="space-y-6">
        {isProRequired ? (
          <ProGateBanner lessonTitle={lesson.title} />
        ) : blocks.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border rounded-3xl bg-surface/40 p-6 text-text-muted space-y-2">
            <p className="text-base font-medium">Această lecție nu conține blocuri de conținut încă.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <LessonBlockRenderer key={block.id} block={block} />
          ))
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm font-semibold text-text hover:bg-surface-elevated hover:border-cyan-500/40 transition-colors min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span className="truncate max-w-[200px]">Anterioara: {prevLesson.title}</span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Link
          to="/catalog"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm font-bold text-text hover:bg-surface-elevated transition-colors min-h-[44px]"
        >
          <span>Catalog</span>
        </Link>

        {nextLesson ? (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs sm:text-sm font-bold hover:bg-cyan-400 transition-colors shadow-glow min-h-[44px]"
          >
            <span className="truncate max-w-[200px]">Următoarea: {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </footer>

      {/* Back to Top Floating Button */}
      <BackToTop />
    </div>
  )
}

export default LessonPage
