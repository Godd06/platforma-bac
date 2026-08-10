import React from 'react'
import { useParams } from 'react-router-dom'

export const SubjectPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>()

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Materie: {subject}</h2>
        <p className="text-sm text-text-muted mt-1">Modul Materie (Placeholder ierarhie capitole).</p>
      </div>
    </div>
  )
}
