import React from 'react'

export const AdminContentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Administrare Conținut</h2>
        <p className="text-sm text-text-muted mt-1">
          Ierarhie CMS: Materie → Capitol/Operă → Lecție → Block Editor.
        </p>
      </div>
    </div>
  )
}
