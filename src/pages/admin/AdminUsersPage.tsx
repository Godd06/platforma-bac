import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Search,
  Shield,
  Crown,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Lock,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { UserRoleType } from '@/types/database'
import {
  fetchAdminUsersList,
  updateUserRoles,
  type AdminUserListItem,
} from '@/services/adminUserService'
import { EmptyState } from '@/components/ui/EmptyState'

export const AdminUsersPage: React.FC = () => {
  const { user, roles: currentUserRoles } = useAuth()
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRoleType>('all')
  const [selectedSubFilter, setSelectedSubFilter] = useState<'all' | 'pro' | 'free'>('all')

  // Selected User Modal & Role Edit State
  const [selectedItem, setSelectedItem] = useState<AdminUserListItem | null>(null)
  const [editRolesModalOpen, setEditRolesModalOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<AdminUserListItem | null>(null)
  const [pendingRoles, setPendingRoles] = useState<UserRoleType[]>([])
  const [savingRoles, setSavingRoles] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)
  const [rolesSuccess, setRolesSuccess] = useState<string | null>(null)

  // Load Users
  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchAdminUsersList()
    if (res.error) {
      setError(res.error)
    } else if (res.data) {
      setUsers(res.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Handle Edit Roles Launcher
  const handleOpenEditRoles = (item: AdminUserListItem) => {
    setTargetUser(item)
    setPendingRoles([...item.roles])
    setRolesError(null)
    setRolesSuccess(null)
    setEditRolesModalOpen(true)
  }

  // Toggle Pending Role selection
  const handleTogglePendingRole = (role: UserRoleType) => {
    if (role === 'student') return // Student is base role, always kept
    setPendingRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  // Save Role Assignments
  const handleSaveRoles = async () => {
    if (!targetUser || !user) return
    setSavingRoles(true)
    setRolesError(null)
    setRolesSuccess(null)

    const res = await updateUserRoles(
      targetUser.profile.user_id,
      user.id,
      currentUserRoles,
      pendingRoles
    )

    if (!res.success) {
      setRolesError(res.error)
    } else {
      setRolesSuccess('Rolurile au fost actualizate cu succes!')
      setTimeout(() => {
        setEditRolesModalOpen(false)
        setTargetUser(null)
        loadUsers()
      }, 1500)
    }
    setSavingRoles(false)
  }

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const nameMatch = (u.profile.display_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const idMatch = u.profile.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSearch = nameMatch || idMatch

    const matchesRole = selectedRoleFilter === 'all' || u.roles.includes(selectedRoleFilter)
    const matchesSub =
      selectedSubFilter === 'all' ||
      (selectedSubFilter === 'pro' && u.subscription?.status === 'active') ||
      (selectedSubFilter === 'free' && (!u.subscription || u.subscription.status !== 'active'))

    return matchesSearch && matchesRole && matchesSub
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-subtle">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            Gestionare Utilizatori & Roluri (Admin User Management)
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Administrează conturile elevilor, atribuirea rolurilor administrative și statusul abonamentelor PRO.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-text font-bold text-sm hover:bg-surface transition-colors flex items-center gap-2 shadow-subtle cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Reîmprospătează
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută nume sau User ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value as 'all' | UserRoleType)}
            className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs text-text focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toate Rolurile</option>
            <option value="student">Student</option>
            <option value="editor">Editor Staff</option>
            <option value="reviewer">Reviewer Staff</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* Subscription Filter */}
          <select
            value={selectedSubFilter}
            onChange={(e) => setSelectedSubFilter(e.target.value as 'all' | 'pro' | 'free')}
            className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs text-text focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toate Abonamentele</option>
            <option value="pro">Abonați PRO</option>
            <option value="free">Utilizatori FREE</option>
          </select>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="p-8 text-center text-text-muted space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <p className="text-sm font-bold">Se încarcă lista utilizatorilor...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-5 h-5" />}
          title="Niciun utilizator găsit"
          description="Nu există utilizatori care să se potrivească filtrelor selectate."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-text-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Utilizator / Profil</th>
                <th className="p-4">Roluri Atribuite</th>
                <th className="p-4">Abonament</th>
                <th className="p-4 text-center">Lecții Completate</th>
                <th className="p-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text">
              {filteredUsers.map((item) => {
                const isSelf = user?.id === item.profile.user_id
                const isPro = item.subscription?.status === 'active'

                return (
                  <tr key={item.profile.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* User & Profile info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 uppercase text-xs">
                          {item.profile.display_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-text flex items-center gap-1.5">
                            {item.profile.display_name || 'Utilizator Fără Nume'}
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                                Tu
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-text-muted font-mono truncate max-w-[180px]" title={item.profile.user_id}>
                            ID: {item.profile.user_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Roles Badges */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              role === 'super_admin'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : role === 'reviewer'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                : role === 'editor'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-surface-elevated text-text-muted border-border'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Subscription Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {isPro ? (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>PRO Active</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-surface-elevated text-text-muted font-semibold border border-border">
                            FREE (Standard)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Completed Progress */}
                    <td className="p-4 text-center">
                      <span className="font-bold text-text text-sm">{item.completedLessonsCount}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="p-2 rounded-xl border border-border bg-surface-elevated text-text hover:bg-surface transition-colors cursor-pointer"
                          title="Vezi detalii profil"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditRoles(item)}
                          disabled={isSelf}
                          className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold hover:bg-amber-500 hover:text-black disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title={isSelf ? 'Nu îți poți modifica propriile roluri' : 'Editează rolurile utilizatorului'}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Roluri</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT ROLES MODAL */}
      {editRolesModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-surface border border-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                Atribuire Roluri Administrare
              </h3>
              <button
                type="button"
                onClick={() => setEditRolesModalOpen(false)}
                className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border">
                <p className="text-xs font-bold text-text">{targetUser.profile.display_name || 'Utilizator'}</p>
                <p className="text-[11px] text-text-muted font-mono truncate">{targetUser.profile.user_id}</p>
              </div>

              {/* Role Checkboxes */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-text uppercase tracking-wider">
                  Selectează rolurile permise:
                </label>

                {/* Student Base Role */}
                <div className="p-3 rounded-xl border border-border bg-surface-elevated opacity-70 flex items-center justify-between">
                  <span className="text-xs font-bold text-text">Student (Bază)</span>
                  <input type="checkbox" checked disabled className="w-4 h-4 accent-amber-500 rounded" />
                </div>

                {/* Editor Staff */}
                <div
                  onClick={() => handleTogglePendingRole('editor')}
                  className="p-3 rounded-xl border border-border bg-surface-elevated hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-amber-400">Editor Staff</p>
                    <p className="text-[11px] text-text-muted">Creare și editare conținut didactic, materii, lecții</p>
                  </div>
                  <input type="checkbox" checked={pendingRoles.includes('editor')} readOnly className="w-4 h-4 accent-amber-500 rounded pointer-events-none" />
                </div>

                {/* Reviewer Staff */}
                <div
                  onClick={() => handleTogglePendingRole('reviewer')}
                  className="p-3 rounded-xl border border-border bg-surface-elevated hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-cyan-400">Reviewer Staff</p>
                    <p className="text-[11px] text-text-muted">Aprobare și verificare calitate lecții de BAC</p>
                  </div>
                  <input type="checkbox" checked={pendingRoles.includes('reviewer')} readOnly className="w-4 h-4 accent-cyan-500 rounded pointer-events-none" />
                </div>

                {/* Super Admin Guarded Role */}
                <div
                  onClick={() => handleTogglePendingRole('super_admin')}
                  className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:border-purple-500 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-purple-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-purple-400" />
                      Super Admin
                    </p>
                    <p className="text-[11px] text-text-muted">Acces total pe platformă și alocare roluri administrative</p>
                  </div>
                  <input type="checkbox" checked={pendingRoles.includes('super_admin')} readOnly className="w-4 h-4 accent-purple-500 rounded pointer-events-none" />
                </div>
              </div>

              {rolesError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{rolesError}</span>
                </div>
              )}

              {rolesSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{rolesSuccess}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditRolesModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text cursor-pointer"
              >
                Anulează
              </button>
              <button
                type="button"
                disabled={savingRoles}
                onClick={handleSaveRoles}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {savingRoles ? 'Se salvează...' : 'Salvează Rolurile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER PROFILE INSPECTION MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-surface border border-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Fișă Profil Utilizator
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Nume Afișat:</span>
                  <span className="font-bold text-text">{selectedItem.profile.display_name || 'Nespecificat'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">User ID:</span>
                  <span className="font-mono text-text truncate max-w-[200px]">{selectedItem.profile.user_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Data Înregistrării:</span>
                  <span className="font-bold text-text">{new Date(selectedItem.profile.created_at).toLocaleDateString('ro-RO')}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Status Abonament:</span>
                  <span className={`font-bold ${selectedItem.subscription?.status === 'active' ? 'text-amber-400' : 'text-text-muted'}`}>
                    {selectedItem.subscription?.status === 'active' ? 'PRO Activ' : 'Standard FREE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Lecții Completate:</span>
                  <span className="font-bold text-text">{selectedItem.completedLessonsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Lecții În Desfășurare:</span>
                  <span className="font-bold text-text">{selectedItem.inProgressLessonsCount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-bold text-text hover:bg-surface cursor-pointer"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
