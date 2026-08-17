import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Settings,
  Moon,
  Sun,
  X,
  Compass,
  ArrowRight,
  Command,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface CommandItem {
  id: string
  title: string
  subtitle: string
  category: 'Materii' | 'Opere Română' | 'Sinteze Istorie' | 'Navigație' | 'Acțiuni'
  path?: string
  action?: () => void
  icon: React.ReactNode
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // Base index of searchable educational items and actions
  const items: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-dashboard',
        title: 'Panou Studiu (Dashboard)',
        subtitle: 'Progres, ritm zilnic și telemetrie',
        category: 'Navigație',
        path: '/dashboard',
        icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'nav-catalog',
        title: 'Catalog Materii Bac',
        subtitle: 'Toate disciplinele și programa oficială',
        category: 'Navigație',
        path: '/catalog',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'nav-pro',
        title: 'Pachetul PRO',
        subtitle: 'Acces complet la toate eseurile de 10',
        category: 'Navigație',
        path: '/pro',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'nav-settings',
        title: 'Setări Cont & Preferințe',
        subtitle: 'Profil, temă și securitate',
        category: 'Navigație',
        path: '/settings',
        icon: <Settings className="w-4 h-4 text-text-muted" />,
      },

      // Materii
      {
        id: 'subj-romana',
        title: 'Limba și Literatura Română',
        subtitle: '17 Autori canonici, curente literare și eseuri structurate',
        category: 'Materii',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'subj-istorie',
        title: 'Istoria Românilor',
        subtitle: 'Sinteze cauză-efect, cronologii și relații internaționale',
        category: 'Materii',
        path: '/catalog/istorie',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
      },

      // Opere Română Canonice
      {
        id: 'opera-moara',
        title: 'Moara cu noroc — Ioan Slavici',
        subtitle: 'Nuvela psihologică și realistă · Dezumanizarea prin avariție',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-plumb',
        title: 'Plumb — George Bacovia',
        subtitle: 'Simbolismul românesc · Motivul claustrării și spleen-ul',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-harap',
        title: 'Povestea lui Harap-Alb — Ion Creangă',
        subtitle: 'Basmul cult · Bildungsroman și inițierea protagonistului',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-luceafarul',
        title: 'Luceafărul — Mihai Eminescu',
        subtitle: 'Romantismul filozofic · Condiția geniului neînțeles',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-scrisoare',
        title: 'O scrisoare pierdută — I.L. Caragiale',
        subtitle: 'Comedia clasică · Comicul de moravuri, limbaj și situație',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-corola',
        title: 'Eu nu strivesc corola de minuni a lumii — Lucian Blaga',
        subtitle: 'Modernismul expresionist · Cunoașterea luciferică vs paradisiacă',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-ion',
        title: 'Ion — Liviu Rebreanu',
        subtitle: 'Romanul realist-obiectiv · Glasul pământului și al iubirii',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-enigma',
        title: 'Enigma Otiliei — George Călinescu',
        subtitle: 'Balzacianismul și paternitatea · Moștenirea și misterul feminității',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-ultimanopate',
        title: 'Ultima noapte de dragoste... — Camil Petrescu',
        subtitle: 'Romanul modern psihologic · Drama intelectualului lucid',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'opera-morometii',
        title: 'Moromeții — Marin Preda',
        subtitle: 'Romanul postbelic · Destrămarea satului tradițional',
        category: 'Opere Română',
        path: '/catalog/romana',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      },

      // Sinteze Istorie
      {
        id: 'ist-constitutii',
        title: 'Constituțiile din România (1866–1991)',
        subtitle: 'Trăsături democratice vs totalitare și evoluția drepturilor',
        category: 'Sinteze Istorie',
        path: '/catalog/istorie',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'ist-romanitatea',
        title: 'Romanitatea românilor în viziunea istoricilor',
        subtitle: 'Izvoare bizantine, teoria imigraționistă și continuitatea daco-romană',
        category: 'Sinteze Istorie',
        path: '/catalog/istorie',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'ist-totalitarism',
        title: 'Secolul XX: Democrație și Totalitarism',
        subtitle: 'Fascism, Nazism și Comunism în spațiul românesc și european',
        category: 'Sinteze Istorie',
        path: '/catalog/istorie',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'ist-autonomii',
        title: 'Autonomii locale și instituții medievale',
        subtitle: 'Formarea statelor medievale Țara Românească, Moldova, Transilvania',
        category: 'Sinteze Istorie',
        path: '/catalog/istorie',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
      },

      // Acțiuni Rapide
      {
        id: 'action-toggle-theme',
        title: theme === 'dark' ? 'Activează Modul Luminos (Light Theme)' : 'Activează Modul Întunecat (Dark Theme)',
        subtitle: 'Schimbă instant contrastul și luminozitatea interfeței',
        category: 'Acțiuni',
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      },
    ],
    [theme, setTheme]
  )

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase().trim()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [items, query])

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Global Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setIsOpen(false)
      setQuery('')
      if (item.action) {
        item.action()
      } else if (item.path) {
        navigate(item.path)
      }
    },
    [navigate]
  )

  // Arrow key navigation inside modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filteredItems[selectedIndex]
      if (item) {
        handleSelect(item)
      }
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-subtle min-h-[38px]"
        title="Caută rapid în catalog (Ctrl + K)"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400" />
        <span>Căutare rapidă...</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-surface-elevated border border-border text-[10px] font-mono text-text font-bold">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Căutare Globală & Comenzi"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-surface border border-border p-3 sm:p-4 shadow-2xl space-y-3 animate-fadeIn select-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 bg-surface-elevated rounded-2xl border border-border shadow-inner">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută orice eseu, autor canonic, temă de istorie sau acțiune..."
            className="w-full bg-transparent px-3 py-1 text-sm font-medium text-text placeholder:text-text-muted focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-text rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-surface border border-border font-bold">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto space-y-1 p-1 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-text-muted space-y-1">
              <p className="text-xs font-semibold">Niciun rezultat găsit pentru „{query}”</p>
              <p className="text-[11px] text-text-subtle">Încearcă să cauți după autor (ex: Slavici, Bacovia) sau temă.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 shadow-subtle'
                      : 'hover:bg-surface-elevated/50 text-text border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">{item.title}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-text-subtle uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-cyan-400' : 'text-text-subtle'}`} />
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="pt-2 px-4 pb-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-subtle">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↓</kbd>
              <span>pentru navigare</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text">↵</kbd>
              <span>pentru selectare</span>
            </span>
          </div>
          <span>PlatformaBac Search</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
