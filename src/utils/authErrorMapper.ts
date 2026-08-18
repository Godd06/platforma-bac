/**
 * Safe Auth Error Mapper & Validation Utilities (Auth UX Hardening)
 */

export function mapAuthError(rawMessage?: string | null): string {
  if (!rawMessage) {
    return 'A apărut o eroare neașteptată. Te rugăm să reîncerci.'
  }

  const msg = rawMessage.toLowerCase()

  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Adresa de e-mail sau parola este incorectă. Te rugăm să verifici datele.'
  }

  if (msg.includes('user already registered') || msg.includes('already_exists')) {
    return 'Există deja un cont înregistrat cu această adresă de e-mail. Încearcă să te autentifici.'
  }

  if (msg.includes('email rate limit exceeded') || msg.includes('over email send rate limit') || msg.includes('too many requests')) {
    return 'Prea multe încercări recente. Te rugăm să aștepți un minut înainte de a reîncerca.'
  }

  if (msg.includes('email not confirmed')) {
    return 'Adresa de e-mail nu a fost încă confirmată. Verifică caseta de poștă electronică.'
  }

  if (msg.includes('networkerror') || msg.includes('failed to fetch') || msg.includes('offline')) {
    return 'Eroare de rețea. Te rugăm să verifici conexiunea la internet și să reîncerci.'
  }

  if (msg.includes('password should be at least')) {
    return 'Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică, o cifră și un simbol.'
  }

  return rawMessage
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(trimmed)
}
