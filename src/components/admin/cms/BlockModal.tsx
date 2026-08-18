import React, { useState, useEffect } from 'react'
import {
  X,
  Loader2,
  Heading,
  AlignLeft,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  CheckSquare,
  Image as ImageIcon,
  Video,
  Volume2,
  Download,
  Quote,
  Code,
  Plus,
  Trash2,
} from 'lucide-react'
import type { LessonBlockData } from '@/types/blocks'
import type { LessonBlockFormData } from '@/services/adminCmsService'

interface BlockModalProps {
  isOpen: boolean
  block: LessonBlockData | null
  lessonId: string
  initialSortOrder?: number
  loading?: boolean
  error?: string | null
  onSave: (data: LessonBlockFormData) => Promise<void>
  onClose: () => void
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  block,
  lessonId,
  initialSortOrder = 0,
  loading = false,
  error = null,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(block)

  const [blockType, setBlockType] = useState<string>('rich_text')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [rawJsonMode, setRawJsonMode] = useState<boolean>(false)
  const [rawJsonText, setRawJsonText] = useState<string>('{}')
  const [formError, setFormError] = useState<string | null>(null)

  // Heading State
  const [headingText, setHeadingText] = useState('')
  const [headingLevel, setHeadingLevel] = useState<number>(2)
  const [headingSubtitle, setHeadingSubtitle] = useState('')

  // Rich Text State
  const [richTextHtml, setRichTextHtml] = useState('')

  // Important Block State
  const [importantTitle, setImportantTitle] = useState('Important')
  const [importantText, setImportantText] = useState('')

  // Remember Block State
  const [rememberTitle, setRememberTitle] = useState('De reținut')
  const [rememberText, setRememberText] = useState('')

  // Definition Block State
  const [defTerm, setDefTerm] = useState('')
  const [defDefinition, setDefDefinition] = useState('')
  const [defCategory, setDefCategory] = useState('')
  const [defExample, setDefExample] = useState('')

  // Summary Block State
  const [summaryTitle, setSummaryTitle] = useState('Sinteză și idei principale')
  const [summaryItems, setSummaryItems] = useState<string[]>([''])
  const [summaryContent, setSummaryContent] = useState('')

