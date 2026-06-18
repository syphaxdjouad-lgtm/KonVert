export type StyleId =
  | 'soft' | 'editorial' | 'apple-clean' | 'bold' | 'organic'
  | 'luxe-noir' | 'brutalist' | 'warm-neutral' | 'minimal-mono' | 'vibrant'

export interface StyleTokens {
  colors: {
    bg: string
    surface: string
    accent: string
    text: string
    textMuted: string
    border: string
    // Sprint 1 — tokens sémantiques CRO (optionnels, fallback sur CRO_DEFAULTS dans les renderers)
    bgAlt?:    string   // fond alterné pour séparer les sections visuellement
    success?:  string   // confirmations, stocks OK — défaut '#16A34A'
    warning?:  string   // stock faible, urgence modérée — défaut '#D97706'
    danger?:   string   // flash sale, stock critique — défaut '#DC2626'
    star?:     string   // couleur étoiles reviews — défaut '#F59E0B'
  }
  fonts: {
    heading: string
    body: string
    mono?: string
  }
  spacing: {
    section: string
    card: string
    gap: string
    // Sprint 1 — responsive section spacing
    sectionMobile?: string  // défaut '64px'
  }
  radius: {
    card: string
    button: string
    image: string
  }
  shadows: {
    card: string
    hover: string
  }
  motion: {
    ease: string
    duration: string
    // Sprint 1 — granularité motion Dawn
    durationShort?: string   // défaut '120ms' — hover, micro-interactions
    easeSpring?:    string   // défaut 'cubic-bezier(0.32, 0.72, 0, 1)' — slide-up sticky
  }
}

export interface StyleDefinition {
  id: StyleId
  name: string
  description: string
  tokens: StyleTokens
}
