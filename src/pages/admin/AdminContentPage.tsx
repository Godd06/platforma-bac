import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

import {
  fetchAdminSubjects,
  fetchAdminChapters,
  fetchAdminLessons,
  fetchAdminLessonBlocks,
  createSubject,
  updateSubject,
  deleteSubject,
  duplicateSubject,
  reorderSubject,
  createChapter,
  updateChapter,
  deleteChapter,
  duplicateChapter,
  reorderChapter,
  createLesson,
  updateLesson,
  deleteLesson,
  duplicateLesson,
  reorderLesson,
  bulkUpdateLessons,
  bulkDeleteLessons,
  createLessonBlock,
  insertLessonBlockAt,
  updateLessonBlock,
  deleteLessonBlock,
  duplicateLessonBlock,
  reorderLessonBlock,
  resolveHierarchyBySlugs,
  fetchLessonWithParents,
  type AdminSubjectWithCounts,
  type AdminChapterWithCounts,
  type AdminLessonWithCounts,
  type SubjectFormData,
  type ChapterFormData,
  type LessonFormData,
  type LessonBlockFormData,
  type GlobalSearchResult,
} from '@/services/adminCmsService'

import type { Subject, Chapter, Lesson, LessonStatus, LessonAccessLevel } from '@/types/database'
import type { LessonBlockData } from '@/types/blocks'

import { AdminCmsHeader } from '@/components/admin/cms/AdminCmsHeader'
import { AdminCmsSidebarTree } from '@/components/admin/cms/AdminCmsSidebarTree'
import { AdminSubjectsView } from '@/components/admin/cms/AdminSubjectsView'
import { AdminChaptersView } from '@/components/admin/cms/AdminChaptersView'
import { AdminLessonsView } from '@/components/admin/cms/AdminLessonsView'
import { AdminLessonStudio } from '@/components/admin/cms/AdminLessonStudio'
import { AdminGlobalSearchModal } from '@/components/admin/cms/AdminGlobalSearchModal'
import { AdminImportExportModal } from '@/components/admin/cms/AdminImportExportModal'
import { QuickCreateModal } from '@/components/admin/cms/QuickCreateModal'
import { LessonPreviewModal } from '@/components/admin/cms/LessonPreviewModal'
import { AdminConfirmModal } from '@/components/admin/cms/AdminConfirmModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

