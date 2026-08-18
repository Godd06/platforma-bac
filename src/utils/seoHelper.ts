export interface SeoMetaOptions {
  title: string
  description?: string
  canonicalUrl?: string
  noIndex?: boolean
}

/**
 * Dynamic SEO & Head Tags Updater for React SPA routes
 * 
 * Rules:
 * 1. Public discovery pages (Landing, Catalog, Subject Overview, PRO, Login, Register) are INDEXABLE.
 * 2. Private student pages (/dashboard, /settings, /lesson/*) & Admin area (/admin/*) are marked NOINDEX, NOFOLLOW.
 */
export function updateSeoMeta({
  title,
  description = 'Platformă educațională modernă pentru pregătirea examenului de Bacalaureat — Limba Română și Istorie.',
  canonicalUrl,
  noIndex = false,
}: SeoMetaOptions): void {
  if (typeof document === 'undefined') return

  // 1. Update Title
  const formattedTitle = title.includes('Platformă Bacalaureat')
    ? title
    : `${title} | Platformă Bacalaureat`
  document.title = formattedTitle

  // 2. Update Meta Description
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.name = 'description'
    document.head.appendChild(metaDesc)
  }
  metaDesc.content = description

  // 3. Update Robots Indexation Directive
  let metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (!metaRobots) {
    metaRobots = document.createElement('meta')
    metaRobots.name = 'robots'
    document.head.appendChild(metaRobots)
  }
  metaRobots.content = noIndex ? 'noindex, nofollow' : 'index, follow'

  // 4. Update Canonical Link
  let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!linkCanonical) {
    linkCanonical = document.createElement('link')
    linkCanonical.rel = 'canonical'
    document.head.appendChild(linkCanonical)
  }
  const href = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://platforma-bac.ro/')
  linkCanonical.href = href
}
