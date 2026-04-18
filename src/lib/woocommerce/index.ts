import crypto from 'crypto'
import { encryptToken, decryptToken } from '@/lib/shopify'

// ─── WooCommerce REST API client ──────────────────────────────────────────────
// Authentification via Consumer Key + Consumer Secret (Basic Auth)

export class WooCommerceClient {
  private baseUrl: string
  private auth:    string

  constructor(storeUrl: string, consumerKey: string, consumerSecret: string) {
    // Normaliser l'URL (enlever le slash final)
    this.baseUrl = storeUrl.replace(/\/$/, '')
    this.auth    = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/wp-json/wc/v3${path}`

    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Authorization:  `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      if (res.status === 401) throw new Error('Clés WooCommerce invalides')
      if (res.status === 403) throw new Error('Permissions insuffisantes — vérifie les droits Read/Write')
      if (res.status === 404) throw new Error('API WooCommerce introuvable — vérifie que WooCommerce est installé et les permalinks configurés')
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`WooCommerce API ${res.status}: ${body.slice(0, 200)}`)
      }

      return res.json() as Promise<T>
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('Timeout WooCommerce — store trop lent ou URL incorrecte')
      // Erreurs SSL auto-signées fréquentes sur les sites de dev
      if (err.message?.includes('CERT') || err.message?.includes('SSL')) {
        throw new Error('Erreur SSL — si c\'est un site de dev, configure un certificat valide')
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  // Vérifier la connexion
  async ping(): Promise<{ name: string; url: string; version: string }> {
    const data = await this.request<any>('/system_status')
    return {
      name:    data.settings?.title || this.baseUrl,
      url:     this.baseUrl,
      version: data.environment?.version || '?',
    }
  }

  // Créer une page WordPress via WC (utilise l'API WordPress Pages)
  async createPage(title: string, htmlContent: string): Promise<{ id: number; url: string }> {
    const wpUrl = `${this.baseUrl}/wp-json/wp/v2/pages`
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(wpUrl, {
        method: 'POST',
        headers: {
          Authorization:  `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: htmlContent,
          status:  'publish',
        }),
        signal: controller.signal,
      })

      if (res.status === 401) throw new Error('Clés WooCommerce sans accès WordPress Pages — génère une Application Password')
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`WP Pages API ${res.status}: ${body.slice(0, 200)}`)
      }

      const page = await res.json()
      return { id: page.id, url: page.link }
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('Timeout création page WordPress')
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  // Mettre à jour une page existante
  async updatePage(pageId: number, title: string, htmlContent: string): Promise<void> {
    const wpUrl = `${this.baseUrl}/wp-json/wp/v2/pages/${pageId}`
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(wpUrl, {
        method: 'PUT',
        headers: {
          Authorization:  `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: htmlContent }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`WP Pages update ${res.status}: ${body.slice(0, 200)}`)
      }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ─── Helpers pour stocker les credentials ────────────────────────────────────

export function encryptCredentials(consumerKey: string, consumerSecret: string): string {
  // On chiffre "key:secret" ensemble
  return encryptToken(`${consumerKey}::${consumerSecret}`)
}

export function decryptCredentials(encrypted: string): { consumerKey: string; consumerSecret: string } {
  const decrypted = decryptToken(encrypted)
  const parts = decrypted.split('::')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Format de credentials WooCommerce invalide — reconnecte le store')
  }
  return { consumerKey: parts[0], consumerSecret: parts[1] }
}
