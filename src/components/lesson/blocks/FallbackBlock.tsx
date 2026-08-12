import React from 'react'
import { HelpCircle } from 'lucide-react'
import type { LessonBlockData } from '@/types/blocks'

interface Props {
  block: LessonBlockData
}

export const FallbackBlock: React.FC<Props> = ({ block }) => {
  return (
    <div className="my-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 shrink-0 text-amber-500" />
        <span>
          Tip de bloc neacceptat încă: <strong className="font-mono">{block.block_type}</strong>
        </span>
      </div>
      <span className="text-[10px] opacity-75 font-mono">ID: {block.id}</span>
    </div>
  )
}
