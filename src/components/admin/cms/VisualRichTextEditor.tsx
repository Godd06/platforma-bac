import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Link as LinkIcon,
  Quote,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  ExternalLink,
  Check,
  X,
} from 'lucide-react'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

// Custom Tiptap Highlight Extension that preserves data-color and custom highlight classes
const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element) => {
          const colorAttr = element.getAttribute('data-color') || element.getAttribute('data-highlight')
          if (colorAttr) return colorAttr
          const cls = (element.getAttribute('class') || '').toLowerCase()
          if (cls.includes('highlight-cyan') || cls.includes('cyan')) return 'cyan'
          if (cls.includes('highlight-amber') || cls.includes('amber')) return 'amber'
          if (cls.includes('highlight-yellow') || cls.includes('yellow')) return 'yellow'
          if (cls.includes('highlight-rose') || cls.includes('rose') || cls.includes('red')) return 'rose'
          if (cls.includes('highlight-emerald') || cls.includes('emerald') || cls.includes('green')) return 'emerald'
          return 'yellow'
        },
        renderHTML: (attributes) => {
          const c = attributes.color || 'yellow'
          return {
            'data-color': c,
            class: `bac-highlight highlight-${c}`,
          }
        },
      },
    }
  },
})

export interface VisualRichTextEditorProps {
  content: string // HTML or plain text
  placeholder?: string
  onChange: (data: { html: string; text: string; json: Record<string, unknown> }) => void
  onSaveShortcut?: () => void
  autoFocus?: boolean
  className?: string
}

