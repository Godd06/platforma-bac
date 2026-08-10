import React from 'react'
import { useParams } from 'react-router-dom'

export const ChapterPage: React.FC = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>()

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Capitol / Operă: {chapter}</h2>
        <p className="text-sm text-text-muted mt-1">Materie: {subject} (Placeholder listă lecții).</p>
      </div>
    </div>
  )
}
