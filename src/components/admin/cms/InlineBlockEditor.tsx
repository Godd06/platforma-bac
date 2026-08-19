import React, { useState, useEffect } from 'react'
import {
  Check,
  Code,
  Plus,
  Trash2,
  FileText,
  Upload,
} from 'lucide-react'
import type { LessonBlockData } from '@/types/blocks'
import { uploadMediaFile, type LessonBlockFormData } from '@/services/adminCmsService'
import { VisualRichTextEditor } from './VisualRichTextEditor'

interface InlineBlockEditorProps {
  block: LessonBlockData
  onSave: (formData: LessonBlockFormData) => void
  onSaveAndNext?: (formData: LessonBlockFormData) => void
  onCancel: () => void
}

export const InlineBlockEditor: React.FC<InlineBlockEditorProps> = ({
  block,
  onSave,
  onSaveAndNext,
  onCancel,
}) => {
  const [blockType, setBlockType] = useState<string>(block.block_type || 'rich_text')
  const [sortOrder] = useState<number>(block.sort_order ?? 0)
  const [content, setContent] = useState<Record<string, unknown>>(() => {
    return { ...(block.content || {}) }
  })
  const [rawJsonMode, setRawJsonMode] = useState<boolean>(false)
  const [rawJsonText, setRawJsonText] = useState<string>(() => JSON.stringify(block.content || {}, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Keyboard shortcut: Ctrl+Enter to save, Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, blockType, rawJsonMode, jsonError])

  const handleContentField = (key: string, value: unknown) => {
    setContent((prev) => {
      const updated = { ...prev, [key]: value }
      setRawJsonText(JSON.stringify(updated, null, 2))
      return updated
    })
  }

  const handleRawJsonChange = (val: string) => {
    setRawJsonText(val)
    setJsonError(null)
    try {
      const parsed = JSON.parse(val)
      setContent(parsed)
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Sintaxă JSON invalidă')
    }
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (rawJsonMode && jsonError) return

    onSave({
      lesson_id: block.lesson_id,
      block_type: blockType,
      sort_order: sortOrder,
      content,
    })
  }

  const richTextInitial =
    (content.html as string) ||
    (content.markdown as string) ||
    (content.text as string) ||
    ''

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-surface-elevated/95 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4 animate-fadeIn">
      {/* Top Header & Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block">
              Editor Vizual WYSIWYG
            </span>
            <span className="text-[11px] text-text-subtle font-mono">
              Tastează și formatează direct în pagină
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Block Type Picker */}
          <select
            value={blockType}
            onChange={(e) => setBlockType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text focus:outline-none focus:border-amber-400 transition-all cursor-pointer shadow-subtle"
          >
            <option value="rich_text">¶ — Paragraf / Text Vizual</option>
            <option value="heading">H — Titlu / Reper Barem</option>
            <option value="important">⚠️ — Atenție la Barem</option>
            <option value="remember">💡 — De Reținut / Notă</option>
            <option value="definition">📖 — Definiție / Concept</option>
            <option value="summary">🎯 — Sinteză / Puncte Cheie</option>
            <option value="image">🖼️ — Imagine / Ilustrație</option>
            <option value="video">🎬 — Video Embed</option>
            <option value="audio">🎧 — Audio Player / Narațiune</option>
            <option value="file_download">📥 — Fișier / Descărcare PDF</option>
            <option value="quote">💬 — Citat / Fragment Textual</option>
          </select>

          {/* Raw JSON toggle */}
          <button
            type="button"
            onClick={() => setRawJsonMode(!rawJsonMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              rawJsonMode
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text bg-surface border border-border hover:bg-surface-elevated'
            }`}
            title="Comută Mod JSON Brut"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {rawJsonMode ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-bold text-text-muted">
              Conținut Structurat JSON (Power User)
            </label>
            <span className="text-[11px] text-text-subtle font-mono">Ctrl+Enter pentru salvare</span>
          </div>
          <textarea
            rows={8}
            value={rawJsonText}
            onChange={(e) => handleRawJsonChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text focus:outline-none focus:border-amber-400 leading-relaxed shadow-inner"
          />
          {jsonError && (
            <p className="text-xs text-status-danger font-medium flex items-center gap-1">
              <span>⚠️</span>
              <span>{jsonError}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* ==================== 1. RICH TEXT (VISUAL WYSIWYG) ==================== */}
          {blockType === 'rich_text' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text">
                Conținut Text Formatat Vizual
              </label>
              <VisualRichTextEditor
                content={richTextInitial}
                autoFocus={true}
                placeholder="Scrie paragraful de eseu sau analiza literară aici... Selectează textul pentru formatare rapidă."
                onChange={({ html, text }) => {
                  handleContentField('html', html)
                  handleContentField('text', text)
                }}
                onSaveShortcut={handleSave}
              />
            </div>
          )}

          {/* ==================== 2. HEADING ==================== */}
          {blockType === 'heading' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                    Ierarhie Barem
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-surface border border-border">
                    {[1, 2, 3, 4].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleContentField('level', lvl)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          (Number(content.level) || 2) === lvl
                            ? 'bg-amber-500 text-black shadow-subtle'
                            : 'text-text-muted hover:text-text'
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="block text-xs font-bold text-text">Text Titlu / Reper</label>
                  <input
                    type="text"
                    autoFocus
                    value={(content.text as string) || ''}
                    onChange={(e) => handleContentField('text', e.target.value)}
                    placeholder="ex: 1. Tema și viziunea despre lume"
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface border border-border text-base font-display font-bold text-text focus:outline-none focus:border-amber-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">
                  Subtitlu / Notă explicativă (Opțional)
                </label>
                <input
                  type="text"
                  value={(content.subtitle as string) || ''}
                  onChange={(e) => handleContentField('subtitle', e.target.value)}
                  placeholder="ex: Încadrarea operei în realismul psihologic (slavician)"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* ==================== 3. IMPORTANT (ALERT) ==================== */}
          {blockType === 'important' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Titlu Atenționare Barem
                </label>
                <input
                  type="text"
                  value={(content.title as string) || ''}
                  onChange={(e) => handleContentField('title', e.target.value)}
                  placeholder="ex: Atenție la Baremul Oficial Subiectul III!"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-amber-500/50 text-sm font-bold text-text focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Mesaj Detaliat (Vizual)</label>
                <VisualRichTextEditor
                  content={(content.message as string) || (content.text as string) || (content.html as string) || ''}
                  placeholder="Precizează cerințele obligatorii din baremul de evaluare..."
                  onChange={({ html, text }) => {
                    handleContentField('message', html)
                    handleContentField('text', text)
                  }}
                  onSaveShortcut={handleSave}
                />
              </div>
            </div>
          )}

          {/* ==================== 4. REMEMBER (NOTE) ==================== */}
          {blockType === 'remember' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Titlu Notă / De Reținut
                </label>
                <input
                  type="text"
                  value={(content.title as string) || ''}
                  onChange={(e) => handleContentField('title', e.target.value)}
                  placeholder="ex: Citat reprezentativ / Reper critic George Călinescu"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-cyan-500/50 text-sm font-bold text-text focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Text Notă / Citat (Vizual)</label>
                <VisualRichTextEditor
                  content={(content.text as string) || (content.message as string) || (content.html as string) || ''}
                  placeholder="„Omul să fie mulțumit cu sărăcia sa, căci, dacă e vorba, nu bogăția, ci liniștea colibei tale te face fericit.”"
                  onChange={({ html, text }) => {
                    handleContentField('text', html)
                    handleContentField('html', html)
                    handleContentField('message', text)
                  }}
                  onSaveShortcut={handleSave}
                />
              </div>
            </div>
          )}

          {/* ==================== 5. DEFINITION ==================== */}
          {blockType === 'definition' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text uppercase tracking-wider">Concept / Termen</label>
                  <input
                    type="text"
                    value={(content.term as string) || ''}
                    onChange={(e) => handleContentField('term', e.target.value)}
                    placeholder="ex: Nuvelă psihologică"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Categorie / Gen</label>
                  <input
                    type="text"
                    value={(content.category as string) || ''}
                    onChange={(e) => handleContentField('category', e.target.value)}
                    placeholder="ex: Specie a genului epic"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Definiție Structurată (Vizual)</label>
                <VisualRichTextEditor
                  content={(content.definition as string) || (content.html as string) || ''}
                  placeholder="Explicația noțiunii și caracteristicile definitorii..."
                  onChange={({ html, text }) => {
                    handleContentField('definition', html)
                    handleContentField('text', text)
                  }}
                  onSaveShortcut={handleSave}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Exemplu Concret / Ilustrare din Operă (Opțional)</label>
                <input
                  type="text"
                  value={(content.example as string) || ''}
                  onChange={(e) => handleContentField('example', e.target.value)}
                  placeholder="ex: Moara cu noroc de Ioan Slavici reprezintă o nuvelă psihologică realistă canonică."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ==================== 6. SUMMARY ==================== */}
          {blockType === 'summary' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Titlu Sinteză Finală
                </label>
                <input
                  type="text"
                  value={(content.title as string) || ''}
                  onChange={(e) => handleContentField('title', e.target.value)}
                  placeholder="ex: Reper Sinteză: 4 Idei Fundamentale"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-emerald-500/50 text-sm font-bold text-text focus:outline-none"
                />
              </div>

              {/* Dynamic list items */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-muted">Puncte de Barem</label>
                {(((content.points as string[]) || (content.items as string[])) || []).map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 w-6 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => {
                        const current = [...(((content.points as string[]) || (content.items as string[])) || [])]
                        current[idx] = e.target.value
                        handleContentField('points', current)
                        handleContentField('items', current)
                      }}
                      placeholder={`Punctul ${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const current = [...(((content.points as string[]) || (content.items as string[])) || [])]
                        current.splice(idx, 1)
                        handleContentField('points', current)
                        handleContentField('items', current)
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-status-danger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const current = [...(((content.points as string[]) || (content.items as string[])) || [])]
                    current.push('')
                    handleContentField('points', current)
                    handleContentField('items', current)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Adaugă punct de barem</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== 7. IMAGE ==================== */}
          {blockType === 'image' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-text uppercase tracking-wider">
                    Fișier Media (Imagine, Audio sau Video)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-subtle">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Încarcă Fișier</span>
                    <input
                      type="file"
                      accept="image/*,audio/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const res = await uploadMediaFile(file, 'media-blocks')
                        if (res.url) {
                          handleContentField('url', res.url)
                          handleContentField('src', res.url)
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={(content.url as string) || (content.src as string) || ''}
                  onChange={(e) => {
                    handleContentField('url', e.target.value)
                    handleContentField('src', e.target.value)
                  }}
                  placeholder="https://... sau încarcă un fișier media local"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>

              {Boolean((content.url as string) || (content.src as string)) && (
                <div className="p-3 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center overflow-hidden">
                  <img
                    src={(content.url as string) || (content.src as string)}
                    alt={(content.alt as string) || 'Preview'}
                    className="max-h-48 object-contain rounded-lg"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ==================== 8. VIDEO ==================== */}
          {blockType === 'video' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-text uppercase tracking-wider">
                    Sursă Video (URL YouTube / MP4 / WebM)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-subtle">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Încarcă Video Local</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const res = await uploadMediaFile(file, 'videos')
                        if (res.url) {
                          handleContentField('url', res.url)
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={(content.url as string) || ''}
                  onChange={(e) => handleContentField('url', e.target.value)}
                  placeholder="ex: https://www.youtube.com/watch?v=... sau URL mp4"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Titlu Video</label>
                  <input
                    type="text"
                    value={(content.title as string) || ''}
                    onChange={(e) => handleContentField('title', e.target.value)}
                    placeholder="ex: Analiză Video Canonică"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Legendă / Note</label>
                  <input
                    type="text"
                    value={(content.caption as string) || ''}
                    onChange={(e) => handleContentField('caption', e.target.value)}
                    placeholder="ex: Durată: 12 min • Explicații barem"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== 9. AUDIO ==================== */}
          {blockType === 'audio' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-text uppercase tracking-wider">
                    Sursă Audio (MP3 / Podcast)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all cursor-pointer shadow-subtle">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Încarcă MP3 / Audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const res = await uploadMediaFile(file, 'audio')
                        if (res.url) {
                          handleContentField('url', res.url)
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={(content.url as string) || ''}
                  onChange={(e) => handleContentField('url', e.target.value)}
                  placeholder="https://... sau încarcă un fișier MP3 local"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Titlu Audio</label>
                  <input
                    type="text"
                    value={(content.title as string) || ''}
                    onChange={(e) => handleContentField('title', e.target.value)}
                    placeholder="ex: Podcast — Sinteză Moara cu Noroc"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Durată (Minute)</label>
                  <input
                    type="text"
                    value={(content.duration as string) || ''}
                    onChange={(e) => handleContentField('duration', e.target.value)}
                    placeholder="ex: 8"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Transcrierea Audio (Opțional)</label>
                <textarea
                  rows={3}
                  value={(content.transcript as string) || ''}
                  onChange={(e) => handleContentField('transcript', e.target.value)}
                  placeholder="Adaugă textul transcris al înregistrării..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ==================== 10. FILE DOWNLOAD ==================== */}
          {(blockType === 'file_download' || blockType === 'attachment') && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-text uppercase tracking-wider">
                    Fișier de Descărcat (PDF, DOCX, ZIP)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-subtle">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Încarcă Fișier</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.zip,.rar,.txt"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const res = await uploadMediaFile(file, 'downloads')
                        if (res.url) {
                          handleContentField('url', res.url)
                          handleContentField('filename', file.name)
                          handleContentField('filesize', `${(file.size / (1024 * 1024)).toFixed(1)} MB`)
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={(content.url as string) || ''}
                  onChange={(e) => handleContentField('url', e.target.value)}
                  placeholder="https://... sau încarcă un fișier de descărcat"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Nume Fișier Afișat</label>
                  <input
                    type="text"
                    value={(content.filename as string) || ''}
                    onChange={(e) => handleContentField('filename', e.target.value)}
                    placeholder="ex: Schiță-Barem-Eseu-Canonic.pdf"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Dimensiune Fișier</label>
                  <input
                    type="text"
                    value={(content.filesize as string) || ''}
                    onChange={(e) => handleContentField('filesize', e.target.value)}
                    placeholder="ex: PDF • 1.4 MB"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Descriere Scurtă</label>
                <input
                  type="text"
                  value={(content.description as string) || ''}
                  onChange={(e) => handleContentField('description', e.target.value)}
                  placeholder="ex: Fișă rezumat pentru imprimat și recapitulat rapid."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ==================== 11. QUOTE ==================== */}
          {(blockType === 'quote' || blockType === 'literary_quote') && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text uppercase tracking-wider">
                  Citat Literar sau Critic
                </label>
                <textarea
                  rows={3}
                  value={(content.quote as string) || ''}
                  onChange={(e) => handleContentField('quote', e.target.value)}
                  placeholder="ex: Omul să fie mulțumit cu sărăcia sa, căci, dacă-i vorba, nu bogăția, ci liniștea colibei tale te face fericit."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-literary-serif text-text focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Autor</label>
                  <input
                    type="text"
                    value={(content.author as string) || ''}
                    onChange={(e) => handleContentField('author', e.target.value)}
                    placeholder="ex: Ioan Slavici"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-muted">Opera / Capitol</label>
                  <input
                    type="text"
                    value={(content.work as string) || ''}
                    onChange={(e) => handleContentField('work', e.target.value)}
                    placeholder="ex: Moara cu noroc (Vorbele Bătrânei)"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-muted">Comentariu Critica (Opțional)</label>
                <input
                  type="text"
                  value={(content.commentary as string) || ''}
                  onChange={(e) => handleContentField('commentary', e.target.value)}
                  placeholder="ex: Avertismentul moralizator care anticipează deznodământul tragic."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">
        <span className="text-[11px] font-mono text-text-subtle hidden sm:inline">
          Scurtătură: <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">Ctrl+Enter</kbd> salvează • <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">Esc</kbd> anulează
        </span>

        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* FIX CANCEL BUTTON PROPAGATION */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
            className="px-3.5 py-1.5 rounded-xl glass-subtle border border-border text-xs font-semibold text-text hover:bg-surface hover:text-status-danger transition-colors min-h-[36px] cursor-pointer"
          >
            Anulează
          </button>

          {onSaveAndNext && (
            <button
              type="button"
              onClick={() =>
                onSaveAndNext({
                  lesson_id: block.lesson_id,
                  block_type: blockType,
                  sort_order: sortOrder,
                  content,
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-subtle border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/10 transition-all min-h-[36px]"
              title="Salvează acest bloc și deschide imediat următorul bloc pentru editare"
            >
              <span>Salvează & Următorul →</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] min-h-[36px]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvează Blocul</span>
          </button>
        </div>
      </div>
    </div>
  )
}
