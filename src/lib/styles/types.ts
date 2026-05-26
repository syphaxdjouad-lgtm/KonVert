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
  }
}

export interface StyleDefinition {
  id: StyleId
  name: string
  description: string
  tokens: StyleTokens
}