export const VisualRichTextEditor: React.FC<VisualRichTextEditorProps> = ({
  content,
  placeholder = 'Scrie sau lipește textul eseului aici...',
  onChange,
  onSaveShortcut,
  autoFocus = false,
  className = '',
}) => {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [highlightMenuOpen, setHighlightMenuOpen] = useState(false)
  const isUpdatingFromProps = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 space-y-1 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 space-y-1 my-2',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-3 border-amber-400 bg-surface-elevated/40 p-3 my-3 rounded-r-xl italic text-text-muted',
          },
        },
      }),
      Underline,
      CustomHighlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        validate: (href) => /^https?:\/\//.test(href) || href.startsWith('mailto:'),
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    autofocus: autoFocus ? 'end' : false,
    editorProps: {
      attributes: {
        class: `focus:outline-none min-h-[160px] font-literary-serif text-base sm:text-lg leading-relaxed text-text px-4 py-3.5 max-w-none ${className}`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isUpdatingFromProps.current) return
      const rawHtml = ed.getHTML()
      const cleanHtml = sanitizeHtml(rawHtml)
      const text = ed.getText()
      const json = ed.getJSON() as Record<string, unknown>
      onChange({ html: cleanHtml, text, json })
    },
  })

  // Synchronize incoming content changes if different from editor
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHtml = editor.getHTML()
      if (content !== currentHtml && !editor.isFocused) {
        isUpdatingFromProps.current = true
        editor.commands.setContent(content || '', { emitUpdate: false })
        isUpdatingFromProps.current = false
      }
    }
  }, [content, editor])

  // Global Keyboard shortcuts: Ctrl+S and Ctrl+K
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (onSaveShortcut) {
          e.preventDefault()
          onSaveShortcut()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (editor?.isFocused) {
          e.preventDefault()
          const previousUrl = editor.getAttributes('link').href || ''
          setLinkUrl(previousUrl)
          setLinkPopoverOpen(true)
        }
      }
    },
    [editor, onSaveShortcut]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!editor) return null

  // Semantic Highlights Presets
  const highlightPresets = [
    {
      label: 'Reține (Galben)',
      color: 'yellow',
      desc: 'Citate & Teză morală',
      dot: 'bg-yellow-400 border-yellow-600',
    },
    {
      label: 'Important (Chihlimbar)',
      color: 'amber',
      desc: 'Repere barem Subiectul III',
      dot: 'bg-amber-500 border-amber-700',
    },
    {
      label: 'Definiție (Cian)',
      color: 'cyan',
      desc: 'Concepte operaționale & Curente',
      dot: 'bg-cyan-400 border-cyan-600',
    },
    {
      label: 'Atenție (Roșu)',
      color: 'rose',
      desc: 'Capcane & Greșeli frecvente',
      dot: 'bg-rose-500 border-rose-700',
    },
    {
      label: 'Exemplu (Verde)',
      color: 'emerald',
      desc: 'Ilustrări & Scene reprezentative',
      dot: 'bg-emerald-400 border-emerald-600',
    },
  ]

  const applyHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run()
    setHighlightMenuOpen(false)
  }

  const removeHighlight = () => {
    editor.chain().focus().unsetHighlight().run()
    setHighlightMenuOpen(false)
  }

  const applyLink = () => {
    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      let formatted = linkUrl.trim()
      if (!/^https?:\/\//i.test(formatted) && !formatted.startsWith('mailto:')) {
        formatted = `https://${formatted}`
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: formatted }).run()
    }
    setLinkPopoverOpen(false)
    setLinkUrl('')
  }

  const wordCount = editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0

  return (
    <div className="relative rounded-2xl bg-surface border border-border focus-within:border-amber-500/50 transition-all shadow-inner overflow-hidden">
      {/* Top Visual Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-surface-elevated/70 border-b border-border text-xs sticky top-0 z-20 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('bold')
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Îngroșat / Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('italic')
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Cursiv / Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('underline')
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Subliniat / Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('strike')
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Tăiat / Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* Semantic Highlight Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setHighlightMenuOpen(!highlightMenuOpen)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                editor.isActive('highlight')
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/40 shadow-subtle'
                  : 'text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-surface'
              }`}
              title="Evidențiere Text Pedagogic BAC"
            >
              <Highlighter className="w-4 h-4" />
              {editor.isActive('highlight') && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* Highlight Popover */}
            {highlightMenuOpen && (
              <div className="absolute left-0 top-full mt-2 p-2 rounded-2xl bg-surface-elevated border border-border shadow-2xl z-50 space-y-1.5 min-w-[220px] animate-fadeIn">
                <div className="px-2 pt-1 pb-1.5 border-b border-border">
                  <span className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Evidențiere Pedagogică BAC
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    Alege rolul semantic al textului:
                  </span>
                </div>
                {highlightPresets.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => applyHighlight(preset.color)}
                    className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-surface transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full border shadow-sm shrink-0 ${preset.dot}`} />
                      <div className="flex flex-col">
                        <span className="text-text font-bold leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {preset.label}
                        </span>
                        <span className="text-[10px] text-text-muted leading-tight mt-0.5">
                          {preset.desc}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="pt-1.5 border-t border-border mt-1">
                  <button
                    type="button"
                    onClick={removeHighlight}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-text-muted hover:text-status-danger hover:bg-surface transition-all flex items-center gap-1.5"
                  >
                    <RemoveFormatting className="w-3.5 h-3.5" />
                    <span>Elimină evidențierea</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Link Button */}
          <button
            type="button"
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href || ''
              setLinkUrl(previousUrl)
              setLinkPopoverOpen(true)
            }}
            className={`p-1.5 rounded-lg transition-all ${
              editor.isActive('link')
                ? 'bg-amber-500 text-black font-bold shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Inserează Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Blockquote trigger */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Bloc Citat literar"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Listă cu buline"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
            title="Listă numerotată"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface disabled:opacity-30 transition-colors"
            title="Anulează (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface disabled:opacity-30 transition-colors"
            title="Refă (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Clear formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-surface transition-all ml-1"
            title="Curăță formatarea textului"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Word count & Reading Time Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-text-subtle">
          <span>{wordCount} cuvinte</span>
          <span>•</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 180))} min lectură</span>
        </div>
      </div>

      {/* Main WYSIWYG Content Area */}
      <div className="p-1">
        <EditorContent editor={editor} />
      </div>

      {/* Link Input Popover */}
      {linkPopoverOpen && (
        <div className="p-3 bg-surface-elevated border-2 border-amber-500/60 rounded-2xl shadow-2xl m-3 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Adaugă Link / Referință Externă</span>
            </span>
            <button
              type="button"
              onClick={() => setLinkPopoverOpen(false)}
              className="p-1 text-text-muted hover:text-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="url"
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
              placeholder="https://ro.wikipedia.org/wiki/..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={applyLink}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow-subtle shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Aplică</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
