/**
 * Native DOMParser-based HTML Sanitizer for safe rendering of rich_text blocks.
 * Enforces tag whitelist, attribute whitelist, URL scheme validation, and safe rel="noopener noreferrer" links.
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
