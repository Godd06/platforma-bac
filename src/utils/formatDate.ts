/**
 * Format an ISO timestamp into a Romanian relative time string.
 * e.g., "acum 5 minute", "acum 2 ore", "ieri", "acum 3 zile", "12 oct."
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 0) {
    return 'chiar acum'
  }

  if (diffInSeconds < 60) {
    return 'chiar acum'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `acum ${diffInMinutes} ${diffInMinutes === 1 ? 'minut' : 'minute'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `acum ${diffInHours} ${diffInHours === 1 ? 'oră' : 'ore'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) {
    return 'ieri'
  }
  if (diffInDays < 7) {
    return `acum ${diffInDays} zile`
  }

  // Format as short date in Romanian (e.g. 15 oct. / 15 oct. 2026)
  const day = date.getDate()
  const months = ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.']
  const month = months[date.getMonth()]
  const isCurrentYear = date.getFullYear() === now.getFullYear()

  if (isCurrentYear) {
    return `${day} ${month}`
  }

  return `${day} ${month} ${date.getFullYear()}`
}
