import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  Plus,
  Save,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit,
  Crown,
  Unlock,
  Clock,
  Columns2,
  X,
  Maximize2,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react'
import type { Lesson, Chapter, Subject, LessonStatus, LessonAccessLevel } from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'
import type { LessonFormData, LessonBlockFormData } from '@/services/adminCmsService'
import { LessonBlockRenderer } from '@/components/lesson/LessonBlockRenderer'
import { InlineBlockEditor } from './InlineBlockEditor'
import { LessonPreviewModal } from './LessonPreviewModal'
import { EmptyState } from '@/components/ui/EmptyState'

interface AdminLessonStudioProps {
  lesson: Lesson
  blocks: LessonBlockData[]
  chapter: Chapter | null
  subject: Subject | null
  onBackToLessons: () => void
  onSaveLesson: (formData: LessonFormData) => Promise<void>
  onSaveBlock: (formData: LessonBlockFormData, editingId?: string) => Promise<string | undefined>
  onInsertBlockAt: (
    lessonId: string,
    targetIndex: number,
    blockType: string,
    content: Record<string, unknown>
  ) => Promise<string | undefined>
  onDuplicateBlock: (blockId: string) => Promise<void>
  onDeleteBlock: (blockId: string) => Promise<void>
  onReorderBlock: (blockId: string, direction: 'up' | 'down') => Promise<void>
  onRefresh: () => Promise<void>
}

