import React, { useState, useEffect, useCallback } from 'react'
import {
  Upload,
  Search,
  Image as ImageIcon,
  FileAudio,
  FileVideo,
  FileText,
  Trash2,
  Copy,
  Check,
  Lock,
  Globe,
  AlertTriangle,
  RefreshCw,
  X,
  FileUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  validateMediaFile,
  sanitizeFilename,
  getStorageBucket,
  getSecureMediaUrl,
  type MediaCategory,
} from '@/utils/storageSecurity'
import { EmptyState } from '@/components/ui/EmptyState'

export interface StorageFileItem {
  id: string
  name: string
  bucket: 'public-media' | 'pro-media'
  mime: string
  size: number
  created_at: string
  url: string
  isPro: boolean
  category: MediaCategory
}

export const AdminMediaPage: React.FC = () => {
  const [files, setFiles] = useState<StorageFileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | MediaCategory>('all')
  const [selectedBucket, setSelectedBucket] = useState<'all' | 'public-media' | 'pro-media'>('all')

  // Upload State
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('image')
  const [uploadIsPro, setUploadIsPro] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  // Selected Asset & Dependency Inspection Modal
  const [previewFile, setPreviewFile] = useState<StorageFileItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dependencyWarning, setDependencyWarning] = useState<{ isUsed: boolean; count: number } | null>(null)

  // Fetch Storage Assets
  const fetchStorageAssets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items: StorageFileItem[] = []

      // 1. Fetch public-media bucket
      const { data: publicFiles, error: pubErr } = await supabase.storage.from('public-media').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (!pubErr && publicFiles) {
        for (const file of publicFiles) {
          if (file.name === '.emptyFolderPlaceholder') continue
          const { url } = await getSecureMediaUrl('public-media', file.name)
          const ext = file.name.split('.').pop()?.toLowerCase() || ''
          let category: MediaCategory = 'image'
          if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) category = 'audio'
          else if (['mp4', 'webm', 'mov'].includes(ext)) category = 'video'
          else if (['pdf'].includes(ext)) category = 'document'

          items.push({
            id: `pub-${file.id || file.name}`,
            name: file.name,
            bucket: 'public-media',
            mime: file.metadata?.mimetype || `image/${ext}`,
            size: file.metadata?.size || 0,
            created_at: file.created_at || new Date().toISOString(),
            url: url || '',
            isPro: false,
            category,
          })
        }
      }

      // 2. Fetch pro-media bucket
      const { data: proFiles, error: proErr } = await supabase.storage.from('pro-media').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (!proErr && proFiles) {
        for (const file of proFiles) {
          if (file.name === '.emptyFolderPlaceholder') continue
          const { url } = await getSecureMediaUrl('pro-media', file.name)
          const ext = file.name.split('.').pop()?.toLowerCase() || ''
          let category: MediaCategory = 'image'
          if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) category = 'audio'
          else if (['mp4', 'webm', 'mov'].includes(ext)) category = 'video'
          else if (['pdf'].includes(ext)) category = 'document'

          items.push({
            id: `pro-${file.id || file.name}`,
            name: file.name,
            bucket: 'pro-media',
            mime: file.metadata?.mimetype || `image/${ext}`,
            size: file.metadata?.size || 0,
            created_at: file.created_at || new Date().toISOString(),
            url: url || '',
            isPro: true,
            category,
          })
        }
      }

      setFiles(items)
    } catch (err) {
      console.error('[AdminMediaPage] Error fetching media files:', err)
      setError('Nu s-au putut încărca fișierele din biblioteca media.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStorageAssets()
  }, [fetchStorageAssets])

  // Handle File Selection for Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    setUploadSuccess(null)
    const file = e.target.files?.[0]
    if (!file) return

    const valResult = await validateMediaFile(file, uploadCategory)
    if (!valResult.valid) {
      setUploadError(valResult.error)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  // Execute Upload
  const handleExecuteUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const bucket = getStorageBucket(uploadIsPro)
      const safeFilename = sanitizeFilename(selectedFile.name)

      const { error: upErr } = await supabase.storage.from(bucket).upload(safeFilename, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      })

      if (upErr) {
        setUploadError(`Eroare la încărcare: ${upErr.message}`)
        setUploading(false)
        return
      }

      setUploadSuccess(`Fișierul ${safeFilename} a fost încărcat cu succes!`)
      setSelectedFile(null)
      setUploadModalOpen(false)
      fetchStorageAssets()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscută la încărcare.'
      setUploadError(msg)
    } finally {
      setUploading(false)
    }
  }

  // Copy Signed / Public URL to Clipboard
  const handleCopyUrl = (item: StorageFileItem) => {
    if (!item.url) return
    navigator.clipboard.writeText(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  // Dependency Check before Delete
  const handleInspectDelete = async (item: StorageFileItem) => {
    setDeletingId(item.id)
    setDependencyWarning(null)

    try {
      // Check if file URL is referenced in any lesson blocks
      const cleanName = item.name
      const { data: matchedBlocks } = await supabase
        .from('lesson_blocks')
        .select('id, lesson_id')
        .or(`content.cs.{"url":"${item.url}"},content.cs.{"filename":"${cleanName}"}`)

      const count = matchedBlocks?.length || 0
      setDependencyWarning({ isUsed: count > 0, count })
    } catch {
      setDependencyWarning({ isUsed: false, count: 0 })
    }
  }

  // Confirm Asset Deletion
  const handleConfirmDelete = async (item: StorageFileItem) => {
    try {
      const { error: delErr } = await supabase.storage.from(item.bucket).remove([item.name])
      if (delErr) {
        alert(`Eroare la ștergerea fișierului: ${delErr.message}`)
        return
      }
      setPreviewFile(null)
      setDeletingId(null)
      setDependencyWarning(null)
      fetchStorageAssets()
    } catch (err) {
      alert('Eroare necunoscută la ștergerea fișierului.')
    }
  }

  // Filtered Assets list
  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    const matchesBucket = selectedBucket === 'all' || f.bucket === selectedBucket
    return matchesSearch && matchesCategory && matchesBucket
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header & Upload Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-subtle">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            Media Library (Bibliotecă Media)
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestionează securizat activele media (Imagini, Audio, Video, PDF-uri) stocate în Supabase Storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStorageAssets}
            className="p-2.5 rounded-xl border border-border bg-surface-elevated text-text hover:bg-surface transition-colors cursor-pointer"
            title="Reîmprospătează lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-subtle cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Încarcă Fișier Nou
          </button>
        </div>
      </div>

      {/* Toolbar Filters & Search */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după nume fișier..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedCategory === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-text-muted hover:text-text'}`}
            >
              Toate
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('image')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedCategory === 'image' ? 'bg-amber-500 text-black font-bold' : 'text-text-muted hover:text-text'}`}
            >
              Imagini
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('audio')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedCategory === 'audio' ? 'bg-amber-500 text-black font-bold' : 'text-text-muted hover:text-text'}`}
            >
              Audio
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('video')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedCategory === 'video' ? 'bg-amber-500 text-black font-bold' : 'text-text-muted hover:text-text'}`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('document')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedCategory === 'document' ? 'bg-amber-500 text-black font-bold' : 'text-text-muted hover:text-text'}`}
            >
              PDF
            </button>
          </div>

          {/* Bucket Filter */}
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value as 'all' | 'public-media' | 'pro-media')}
            className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs text-text focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toate Bucket-urile</option>
            <option value="public-media">Public Media (FREE)</option>
            <option value="pro-media">PRO Media (Privat)</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-square rounded-2xl bg-surface-elevated animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-5 h-5" />}
          title="Niciun fișier găsit"
          description={searchQuery ? 'Nu există fișiere care să se potrivească căutării.' : 'Nu există fișiere încărcate în biblioteca media.'}
        />
      ) : (
        /* Asset Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setPreviewFile(file)}
              className="group relative rounded-2xl bg-surface border border-border overflow-hidden hover:border-amber-500/50 transition-all shadow-subtle hover:shadow-lg cursor-pointer flex flex-col"
            >
              {/* Preview Thumbnail */}
              <div className="aspect-square bg-surface-elevated relative flex items-center justify-center overflow-hidden">
                {file.category === 'image' ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : file.category === 'audio' ? (
                  <FileAudio className="w-12 h-12 text-cyan-400" />
                ) : file.category === 'video' ? (
                  <FileVideo className="w-12 h-12 text-amber-400" />
                ) : (
                  <FileText className="w-12 h-12 text-rose-400" />
                )}

                {/* Badge Bucket */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                  {file.isPro ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>PRO</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>FREE</span>
                    </>
                  )}
                </div>
              </div>

              {/* Asset Details */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                <p className="text-xs font-bold text-text truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="uppercase text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated border border-border">
                    {file.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-surface border border-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                Încărcare Fișier Nou în Storage
              </h3>
              <button
                type="button"
                onClick={() => {
                  setUploadModalOpen(false)
                  setSelectedFile(null)
                  setUploadError(null)
                }}
                className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                  Categorie Fișier:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['image', 'audio', 'video', 'document'] as MediaCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setUploadCategory(cat)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-colors cursor-pointer flex flex-col items-center gap-1 ${uploadCategory === cat ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-border bg-surface-elevated text-text-muted hover:text-text'}`}
                    >
                      {cat === 'image' && <ImageIcon className="w-4 h-4" />}
                      {cat === 'audio' && <FileAudio className="w-4 h-4" />}
                      {cat === 'video' && <FileVideo className="w-4 h-4" />}
                      {cat === 'document' && <FileText className="w-4 h-4" />}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bucket Routing Access Switch */}
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text flex items-center gap-1.5">
                    {uploadIsPro ? <Lock className="w-4 h-4 text-amber-400" /> : <Globe className="w-4 h-4 text-emerald-400" />}
                    Destinație Bucket: {uploadIsPro ? 'PRO Media (Privat)' : 'Public Media (Gratuit)'}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {uploadIsPro ? 'Fișierele PRO sunt securizate și servite via Signed URL (1h).' : 'Fișierele FREE au URL public direct.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={uploadIsPro}
                  onChange={(e) => setUploadIsPro(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-3 bg-surface-elevated/40 hover:border-amber-500/50 transition-colors">
                <FileUp className="w-10 h-10 mx-auto text-amber-500 animate-bounce" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-text">Alege fișierul de pe disk</p>
                  <p className="text-[11px] text-text-muted">
                    Limitele maxime de dimensiune sunt aplicate automat conform politicilor de securitate.
                  </p>
                </div>
                <input type="file" onChange={handleFileChange} className="text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer" />
              </div>

              {/* Upload Errors */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                Anulează
              </button>
              <button
                type="button"
                disabled={!selectedFile || uploading}
                onClick={handleExecuteUpload}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {uploading ? 'Se încarcă...' : 'Încarcă în Storage'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW & DEPENDENCY INSPECTION MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-surface border border-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                {previewFile.isPro ? <Lock className="w-5 h-5 text-amber-400" /> : <Globe className="w-5 h-5 text-emerald-400" />}
                <h3 className="text-lg font-bold text-text truncate max-w-md" title={previewFile.name}>
                  {previewFile.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewFile(null)
                  setDeletingId(null)
                  setDependencyWarning(null)
                }}
                className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Preview Box */}
              <div className="aspect-square rounded-2xl bg-surface-elevated border border-border flex items-center justify-center p-2 overflow-hidden relative">
                {previewFile.category === 'image' ? (
                  <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-full object-contain" />
                ) : previewFile.category === 'audio' ? (
                  <div className="w-full px-4 space-y-3 text-center">
                    <FileAudio className="w-16 h-16 mx-auto text-cyan-400" />
                    <audio controls src={previewFile.url} className="w-full" />
                  </div>
                ) : previewFile.category === 'video' ? (
                  <video controls src={previewFile.url} className="w-full max-h-full rounded-xl" />
                ) : (
                  <div className="text-center space-y-3">
                    <FileText className="w-16 h-16 mx-auto text-rose-400" />
                    <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-400 underline hover:text-amber-300">
                      Deschide Documentul PDF
                    </a>
                  </div>
                )}
              </div>

              {/* Metadata Details */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Bucket:</span>
                    <span className="font-bold text-text">{previewFile.bucket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">MIME Type:</span>
                    <span className="font-bold text-text">{previewFile.mime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Dimensiune:</span>
                    <span className="font-bold text-text">{formatFileSize(previewFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Acces:</span>
                    <span className={`font-bold ${previewFile.isPro ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {previewFile.isPro ? 'PRO (Privat - Signed URL)' : 'FREE (Public direct)'}
                    </span>
                  </div>
                </div>

                {/* Copy URL Section */}
                <div className="space-y-2">
                  <label className="block font-bold text-text">URL Referință (Securizat):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={previewFile.url}
                      className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-[11px] text-text-muted font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(previewFile)}
                      className="px-3 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedId === previewFile.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedId === previewFile.id ? 'Copiat!' : 'Copiază'}</span>
                    </button>
                  </div>
                </div>

                {/* Dependency Check & Danger Delete Zone */}
                {deletingId === previewFile.id ? (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>Confirmare Ștergere Definitivă</span>
                    </div>

                    {dependencyWarning?.isUsed && (
                      <p className="text-amber-400 font-semibold text-[11px]">
                        ⚠️ ATENȚIE: Acest fișier este utilizat de {dependencyWarning.count} blocuri de lecții! Ștergerea lui va afecta conținutul publicat!
                      </p>
                    )}

                    <p className="text-text-muted text-[11px]">
                      Ești sigur că vrei să ștergi fișierul <strong className="text-text">{previewFile.name}</strong> din storage-ul {previewFile.bucket}?
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-xl border border-border text-text-muted text-xs hover:text-text cursor-pointer"
                      >
                        Anulează
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(previewFile)}
                        className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 cursor-pointer"
                      >
                        Șterge Definitiv
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleInspectDelete(previewFile)}
                    className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Șterge Fișierul din Storage
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