export const AdminContentPage: React.FC = () => {
  const { subjectSlug, chapterSlug, lessonSlug, lessonId: paramLessonId } = useParams<{
    subjectSlug?: string
    chapterSlug?: string
    lessonSlug?: string
    lessonId?: string
  }>()

  const navigate = useNavigate()

  // All data collections
  const [subjects, setSubjects] = useState<AdminSubjectWithCounts[]>([])
  const [chapters, setChapters] = useState<AdminChapterWithCounts[]>([])
  const [lessons, setLessons] = useState<AdminLessonWithCounts[]>([])
  const [blocks, setBlocks] = useState<LessonBlockData[]>([])

  // Active resolved entities
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  // Loading & Error states
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Modals state (Strictly limited to search, AI import/export, quick create, confirm delete)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)

  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewLessonTarget, setPreviewLessonTarget] = useState<{
    lesson: Lesson | null
    blocks: LessonBlockData[]
    chapter: Chapter | null
    subject: Subject | null
  } | null>(null)

  // Confirm delete modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'subject' | 'chapter' | 'lesson' | 'bulk_lessons'
    id?: string
    ids?: string[]
    title: string
    description: string
    stats?: { label: string; count: number }[]
  } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showToast = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  // Global keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setGlobalSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ==========================================
  // HIERARCHY RESOLUTION & DATA FETCHING
  // ==========================================

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Fetch Subjects list
      const subjectsRes = await fetchAdminSubjects()
      if (subjectsRes.error) throw new Error(subjectsRes.error)
      setSubjects(subjectsRes.data || [])

      // 2. Resolve Active Hierarchy from URL parameters
      if (paramLessonId) {
        // Direct Editor route: /admin/editor/:lessonId
        const { lesson, chapter, subject, error: lesErr } = await fetchLessonWithParents(paramLessonId)
        if (lesErr || !lesson) throw new Error(lesErr || 'Lecția nu a fost găsită.')

        setActiveLesson(lesson)
        setActiveChapter(chapter)
        setActiveSubject(subject)

        if (chapter) {
          const chapRes = await fetchAdminChapters(chapter.subject_id)
          setChapters(chapRes.data || [])
          const lesListRes = await fetchAdminLessons(chapter.id)
          setLessons(lesListRes.data || [])
        }

        const blocksRes = await fetchAdminLessonBlocks(lesson.id)
        setBlocks(blocksRes.data || [])
      } else if (subjectSlug) {
        // Hierarchical Slug Route: /admin/content/:subjectSlug/...
        const { subject, chapter, lesson, error: hierErr } = await resolveHierarchyBySlugs(
          subjectSlug,
          chapterSlug,
          lessonSlug
        )
        if (hierErr) throw new Error(hierErr)

        setActiveSubject(subject)
        setActiveChapter(chapter)
        setActiveLesson(lesson)

        if (subject) {
          const chapRes = await fetchAdminChapters(subject.id)
          setChapters(chapRes.data || [])
        } else {
          setChapters([])
        }

        if (chapter) {
          const lesRes = await fetchAdminLessons(chapter.id)
          setLessons(lesRes.data || [])
        } else {
          setLessons([])
        }

        if (lesson) {
          const blocksRes = await fetchAdminLessonBlocks(lesson.id)
          setBlocks(blocksRes.data || [])
        } else {
          setBlocks([])
        }
      } else {
        // Root content browser: /admin/content
        setActiveSubject(null)
        setActiveChapter(null)
        setActiveLesson(null)
        setChapters([])
        setLessons([])
        setBlocks([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea conținutului.')
    } finally {
      setLoading(false)
    }
  }, [subjectSlug, chapterSlug, lessonSlug, paramLessonId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ==========================================
  // NAVIGATION HELPERS (Clean Hierarchical URLs)
  // ==========================================

  const navigateToSubject = (sSlug?: string) => {
    if (sSlug) navigate(`/admin/content/${sSlug}`)
    else navigate('/admin/content')
  }

  const navigateToChapter = (sSlug: string, cSlug: string) => {
    navigate(`/admin/content/${sSlug}/${cSlug}`)
  }

  const navigateToLesson = (sSlug: string, cSlug: string, lSlug: string, editMode = false) => {
    navigate(
      editMode
        ? `/admin/content/${sSlug}/${cSlug}/${lSlug}?mode=edit`
        : `/admin/content/${sSlug}/${cSlug}/${lSlug}`
    )
  }

  const handleGlobalSearchResultSelect = (result: GlobalSearchResult) => {
    if (result.type === 'subject' && result.subjectSlug) {
      navigateToSubject(result.subjectSlug)
    } else if (result.type === 'chapter' && result.subjectSlug && result.chapterSlug) {
      navigateToChapter(result.subjectSlug, result.chapterSlug)
    } else if (result.type === 'lesson') {
      if (result.subjectSlug && result.chapterSlug && result.slug) {
        navigateToLesson(result.subjectSlug, result.chapterSlug, result.slug)
      } else if (result.lessonId) {
        navigate(`/admin/editor/${result.lessonId}`)
      }
    }
  }

  // ==========================================
  // SUBJECT HANDLERS (IN PLACE)
  // ==========================================

  const handleSaveSubject = async (formData: SubjectFormData) => {
    setActionLoading(true)
    if (activeSubject) {
      const res = await updateSubject(activeSubject.id, formData)
      if (res.error) throw new Error(res.error)
      showToast(`Materia „${formData.name}” a fost actualizată.`)
      if (res.data) navigateToSubject(res.data.slug)
    } else {
      const res = await createSubject(formData)
      if (res.error) throw new Error(res.error)
      showToast(`Materia „${formData.name}” a fost creată.`)
      if (res.data) navigateToSubject(res.data.slug)
    }
    setActionLoading(false)
    await loadData()
  }

  const handleDuplicateSubject = async (subjId: string) => {
    const res = await duplicateSubject(subjId)
    if (res.error) showToast(`Eroare duplicare: ${res.error}`)
    else {
      showToast(`Materia a fost duplicată cu succes.`)
      await loadData()
    }
  }

  const handleToggleSubjectPublished = async (subj: Subject) => {
    const res = await updateSubject(subj.id, { is_published: !subj.is_published })
    if (res.error) showToast(`Eroare actualizare: ${res.error}`)
    else {
      showToast(`Materia a fost setată ca ${!subj.is_published ? 'Publicată' : 'Ciornă'}.`)
      await loadData()
    }
  }

  const handleReorderSubject = async (subjId: string, direction: 'up' | 'down') => {
    const res = await reorderSubject(subjId, direction)
    if (res.error) showToast(`Eroare reordonare: ${res.error}`)
    else await loadData()
  }

  // ==========================================
  // CHAPTER HANDLERS (IN PLACE)
  // ==========================================

  const handleSaveChapter = async (formData: ChapterFormData) => {
    setActionLoading(true)
    if (activeChapter) {
      const res = await updateChapter(activeChapter.id, formData)
      if (res.error) throw new Error(res.error)
      showToast(`Capitolul „${formData.title}” a fost actualizat.`)
      if (activeSubject && res.data) {
        navigateToChapter(activeSubject.slug, res.data.slug)
      }
    } else {
      const res = await createChapter(formData)
      if (res.error) throw new Error(res.error)
      showToast(`Capitolul „${formData.title}” a fost creat.`)
      if (activeSubject && res.data) {
        navigateToChapter(activeSubject.slug, res.data.slug)
      }
    }
    setActionLoading(false)
    await loadData()
  }

  const handleDuplicateChapter = async (chapId: string) => {
    const res = await duplicateChapter(chapId)
    if (res.error) showToast(`Eroare duplicare: ${res.error}`)
    else {
      showToast(`Capitolul a fost duplicat cu succes.`)
      await loadData()
    }
  }

  const handleToggleChapterPublished = async (chap: Chapter) => {
    const res = await updateChapter(chap.id, { is_published: !chap.is_published })
    if (res.error) showToast(`Eroare actualizare: ${res.error}`)
    else {
      showToast(`Capitolul a fost setat ca ${!chap.is_published ? 'Publicat' : 'Ciornă'}.`)
      await loadData()
    }
  }

  const handleReorderChapter = async (chapId: string, direction: 'up' | 'down') => {
    if (!activeSubject) return
    const res = await reorderChapter(activeSubject.id, chapId, direction)
    if (res.error) showToast(`Eroare reordonare: ${res.error}`)
    else await loadData()
  }

  // ==========================================
  // LESSON HANDLERS (IN PLACE)
  // ==========================================

  const handleSaveLesson = async (formData: LessonFormData) => {
    setActionLoading(true)
    if (activeLesson) {
      const res = await updateLesson(activeLesson.id, formData)
      if (res.error) throw new Error(res.error)
      showToast(`Lecția „${formData.title}” a fost actualizată.`)
      if (res.data) {
        setActiveLesson(res.data)
        if (activeSubject && activeChapter && res.data.slug !== activeLesson.slug) {
          navigateToLesson(activeSubject.slug, activeChapter.slug, res.data.slug)
        }
      }
    } else {
      const res = await createLesson(formData)
      if (res.error) throw new Error(res.error)
      showToast(`Lecția „${formData.title}” a fost creată.`)
      if (activeSubject && activeChapter && res.data) {
        navigateToLesson(activeSubject.slug, activeChapter.slug, res.data.slug)
      }
    }
    setActionLoading(false)
  }

  const handleDuplicateLesson = async (lesId: string) => {
    const res = await duplicateLesson(lesId)
    if (res.error) showToast(`Eroare duplicare: ${res.error}`)
    else {
      showToast(`Lecția a fost duplicată cu toate blocurile.`)
      if (activeSubject && activeChapter && res.data) {
        // Immediately navigate into the new duplicate lesson!
        navigateToLesson(activeSubject.slug, activeChapter.slug, res.data.slug)
      }
      await loadData()
    }
  }

  const handleReorderLesson = async (lesId: string, direction: 'up' | 'down') => {
    if (!activeChapter) return
    const res = await reorderLesson(activeChapter.id, lesId, direction)
    if (res.error) showToast(`Eroare reordonare: ${res.error}`)
    else await loadData()
  }

  const handleQuickLessonStatus = async (lessonItem: Lesson, newStatus: LessonStatus) => {
    const res = await updateLesson(lessonItem.id, { status: newStatus })
    if (res.error) showToast(`Eroare status: ${res.error}`)
    else {
      showToast(`Statusul lecției a fost setat la ${newStatus}.`)
      await loadData()
    }
  }

  const handleQuickLessonAccess = async (lessonItem: Lesson, newAccess: LessonAccessLevel) => {
    const res = await updateLesson(lessonItem.id, { access_level: newAccess })
    if (res.error) showToast(`Eroare acces: ${res.error}`)
    else {
      showToast(`Nivelul de acces a fost setat la ${newAccess.toUpperCase()}.`)
      await loadData()
    }
  }

  const handleBulkUpdateLessons = async (
    ids: string[],
    updates: { status?: LessonStatus; access_level?: LessonAccessLevel }
  ) => {
    const res = await bulkUpdateLessons(ids, updates)
    if (res.error) showToast(`Eroare acțiune în masă: ${res.error}`)
    else {
      showToast(`${res.count} lecții au fost actualizate.`)
      await loadData()
    }
  }

  // ==========================================
  // BLOCK HANDLERS (IN PLACE & STABLE)
  // ==========================================

  const handleInsertBlockAt = async (
    lessonId: string,
    targetIndex: number,
    blockType: string,
    content: Record<string, unknown>
  ): Promise<string | undefined> => {
    const res = await insertLessonBlockAt(lessonId, targetIndex, blockType, content)
    if (res.error) {
      showToast(`Eroare inserare bloc: ${res.error}`)
      throw new Error(res.error)
    }
    showToast('Blocul a fost inserat cu succes.')
    if (activeLesson) {
      const bRes = await fetchAdminLessonBlocks(activeLesson.id)
      setBlocks(bRes.data || [])
    }
    return res.data?.id
  }

  const handleSaveBlock = async (formData: LessonBlockFormData, editingId?: string): Promise<string | undefined> => {
    let resultBlockId: string | undefined = undefined
    if (editingId) {
      const res = await updateLessonBlock(editingId, formData)
      if (res.error) throw new Error(res.error)
      resultBlockId = editingId
      showToast('Blocul a fost actualizat.')
    } else {
      const res = await createLessonBlock(formData)
      if (res.error) throw new Error(res.error)
      resultBlockId = res.data?.id
      showToast('Blocul a fost adăugat cu succes.')
    }

    if (activeLesson) {
      const bRes = await fetchAdminLessonBlocks(activeLesson.id)
      setBlocks(bRes.data || [])
    }
    return resultBlockId
  }

  const handleDuplicateBlock = async (blockId: string) => {
    const res = await duplicateLessonBlock(blockId)
    if (res.error) showToast(`Eroare duplicare bloc: ${res.error}`)
    else {
      showToast('Blocul a fost duplicat.')
      if (activeLesson) {
        const bRes = await fetchAdminLessonBlocks(activeLesson.id)
        setBlocks(bRes.data || [])
      }
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    const res = await deleteLessonBlock(blockId)
    if (res.error) showToast(`Eroare ștergere bloc: ${res.error}`)
    else {
      showToast('Blocul a fost șters.')
      if (activeLesson) {
        const bRes = await fetchAdminLessonBlocks(activeLesson.id)
        setBlocks(bRes.data || [])
      }
    }
  }

  const handleReorderBlock = async (blockId: string, direction: 'up' | 'down') => {
    if (!activeLesson) return
    const res = await reorderLessonBlock(activeLesson.id, blockId, direction)
    if (res.error) showToast(`Eroare reordonare bloc: ${res.error}`)
    else {
      const bRes = await fetchAdminLessonBlocks(activeLesson.id)
      setBlocks(bRes.data || [])
    }
  }

  // ==========================================
  // DELETE HANDLERS (WITH PRECISE IMPACT COUNTS)
  // ==========================================

  const handleExecuteDelete = async () => {
    if (!confirmDelete) return
    setActionLoading(true)

    try {
      if (confirmDelete.type === 'subject' && confirmDelete.id) {
        const res = await deleteSubject(confirmDelete.id)
        if (res.error) throw new Error(res.error)
        showToast('Materia a fost ștearsă.')
        navigateToSubject()
      } else if (confirmDelete.type === 'chapter' && confirmDelete.id) {
        const res = await deleteChapter(confirmDelete.id)
        if (res.error) throw new Error(res.error)
        showToast('Capitolul a fost șters.')
        if (activeSubject) navigateToSubject(activeSubject.slug)
      } else if (confirmDelete.type === 'lesson' && confirmDelete.id) {
        const res = await deleteLesson(confirmDelete.id)
        if (res.error) throw new Error(res.error)
        showToast('Lecția a fost ștearsă.')
        if (activeSubject && activeChapter) {
          navigateToChapter(activeSubject.slug, activeChapter.slug)
        }
      } else if (confirmDelete.type === 'bulk_lessons' && confirmDelete.ids) {
        const res = await bulkDeleteLessons(confirmDelete.ids)
        if (res.error) throw new Error(res.error)
        showToast(`${res.count} lecții au fost eliminate definitiv.`)
      }

      setConfirmDelete(null)
      await loadData()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Eroare la ștergere.')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePreviewLesson = async (les: Lesson) => {
    const { data: lesBlocks } = await fetchAdminLessonBlocks(les.id)
    setPreviewLessonTarget({
      lesson: les,
      blocks: lesBlocks || [],
      chapter: activeChapter,
      subject: activeSubject,
    })
    setPreviewModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-full overflow-x-hidden">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-surface-elevated border border-emerald-500/40 text-text shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{successToast}</p>
        </div>
      )}

      {/* Global Header Bar with Breadcrumbs & Command Palette */}
      <AdminCmsHeader
        subjects={subjects}
        selectedSubject={activeSubject}
        selectedChapter={activeChapter}
        selectedLesson={activeLesson}
        onNavigate={({ subjectId: sId, chapterId: cId, lessonId: lId }) => {
          if (lId && activeSubject && activeChapter && activeLesson) {
            navigateToLesson(activeSubject.slug, activeChapter.slug, activeLesson.slug)
          } else if (cId && activeSubject && activeChapter) {
            navigateToChapter(activeSubject.slug, activeChapter.slug)
          } else if (sId && activeSubject) {
            navigateToSubject(activeSubject.slug)
          } else {
            navigateToSubject()
          }
        }}
        onRefresh={loadData}
        onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        onOpenImportExport={() => setImportExportOpen(true)}
        onOpenCreateSubject={() => setQuickCreateOpen(true)}
        onOpenCreateChapter={() => setQuickCreateOpen(true)}
        onOpenCreateLesson={() => setQuickCreateOpen(true)}
      />

      {/* Error State */}
      {error && (
        <ErrorState
          title="Eroare la încărcarea conținutului"
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <Skeleton className="h-10 w-full" rounded="xl" />
            <Skeleton className="h-64 w-full" rounded="2xl" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-32 w-full" rounded="2xl" />
            <Skeleton className="h-48 w-full" rounded="2xl" />
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MASTER-DETAIL CONTENT STUDIO LAYOUT */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Persistent Content Hierarchy Tree */}
          <aside className={`lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 ${activeLesson ? 'hidden lg:block' : 'block'}`}>
            <AdminCmsSidebarTree
              subjects={subjects}
              chapters={chapters}
              selectedSubjectId={activeSubject?.id || null}
              selectedChapterId={activeChapter?.id || null}
              onSelectSubject={(sId) => {
                const s = subjects.find((item) => item.id === sId)
                if (s) navigateToSubject(s.slug)
              }}
              onSelectChapter={(sId, cId) => {
                const s = subjects.find((item) => item.id === sId)
                const c = chapters.find((item) => item.id === cId)
                if (s && c) navigateToChapter(s.slug, c.slug)
              }}
              onOpenCreateSubject={() => setQuickCreateOpen(true)}
              onOpenCreateChapter={(sId) => {
                const s = subjects.find((item) => item.id === sId)
                if (s) navigateToSubject(s.slug)
                setQuickCreateOpen(true)
              }}
            />
          </aside>

          {/* Right Column: Main Content Studio Workspace */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            {/* VIEW 4: LESSON STUDIO (Dedicated In-Place Workspace) */}
            {activeLesson ? (
              <AdminLessonStudio
                lesson={activeLesson}
                blocks={blocks}
                chapter={activeChapter}
                subject={activeSubject}
                onBackToLessons={() => {
                  if (activeSubject && activeChapter) {
                    navigateToChapter(activeSubject.slug, activeChapter.slug)
                  } else {
                    navigateToSubject()
                  }
                }}
                onSaveLesson={handleSaveLesson}
                onSaveBlock={handleSaveBlock}
                onInsertBlockAt={handleInsertBlockAt}
                onDuplicateBlock={handleDuplicateBlock}
                onDeleteBlock={handleDeleteBlock}
                onReorderBlock={handleReorderBlock}
                onRefresh={loadData}
              />
            ) : activeChapter && activeSubject ? (
              /* VIEW 3: LESSONS MANAGEMENT IN CHAPTER */
              <AdminLessonsView
                chapter={activeChapter}
                lessons={lessons}
                onSelectLesson={(lSlug) =>
                  navigateToLesson(activeSubject.slug, activeChapter.slug, lSlug)
                }
                onOpenCreateLesson={() => setQuickCreateOpen(true)}
                onOpenEditLesson={(l) =>
                  navigateToLesson(activeSubject.slug, activeChapter.slug, l.slug, true)
                }
                onSaveChapter={handleSaveChapter}
                onDuplicateLesson={handleDuplicateLesson}
                onPreviewLesson={handlePreviewLesson}
                onDeleteLesson={(l) =>
                  setConfirmDelete({
                    type: 'lesson',
                    id: l.id,
                    title: `Ștergi definitiv lecția „${l.title}”?`,
                    description: 'Toate blocurile educaționale din această lecție vor fi șterse definitiv.',
                    stats: [{ label: 'blocuri de conținut', count: (l as AdminLessonWithCounts).block_count || 0 }],
                  })
                }
                onReorderLesson={handleReorderLesson}
                onQuickStatusChange={handleQuickLessonStatus}
                onQuickAccessChange={handleQuickLessonAccess}
                onBulkUpdate={handleBulkUpdateLessons}
                onBulkDelete={(ids) =>
                  setConfirmDelete({
                    type: 'bulk_lessons',
                    ids,
                    title: `Ștergi ${ids.length} lecții selectate?`,
                    description: 'Această operațiune va elimina definitiv toate lecțiile selectate și blocurile aferente.',
                    stats: [{ label: 'lecții selectate', count: ids.length }],
                  })
                }
                onOpenAiImport={() => setImportExportOpen(true)}
              />
            ) : activeSubject ? (
              /* VIEW 2: CHAPTERS / OPERE IN SUBJECT (WITH IN-PLACE EDITING) */
              <AdminChaptersView
                subject={activeSubject}
                chapters={chapters}
                onSelectChapter={(cSlug) => navigateToChapter(activeSubject.slug, cSlug)}
                onOpenCreateChapter={() => setQuickCreateOpen(true)}
                onSaveChapter={handleSaveChapter}
                onDuplicateChapter={handleDuplicateChapter}
                onTogglePublished={handleToggleChapterPublished}
                onDeleteChapter={(c) =>
                  setConfirmDelete({
                    type: 'chapter',
                    id: c.id,
                    title: `Ștergi opera / capitolul „${c.title}”?`,
                    description: 'Atenție! Toate eseurile, lecțiile și blocurile acestei opere vor fi șterse definitiv.',
                    stats: [{ label: 'lecții și eseuri structurate', count: (c as AdminChapterWithCounts).lesson_count || 0 }],
                  })
                }
                onReorderChapter={handleReorderChapter}
              />
            ) : (
              /* VIEW 1: SUBJECTS OVERVIEW STUDIO (WITH IN-PLACE EDITING) */
              <AdminSubjectsView
                subjects={subjects}
                onSelectSubject={(sSlug) => navigateToSubject(sSlug)}
                onOpenCreateSubject={() => setQuickCreateOpen(true)}
                onSaveSubject={handleSaveSubject}
                onDuplicateSubject={handleDuplicateSubject}
                onTogglePublished={handleToggleSubjectPublished}
                onDeleteSubject={(s) =>
                  setConfirmDelete({
                    type: 'subject',
                    id: s.id,
                    title: `Ștergi materia „${s.name}”?`,
                    description: 'Atenție critică! Se vor șterge automat toate operele, eseurile și blocurile asociate din baza de date.',
                    stats: [
                      { label: 'capitole / opere canonice', count: (s as AdminSubjectWithCounts).chapter_count || 0 },
                      { label: 'lecții și eseuri', count: (s as AdminSubjectWithCounts).lesson_count || 0 },
                    ],
                  })
                }
                onReorderSubject={handleReorderSubject}
              />
            )}
          </main>
        </div>
      )}

      {/* ========================================== */}
      {/* GLOBAL MODALS */}
      {/* ========================================== */}

      {/* Global Command Search Palette */}
      <AdminGlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        onSelect={handleGlobalSearchResultSelect}
      />

      {/* AI Pipeline Import / Export Modal */}
      <AdminImportExportModal
        isOpen={importExportOpen}
        activeSubject={activeSubject}
        activeChapter={activeChapter}
        activeLesson={activeLesson}
        onClose={() => setImportExportOpen(false)}
        onSuccess={(msg) => {
          showToast(msg)
          loadData()
        }}
      />

      {/* Quick Create Modal */}
      <QuickCreateModal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        onOpenImportAi={() => setImportExportOpen(true)}
      />

      {/* Lesson Preview Modal */}
      <LessonPreviewModal
        isOpen={previewModalOpen}
        lesson={previewLessonTarget?.lesson || null}
        blocks={previewLessonTarget?.blocks || []}
        chapter={previewLessonTarget?.chapter || null}
        subject={previewLessonTarget?.subject || null}
        onClose={() => {
          setPreviewModalOpen(false)
          setPreviewLessonTarget(null)
        }}
      />

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(confirmDelete)}
        title={confirmDelete?.title || 'Confirmare ștergere'}
        description={confirmDelete?.description || 'Această acțiune este ireversibilă.'}
        stats={confirmDelete?.stats}
        confirmText="Șterge definitiv"
        isDestructive={true}
        loading={actionLoading}
        onConfirm={handleExecuteDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default AdminContentPage
