/**
 * Native DOMParser-based HTML Sanitizer for safe rendering of rich_text blocks.
 * Enforces tag whitelist, attribute whitelist, URL scheme validation, and safe rel="noopener noreferrer" links.
 * Preserves semantic data-color attributes on <mark> tags and ensures clean class names for high-contrast highlighting.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') return ''

  // Use DOMParser if available in browser context
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    // Fallback for SSR or non-DOM test environments: strip HTML tags
    return rawHtml.replace(/<[^>]*>?/gm, '')
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')

  const ALLOWED_TAGS = new Set([
    'p',
    'br',
    'span',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'sub',
    'sup',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'hr',
    'div',
    'a',
    'img',
    'mark',
  ])

  const ALLOWED_ATTRS = new Set([
    'href',
    'src',
    'alt',
    'title',
    'target',
    'rel',
    'class',
    'id',
    'data-color',
    'data-highlight',
  ])

  const ALLOWED_SCHEMES = ['https:', 'http:', 'mailto:']

  function isSafeUrl(urlStr: string): boolean {
    const trimmed = urlStr.trim()
    if (!trimmed) return false

    const lower = trimmed.toLowerCase()
    // Explicitly reject dangerous schemes
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:')
    ) {
      return false
    }

    // Reject protocol-relative URLs starting with //
    if (trimmed.startsWith('//')) {
      return false
    }

    // Allow relative URLs starting with /, ./, ../, or anchor #
    if (
      trimmed.startsWith('/') ||
      trimmed.startsWith('./') ||
      trimmed.startsWith('../') ||
      trimmed.startsWith('#') ||
      !trimmed.includes(':')
    ) {
      return true
    }

    try {
      const parsed = new URL(trimmed)
      return ALLOWED_SCHEMES.includes(parsed.protocol)
    } catch {
      return false
    }
  }

  function normalizeMarkElement(el: HTMLElement) {
    let color = el.getAttribute('data-color') || el.getAttribute('data-highlight')

    // If no data-color, detect from classes or style attributes
    if (!color) {
      const cls = (el.getAttribute('class') || '').toLowerCase()
      const style = (el.getAttribute('style') || '').toLowerCase()

      if (cls.includes('yellow') || style.includes('yellow') || style.includes('#fef') || style.includes('#eab308') || style.includes('#ca8a04') || style.includes('rgb(234, 179, 8)')) {
        color = 'yellow'
      } else if (cls.includes('amber') || style.includes('amber') || style.includes('#ffedd5') || style.includes('#f59e0b') || style.includes('#ea580c') || style.includes('rgb(245, 158, 11)')) {
        color = 'amber'
      } else if (cls.includes('cyan') || style.includes('cyan') || style.includes('#cffafe') || style.includes('#06b6d4') || style.includes('#0891b2') || style.includes('rgb(6, 182, 212)')) {
        color = 'cyan'
      } else if (cls.includes('rose') || cls.includes('red') || style.includes('rose') || style.includes('red') || style.includes('#ffe4e6') || style.includes('#f43f5e') || style.includes('#e11d48') || style.includes('rgb(244, 63, 94)')) {
        color = 'rose'
      } else if (cls.includes('emerald') || cls.includes('green') || style.includes('emerald') || style.includes('green') || style.includes('#d1fae5') || style.includes('#10b981') || style.includes('#059669') || style.includes('rgb(16, 185, 129)')) {
        color = 'emerald'
      }
    }

    // Normalize canonical color value
    let canonicalColor = 'yellow'
    if (color) {
      const normalized = color.toLowerCase().trim()
      if (normalized === 'cyan') canonicalColor = 'cyan'
      else if (normalized === 'amber') canonicalColor = 'amber'
      else if (normalized === 'yellow') canonicalColor = 'yellow'
      else if (normalized === 'rose' || normalized === 'red') canonicalColor = 'rose'
      else if (normalized === 'emerald' || normalized === 'green') canonicalColor = 'emerald'
    }

    // Set standard data attribute and class
    el.setAttribute('data-color', canonicalColor)
    el.setAttribute('class', `bac-highlight highlight-${canonicalColor}`)

    // Clean up inline styles so CSS tokens strictly govern the design
    el.removeAttribute('style')
  }

  function cleanNode(node: Node) {
    const children = Array.from(node.childNodes)
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement
        const tagName = el.tagName.toLowerCase()

        if (!ALLOWED_TAGS.has(tagName)) {
          // Replace forbidden tag with its text content
          const textNode = doc.createTextNode(el.textContent || '')
          if (el.parentNode) {
            el.parentNode.replaceChild(textNode, el)
          }
          continue
        }

        // Special handling for <mark> highlights
        if (tagName === 'mark') {
          normalizeMarkElement(el)
        }

        // Clean attributes
        const attrNames = el.getAttributeNames()
        for (const attr of attrNames) {
          const attrLower = attr.toLowerCase()

          // Remove event handlers (on*) or non-whitelisted attributes
          if (attrLower.startsWith('on') || !ALLOWED_ATTRS.has(attrLower)) {
            el.removeAttribute(attr)
            continue
          }

          // Validate URL attributes
          if (['href', 'src', 'poster'].includes(attrLower)) {
            const val = el.getAttribute(attr) || ''
            if (!isSafeUrl(val)) {
              el.removeAttribute(attr)
            }
          }
        }

        // Enforce rel="noopener noreferrer" for external links or target="_blank"
        if (tagName === 'a') {
          const target = el.getAttribute('target')
          if (target === '_blank') {
            el.setAttribute('rel', 'noopener noreferrer')
          }
        }

        // Clean children recursively
        cleanNode(el)
      } else if (
        child.nodeType !== Node.TEXT_NODE &&
        child.nodeType !== Node.COMMENT_NODE
      ) {
        if (child.parentNode) {
          child.parentNode.removeChild(child)
        }
      }
    }
  }

  cleanNode(doc.body)
  return doc.body.innerHTML
}
