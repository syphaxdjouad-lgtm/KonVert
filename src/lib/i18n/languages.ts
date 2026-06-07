export const ALLOWED_LANGS: ReadonlySet<string> = new Set([
  'fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'ar', 'zh',
])

export const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'English',
  es: 'español',
  de: 'Deutsch',
  it: 'italiano',
  pt: 'português',
  nl: 'Nederlands',
  ar: 'العربية',
  zh: '中文',
}

export function resolveLanguage(input: unknown): string {
  return typeof input === 'string' && ALLOWED_LANGS.has(input) ? input : 'fr'
}

export function languageName(lang: string): string {
  return LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.fr
}
