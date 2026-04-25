import crypto from 'crypto'

// ─── Config ───────────────────────────────────────────────────────────────────

export const SHOPIFY_API_KEY    = process.env.SHOPIFY_API_KEY    || ''
export const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || ''
export const SHOPIFY_SCOPES     = 'write_pages,read_pages,write_content,read_content'
export const APP_URL            = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ─── OAuth helpers ────────────────────────────────────────────────────────────

export function buildOAuthUrl(shop: string, state: string): string {
  const redirectUri = `${APP_URL}/api/shopify/callback`
  const params = new URLSearchParams({
    client_id:    SHOPIFY_API_KEY,
    scope:        SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    'grant_options[]': 'per-user',
  })
  return `https://${shop}/admin/oauth/authorize?${params}`
}

export function generateState(): string {
  return crypto.randomBytes(16).toString('hex')
}

export function verifyHmac(query: Record<string, string>, secret: string): boolean {
  const { hmac, ...rest } = query
  if (!hmac) return false

  const message = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('&')

  const digest = crypto.createHmac('sha256', secret).update(message).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
}

// ─── Échange code → access token ─────────────────────────────────────────────

export async function exchangeCodeForToken(shop: string, code: string): Promise<string> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Shopify token exchange failed: ${err}`)
  }

  const data = await res.json()
  return data.access_token
}

// ─── Chiffrement du token ─────────────────────────────────────────────────────

// Fail-fast en runtime serveur : sans ENCRYPTION_KEY stable, on régénérerait
// une clé à chaque cold-start → tous les access_tokens en DB deviendraient
// indéchiffrables. La clé doit être une env var permanente.
function getEncryptionKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw || raw.length < 32) {
    throw new Error(
      'ENCRYPTION_KEY manquante ou trop courte (min 32 caractères). ' +
        'Sans elle, les tokens Shopify chiffrés en DB deviennent illisibles.'
    )
  }
  return crypto.createHash('sha256').update(raw).digest()
}

export function encryptToken(token: string): string {
  const iv  = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('hex'), encrypted.toString('hex'), tag.toString('hex')].join(':')
}

export function decryptToken(encrypted: string): string {
  const [ivHex, dataHex, tagHex] = encrypted.split(':')
  const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

// ─── Shopify API client ───────────────────────────────────────────────────────

export class ShopifyClient {
  private shop:  string
  private token: string

  constructor(shop: string, accessToken: string) {
    this.shop  = shop
    this.token = accessToken
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`https://${this.shop}/admin/api/2024-01${path}`, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.token,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(15000),
    })

    if (res.status === 401) throw new Error('Token Shopify expiré ou invalide')
    if (res.status === 402) throw new Error('Store Shopify inactif ou plan insuffisant')
    if (res.status === 429) throw new Error('Rate limit Shopify — réessaie dans quelques secondes')
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Shopify API ${res.status}: ${body}`)
    }

    return res.json() as Promise<T>
  }

  // Vérifier que la connexion fonctionne
  async ping(): Promise<{ shop: string; name: string; email: string }> {
    const data = await this.request<{ shop: any }>('/shop.json')
    return {
      shop:  data.shop.myshopify_domain,
      name:  data.shop.name,
      email: data.shop.email,
    }
  }

  // Créer une page dans le store Shopify
  async createPage(title: string, htmlBody: string): Promise<{ id: number; url: string }> {
    const data = await this.request<{ page: any }>('/pages.json', {
      method: 'POST',
      body: JSON.stringify({
        page: {
          title,
          body_html: htmlBody,
          published: true,
        },
      }),
    })

    return {
      id:  data.page.id,
      url: `https://${this.shop}/pages/${data.page.handle}`,
    }
  }

  // Mettre à jour une page existante
  async updatePage(pageId: number, title: string, htmlBody: string): Promise<void> {
    await this.request(`/pages/${pageId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        page: { id: pageId, title, body_html: htmlBody },
      }),
    })
  }

  // Lister les pages du store
  async listPages(): Promise<{ id: number; title: string; handle: string }[]> {
    const data = await this.request<{ pages: any[] }>('/pages.json?limit=50')
    return data.pages.map((p) => ({ id: p.id, title: p.title, handle: p.handle }))
  }
}
