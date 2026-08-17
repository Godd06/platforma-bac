import React from 'react'
import { Download, FileText, FileArchive } from 'lucide-react'
import type { FileDownloadBlockContent } from '@/types/blocks'

interface Props {
  content: FileDownloadBlockContent
}

export const FileDownloadBlock: React.FC<Props> = ({ content }) => {
  const url = content.url || '#'
  const filename = content.filename || 'Material-Auxiliar-Bac.pdf'
  const filesize = content.filesize || 'PDF • 1.2 MB'
  const description = content.description

  const getFileIcon = (name: string) => {
    if (name.endsWith('.zip') || name.endsWith('.rar')) return <FileArchive className="w-5 h-5 text-amber-400" />
    if (name.endsWith('.docx') || name.endsWith('.doc')) return <FileText className="w-5 h-5 text-cyan-400" />
    return <FileText className="w-5 h-5 text-amber-400" />
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-elevated border border-border my-4 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          {getFileIcon(filename)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Resursă Descarcabilă
            </span>
            <span className="text-[10px] font-mono text-text-subtle">({filesize})</span>
          </div>
          <h4 className="text-sm font-bold text-text truncate">{filename}</h4>
          {description && (
            <p className="text-xs text-text-muted mt-0.5 font-literary-serif line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      <a
        href={url}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-subtle shrink-0 cursor-pointer w-full sm:w-auto justify-center"
      >
        <Download className="w-4 h-4" />
        <span>Descarcă Fișierul</span>
      </a>
    </div>
  )
}
