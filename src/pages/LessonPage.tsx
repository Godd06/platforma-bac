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
  CheckCircle2,
  Maximize2,
  Minimize2,
} from 'lucide-react'

import {
  fetchLessonWithBlocks,
  getLessonProgress,
  recordLessonProgress,
  markLessonCompleted,
  type LessonFetchResult,
} from '@/services/lessonService'
import type { LessonProgress } from '@/types/database'
import { LessonBlockRenderer } from '@/components/lesson/LessonBlockRenderer'
import { ProGateBanner } from '@/components/lesson/ProGateBanner'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { BackToTop } from '@/components/ui/BackToTop'
import { AnimatedBorderButton } from '@/components/ui/AnimatedBorderButton'
import { LessonAudioBar } from '@/components/lesson/LessonAudioBar'
import { LessonBaremChecklist } from '@/components/lesson/LessonBaremChecklist'
import { LessonStudyNotes } from '@/components/lesson/LessonStudyNotes'
import { Skeleton } from '@/components/ui/Skeleton'

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<LessonFetchResult | null>(null)
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [completing, setCompleting] = useState<boolean>(false)
  const [completedSuccess, setCompletedSuccess] = useState<boolean>(false)
  const [focusMode, setFocusMode] = useState<boolean>(false)

  const loadLesson = useCallback(async () => {
    if (!lessonId) return
    setLoading(true)
    const res = await fetchLessonWithBlocks(lessonId)
    setData(res)

    if (res.accessState === 'ACCESSIBLE') {
      const userProgress = await getLessonProgress(lessonId)
      setProgress(userProgress)

      // If user has no progress row yet, record initial start
      if (!userProgress) {
        const initialProgress = await recordLessonProgress(lessonId, 15)
        if (initialProgress) {
          setProgress(initialProgress)
        }
      }
    }

    setLoading(false)
  }, [lessonId])

  useEffect(() => {
    loadLesson()
  }, [loadLesson])

  const handleMarkCompleted = async () => {
    if (!lessonId || completing) return
    setCompleting(true)

    try {
      const result = await markLessonCompleted(lessonId)
      if (result) {
        setProgress(result.progress)
        setCompletedSuccess(true)
      }
    } catch (err) {
      console.error('[LessonPage] Error completing lesson:', err)
    } finally {
      setCompleting(false)
    }
  }

  // 1. Premium Loading State (Textbook skeleton)
  if (loading) {
    return (
      <div className="max-w-prose mx-auto space-y-6 pb-16 px-2 sm:px-4 animate-fadeIn select-none">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <Skeleton className="h-4 w-20" rounded="md" />
          <Skeleton className="h-4 w-48" rounded="md" />
        </div>

        {/* Lesson Header Skeleton */}
        <div className="p-6 sm:p-7 rounded-2xl glass-elevated border border-border space-y-3.5 shadow-subtle">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" rounded="lg" />
            <Skeleton className="h-5 w-28" rounded="lg" />
            <Skeleton className="h-5 w-16" rounded="lg" />
          </div>
          <Skeleton className="h-9 w-4/5" rounded="xl" />
          <Skeleton className="h-4 w-full" rounded="md" />
        </div>

        {/* Audio Bar Skeleton */}
        <div className="p-4 rounded-2xl glass-elevated border border-border flex items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10" rounded="xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" rounded="md" />
              <Skeleton className="h-4 w-48" rounded="md" />
            </div>
          </div>
          <Skeleton className="h-8 w-28" rounded="xl" />
        </div>

        {/* Content Blocks Skeletons */}
        <div className="space-y-4 pt-1">
          <div className="p-6 rounded-2xl glass-elevated border border-border space-y-3 shadow-subtle">
            <Skeleton className="h-5 w-44" rounded="md" />
            <Skeleton className="h-4 w-full" rounded="md" />
            <Skeleton className="h-4 w-full" rounded="md" />
            <Skeleton className="h-4 w-3/4" rounded="md" />
          </div>

          <div className="p-6 rounded-2xl glass-elevated border border-border space-y-3 shadow-subtle">
            <Skeleton className="h-5 w-36" rounded="md" />
            <Skeleton className="h-4 w-full" rounded="md" />
            <Skeleton className="h-4 w-5/6" rounded="md" />
          </div>
        </div>

        {/* Barem checklist skeleton */}
        <div className="p-6 rounded-2xl glass-elevated border border-border space-y-3 shadow-subtle">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-56" rounded="md" />
            <Skeleton className="h-6 w-24" rounded="xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Skeleton className="h-20" rounded="xl" />
            <Skeleton className="h-20" rounded="xl" />
          </div>
        </div>
      </div>
    )
  }

  // 2. Rule 2 State: NOT_FOUND (404 UI)
  if (!data || data.accessState === 'NOT_FOUND' || !data.lesson) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-text-muted shadow-subtle">
          <FileQuestion className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-lg font-bold text-text">Lecția nu a fost găsită</h2>
          <p className="text-xs text-text-muted">
            {data?.errorMessage || 'Lecția pe care o cauți nu există sau a fost mutată.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow-subtle min-h-[38px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Înapoi la Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  // 3. Rule 2 State: ERROR (Error UI)
  if (data.accessState === 'ERROR') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-subtle">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-lg font-bold text-text">Eroare la încărcarea lecției</h2>
          <p className="text-xs text-text-muted">
            {data.errorMessage || 'Nu s-au putut încărca datele din baza de date.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadLesson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-text hover:bg-surface-elevated transition-colors text-xs font-semibold min-h-[38px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reîncearcă</span>
          </button>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-subtle min-h-[38px]"
          >
            <span>Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  const { lesson, blocks, subject, chapter, prevLesson, nextLesson, accessState } = data
  const isProRequired = accessState === 'PRO_REQUIRED'
  const isCompleted = progress?.status === 'completed' || completedSuccess
  const isHistorySubject = subject?.slug === 'istorie' || subject?.name.toLowerCase().includes('istorie')

  return (
    <div
      className={`mx-auto space-y-6 pb-20 px-2 sm:px-4 animate-fadeIn transition-all duration-300 ${
        focusMode ? 'max-w-3xl pt-2' : 'max-w-prose'
      }`}
    >
      {/* Scroll Progress Indicator for Calm Reading */}
      <ScrollProgressBar />

      {/* Top Breadcrumbs & Focus Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 no-print border-b border-border-subtle pb-2.5">
        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Catalog</span>
        </button>

        <div className="flex items-center gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-text-subtle truncate max-w-[200px] sm:max-w-md">
            {subject && <span className="font-semibold text-text truncate">{subject.name}</span>}
            {chapter && (
              <>
                <span>/</span>
                <span className="truncate hidden sm:inline">{chapter.title}</span>
              </>
            )}
          </nav>

          {/* Focus Mode Button */}
          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
              focusMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-subtle'
                : 'glass-subtle text-text-muted hover:text-text border-border-subtle'
            }`}
            title={focusMode ? 'Ieși din Modul Focus' : 'Activează Modul Focus (Fără Distrageri)'}
          >
            {focusMode ? <Minimize2 className="w-3 h-3 text-cyan-400" /> : <Maximize2 className="w-3 h-3" />}
            <span className="hidden sm:inline">{focusMode ? 'Focus Activ' : 'Mod Focus'}</span>
          </button>
        </div>
      </div>

      {/* Digital Textbook Lesson Header */}
      <header className="rounded-2xl glass-elevated border border-border p-6 sm:p-7 space-y-3 shadow-subtle">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{subject?.name || 'Materia Bac'}</span>
          </span>

          {lesson.estimated_minutes && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] glass-subtle text-text-muted border border-border-subtle">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lesson.estimated_minutes} min lectură</span>
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
              lesson.access_level === 'pro'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
            }`}
          >
            {lesson.access_level === 'pro' && <Lock className="w-2.5 h-2.5" />}
            <span>{lesson.access_level === 'pro' ? 'PRO' : 'GRATUIT'}</span>
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ASIMILATĂ</span>
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {lesson.short_description && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {lesson.short_description}
          </p>
        )}
      </header>

      {/* Audio Synthesis Bar with Speed Selector */}
      {!isProRequired && (
        <LessonAudioBar
          title={lesson.title}
          durationMinutes={lesson.estimated_minutes}
        />
      )}

      {/* Central Reading Column (Calm Matte Canvas) */}
      <div className="space-y-4">
        {isProRequired ? (
          <ProGateBanner lessonTitle={lesson.title} />
        ) : blocks.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border rounded-2xl glass-subtle p-4 text-text-muted space-y-1">
            <p className="text-xs sm:text-sm font-medium">Această lecție nu conține blocuri de conținut încă.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <LessonBlockRenderer key={block.id} block={block} />
          ))
        )}
      </div>

      {/* Interactive Self-Assessment on Official Barem (10p) */}
      {!isProRequired && blocks.length > 0 && (
        <LessonBaremChecklist
          lessonId={lesson.id}
          isHistory={Boolean(isHistorySubject)}
        />
      )}

      {/* Personal Study Notebook & Quotes */}
      {!isProRequired && blocks.length > 0 && (
        <LessonStudyNotes
          lessonId={lesson.id}
          lessonTitle={lesson.title}
        />
      )}

      {/* Interactive Lesson Completion Section */}
      {!isProRequired && blocks.length > 0 && (
        <section className="p-6 rounded-2xl glass-elevated border border-border space-y-3 no-print shadow-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                EVALUARE & ASIMILARE
              </span>
              <h3 className="font-display text-sm sm:text-base font-bold text-text">
                {isCompleted ? 'Lecție finalizată cu succes' : 'Ai asimilat ideile acestei lecții?'}
              </h3>
              <p className="text-xs text-text-muted">
                {isCompleted
                  ? 'Progresul tău a fost înregistrat și ritmul săptămânal a fost actualizat.'
                  : 'Marchează lecția pentru a actualiza progresul general și ritmul de învățare.'}
              </p>
            </div>

            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Asimilată</span>
              </div>
            ) : (
              <AnimatedBorderButton
                onClick={handleMarkCompleted}
                disabled={completing}
                variant="cyan"
                glow={true}
                className="w-full sm:w-auto shrink-0"
              >
                {completing ? (
                  <span>Se înregistrează...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marchează ca finalizată</span>
                  </>
                )}
              </AnimatedBorderButton>
            )}
          </div>
        </section>
      )}

      {/* Footer Navigation Bar */}
      <footer className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[42px]"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span className="truncate max-w-[160px]">Anterioara: {prevLesson.title}</span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Link
          to="/catalog"
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors min-h-[42px]"
        >
          <span>Catalog Materii</span>
        </Link>

        {nextLesson ? (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-subtle min-h-[42px]"
          >
            <span className="truncate max-w-[160px]">Următoarea: {nextLesson.title}</span>
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
