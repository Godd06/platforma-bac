import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Comută tema (curent: ${isDark ? 'Întunecat' : 'Luminos'})`}
      title={`Comută la tema ${isDark ? 'luminoasă' : 'întunecată'}`}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors min-h-[32px] min-w-[32px] ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
      )}
    </button>
  )
}

export default ThemeToggle