  // Image Block State
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageCaption, setImageCaption] = useState('')

  // Video Block State
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoPoster, setVideoPoster] = useState('')
  const [videoCaption, setVideoCaption] = useState('')

  // Audio Block State
  const [audioUrl, setAudioUrl] = useState('')
  const [audioTitle, setAudioTitle] = useState('')
  const [audioDuration, setAudioDuration] = useState('5')
  const [audioTranscript, setAudioTranscript] = useState('')

  // File Download Block State
  const [fileUrl, setFileUrl] = useState('')
  const [fileFilename, setFileFilename] = useState('')
  const [fileFilesize, setFileFilesize] = useState('')
  const [fileDescription, setFileDescription] = useState('')

  // Quote Block State
  const [quoteText, setQuoteText] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [quoteWork, setQuoteWork] = useState('')
  const [quoteCommentary, setQuoteCommentary] = useState('')

  useEffect(() => {
    if (block) {
      setBlockType(block.block_type || 'rich_text')
      setSortOrder(block.sort_order ?? 0)
      const content = block.content || {}
      setRawJsonText(JSON.stringify(content, null, 2))

      // Populate dedicated fields based on block_type
      if (block.block_type === 'heading') {
        setHeadingText((content.text as string) || '')
        setHeadingLevel(Number(content.level) || 2)
        setHeadingSubtitle((content.subtitle as string) || '')
      } else if (block.block_type === 'rich_text') {
        setRichTextHtml((content.html as string) || (content.text as string) || '')
      } else if (block.block_type === 'important') {
        setImportantTitle((content.title as string) || 'Important')
        setImportantText((content.text as string) || '')
      } else if (block.block_type === 'remember') {
        setRememberTitle((content.title as string) || 'De reținut')
        setRememberText((content.text as string) || '')
      } else if (block.block_type === 'definition') {
        setDefTerm((content.term as string) || '')
        setDefDefinition((content.definition as string) || '')
        setDefCategory((content.category as string) || '')
        setDefExample((content.example as string) || '')
      } else if (block.block_type === 'summary') {
        setSummaryTitle((content.title as string) || 'Sinteză și idei principale')
        const items = Array.isArray(content.items) ? (content.items as string[]) : ['']
        setSummaryItems(items.length > 0 ? items : [''])
        setSummaryContent((content.content as string) || '')
      } else if (block.block_type === 'image') {
        setImageUrl((content.url as string) || '')
        setImageAlt((content.alt as string) || '')
        setImageCaption((content.caption as string) || '')
      } else if (block.block_type === 'video') {
        setVideoUrl((content.url as string) || '')
        setVideoTitle((content.title as string) || '')
        setVideoPoster((content.poster as string) || '')
        setVideoCaption((content.caption as string) || '')
      } else if (block.block_type === 'audio') {
        setAudioUrl((content.url as string) || '')
        setAudioTitle((content.title as string) || '')
        setAudioDuration((content.duration as string) || '5')
        setAudioTranscript((content.transcript as string) || '')
      } else if (block.block_type === 'file_download' || block.block_type === 'attachment' || block.block_type === 'resource') {
        setFileUrl((content.url as string) || '')
        setFileFilename((content.filename as string) || '')
        setFileFilesize((content.filesize as string) || '')
        setFileDescription((content.description as string) || '')
      } else if (block.block_type === 'quote' || block.block_type === 'literary_quote') {
        setQuoteText((content.quote as string) || (content.text as string) || '')
        setQuoteAuthor((content.author as string) || '')
        setQuoteWork((content.work as string) || '')
        setQuoteCommentary((content.commentary as string) || '')
      }
    } else {
      setBlockType('rich_text')
      setSortOrder(initialSortOrder)
      setRawJsonMode(false)
      setRawJsonText('{}')

      setHeadingText('')
      setHeadingLevel(2)
      setHeadingSubtitle('')

      setRichTextHtml('')

      setImportantTitle('Important')
      setImportantText('')

      setRememberTitle('De reținut')
      setRememberText('')

      setDefTerm('')
      setDefDefinition('')
      setDefCategory('')
      setDefExample('')

      setSummaryTitle('Sinteză și idei principale')
      setSummaryItems([''])
      setSummaryContent('')

      setImageUrl('')
      setImageAlt('')
      setImageCaption('')

      setVideoUrl('')
      setVideoTitle('')
      setVideoPoster('')
      setVideoCaption('')

      setAudioUrl('')
      setAudioTitle('')
      setAudioDuration('5')
      setAudioTranscript('')

      setFileUrl('')
      setFileFilename('')
      setFileFilesize('')
      setFileDescription('')

      setQuoteText('')
      setQuoteAuthor('')
      setQuoteWork('')
      setQuoteCommentary('')
    }
    setFormError(null)
  }, [block, initialSortOrder, isOpen])

  if (!isOpen) return null

  // Helpers for summary items list
  const handleAddSummaryItem = () => {
    setSummaryItems((prev) => [...prev, ''])
  }

  const handleUpdateSummaryItem = (index: number, val: string) => {
    setSummaryItems((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  const handleRemoveSummaryItem = (index: number) => {
    setSummaryItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    let content: Record<string, unknown> = {}

    if (rawJsonMode) {
      try {
        content = JSON.parse(rawJsonText)
      } catch (err) {
        setFormError('Format JSON invalid: ' + (err instanceof Error ? err.message : 'Verifică sintaxa.'))
        return
      }
    } else {
      // Build content from specialized visual form
      switch (blockType) {
        case 'heading':
          if (!headingText.trim()) {
            setFormError('Textul titlului este obligatoriu.')
            return
          }
          content = {
            text: headingText.trim(),
            level: Number(headingLevel) || 2,
            ...(headingSubtitle.trim() ? { subtitle: headingSubtitle.trim() } : {}),
          }
          break

        case 'rich_text':
          if (!richTextHtml.trim()) {
            setFormError('Conținutul textului este obligatoriu.')
            return
          }
          content = {
            html: richTextHtml.trim(),
          }
          break

        case 'important':
          if (!importantText.trim()) {
            setFormError('Textul atenționării este obligatoriu.')
            return
          }
          content = {
            title: importantTitle.trim() || 'Important',
            text: importantText.trim(),
          }
          break

        case 'remember':
          if (!rememberText.trim()) {
            setFormError('Textul de reținut este obligatoriu.')
            return
          }
          content = {
            title: rememberTitle.trim() || 'De reținut',
            text: rememberText.trim(),
          }
          break

        case 'definition':
          if (!defTerm.trim() || !defDefinition.trim()) {
            setFormError('Termenul și definiția sunt obligatorii.')
            return
          }
          content = {
            term: defTerm.trim(),
            definition: defDefinition.trim(),
            ...(defCategory.trim() ? { category: defCategory.trim() } : {}),
            ...(defExample.trim() ? { example: defExample.trim() } : {}),
          }
          break

        case 'summary': {
          const cleanItems = summaryItems.map((i) => i.trim()).filter(Boolean)
          if (cleanItems.length === 0 && !summaryContent.trim()) {
            setFormError('Adaugă cel puțin un punct cheie sau un paragraf de sinteză.')
            return
          }
          content = {
            title: summaryTitle.trim() || 'Sinteză și idei principale',
            items: cleanItems,
            ...(summaryContent.trim() ? { content: summaryContent.trim() } : {}),
          }
          break
        }

        case 'image':
          if (!imageUrl.trim()) {
            setFormError('URL-ul imaginii este obligatoriu.')
            return
          }
          content = {
            url: imageUrl.trim(),
            ...(imageAlt.trim() ? { alt: imageAlt.trim() } : {}),
            ...(imageCaption.trim() ? { caption: imageCaption.trim() } : {}),
          }
          break

        case 'video':
          if (!videoUrl.trim()) {
            setFormError('URL-ul video este obligatoriu.')
            return
          }
          content = {
            url: videoUrl.trim(),
            ...(videoTitle.trim() ? { title: videoTitle.trim() } : {}),
            ...(videoPoster.trim() ? { poster: videoPoster.trim() } : {}),
            ...(videoCaption.trim() ? { caption: videoCaption.trim() } : {}),
          }
          break

        case 'audio':
          if (!audioUrl.trim()) {
            setFormError('URL-ul audio este obligatoriu.')
            return
          }
          content = {
            url: audioUrl.trim(),
            ...(audioTitle.trim() ? { title: audioTitle.trim() } : {}),
            ...(audioDuration ? { duration: audioDuration } : {}),
            ...(audioTranscript.trim() ? { transcript: audioTranscript.trim() } : {}),
          }
          break

        case 'file_download':
          if (!fileUrl.trim() || !fileFilename.trim()) {
            setFormError('URL-ul resursei și numele fișierului sunt obligatorii.')
            return
          }
          content = {
            url: fileUrl.trim(),
            filename: fileFilename.trim(),
            ...(fileFilesize.trim() ? { filesize: fileFilesize.trim() } : {}),
            ...(fileDescription.trim() ? { description: fileDescription.trim() } : {}),
          }
          break

        case 'quote':
          if (!quoteText.trim()) {
            setFormError('Textul citatului este obligatoriu.')
            return
          }
          content = {
            quote: quoteText.trim(),
            ...(quoteAuthor.trim() ? { author: quoteAuthor.trim() } : {}),
            ...(quoteWork.trim() ? { work: quoteWork.trim() } : {}),
            ...(quoteCommentary.trim() ? { commentary: quoteCommentary.trim() } : {}),
          }
          break

        default:
          content = {}
          break
      }
    }

    try {
      await onSave({
        lesson_id: lessonId,
        block_type: blockType,
        sort_order: Number(sortOrder) || 0,
        content,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'A apărut o eroare la salvare.')
    }
  }

  const blockTypeIcons: Record<string, React.ReactNode> = {
    heading: <Heading className="w-4 h-4 text-cyan-400" />,
    rich_text: <AlignLeft className="w-4 h-4 text-slate-300" />,
    important: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    remember: <Lightbulb className="w-4 h-4 text-cyan-400" />,
    definition: <BookOpen className="w-4 h-4 text-cyan-400" />,
    summary: <CheckSquare className="w-4 h-4 text-emerald-400" />,
    image: <ImageIcon className="w-4 h-4 text-purple-400" />,
    video: <Video className="w-4 h-4 text-red-400" />,
    audio: <Volume2 className="w-4 h-4 text-amber-400" />,
    file_download: <Download className="w-4 h-4 text-blue-400" />,
    quote: <Quote className="w-4 h-4 text-amber-300" />,
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-elevated border border-border p-6 space-y-5 shadow-2xl z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
              {blockTypeIcons[blockType] || <Code className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <h3 id="block-modal-title" className="font-display font-bold text-lg text-text">
                {isEditing ? 'Editare Bloc de Conținut' : 'Adaugă Bloc Nou'}
              </h3>
              <p className="text-xs text-text-muted">
                Tip: <span className="font-mono text-amber-400 font-bold">{blockType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRawJsonMode((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                rawJsonMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'glass-subtle border-border text-text-muted hover:text-text'
              }`}
              title="Comută între Editor Asistat și JSON brut"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{rawJsonMode ? 'Mod Vizual' : 'JSON Brut'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Închide fereastra"
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notification */}
        {(formError || error) && (
          <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger">
            {formError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Block Type Selector */}
          <div className="space-y-1.5">
            <label htmlFor="block-type-select" className="block text-xs font-bold text-text uppercase tracking-wider">
              Tipul Blocului Pedagogic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'heading', name: 'Titlu (H1-H4)', icon: <Heading className="w-3.5 h-3.5" /> },
                { id: 'rich_text', name: 'Text / Paragraf', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { id: 'important', name: 'Important (Alert)', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                { id: 'remember', name: 'De Reținut (Tip)', icon: <Lightbulb className="w-3.5 h-3.5" /> },
                { id: 'definition', name: 'Definiție Literară', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'summary', name: 'Sinteză / Barem', icon: <CheckSquare className="w-3.5 h-3.5" /> },
                { id: 'image', name: 'Imagine / Schemă', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                { id: 'video', name: 'Lecție Video', icon: <Video className="w-3.5 h-3.5" /> },
                { id: 'audio', name: 'Audio Sinteză', icon: <Volume2 className="w-3.5 h-3.5" /> },
                { id: 'file_download', name: 'Resursă PDF/Fișier', icon: <Download className="w-3.5 h-3.5" /> },
                { id: 'quote', name: 'Citat Literar', icon: <Quote className="w-3.5 h-3.5" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBlockType(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    blockType === t.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                      : 'bg-surface border-border text-text-muted hover:text-text hover:bg-surface-elevated'
                  }`}
                >
                  {t.icon}
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC FORM FIELDS ACCORDING TO BLOCK TYPE */}
          {rawJsonMode ? (
            <div className="space-y-1.5">
              <label htmlFor="block-raw-json" className="block text-xs font-bold text-text uppercase tracking-wider">
                Conținut JSON Brut (`content`)
              </label>
              <textarea
                id="block-raw-json"
                rows={8}
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/80 border border-border text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* 1. HEADING */}
              {blockType === 'heading' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label htmlFor="heading-text-input" className="block text-xs font-bold text-text">
                        Text Titlu <span className="text-status-danger">*</span>
                      </label>
                      <input
                        id="heading-text-input"
                        type="text"
                        required
                        value={headingText}
                        onChange={(e) => setHeadingText(e.target.value)}
                        placeholder="ex: II. Viziunea despre lume în opera Moara cu noroc"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="heading-level-select" className="block text-xs font-bold text-text">
                        Nivel Ierarhic
                      </label>
                      <select
                        id="heading-level-select"
                        value={headingLevel}
                        onChange={(e) => setHeadingLevel(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      >
                        <option value={1}>H1 - Titlu Principal</option>
                        <option value={2}>H2 - Secțiune Mare</option>
                        <option value={3}>H3 - Subsecțiune</option>
                        <option value={4}>H4 - Detaliu</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="heading-subtitle-input" className="block text-xs font-bold text-text">
                      Subtitlu / Note Suplimentare (Opțional)
                    </label>
                    <input
                      id="heading-subtitle-input"
                      type="text"
                      value={headingSubtitle}
                      onChange={(e) => setHeadingSubtitle(e.target.value)}
                      placeholder="ex: Structură și compoziție narativă"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 2. RICH TEXT */}
              {blockType === 'rich_text' && (
                <div className="space-y-1.5">
                  <label htmlFor="rich-text-input" className="block text-xs font-bold text-text">
                    Conținut Text / HTML <span className="text-status-danger">*</span>
                  </label>
                  <textarea
                    id="rich-text-input"
                    rows={6}
                    required
                    value={richTextHtml}
                    onChange={(e) => setRichTextHtml(e.target.value)}
                    placeholder="Introdu paragrafele lecției. Poți folosi etichete HTML precum <p>, <strong>, <em>, <ul>, <li>..."
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* 3. IMPORTANT */}
              {blockType === 'important' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="important-title-input" className="block text-xs font-bold text-amber-400">
                      Titlu Alertă
                    </label>
                    <input
                      id="important-title-input"
                      type="text"
                      value={importantTitle}
                      onChange={(e) => setImportantTitle(e.target.value)}
                      placeholder="ex: Nuconfunda cu romanul subiectiv"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="important-text-input" className="block text-xs font-bold text-text">
                      Mesaj Important <span className="text-status-danger">*</span>
                    </label>
                    <textarea
                      id="important-text-input"
                      rows={3}
                      required
                      value={importantText}
                      onChange={(e) => setImportantText(e.target.value)}
                      placeholder="ex: Nu confunda tema operei cu viziunea despre lume a autorului!"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 4. REMEMBER */}
              {blockType === 'remember' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="remember-title-input" className="block text-xs font-bold text-cyan-400">
                      Titlu De Reținut
                    </label>
                    <input
                      id="remember-title-input"
                      type="text"
                      value={rememberTitle}
                      onChange={(e) => setRememberTitle(e.target.value)}
                      placeholder="ex: De reținut pentru 10 curat"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="remember-text-input" className="block text-xs font-bold text-text">
                      Text Memorabil / Reper <span className="text-status-danger">*</span>
                    </label>
                    <textarea
                      id="remember-text-input"
                      rows={3}
                      required
                      value={rememberText}
                      onChange={(e) => setRememberText(e.target.value)}
                      placeholder="ex: Citatul cheie: 'Omul să fie mulțumit cu sărăcia sa, căci, dacă e vorba, nu bogăția, ci liniștea colibei tale te face fericit.'"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 5. DEFINITION */}
              {blockType === 'definition' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="def-term-input" className="block text-xs font-bold text-text">
                        Termen / Concept Literar <span className="text-status-danger">*</span>
                      </label>
                      <input
                        id="def-term-input"
                        type="text"
                        required
                        value={defTerm}
                        onChange={(e) => setDefTerm(e.target.value)}
                        placeholder="ex: Incipit ex-abrupto"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="def-category-input" className="block text-xs font-bold text-text">
                        Categorie / Tag
                      </label>
                      <input
                        id="def-category-input"
                        type="text"
                        value={defCategory}
                        onChange={(e) => setDefCategory(e.target.value)}
                        placeholder="ex: Structură narativă"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="def-def-input" className="block text-xs font-bold text-text">
                      Definiție Canonică <span className="text-status-danger">*</span>
                    </label>
                    <textarea
                      id="def-def-input"
                      rows={2}
                      required
                      value={defDefinition}
                      onChange={(e) => setDefDefinition(e.target.value)}
                      placeholder="ex: Modalitate de deschidere a unei opere narative direct în miezul evenimentelor, fără introduceri..."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="def-example-input" className="block text-xs font-bold text-text">
                      Exemplu din Text (Opțional)
                    </label>
                    <input
                      id="def-example-input"
                      type="text"
                      value={defExample}
                      onChange={(e) => setDefExample(e.target.value)}
                      placeholder="ex: Vorbele bătrânei din debutul nuvelei Moara cu noroc"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 6. SUMMARY */}
              {blockType === 'summary' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="summary-title-input" className="block text-xs font-bold text-emerald-400">
                      Titlu Sinteză
                    </label>
                    <input
                      id="summary-title-input"
                      type="text"
                      value={summaryTitle}
                      onChange={(e) => setSummaryTitle(e.target.value)}
                      placeholder="ex: Sinteză și puncte obligatorii pe barem"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-text">
                        Idei Principale / Bullets
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSummaryItem}
                        className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Adaugă rând
                      </button>
                    </div>

                    {summaryItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateSummaryItem(idx, e.target.value)}
                          placeholder={`Punctul ${idx + 1}...`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text focus:outline-none focus:border-amber-400"
                        />
                        {summaryItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSummaryItem(idx)}
                            aria-label={`Șterge rândul ${idx + 1}`}
                            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-surface-elevated transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="summary-concl-input" className="block text-xs font-bold text-text">
                      Concluzie Suplimentară (Opțional)
                    </label>
                    <textarea
                      id="summary-concl-input"
                      rows={2}
                      value={summaryContent}
                      onChange={(e) => setSummaryContent(e.target.value)}
                      placeholder="ex: Reținerea acestor 4 repere garantează punctajul maxim de 30 de puncte."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 7. IMAGE */}
              {blockType === 'image' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="img-url-input" className="block text-xs font-bold text-text">
                      URL Imagine (HTTPS sau cale relativă) <span className="text-status-danger">*</span>
                    </label>
                    <input
                      id="img-url-input"
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="ex: https://images.unsplash.com/... sau /images/rebreanu.jpg"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="img-alt-input" className="block text-xs font-bold text-text">
                        Text Alternativ (Alt Text)
                      </label>
                      <input
                        id="img-alt-input"
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="ex: Schema personajelor din Moara cu noroc"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="img-cap-input" className="block text-xs font-bold text-text">
                        Legendă (Caption)
                      </label>
                      <input
                        id="img-cap-input"
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="ex: Figura 1. Raportul de forțe dintre Lică și Ghiță"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. VIDEO */}
              {blockType === 'video' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="video-url-input" className="block text-xs font-bold text-text">
                      URL Video (YouTube sau MP4 direct) <span className="text-status-danger">*</span>
                    </label>
                    <input
                      id="video-url-input"
                      type="text"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ sau https://.../video.mp4"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="video-title-input" className="block text-xs font-bold text-text">
                        Titlu Video (Opțional)
                      </label>
                      <input
                        id="video-title-input"
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="ex: Analiză video Moara cu noroc"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="video-caption-input" className="block text-xs font-bold text-text">
                        Legendă Video
                      </label>
                      <input
                        id="video-caption-input"
                        type="text"
                        value={videoCaption}
                        onChange={(e) => setVideoCaption(e.target.value)}
                        placeholder="ex: Explicație detaliată de 15 minute"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. AUDIO */}
              {blockType === 'audio' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="audio-url-input" className="block text-xs font-bold text-text">
                      URL Fișier Audio (MP3 / WAV) <span className="text-status-danger">*</span>
                    </label>
                    <input
                      id="audio-url-input"
                      type="text"
                      required
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="ex: https://.../audio-sinteza-bac.mp3"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="audio-title-input" className="block text-xs font-bold text-text">
                        Titlu Sinteză Audio
                      </label>
                      <input
                        id="audio-title-input"
                        type="text"
                        value={audioTitle}
                        onChange={(e) => setAudioTitle(e.target.value)}
                        placeholder="ex: Sinteză Audio Moara cu noroc"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="audio-dur-input" className="block text-xs font-bold text-text">
                        Durată (minute)
                      </label>
                      <input
                        id="audio-dur-input"
                        type="text"
                        value={audioDuration}
                        onChange={(e) => setAudioDuration(e.target.value)}
                        placeholder="ex: 8"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="audio-trans-input" className="block text-xs font-bold text-text">
                      Transcrierea Text a Fișierului Audio (Opțional)
                    </label>
                    <textarea
                      id="audio-trans-input"
                      rows={3}
                      value={audioTranscript}
                      onChange={(e) => setAudioTranscript(e.target.value)}
                      placeholder="Introdu transcrierea text completă..."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* 10. FILE DOWNLOAD */}
              {(blockType === 'file_download' || blockType === 'attachment' || blockType === 'resource') && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="file-url-input" className="block text-xs font-bold text-text">
                        URL Fișier Descarcabil <span className="text-status-danger">*</span>
                      </label>
                      <input
                        id="file-url-input"
                        type="text"
                        required
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="ex: https://.../sinteza-bac.pdf"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="file-name-input" className="block text-xs font-bold text-text">
                        Nume Fișier Afișat <span className="text-status-danger">*</span>
                      </label>
                      <input
                        id="file-name-input"
                        type="text"
                        required
                        value={fileFilename}
                        onChange={(e) => setFileFilename(e.target.value)}
                        placeholder="ex: Esquisse_Moara_cu_noroc.pdf"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="file-size-input" className="block text-xs font-bold text-text">
                        Dimensiune Afișată
                      </label>
                      <input
                        id="file-size-input"
                        type="text"
                        value={fileFilesize}
                        onChange={(e) => setFileFilesize(e.target.value)}
                        placeholder="ex: PDF • 1.4 MB"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="file-desc-input" className="block text-xs font-bold text-text">
                        Descriere Resursă
                      </label>
                      <input
                        id="file-desc-input"
                        type="text"
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                        placeholder="ex: Fișă rezumat pentru imprimat"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 11. QUOTE */}
              {(blockType === 'quote' || blockType === 'literary_quote') && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="quote-text-input" className="block text-xs font-bold text-text">
                      Text Citat Literar <span className="text-status-danger">*</span>
                    </label>
                    <textarea
                      id="quote-text-input"
                      rows={3}
                      required
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder="ex: Omul să fie mulțumit cu sărăcia sa, căci, dacă e vorba, nu bogăția, ci liniștea colibei tale te face fericit."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="quote-author-input" className="block text-xs font-bold text-text">
                        Autor / Personaj
                      </label>
                      <input
                        id="quote-author-input"
                        type="text"
                        value={quoteAuthor}
                        onChange={(e) => setQuoteAuthor(e.target.value)}
                        placeholder="ex: Bătrâna (mama Anei)"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="quote-work-input" className="block text-xs font-bold text-text">
                        Opera / Sursa Citatului
                      </label>
                      <input
                        id="quote-work-input"
                        type="text"
                        value={quoteWork}
                        onChange={(e) => setQuoteWork(e.target.value)}
                        placeholder="ex: Moara cu noroc de Ioan Slavici"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="quote-comm-input" className="block text-xs font-bold text-text">
                      Comentariu / Semnificație Examen (Opțional)
                    </label>
                    <input
                      id="quote-comm-input"
                      type="text"
                      value={quoteCommentary}
                      onChange={(e) => setQuoteCommentary(e.target.value)}
                      placeholder="ex: Vorbele bătrânei constituie incipitul moralizator al nuvelei."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sort order */}
          <div className="space-y-1.5">
            <label htmlFor="block-sort" className="block text-xs font-bold text-text uppercase tracking-wider">
              Ordine Sortare în Lecție (Sort Order)
            </label>
            <input
              id="block-sort"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface-elevated transition-colors disabled:opacity-50 min-h-[38px]"
            >
              Anulează
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 min-h-[38px]"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Salvează Blocul' : 'Adaugă Blocul'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlockModal
