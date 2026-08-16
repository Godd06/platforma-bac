import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copiază textul',
  className = '',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[CopyButton] Failed to copy text:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Text copiat' : label}
      title={copied ? 'Copiat!' : label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-h-[32px] ${
        copied
          ? 'bg-status-success/20 text-status-success border border-status-success/40'
          : 'bg-surface-elevated text-text-muted hover:text-cyan-400 hover:border-cyan-500/40 border border-border'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-status-success" />
          <span>Copiat ✓</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copiază</span>
        </>
      )}
    </button>
  )
}
