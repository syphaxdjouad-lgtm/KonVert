import { encryptToken, decryptToken } from '@/lib/shopify'

const YOUCAN_API = 'https://api.youcan.shop'

// ─── YouCan REST API client ────────────────────────────────────────────────────
// Auth : Bearer token généré dans YouCan Admin → Paramètres → API

export class YouCanClient {
  private token: string

  constructor(apiToken: string) {
    this.token = apiToken
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(`${YOUCAN_API}${path}`, {
        ...options,
        headers: {
          Authorization:  `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      if (res.status === 401) throw new Error('Token YouCan invalide — régénère-le dans Paramètres → API')
      if (res.status === 403) throw new Error('Permissions insuffisantes — vérifie les droits du token')
      if (res.status === 404) throw new Error('Ressource YouCan introuvable')
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`YouCan API ${res.status}: ${body.slice(0, 200)}`)
      }

      return res.json() as Promise<T>
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('Timeout YouCan — réessaie')
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  // Vérifier le token et récupérer les infos du store
  async ping(): Promise<{ id: string; name: string; url: string }> {
    const data = await this.request<any>('/store/me')
    return {
      id:   data.id   || data.store?.id   || '',
      name: data.name || data.store?.name || 'Ma boutique YouCan',
      url:  data.domain ? `https://${data.domain}` : data.url || '',
    }
  }

  // Créer une page produit sur YouCan
  async createPage(title: string, htmlContent: string): Promise<{ id: string; url: string }> {
    const data = await this.request<any>('/store/pages', {
      method: 'POST',
      body: JSON.stringify({
        title,
        body_html:  htmlContent,
        published:  true,
      }),
    })

    const page = data.page || data
    return {
      id:  String(page.id  || page.token || ''),
      url: page.url || page.link || '',
    }
  }

  // Mettre à jour une page existante
  async updatePage(pageId: string, title: string, htmlContent: string): Promise<void> {
    await this.request<any>(`/store/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        body_html: htmlContent,
        published: true,
      }),
    })
  }
}

// ─── Helpers credentials ──────────────────────────────────────────────────────

export function encryptYouCanToken(token: string): string {
  return encryptToken(token)
}

export function decryptYouCanToken(encrypted: string): string {
  return decryptToken(encrypted)
}
