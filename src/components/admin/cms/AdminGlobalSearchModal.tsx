import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, BookOpen, Layers, FileText, ChevronRight, Crown, Unlock, Loader2 } from 'lucide-react'
import { globalAdminSearch, type GlobalSearchResult } from '@/services/adminCmsService'

interface AdminGlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (result: GlobalSearchResult) => void
}

export const AdminGlobalSearchModal: React.FC<AdminGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GlobalSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const res = await globalAdminSearch(q)
    setResults(res)
    setSelectedIndex(0)
    setLoading(false)
  }, [])

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(val)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        onSelect(results[selectedIndex])
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 p-2.5 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Palette */}
      <div className="relative w-full max-w-2xl rounded-2xl glass-elevated border border-border overflow-hidden shadow-2xl z-10 animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface-elevated/70 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Caută în tot curriculumul (materie, autor, eseu, slug)..."
            className="flex-1 bg-transparent border-none text-sm text-text placeholder:text-text-subtle focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
              }}
              className="p-1 rounded-lg text-text-muted hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text-subtle hidden sm:inline">
            ESC pentru ieșire
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border-subtle">
          {query.trim() && !loading && results.length === 0 && (
            <div className="p-8 text-center text-xs text-text-muted space-y-1">
              <p className="font-bold text-text">Niciun rezultat găsit pentru „{query}”</p>
              <p className="text-text-subtle">Verifică ortografia sau încearcă un termen mai scurt.</p>
            </div>
          )}

          {!query.trim() && (
            <div className="p-6 text-center text-xs text-text-subtle space-y-1.5">
              <p className="font-medium text-text-muted">Tastează pentru a căuta instantaneu în toată baza educațională.</p>
              <p className="text-[11px]">Exemple: „Moara cu noroc”, „Rebreanu”, „Luceafarul”, „Constitutii”</p>
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => {
                  onSelect(item)
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300'
                    : 'hover:bg-surface-elevated text-text border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'subject'
                        ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20'
                        : item.type === 'chapter'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-surface-elevated text-text-muted border border-border'
                    }`}
                  >
                    {item.type === 'subject' && <BookOpen className="w-4 h-4" />}
                    {item.type === 'chapter' && <Layers className="w-4 h-4" />}
                    {item.type === 'lesson' && <FileText className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs sm:text-sm truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono opacity-60 shrink-0">
                        /{item.slug}
                      </span>
                    </div>

                    {item.parentTitle && (
                      <p className="text-[11px] text-text-muted truncate">
                        În: {item.parentTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.accessLevel === 'pro' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      PRO
                    </span>
                  )}
                  {item.accessLevel === 'free' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                      <Unlock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      FREE
                    </span>
                  )}

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      item.type === 'subject'
                        ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400'
                        : item.type === 'chapter'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'bg-surface-elevated text-text-muted'
                    }`}
                  >
                    {item.type}
                  </span>

                  <ChevronRight className="w-4 h-4 text-text-subtle" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-surface-elevated/70 text-[11px] text-text-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↓</kbd>
              <span>Navighează</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↵</kbd>
              <span>Selectează</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">ESC</kbd>
              <span>Închide</span>
            </span>
          </div>
          <span>{results.length} rezultate</span>
        </div>
      </div>
    </div>
  )
}
