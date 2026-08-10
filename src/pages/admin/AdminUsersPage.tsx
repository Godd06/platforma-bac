import React from 'react'

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Gestionare Utilizatori & Roluri</h2>
        <p className="text-sm text-text-muted mt-1">
          Modul administrare conturi elevi, mentori și roluri administrative (student, editor, reviewer, super_admin).
        </p>
      </div>
    </div>
  )
}
