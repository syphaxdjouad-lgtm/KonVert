// Store Builder — UI dashboard : helpers purs (formatage, bandes de score,
// vérif scopes côté affichage). Aucun accès réseau/DOM — testable directement.

import type { AuditBand } from './types'
import { STORE_BUILDER_REQUIRED_SCOPES, AB_TEST_REQUIRED_SCOPE, AB_MAX_DURATION_DAYS } from './types'

/** Reproduit la bande de couleur du score CRO — cf. spec KAKASHI §B.2. */
export function scoreBand(score: number): AuditBand {
  if (score < 50) return 'red'
  if (score <= 75) return 'orange'
  return 'green'
}

export interface BandColors {
  bg: string
  border: string
  text: string
  fg: string // couleur pleine (jauge, icônes)
}

/** Palette bandes — jamais de noir, toujours des teintes claires + couleur pleine pour les accents (cf. contrainte design NEXARA). */
export function bandColors(band: AuditBand): BandColors {
  switch (band) {
    case 'red':
      return { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)', text: '#991b1b', fg: '#dc2626' }
    case 'orange':
      return { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', text: '#9a3412', fg: '#f97316' }
    case 'green':
      return { bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)', text: '#166534', fg: '#16a34a' }
  }
}

export function bandLabel(band: AuditBand): string {
  switch (band) {
    case 'red':
      return 'À améliorer'
    case 'orange':
      return 'Peut mieux faire'
    case 'green':
      return 'Solide'
  }
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '—'
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatPValue(p: number): string {
  if (!Number.isFinite(p)) return '—'
  if (p < 0.001) return 'p < 0.001'
  return `p = ${p.toFixed(3)}`
}

export function formatDateFr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function daysSince(iso: string, now: Date = new Date()): number {
  const ms = now.getTime() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)))
}

/** Jours restants avant la clôture automatique d'un test A/B (plafond 30j). */
export function daysRemainingInTest(startedAtIso: string, now: Date = new Date()): number {
  return Math.max(0, AB_MAX_DURATION_DAYS - daysSince(startedAtIso, now))
}

/** Vérif d'affichage uniquement (pas une garantie de sécurité — le serveur
 * revalide toujours les scopes réels avant tout appel Shopify). */
export function hasStoreBuilderScopes(scopes: string): boolean {
  const granted = new Set(scopes.split(',').map((s) => s.trim()).filter(Boolean))
  return STORE_BUILDER_REQUIRED_SCOPES.every((s) => granted.has(s))
}

export function hasReadOrdersScope(scopes: string): boolean {
  return scopes.split(',').map((s) => s.trim()).includes(AB_TEST_REQUIRED_SCOPE)
}

/** Normalise une saisie utilisateur en sous-domaine .myshopify.com valide,
 * ou renvoie null si le format reste invalide après normalisation. Même
 * règle que src/app/(dashboard)/dashboard/stores/page.tsx (cohérence UX). */
export function normalizeShopDomain(raw: string): string | null {
  let value = raw.trim().toLowerCase()
  value = value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (!value) return null
  if (!value.includes('.')) value = `${value}.myshopify.com`
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(value)) return null
  return value
}

/** Regroupe les 18 critères d'audit par groupe (1=vrais gaps, 2=IA défensif,
 * 3=produit/SEO/perf) — cf. spec KAKASHI §B.1. Purement pour l'affichage. */
export function auditCriterionGroup(id: number): 1 | 2 | 3 {
  if (id <= 6) return 1
  if (id <= 12) return 2
  return 3
}

export const AUDIT_GROUP_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Contenu que seul toi peux ajouter',
  2: 'Contenu généré automatiquement — à vérifier',
  3: 'Produit, SEO & performance',
}

/** Convertit un richtext `<p>...</p>` (whitelist unique du sanitizer serveur,
 * cf. sanitize-richtext.ts) en paragraphes texte brut pour un affichage sûr
 * côté client sans jamais utiliser dangerouslySetInnerHTML. */
export function htmlToParagraphs(html: string): string[] {
  return html
    .split(/<\/p\s*>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
    )
    .filter(Boolean)
}
