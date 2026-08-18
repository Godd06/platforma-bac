/**
 * Supabase Storage Security & Validation Module (TASK P0.5)
 *
 * Implements:
 * 1. MIME Allow-List validation (Images, Audio, Video, PDF)
 * 2. File-Size Limits (Image <= 10MB, Audio <= 50MB, Video <= 100MB, PDF <= 25MB)
 * 3. Filename normalization & path traversal prevention
 * 4. Malicious SVG XML inspection (scans for <script>, onload/onerror, javascript: hrefs)
 * 5. PRO vs FREE storage bucket routing (public-media vs pro-media)
 * 6. Signed URL generation for private PRO media (1 hour expiry)
 */

import { supabase } from '../lib/supabase'

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/x-m4a', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf'],
}

export const FILE_SIZE_LIMITS_BYTES = {
  image: 10 * 1024 * 1024, // 10 MB
  audio: 50 * 1024 * 1024, // 50 MB
  video: 100 * 1024 * 1024, // 100 MB
  document: 25 * 1024 * 1024, // 25 MB
}

export type MediaCategory = 'image' | 'audio' | 'video' | 'document'

/**
 * Normalizes filenames by stripping dangerous path separators and special characters.
 */
export function sanitizeFilename(originalName: string): string {
  if (!originalName) return 'unnamed_file.bin'

  // Extract base filename without directories
  const baseName = originalName.replace(/^.*[\\/]/, '')
  const parts = baseName.split('.')
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin' : 'bin'
  const rawTitle = parts.join('.')

  // Replace special characters with dashes
  const cleanTitle = rawTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const safeTitle = cleanTitle.slice(0, 50) || 'media_file'
  return `${safeTitle}-${Date.now()}.${ext}`
}

/**
 * Inspects SVG text content for malicious embedded scripts, event handlers, or javascript URIs.
 */
export function isSafeSvgContent(svgText: string): boolean {
  if (!svgText) return false
  const lower = svgText.toLowerCase()

  // Malicious SVG tags/patterns
  const dangerousPatterns = [
    /<script\b/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /onmouseenter\s*=/i,
    /javascript:/i,
    /<foreignobject\b/i,
    /data:text\/html/i,
    /xlink:href\s*=\s*["']?javascript:/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(lower)) {
      return false
    }
  }
  return true
}

/**
 * Validates a media file before upload against MIME allow-list, size limits, and SVG security.
 */
export async function validateMediaFile(
  file: File,
  category: MediaCategory = 'image'
): Promise<{ valid: boolean; error: string | null }> {
  if (!file) {
    return { valid: false, error: 'Niciun fișier selectat.' }
  }

  // 1. Validate MIME type
  const allowedForCategory = ALLOWED_MIME_TYPES[category] || []
  const fileMime = file.type.toLowerCase()

  if (!allowedForCategory.includes(fileMime)) {
    return {
      valid: false,
      error: `Tip de fișier nepermis (${file.type}). Sunt acceptate doar fișiere ${category} valide (${allowedForCategory.join(', ')}).`,
    }
  }

  // 2. Validate Size limit
  const maxSizeBytes = FILE_SIZE_LIMITS_BYTES[category] || FILE_SIZE_LIMITS_BYTES.image
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024))
    return {
      valid: false,
      error: `Mărimea fișierului (${(file.size / (1024 * 1024)).toFixed(1)} MB) depășește limita maximă permisă pentru ${category} (${maxMb} MB).`,
    }
  }

  // 3. Inspect SVG files for malicious scripts
  if (fileMime === 'image/svg+xml') {
    try {
      const svgText = await file.text()
      if (!isSafeSvgContent(svgText)) {
        return {
          valid: false,
          error: 'Fișierul SVG conține script-uri sau atribute nesigure și a fost blocat de filtru de securitate.',
        }
      }
    } catch {
      return { valid: false, error: 'Nu s-a putut citi conținutul fișierului SVG.' }
    }
  }

  return { valid: true, error: null }
}

/**
 * Returns appropriate storage bucket based on PRO access level requirement.
 */
export function getStorageBucket(isProContent: boolean): 'pro-media' | 'public-media' {
  return isProContent ? 'pro-media' : 'public-media'
}

/**
 * Generates a secure URL for media access:
 * - Signed URL (1 hour expiration) for private `pro-media` bucket
 * - Public URL for `public-media` bucket
 */
export async function getSecureMediaUrl(
  bucket: 'pro-media' | 'public-media',
  filePath: string,
  expiresInSeconds = 3600
): Promise<{ url: string | null; error: string | null }> {
  if (!filePath) return { url: null, error: 'Calea fișierului nu este specificată.' }

  if (bucket === 'pro-media') {
    // Generate signed URL with expiration for private PRO bucket
    const { data, error } = await supabase.storage
      .from('pro-media')
      .createSignedUrl(filePath, expiresInSeconds)

    if (error || !data?.signedUrl) {
      return { url: null, error: error?.message || 'Nu s-a putut genera URL-ul securizat pentru conținutul PRO.' }
    }
    return { url: data.signedUrl, error: null }
  } else {
    // Public bucket
    const { data } = supabase.storage.from('public-media').getPublicUrl(filePath)
    if (!data?.publicUrl) {
      return { url: null, error: 'Nu s-a putut obține URL-ul public.' }
    }
    return { url: data.publicUrl, error: null }
  }
}
