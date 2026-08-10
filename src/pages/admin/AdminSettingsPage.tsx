import React from 'react'

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Setări Admin</h2>
        <p className="text-sm text-text-muted mt-1">Configurare globală sistem, integrare Supabase/Stripe și opțiuni CMS.</p>
      </div>
    </div>
  )
}