export const AdminLessonStudio: React.FC<AdminLessonStudioProps> = ({
  lesson,
  blocks,
  chapter,
  subject,
  onBackToLessons,
  onSaveLesson,
  onSaveBlock,
  onInsertBlockAt,
  onDuplicateBlock,
  onDeleteBlock,
  onReorderBlock,
}) => {
  // Sync mode with URL search params so saving/refreshing preserves the exact mode
  const [searchParams, setSearchParams] = useSearchParams()
  const urlMode = searchParams.get('mode') as 'view' | 'edit' | 'split' | null
  const [mode, setModeState] = useState<'view' | 'edit' | 'split'>(
    urlMode === 'edit' || urlMode === 'split' ? urlMode : 'view'
  )

  useEffect(() => {
    if (urlMode && (urlMode === 'view' || urlMode === 'edit' || urlMode === 'split')) {
      setModeState(urlMode)
    }
  }, [urlMode])

  const setMode = (newMode: 'view' | 'edit' | 'split') => {
    setModeState(newMode)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (newMode === 'view') {
          next.delete('mode')
        } else {
          next.set('mode', newMode)
        }
        return next
      },
      { replace: true }
    )
  }

  // In-place editing block state
  const [activeEditingBlockId, setActiveEditingBlockId] = useState<string | null>(null)
  const [confirmDeleteBlockId, setConfirmDeleteBlockId] = useState<string | null>(null)
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAddMenuIndex, setShowAddMenuIndex] = useState<number | null>(null)

  // Lesson Metadata state
  const [title, setTitle] = useState(lesson.title || '')
  const [slug, setSlug] = useState(lesson.slug || '')
  const [shortDesc, setShortDesc] = useState(lesson.short_description || '')
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(lesson.estimated_minutes ?? 15)
  const [accessLevel, setAccessLevel] = useState<LessonAccessLevel>(lesson.access_level || 'free')
  const [status, setStatus] = useState<LessonStatus>(lesson.status || 'draft')
  const [isDirty, setIsDirty] = useState(false)

  // Advanced metadata accordion
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Sync state when props change
  useEffect(() => {
    setTitle(lesson.title || '')
    setSlug(lesson.slug || '')
    setShortDesc(lesson.short_description || '')
    setEstimatedMinutes(lesson.estimated_minutes ?? 15)
    setAccessLevel(lesson.access_level || 'free')
    setStatus(lesson.status || 'draft')
    setIsDirty(false)
  }, [lesson])

  const handleMetadataChange = () => {
    setIsDirty(true)
  }

  // Save metadata
  const handleSaveMetadata = async () => {
    setActionLoading(true)
    await onSaveLesson({
      chapter_id: lesson.chapter_id,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      short_description: shortDesc.trim() || null,
      estimated_minutes: estimatedMinutes,
      access_level: accessLevel,
      status,
      sort_order: lesson.sort_order ?? 0,
    })
    setIsDirty(false)
    setActionLoading(false)
  }

  // Finalize & Exit session
  const handleSaveAndExit = async () => {
    if (isDirty) {
      await handleSaveMetadata()
    }
    setActiveEditingBlockId(null)
    setMode('view')
  }

  // Quit / Discard uncommitted changes
  const handleQuitEditMode = () => {
    setTitle(lesson.title || '')
    setSlug(lesson.slug || '')
    setShortDesc(lesson.short_description || '')
    setEstimatedMinutes(lesson.estimated_minutes ?? 15)
    setAccessLevel(lesson.access_level || 'free')
    setStatus(lesson.status || 'draft')
    setIsDirty(false)
    setActiveEditingBlockId(null)
    setMode('view')
  }

  // Keyboard shortcut Ctrl+S
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty) {
          handleSaveMetadata()
        }
      }
    },
    [isDirty, title, slug, shortDesc, estimatedMinutes, accessLevel, status]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const sortedBlocks = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const handleInsertBlockType = async (type: string, targetIndex: number) => {
    setShowAddMenuIndex(null)
    setActionLoading(true)

    const defaultContent: Record<string, unknown> = {}
    if (type === 'heading') {
      defaultContent.text = 'Titlu Nou Reper'
      defaultContent.level = 2
    } else if (type === 'rich_text') {
      defaultContent.html = '<p>Introdu textul noului paragraf de eseu aici...</p>'
    } else if (type === 'important') {
      defaultContent.title = 'Atenție la Barem!'
      defaultContent.message = 'Idee importantă de punctat...'
    } else if (type === 'remember') {
      defaultContent.title = 'Reține Citatul Esențial'
      defaultContent.quote = '„Citat reprezentativ...”'
      defaultContent.author = 'Autor'
    } else if (type === 'definition') {
      defaultContent.term = 'Concept / Curent'
      defaultContent.definition = 'Definiție operațională...'
      defaultContent.example = 'Exemplu din text...'
    } else if (type === 'summary') {
      defaultContent.title = 'Sinteză Reper'
      defaultContent.points = ['Punct cheie 1', 'Punct cheie 2']
    } else if (type === 'image') {
      defaultContent.url = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
      defaultContent.caption = 'Imagine reprezentativă'
    }

    const newBlockId = await onInsertBlockAt(lesson.id, targetIndex, type, defaultContent)

    if (newBlockId) {
      setActiveEditingBlockId(newBlockId)
    }

    setActionLoading(false)
  }

  // In-place Block Type Inserter Picker
  const renderBlockTypePicker = (targetIndex: number) => {
    if (showAddMenuIndex !== targetIndex) return null

    return (
      <div className="my-3 p-4 sm:p-5 rounded-3xl bg-surface-elevated border-2 border-amber-500 shadow-2xl space-y-3 animate-fadeIn select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-text uppercase tracking-wider">
              Alege tipul blocului de inserat ({targetIndex === 0 ? 'la început' : targetIndex >= sortedBlocks.length ? 'la sfârșit' : `între #${targetIndex} și #${targetIndex + 1}`}):
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddMenuIndex(null)}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => handleInsertBlockType('heading', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">H</span>
            <span className="text-[11px] leading-tight text-center">Titlu / Reper</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('rich_text', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">¶</span>
            <span className="text-[11px] leading-tight text-center">Text Vizual</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('important', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">⚠️</span>
            <span className="text-[11px] leading-tight text-center">Atenție Barem</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('remember', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">💡</span>
            <span className="text-[11px] leading-tight text-center">De Reținut</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('definition', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">📖</span>
            <span className="text-[11px] leading-tight text-center">Definiție</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('summary', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">🎯</span>
            <span className="text-[11px] leading-tight text-center">Sinteză</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('image', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">🖼️</span>
            <span className="text-[11px] leading-tight text-center">Imagine</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('video', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">🎬</span>
            <span className="text-[11px] leading-tight text-center">Video</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('audio', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-cyan-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">🎙️</span>
            <span className="text-[11px] leading-tight text-center">Audio</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('file_download', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">📥</span>
            <span className="text-[11px] leading-tight text-center">Fișier PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertBlockType('quote', targetIndex)}
            className="p-3 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors flex flex-col items-center gap-1.5 shadow-subtle group cursor-pointer"
          >
            <span className="text-base font-bold">💬</span>
            <span className="text-[11px] leading-tight text-center">Citat Critic</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Studio Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-elevated border border-border space-y-3 shadow-subtle sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Return Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToLessons}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-subtle border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-surface-elevated transition-colors min-h-[38px]"
            >
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              <span>Înapoi la Lecții</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-display font-extrabold text-sm sm:text-base text-text truncate max-w-xs md:max-w-md">
                {title || 'Lecție Fără Titlu'}
              </span>
            </div>
          </div>

          {/* Mode Switcher & Global Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View / Edit / Split Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-surface border border-border text-xs shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode('view')
                  setActiveEditingBlockId(null)
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 min-h-[34px] ${
                  mode === 'view'
                    ? 'bg-amber-500 text-black shadow-subtle'
                    : 'text-text-muted hover:text-text'
                }`}
                title="Mod Vizualizare Fidelă (Elev)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vizualizare</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 min-h-[34px] ${
                  mode === 'edit'
                    ? 'bg-amber-500 text-black shadow-subtle'
                    : 'text-text-muted hover:text-text'
                }`}
                title="Mod Editare Directă în Pagină"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editează</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('split')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all hidden lg:flex items-center gap-1.5 min-h-[34px] ${
                  mode === 'split'
                    ? 'bg-amber-500 text-black shadow-subtle'
                    : 'text-text-muted hover:text-text'
                }`}
                title="Editor & Previzualizare Split Live"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Split Live</span>
              </button>
            </div>

            {/* Direct Link to Live Public Page */}
            <a
              href={`/lesson/${lesson.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-surface-elevated transition-colors text-xs font-semibold min-h-[38px]"
              title="Deschide pagina publică a lecției într-o filă nouă"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deschide pe Site</span>
            </a>

            {/* Fullscreen Preview Modal Trigger */}
            <button
              type="button"
              onClick={() => setFullscreenPreviewOpen(true)}
              className="p-2 rounded-xl glass-subtle border border-border text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface-elevated transition-colors min-h-[38px]"
              title="Previzualizare Completă (Modal Elev)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* In Edit / Split Mode: Save, Finalize & Quit buttons in header */}
            {(mode === 'edit' || mode === 'split') && (
              <div className="flex flex-wrap items-center gap-2">
                {isDirty && (
                  <span className="hidden xl:inline text-[11px] font-bold text-amber-800 dark:text-amber-300 animate-pulse">
                    Modificări nesalvate
                  </span>
                )}
                <button
                  type="button"
                  disabled={actionLoading || !isDirty}
                  onClick={handleSaveMetadata}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-text font-bold text-xs transition-all disabled:opacity-50 min-h-[38px]"
                  title="Salvează metadatele lecției fără a ieși din modul de editare (Ctrl+S)"
                >
                  <Save className="w-3.5 h-3.5 text-amber-500" />
                  <span>{actionLoading ? 'Se salvează...' : 'Salvează (Ctrl+S)'}</span>
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleSaveAndExit}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[38px]"
                  title="Salvează toate modificările și revino la vizualizarea elevului"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Finalizează & Ieși</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuitEditMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle border border-border text-xs font-semibold text-text-muted hover:text-status-danger hover:border-status-danger/40 transition-colors min-h-[38px]"
                  title="Ieși din modul de editare și anulează modificările nesalvate"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Renunță</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb Context */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{subject?.name || 'Materie'}</span>
          <span>/</span>
          <span>{chapter?.title || 'Capitol'}</span>
          <span>/</span>
          <span className="font-semibold text-text truncate max-w-sm">{lesson.title}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FAITHFUL STUDENT VIEW MODE (VIEW ONLY) */}
      {/* ========================================================================= */}
      {mode === 'view' ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          {/* Informative top bar */}
          <div className="p-4 rounded-2xl glass-elevated border border-border flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted shadow-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-text block">Mod Previzualizare Fidelă (Elev)</span>
                <span className="text-[11px] text-text-subtle">Lecția este afișată exact în formatul pe care îl accesează elevul.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_16px_rgba(245,158,11,0.25)] min-h-[38px]"
            >
              <Edit className="w-4 h-4" />
              <span>Intră în Mod Editare</span>
            </button>
          </div>

          {/* Lesson Hero Header */}
          <div className="p-6 sm:p-8 rounded-3xl glass-elevated border border-border space-y-4 shadow-subtle">
            <div className="flex flex-wrap items-center gap-2">
              {accessLevel === 'pro' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  EXCLUSIV PRO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                  <Unlock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  ACCES GRATUIT
                </span>
              )}

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  status === 'published'
                    ? 'bg-status-success/15 text-status-success border-status-success/30'
                    : status === 'review'
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : 'bg-surface text-text-muted border-border'
                }`}
              >
                {status === 'published' ? 'Publicat' : status === 'review' ? 'În Review' : 'Ciornă'}
              </span>

              <span className="text-xs text-text-muted flex items-center gap-1 px-3 py-1 rounded-full bg-surface-elevated">
                <Clock className="w-3.5 h-3.5" />
                {estimatedMinutes} min lectură
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              {title || 'Titlu Lecție'}
            </h1>

            {shortDesc && (
              <p className="text-sm sm:text-base text-text-muted font-literary-serif leading-relaxed">
                {shortDesc}
              </p>
            )}
          </div>

          {/* Blocks Stream (Rendered with 100% Student Fidelity) */}
          <div className="space-y-5">
            {sortedBlocks.length === 0 ? (
              <EmptyState
                title="Lecția nu are încă blocuri de conținut"
                description="Apasă pe butonul de editare pentru a adăuga primul reper de eseu, citat sau notă critică."
                action={
                  <button
                    type="button"
                    onClick={() => setMode('edit')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editează Lecția</span>
                  </button>
                }
              />
            ) : (
              sortedBlocks.map((block) => (
                <div
                  key={block.id}
                  className="rounded-3xl glass-elevated border border-border p-6 sm:p-7 shadow-subtle transition-all"
                >
                  <LessonBlockRenderer block={block} />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. IN-PLACE EDIT MODE & SPLIT LIVE MODE */
        /* ========================================================================= */
        <div
          className={`grid gap-6 ${
            mode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {/* ==================== COLUMN 1: IN-PLACE LESSON EDITOR ==================== */}
          <div className="space-y-6">
            {/* LESSON HEADER (EDIT IN PLACE) */}
            <div className="p-6 sm:p-8 rounded-3xl glass-elevated border border-border space-y-4 shadow-subtle">
              {/* Access & Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Inline Access Level Selector */}
                  <button
                    type="button"
                    onClick={() => {
                      setAccessLevel((prev) => (prev === 'pro' ? 'free' : 'pro'))
                      handleMetadataChange()
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      accessLevel === 'pro'
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40'
                        : 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {accessLevel === 'pro' ? <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
                    <span>{accessLevel === 'pro' ? 'EXCLUSIV PRO' : 'ACCES GRATUIT'}</span>
                  </button>

                  {/* Inline Status Selector */}
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as LessonStatus)
                      handleMetadataChange()
                    }}
                    className="px-2.5 py-1 rounded-full bg-surface border border-border text-xs font-bold text-text focus:outline-none cursor-pointer"
                  >
                    <option value="draft">🟡 Draft (Ciornă)</option>
                    <option value="review">🔵 În Review</option>
                    <option value="published">🟢 Publicat (Live)</option>
                    <option value="archived">⚫ Arhivat</option>
                  </select>

                  <div className="flex items-center gap-1 text-xs text-text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
                    <Clock className="w-3.5 h-3.5" />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={estimatedMinutes}
                      onChange={(e) => {
                        setEstimatedMinutes(Number(e.target.value))
                        handleMetadataChange()
                      }}
                      className="w-10 bg-transparent border-none text-text text-xs font-bold text-center focus:outline-none"
                    />
                    <span>min</span>
                  </div>
                </div>
              </div>

              {/* INLINE TITLE */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Titlu Lecție / Eseu
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    handleMetadataChange()
                  }}
                  placeholder="Introdu titlul lecției..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-surface border-2 border-amber-500/40 text-xl sm:text-2xl font-display font-extrabold text-text focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* INLINE SHORT DESCRIPTION */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Descriere scurtă / Sumar introductiv
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => {
                    setShortDesc(e.target.value)
                    handleMetadataChange()
                  }}
                  placeholder="Descriere sintetică a eseului sau structura pe repere..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400 font-literary-serif leading-relaxed"
                />
              </div>

              {/* Advanced Slug Settings Toggle */}
              <div className="pt-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-text-subtle hover:text-text font-mono flex items-center gap-1"
                >
                  <span>{showAdvanced ? 'Ascunde detalii avansate' : 'Afișează slug URL avansat'}</span>
                </button>

                {showAdvanced && (
                  <div className="pt-2 space-y-1">
                    <label className="block text-[11px] font-mono text-text-muted">Slug URL:</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value)
                        handleMetadataChange()
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border font-mono text-xs text-text focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ==================== BLOCKS IN-PLACE STREAM ==================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 select-none">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text">
                  Conținut Lecție & Blocuri ({blocks.length})
                </h2>

                <button
                  type="button"
                  onClick={() => setShowAddMenuIndex(showAddMenuIndex === 0 ? null : 0)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle min-h-[36px] cursor-pointer"
                  title="Deschide selectorul de blocuri la începutul lecției"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adaugă Bloc</span>
                </button>
              </div>

              {/* In-place Inserter at top if triggered */}
              {renderBlockTypePicker(0)}

              {sortedBlocks.length === 0 ? (
                <EmptyState
                  title="Lecția nu are încă blocuri de conținut"
                  description="Apasă pe butonul de adăugare pentru a introduce primul paragraf, reper de eseu sau notă critică."
                  action={
                    <button
                      type="button"
                      onClick={() => setShowAddMenuIndex(0)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-subtle"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adaugă Primul Bloc</span>
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {sortedBlocks.map((block, index) => {
                    const isEditingThisBlock = activeEditingBlockId === block.id
                    const nextBlock = index < sortedBlocks.length - 1 ? sortedBlocks[index + 1] : null

                    return (
                      <div key={block.id} className="space-y-2 group/block">
                        {/* IF CURRENTLY EDITING THIS BLOCK IN PLACE */}
                        {isEditingThisBlock ? (
                          <InlineBlockEditor
                            block={block}
                            onSave={async (formData) => {
                              setActionLoading(true)
                              await onSaveBlock(formData, block.id)
                              setActionLoading(false)
                              setActiveEditingBlockId(null)
                            }}
                            onSaveAndNext={
                              nextBlock
                                ? async (formData) => {
                                    setActionLoading(true)
                                    await onSaveBlock(formData, block.id)
                                    setActionLoading(false)
                                    setActiveEditingBlockId(nextBlock.id)
                                  }
                                : undefined
                            }
                            onCancel={() => setActiveEditingBlockId(null)}
                          />
                        ) : (
                          /* VIEW CARD / CLICKABLE BLOCK IN PLACE */
                          <div className="rounded-3xl glass-elevated border border-border hover:border-amber-500/40 transition-all overflow-hidden shadow-subtle group">
                            {/* Block Controls Bar */}
                            <div className="flex items-center justify-between px-4 py-2 bg-surface-elevated/60 border-b border-border-subtle text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-text-subtle">
                                  #{index + 1}
                                </span>
                                <span className="font-mono text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                                  {block.block_type}
                                </span>
                              </div>

                              {/* Block Operations */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => onReorderBlock(block.id, 'up')}
                                  aria-label="Mută bloc mai sus"
                                  className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors disabled:opacity-30"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  disabled={index === sortedBlocks.length - 1}
                                  onClick={() => onReorderBlock(block.id, 'down')}
                                  aria-label="Mută bloc mai jos"
                                  className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors disabled:opacity-30"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>

                                <div className="w-px h-3.5 bg-border mx-1" />

                                {/* Duplicate Block */}
                                <button
                                  type="button"
                                  onClick={() => onDuplicateBlock(block.id)}
                                  className="p-1.5 rounded-lg text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface transition-colors"
                                  title="Duplică Blocul"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                 {/* Edit Block in-place */}
                                <button
                                  type="button"
                                  onClick={() => setActiveEditingBlockId(block.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-amber-500 hover:text-black font-bold text-[11px] text-text transition-all border border-border"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Editează</span>
                                </button>

                                {/* Delete Block - Inline Direct Confirmation (NO OVERLAY MODAL) */}
                                {confirmDeleteBlockId === block.id ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-status-danger/15 border border-status-danger/40 animate-fadeIn">
                                    <span className="text-[11px] font-bold text-status-danger">Ștergi?</span>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        setActionLoading(true)
                                        await onDeleteBlock(block.id)
                                        setActionLoading(false)
                                        setConfirmDeleteBlockId(null)
                                      }}
                                      className="px-2 py-0.5 rounded-lg bg-status-danger hover:bg-status-danger/80 text-white font-bold text-[10px] transition-colors cursor-pointer"
                                    >
                                      Da
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteBlockId(null)}
                                      className="px-1.5 py-0.5 rounded-lg text-text-muted hover:text-text text-[10px] font-semibold transition-colors cursor-pointer"
                                    >
                                      Nu
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteBlockId(block.id)}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
                                    title="Șterge Blocul"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Block Rendered Content */}
                            <div
                              onClick={() => setActiveEditingBlockId(block.id)}
                              className="p-5 sm:p-6 cursor-pointer hover:bg-surface/30 transition-colors"
                              title="Apasă pentru a edita direct acest bloc"
                            >
                              <LessonBlockRenderer block={block} />
                            </div>
                          </div>
                        )}

                        {/* Quick Insert (+) between blocks */}
                        <div className="py-2 flex items-center justify-center transition-all select-none">
                          <button
                            type="button"
                            onClick={() => setShowAddMenuIndex(showAddMenuIndex === index + 1 ? null : index + 1)}
                            className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-subtle hover:scale-105 transition-all cursor-pointer ${
                              showAddMenuIndex === index + 1
                                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-surface hover:bg-amber-500 hover:text-black text-text-muted border border-border'
                            }`}
                            title={`Inserează un bloc nou după blocul #${index + 1}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Inserează bloc aici</span>
                          </button>
                        </div>

                        {/* In-place Inserter between blocks */}
                        {renderBlockTypePicker(index + 1)}
                      </div>
                    )
                  })}

                  {/* In-place Inserter at bottom of stream if triggered */}
                  {sortedBlocks.length > 0 && (
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setShowAddMenuIndex(showAddMenuIndex === sortedBlocks.length ? null : sortedBlocks.length)
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface hover:bg-amber-500 hover:text-black border border-border text-xs font-bold text-text transition-colors shadow-subtle cursor-pointer"
                        title="Adaugă un nou bloc la sfârșitul lecției"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adaugă Bloc la Sfârșitul Lecției</span>
                      </button>
                    </div>
                  )}

                  {sortedBlocks.length > 0 &&
                    showAddMenuIndex === sortedBlocks.length &&
                    renderBlockTypePicker(sortedBlocks.length)}
                </div>
              )}
            </div>
          </div>

          {/* ==================== COLUMN 2: LIVE READER SPLIT PREVIEW ==================== */}
          {mode === 'split' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Previzualizare Live Elev (1:1)</span>
                </span>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl glass-elevated border border-border space-y-6 shadow-subtle max-h-[85vh] overflow-y-auto">
                <div className="space-y-3 pb-4 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {subject?.name || 'Materia'} · {chapter?.title || 'Capitol'}
                  </span>
                  <h1 className="font-display text-2xl font-bold text-text">
                    {title || 'Titlu Lecție'}
                  </h1>
                  {shortDesc && (
                    <p className="text-sm text-text-muted font-literary-serif italic">
                      {shortDesc}
                    </p>
                  )}
                </div>

                {sortedBlocks.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-xs italic">
                    Niciun bloc de conținut introdus încă.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedBlocks.map((block) => (
                      <LessonBlockRenderer key={block.id} block={block} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* EDIT MODE STICKY FOOTER CONTROLS BAR */}
      {/* ========================================== */}
      {(mode === 'edit' || mode === 'split') && (
        <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-auto sm:right-8 z-40 p-2.5 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-3xl glass-floating border-2 border-amber-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 animate-fadeIn backdrop-blur-2xl max-w-full sm:max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <div className="text-[11px] sm:text-xs min-w-0">
              <span className="font-bold text-text block truncate">Mod Editare Activ</span>
              <span className="text-[10px] text-text-muted hidden sm:inline">
                {isDirty ? 'Modificări nesalvate la metadate' : 'Poți edita continuu orice bloc'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <button
              type="button"
              onClick={handleQuitEditMode}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl glass-subtle border border-border text-[11px] sm:text-xs font-semibold text-text-muted hover:text-status-danger hover:border-status-danger/40 transition-colors min-h-[32px] sm:min-h-[36px]"
              title="Ieși din modul de editare și anulează modificările nesalvate"
            >
              Renunță
            </button>

            <button
              type="button"
              disabled={actionLoading || !isDirty}
              onClick={handleSaveMetadata}
              className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-surface border border-border text-[11px] sm:text-xs font-bold text-text hover:bg-surface-elevated transition-colors disabled:opacity-40 min-h-[32px] sm:min-h-[36px]"
              title="Salvează metadatele lecției (Ctrl+S)"
            >
              Salvează
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={handleSaveAndExit}
              className="inline-flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] sm:text-xs transition-all shadow-subtle min-h-[32px] sm:min-h-[36px]"
              title="Finalizează și revino la vizualizarea elevului"
            >
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Finalizează</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      <LessonPreviewModal
        isOpen={fullscreenPreviewOpen}
        lesson={{
          ...lesson,
          title,
          slug,
          short_description: shortDesc,
          estimated_minutes: estimatedMinutes,
          access_level: accessLevel,
          status,
        }}
        blocks={sortedBlocks}
        chapter={chapter}
        subject={subject}
        onClose={() => setFullscreenPreviewOpen(false)}
      />
    </div>
  )
}
