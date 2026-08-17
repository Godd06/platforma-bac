import React, { useState, useEffect } from 'react'
import {
  X,
  Upload,
  Download,
  Copy,
  Check,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Loader2,
  Bot,
} from 'lucide-react'
import type { Subject, Chapter, Lesson } from '@/types/database'
import {
  exportLessonJson,
  exportChapterJson,
  importLessonJson,
  fetchAdminSubjects,
  fetchAdminChapters,
  type ExportedLessonData,
  type AdminSubjectWithCounts,
  type AdminChapterWithCounts,
} from '@/services/adminCmsService'

interface AdminImportExportModalProps {
  isOpen: boolean
  activeSubject: Subject | null
  activeChapter: Chapter | null
  activeLesson: Lesson | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export const AdminImportExportModal: React.FC<AdminImportExportModalProps> = ({
  isOpen,
  activeSubject: _activeSubject,
  activeChapter,
  activeLesson,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'ai_prompt'>('import')
  const [importJsonText, setImportJsonText] = useState('')
  const [parsedImport, setParsedImport] = useState<Partial<ExportedLessonData> | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Dynamic destination pickers when activeChapter is null
  const [subjectsList, setSubjectsList] = useState<AdminSubjectWithCounts[]>([])
  const [chaptersList, setChaptersList] = useState<AdminChapterWithCounts[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedChapterId, setSelectedChapterId] = useState<string>(activeChapter?.id || '')

  // Export State
  const [exportJsonText, setExportJsonText] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setImportJsonText('')
      setParsedImport(null)
      setValidationError(null)
      setCopied(false)
      setPromptCopied(false)
      setSelectedChapterId(activeChapter?.id || '')

      if (!activeChapter) {
        loadSubjectsAndChapters()
      }

      if (activeTab === 'export') {
        loadExportData()
      }
    }
  }, [isOpen, activeTab, activeChapter])

  const loadSubjectsAndChapters = async () => {
    const subjs = await fetchAdminSubjects()
    if (subjs.data && subjs.data.length > 0) {
      setSubjectsList(subjs.data)
      const firstSubjId = _activeSubject?.id || subjs.data[0].id
      setSelectedSubjectId(firstSubjId)
      const chaps = await fetchAdminChapters(firstSubjId)
      if (chaps.data && chaps.data.length > 0) {
        setChaptersList(chaps.data)
        setSelectedChapterId(chaps.data[0].id)
      } else {
        setChaptersList([])
        setSelectedChapterId('')
      }
    }
  }

  const handleSubjectChange = async (subjId: string) => {
    setSelectedSubjectId(subjId)
    const chaps = await fetchAdminChapters(subjId)
    if (chaps.data && chaps.data.length > 0) {
      setChaptersList(chaps.data)
      setSelectedChapterId(chaps.data[0].id)
    } else {
      setChaptersList([])
      setSelectedChapterId('')
    }
  }

  const loadExportData = async () => {
    setExportLoading(true)
    if (activeLesson) {
      const res = await exportLessonJson(activeLesson.id)
      if (res.data) setExportJsonText(JSON.stringify(res.data, null, 2))
      else setExportJsonText('// Eroare la exportul lecției')
    } else if (activeChapter) {
      const res = await exportChapterJson(activeChapter.id)
      if (res.data) setExportJsonText(JSON.stringify(res.data, null, 2))
      else setExportJsonText('// Eroare la exportul capitolului')
    } else {
      setExportJsonText('// Selectează un capitol sau o lecție pentru export complet.')
    }
    setExportLoading(false)
  }

  const handleJsonTextChange = (text: string) => {
    setImportJsonText(text)
    setValidationError(null)
    setParsedImport(null)

    if (!text.trim()) return

    try {
      const parsed = JSON.parse(text)
      const lessonObj = parsed.lesson || parsed
      if (!lessonObj.title) {
        setValidationError('Structura JSON trebuie să conțină cel puțin proprietatea "title".')
        return
      }
      setParsedImport(parsed)
    } catch (err) {
      setValidationError('Sintaxă JSON invalidă: ' + (err instanceof Error ? err.message : 'eroare de parsare'))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      handleJsonTextChange(content)
    }
    reader.readAsText(file)
  }

  const handleExecuteImport = async () => {
    const targetChapId = activeChapter?.id || selectedChapterId
    if (!targetChapId) {
      setValidationError('Selectează mai întâi un capitol / o operă în care să imporți lecția.')
      return
    }
    if (!parsedImport) {
      setValidationError('Introduceți un JSON valid înainte de import.')
      return
    }

    setLoading(true)
    const res = await importLessonJson(targetChapId, parsedImport)
    setLoading(false)

    if (res.error) {
      setValidationError(res.error)
    } else {
      onSuccess(`Lecția „${res.data?.title}” a fost importată cu succes din pipeline AI!`)
      onClose()
    }
  }

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportJsonText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadExport = () => {
    const blob = new Blob([exportJsonText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `platforma-bac-export-${activeLesson?.slug || activeChapter?.slug || 'content'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentChapterTitle =
    activeChapter?.title ||
    chaptersList.find((c) => c.id === selectedChapterId)?.title ||
    'Moara cu noroc de Ioan Slavici'

  const aiSystemPromptTemplate = `Ești un profesor expert de Limba și Literatura Română și pregătești conținut pentru platforma educațională Platforma BAC.

Vreau să generezi un eseu structurat canonic pentru opera: "${currentChapterTitle}".

Răspunde STRICT cu un obiect JSON valid conform următoarei scheme (fără text explicativ înainte sau după JSON):

{
  "title": "Titlu Complet Eseu (ex: Particularități de construcție a unui personaj — Ghiță)",
  "short_description": "Sinteză a eseului structurată pe cele 4 repere din baremul oficial de Bacalaureat.",
  "access_level": "pro",
  "estimated_minutes": 15,
  "blocks": [
    {
      "block_type": "heading",
      "sort_order": 10,
      "content": {
        "level": 2,
        "text": "1. Introducere & Încadrarea operei și a autorului",
        "subtitle": "Context literar și apartenență la curentul realismului psihologic"
      }
    },
    {
      "block_type": "rich_text",
      "sort_order": 20,
      "content": {
        "html": "<p>Opera literară reprezintă o creație fundamentală...</p>"
      }
    },
    {
      "block_type": "important",
      "sort_order": 30,
      "content": {
        "title": "Atenție la Baremul Subiectului III",
        "message": "Menționează obligatoriu cele două scene reprezentative pentru evoluția conflictului interior."
      }
    },
    {
      "block_type": "remember",
      "sort_order": 40,
      "content": {
        "title": "Citat Cheie de Memorat",
        "text": "„Omul să fie mulțumit cu sărăcia sa, căci, dacă e vorba, nu bogăția, ci liniștea colibei tale te face fericit.”"
      }
    },
    {
      "block_type": "definition",
      "sort_order": 50,
      "content": {
        "term": "Dezumanizare treptată",
        "category": "Evoluție psihologică",
        "definition": "Procesul prin care lăcomia distruge busola morală a protagonistului.",
        "example": "Schimbarea atitudinii lui Ghiță față de familie odată cu apariția lui Lică Sămădăul."
      }
    },
    {
      "block_type": "summary",
      "sort_order": 60,
      "content": {
        "title": "Sinteză: 4 Repere Fundamentale",
        "points": [
          "Reper 1: Încadrarea în context și precizarea a două trăsături ale curentului.",
          "Reper 2: Două episoade / secvențe narative relevante pentru temă.",
          "Reper 3: Două elemente de structură (conflict, incipit, relații temporale).",
          "Reper 4: Concluzia și susținerea unei opinii argumentate."
        ]
      }
    }
  ]
}`

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiSystemPromptTemplate)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2500)
  }

  if (!isOpen) return null

  const targetChapterId = activeChapter?.id || selectedChapterId

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-export-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-elevated border border-border p-6 space-y-5 shadow-2xl z-10 animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="import-export-title" className="font-display font-bold text-lg text-text">
                Pipeline AI & Import / Export
              </h3>
              <p className="text-xs text-text-muted">
                Transferă structuri complete de conținut direct în baza de date Supabase.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Închide fereastra"
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-surface border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-amber-500 text-black shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_prompt')}
            className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ai_prompt'
                ? 'bg-amber-500 text-black shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Prompt Generator</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('export')
              loadExportData()
            }}
            className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-amber-500 text-black shadow-subtle'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {/* ==================== TAB 1: IMPORT ==================== */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-surface-elevated/40 border border-border text-xs text-text-muted space-y-2">
              <span className="font-bold text-text block">Destinație Import:</span>
              {activeChapter ? (
                <p>
                  Capitol / Operă: <strong className="text-amber-700 dark:text-amber-300">{activeChapter.title}</strong>
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-text-muted">Materie:</label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                    >
                      {subjectsList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-text-muted">Capitol / Operă:</label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                    >
                      {chaptersList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* File picker */}
            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text cursor-pointer hover:bg-surface-elevated transition-colors">
                <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Încarcă fișier .json</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <span className="text-[11px] text-text-subtle">
                sau lipește codul JSON mai jos:
              </span>
            </div>

            {/* JSON Textarea */}
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => handleJsonTextChange(e.target.value)}
              placeholder={`{\n  "title": "Particularități de construcție a unui personaj — Ghiță",\n  "short_description": "Eseu structurat pe 4 repere fundamentale",\n  "access_level": "pro",\n  "blocks": [\n    { "block_type": "heading", "content": { "text": "1. Introducere", "level": 2 } },\n    { "block_type": "rich_text", "content": { "html": "<p>Ghiță este personajul...</p>" } }\n  ]\n}`}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text focus:outline-none focus:border-amber-400 leading-relaxed shadow-inner"
            />

            {/* Validation Message */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Success Preview Box */}
            {parsedImport && !validationError && (
              <div className="p-3.5 rounded-2xl bg-status-success/10 border border-status-success/30 text-xs text-status-success space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Structură Validată cu Succes:</span>
                </div>
                <p className="text-text">
                  Titlu: <strong>{parsedImport.lesson?.title || (parsedImport as unknown as Lesson).title}</strong>
                </p>
                <p className="text-text-muted">
                  Blocuri detectate: <strong>{Array.isArray(parsedImport.blocks) ? parsedImport.blocks.length : 0} blocuri</strong>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors"
              >
                Anulează
              </button>

              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={loading || !parsedImport || !targetChapterId || Boolean(validationError)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 min-h-[38px]"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Importă în Baza de Date</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: AI PROMPT GENERATOR ==================== */}
        {activeTab === 'ai_prompt' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-surface-elevated/40 border border-border text-xs text-text-muted space-y-1">
              <span className="font-bold text-text block">Generator Prompt AI (ChatGPT / Claude / Gemini):</span>
              <p>
                Copiază acest prompt și trimite-l modelului AI ales. Răspunsul său JSON va fi 100% compatibil cu importatorul de mai sus!
              </p>
            </div>

            <textarea
              rows={9}
              readOnly
              value={aiSystemPromptTemplate}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text focus:outline-none select-all leading-relaxed shadow-inner"
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle min-h-[38px]"
              >
                {promptCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{promptCopied ? 'Prompt Copiat în Clipboard!' : 'Copiază Promptul pentru AI'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: EXPORT ==================== */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-surface-elevated/40 border border-border text-xs text-text-muted">
              Exportă entitatea selectată ca fișier JSON portabil, gata pentru backup sau transfer.
            </div>

            {exportLoading ? (
              <div className="p-12 text-center text-xs text-text-muted flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                <span>Se generează exportul structurat...</span>
              </div>
            ) : (
              <textarea
                rows={9}
                readOnly
                value={exportJsonText}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text focus:outline-none select-all leading-relaxed shadow-inner"
              />
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleCopyExport}
                disabled={exportLoading || !exportJsonText}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors disabled:opacity-50 min-h-[38px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiat!' : 'Copiază JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadExport}
                disabled={exportLoading || !exportJsonText}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle disabled:opacity-50 min-h-[38px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descarcă Fișier JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminImportExportModal
