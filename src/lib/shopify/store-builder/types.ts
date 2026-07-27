// Store Builder for Shopify — types partagés.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 4, 2026-07-27) :
// aucune requête de ce module n'a encore touché un vrai store Shopify.
// Validation prévue au spike Sprint 6 (dev store réel) — voir SPIKE_REPORT
// mentionné dans activate-theme.ts.

// ─── Contexte d'exécution ───────────────────────────────────────────────────

/**
 * Contexte boutique requis par toutes les fonctions du Store Builder.
 * L'access token n'est jamais lu depuis l'env ni hardcodé ici : il vient soit
 * de Supabase (table `stores`, déchiffré par l'appelant), soit du futur flow
 * OAuth dédié Store Builder (Sprint 6, table `shopify_store_connections`).
 */
export interface StoreBuilderContext {
  /** Domaine *.myshopify.com, sans protocole (ex: "mon-store.myshopify.com") */
  shopDomain: string
  /** Access token Admin API en clair (déchiffré par l'appelant avant l'appel) */
  accessToken: string
  /**
   * Version d'API Admin Shopify (ex: "2025-10"). Les versions Shopify sont
   * trimestrielles et supportées ~12 mois — À VÉRIFIER/CONFIRMER au moment du
   * spike Sprint 6 sur dev store réel que cette version est toujours stable.
   * cf. https://shopify.dev/docs/api/usage/versioning
   */
  apiVersion: string
}

/** Version par défaut si l'appelant n'en précise pas — à revalider Sprint 6. */
export const DEFAULT_STORE_BUILDER_API_VERSION = '2025-10'

// ─── Résultat discriminé (pas d'exception qui fuit brute) ──────────────────

export type StoreBuilderErrorCode =
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN_SCOPE'
  | 'INVALID_PAYLOAD'
  | 'NOT_FOUND'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'

export interface StoreBuilderError {
  code: StoreBuilderErrorCode
  /** Message actionnable, safe à afficher côté dashboard Konvert. */
  message: string
  /** Statut HTTP Shopify d'origine, si disponible. */
  httpStatus?: number
  /** Pour RATE_LIMITED : délai conseillé avant retry, en ms. */
  retryAfterMs?: number
  /** Détail brut Shopify (jamais de secret dedans) pour debug/Sentry. */
  detail?: unknown
}

export type StoreBuilderResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: StoreBuilderError }

// ─── Thème ──────────────────────────────────────────────────────────────────

export type ShopifyThemeRole = 'main' | 'unpublished' | 'demo' | 'development'

export interface ShopifyTheme {
  id: number
  name: string
  role: ShopifyThemeRole
  createdAt: string
}

export interface UploadThemeInput {
  /** Nom affiché dans l'admin Shopify (ex: "Konvert CRO - V1") */
  name: string
  /**
   * URL publique HTTPS d'un .zip du thème. Priorité sur `assets` si fourni —
   * c'est la stratégie recommandée par Shopify (création "src"-based, la plus
   * fiable et la plus rapide, un seul appel API).
   *
   * ⚠️ DÉCISION D'HÉBERGEMENT — TODO FOUNDER (voir commentaire détaillé dans
   * upload-theme.ts) : le thème vit dans le repo privé `konvert-dawn`. Cette
   * URL doit pointer vers un .zip accessible publiquement sans auth (Shopify
   * télécharge lui-même le fichier, pas de moyen de lui passer un header
   * d'auth). Configurable via env var KONVERT_THEME_ZIP_URL — pas encore
   * hébergé nulle part à ce stade (Sprint 4).
   */
  zipUrl?: string
  /**
   * Fallback si `zipUrl` absent : assets à uploader un par un après création
   * d'un thème vide. Clé = chemin relatif Shopify (ex: "layout/theme.liquid"),
   * valeur = contenu texte (Liquid/JSON/CSS/JS). Pas de binaire ici (images) —
   * hors scope Sprint 4, cf. TODO dans upload-theme.ts.
   */
  assets?: Record<string, string>
}

// ─── Produit ────────────────────────────────────────────────────────────────

export interface NormalizedProductVariant {
  /** Ex: "Rouge / M" — libellé combiné des options */
  title: string
  price: string
  compareAtPrice?: string
  sku?: string
  /** Nombre d'unités en stock, si suivi. */
  inventoryQuantity?: number
  /** Valeurs d'options dans l'ordre déclaré par le produit (ex: ["Rouge", "M"]) */
  optionValues: string[]
}

export interface NormalizedProductImage {
  /** URL source publique de l'image (Shopify la télécharge lui-même). */
  src: string
  alt?: string
  /** Position d'affichage, 1-indexed. */
  position?: number
}

/** Produit normalisé — sortie attendue du scraper/générateur IA Konvert. */
export interface NormalizedProduct {
  title: string
  descriptionHtml: string
  vendor?: string
  productType?: string
  tags?: string[]
  /** Noms des options (ex: ["Couleur", "Taille"]), max 3 côté Shopify. */
  optionNames?: string[]
  variants: NormalizedProductVariant[]
  images: NormalizedProductImage[]
  status?: 'active' | 'draft'
}

export interface CreatedProduct {
  id: number
  handle: string
  variantIds: number[]
  imageIds: number[]
}

// ─── Activation thème ───────────────────────────────────────────────────────

export interface ActivateThemeInput {
  themeId: number
}
