'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp,
  ShieldAlert, Info, Rocket, Circle, CheckCircle, XCircle, Link2,
} from 'lucide-react'
import { useStoreBuilderConnections } from '../_lib/useConnections'
import { hasStoreBuilderScopes, htmlToParagraphs } from '../_lib/format'
import { EmptyState } from '../_components/EmptyState'
import { ConnectionPicker } from '../_components/ConnectionPicker'
import type {
  Vertical, GenerateResponseData, ApiResult, InstallStep, DawnSection,
} from '../_lib/types'
import { VERTICAL_LABELS } from '../_lib/types'

const GUARANTEE_ICON_LABELS: Record<string, string> = {
  none: '—', truck: 'Livraison', return: 'Retour', lock: 'Sécurité', chat_bubble: 'Support',
  check_mark: 'Validation', stopwatch: 'Rapidité', box: 'Colis', leaf: 'Naturel',
  recycle: 'Recyclable', price_tag: 'Prix', plane: 'Expédition',
}

interface MerchantFactsForm {
  processing_delay: string
  shipping_delay: string
  return_policy: string
  warranty_duration: string
  support_response_time: string
  payment_methods: string
  brand_name: string
}

const EMPTY_FACTS: MerchantFactsForm = {
  processing_delay: '', shipping_delay: '', return_policy: '', warranty_duration: '',
  support_response_time: '', payment_methods: '', brand_name: '',
}

function section(data: GenerateResponseData, id: string): DawnSection | undefined {
  return data.template.sections[id]
}

/* ── Bloc générique carte de section preview ─────────────────────────────── */
function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <h4 className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>{title}</h4>
      {children}
    </div>
  )
}

function GeneratedPreview({ data }: { data: GenerateResponseData }) {
  const faq = section(data, 'konvert-faq-rich')
  const guarantees = section(data, 'konvert-guarantees')
  const comparison = section(data, 'konvert-comparison-table')
  const urgency = section(data, 'konvert-urgency-bar')
  const founder = section(data, 'konvert-founder-story')
  const exitIntent = section(data, 'konvert-exit-intent')

  const criticalFlags = data.flags.filter((f) => f.severity === 'critical')
  const warningFlags = data.flags.filter((f) => f.severity === 'warning')

  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-2 rounded-xl p-3 text-xs"
        style={{ background: 'rgba(124,58,237,0.06)', border: '1px dashed rgba(124,58,237,0.3)', color: '#6d28d9' }}
      >
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        Aperçu structuré du contenu généré — le rendu visuel final (couleurs, mise en page) sera celui de ta boutique une fois installé sur ton thème Shopify.
      </div>

      {data.usedFallback && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Le générateur IA était indisponible — un contenu gabarit par défaut a été utilisé à la place. Relis-le attentivement avant publication.
        </div>
      )}

      {(data.scrapeWarning || data.partial) && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {data.scrapeWarning ?? 'Certaines données produit n\'ont pu être récupérées entièrement — vérifie le contenu ci-dessous.'}
        </div>
      )}

      {criticalFlags.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#991b1b' }}>
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Certains contenus générés nécessitent une vérification avant publication</strong> ({criticalFlags.length} point{criticalFlags.length > 1 ? 's' : ''} à vérifier — délais/garanties/comparatifs notamment).
          </div>
        </div>
      )}
      {warningFlags.length > 0 && criticalFlags.length === 0 && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {warningFlags.length} point{warningFlags.length > 1 ? 's' : ''} mineur{warningFlags.length > 1 ? 's' : ''} signalé{warningFlags.length > 1 ? 's' : ''} pour relecture.
        </div>
      )}

      <PreviewCard title="Hero">
        <p className="font-black text-lg leading-snug" style={{ color: '#111' }}>{data.productFields.title}</p>
        <p className="text-sm mt-1.5" style={{ color: '#6b7280' }}>{data.productFields.subtitleMetafield}</p>
      </PreviewCard>

      <PreviewCard title="Description produit">
        <div className="space-y-2 text-sm" style={{ color: '#374151' }}>
          {htmlToParagraphs(data.productFields.bodyHtml).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </PreviewCard>

      {faq?.block_order && faq.block_order.length > 0 && (
        <PreviewCard title="FAQ">
          <div className="space-y-3">
            {faq.block_order.map((key) => {
              const b = faq.blocks?.[key]
              if (!b) return null
              return (
                <div key={key}>
                  <p className="text-sm font-bold" style={{ color: '#111' }}>{String(b.settings?.question ?? '')}</p>
                  <div className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                    {htmlToParagraphs(String(b.settings?.answer ?? '')).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              )
            })}
          </div>
        </PreviewCard>
      )}

      {guarantees?.block_order && guarantees.block_order.length > 0 && (
        <PreviewCard title="Garanties">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guarantees.block_order.map((key) => {
              const b = guarantees.blocks?.[key]
              if (!b) return null
              const icon = String(b.settings?.icon ?? 'none')
              return (
                <div key={key} className="rounded-xl p-3" style={{ background: '#F5F4FA' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: '#fff', color: '#7c3aed' }}>
                      {GUARANTEE_ICON_LABELS[icon] ?? icon}
                    </span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#111' }}>{String(b.settings?.title ?? '')}</p>
                  <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    {htmlToParagraphs(String(b.settings?.text ?? '')).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              )
            })}
          </div>
        </PreviewCard>
      )}

      {comparison && (
        <PreviewCard title="Tableau comparatif">
          <p className="text-sm font-bold mb-3" style={{ color: '#111' }}>{String(comparison.settings?.heading ?? '')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#9ca3af' }}>
                  <th className="text-left font-bold pb-2">{String(comparison.settings?.criteria_column_label ?? 'Critère')}</th>
                  <th className="text-left font-bold pb-2" style={{ color: '#16a34a' }}>{String(comparison.settings?.us_column_label ?? 'Nous')}</th>
                  <th className="text-left font-bold pb-2">{String(comparison.settings?.them_column_label ?? 'Eux')}</th>
                </tr>
              </thead>
              <tbody>
                {(comparison.block_order ?? []).map((key) => {
                  const b = comparison.blocks?.[key]
                  if (!b) return null
                  const usVal = b.settings?.us_value === 'custom' ? String(b.settings?.us_text ?? '') : (b.settings?.us_value === 'yes' ? 'Oui' : 'Non')
                  const themVal = b.settings?.them_value === 'custom' ? String(b.settings?.them_text ?? '') : (b.settings?.them_value === 'yes' ? 'Oui' : 'Non')
                  return (
                    <tr key={key} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td className="py-2 font-semibold" style={{ color: '#374151' }}>{String(b.settings?.label ?? '')}</td>
                      <td className="py-2 font-bold" style={{ color: '#16a34a' }}>{usVal}</td>
                      <td className="py-2" style={{ color: '#9ca3af' }}>{themVal}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </PreviewCard>
      )}

      {urgency && (
        <PreviewCard title="Barre d'urgence">
          <p className="text-sm" style={{ color: '#374151' }}>{String(urgency.settings?.message_default ?? '')}</p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            Avec stock : {String(urgency.settings?.message_with_stock ?? '')} <span className="italic">(le token [count] est remplacé par le vrai stock côté Shopify)</span>
          </p>
        </PreviewCard>
      )}

      {founder && (
        <PreviewCard title="Notre histoire">
          <p className="text-sm font-bold" style={{ color: '#111' }}>{String(founder.settings?.heading ?? '')}</p>
          <div className="text-sm mt-1.5 space-y-2" style={{ color: '#6b7280' }}>
            {htmlToParagraphs(String(founder.settings?.story ?? '')).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div
            className="flex items-start gap-2 rounded-lg p-2.5 mt-3 text-xs"
            style={{ background: 'rgba(124,58,237,0.06)', color: '#6d28d9' }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Volontairement laissé à trous (crochets [...]) et sans nom de fondateur — complète avec tes vraies infos dans l&apos;éditeur de thème Shopify avant de publier.
          </div>
        </PreviewCard>
      )}

      {exitIntent && (
        <PreviewCard title="Popup de sortie (exit-intent)">
          <p className="text-sm font-bold" style={{ color: '#111' }}>{String(exitIntent.settings?.heading ?? '')}</p>
          <div className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {htmlToParagraphs(String(exitIntent.settings?.text ?? '')).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <p className="text-xs mt-1.5 font-bold" style={{ color: '#7c3aed' }}>{String(exitIntent.settings?.cta_label ?? '')}</p>
          <div
            className="flex items-start gap-2 rounded-lg p-2.5 mt-3 text-xs"
            style={{ background: 'rgba(124,58,237,0.06)', color: '#6d28d9' }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Aucun code promo généré — ajoute un vrai code actif dans l&apos;éditeur de thème, ou laisse la popup telle quelle.
          </div>
        </PreviewCard>
      )}
    </div>
  )
}

/* ── Étape installation ───────────────────────────────────────────────────── */

function InstallSteps({ status }: { status: Record<InstallStep, 'pending' | 'active' | 'done' | 'error'> }) {
  const steps: { key: InstallStep; label: string }[] = [
    { key: 'upload_theme', label: 'Upload du thème Konvert CRO' },
    { key: 'create_product', label: 'Création du produit' },
    { key: 'activate_theme', label: 'Activation du thème' },
  ]
  return (
    <div className="space-y-2">
      {steps.map((s) => {
        const st = status[s.key]
        const Icon = st === 'done' ? CheckCircle : st === 'error' ? XCircle : st === 'active' ? Loader2 : Circle
        const color = st === 'done' ? '#16a34a' : st === 'error' ? '#dc2626' : st === 'active' ? '#7c3aed' : '#d1d5db'
        return (
          <div key={s.key} className="flex items-center gap-2.5 text-sm">
            <Icon className={`w-4 h-4 flex-shrink-0 ${st === 'active' ? 'animate-spin' : ''}`} style={{ color }} />
            <span style={{ color: st === 'pending' ? '#9ca3af' : '#111' }}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function InstallPanel({
  connectionId, generated, scopesOk,
}: {
  connectionId: string
  generated: GenerateResponseData
  scopesOk: boolean
}) {
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [imagesText, setImagesText] = useState('')
  const [installing, setInstalling] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [steps, setSteps] = useState<Record<InstallStep, 'pending' | 'active' | 'done' | 'error'>>({
    upload_theme: 'pending', create_product: 'pending', activate_theme: 'pending',
  })

  async function submitInstall(e: React.FormEvent) {
    e.preventDefault()
    if (!price.trim()) return
    setInstalling(true)
    setResult(null)
    setSteps({ upload_theme: 'active', create_product: 'pending', activate_theme: 'pending' })

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((src) => ({ src }))

    try {
      const res = await fetch('/api/shopify/store-builder/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_id: connectionId,
          product: {
            title: generated.productFields.title,
            descriptionHtml: generated.productFields.bodyHtml,
            productType: VERTICAL_LABELS[generated.vertical],
            variants: [{
              title: 'Défaut',
              price: price.trim(),
              compareAtPrice: compareAtPrice.trim() || undefined,
              optionValues: [],
            }],
            images,
          },
          theme: { name: 'Konvert CRO - V1' },
        }),
      })
      const json = await res.json()

      if (json.success) {
        setSteps({ upload_theme: 'done', create_product: 'done', activate_theme: 'done' })
        setResult({ ok: true, message: 'Installation réussie — ta page produit est en ligne sur ta boutique Shopify.' })
      } else {
        const failedStep: InstallStep | undefined = json.step
        setSteps((prev) => {
          const next = { ...prev }
          const order: InstallStep[] = ['upload_theme', 'create_product', 'activate_theme']
          const failedIdx = failedStep ? order.indexOf(failedStep) : -1
          order.forEach((k, i) => {
            if (failedIdx === -1) return
            next[k] = i < failedIdx ? 'done' : i === failedIdx ? 'error' : 'pending'
          })
          return next
        })
        setResult({ ok: false, message: json.error?.message ?? json.error ?? "L'installation a échoué." })
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Erreur réseau' })
      setSteps((prev) => ({ ...prev, upload_theme: prev.upload_theme === 'active' ? 'error' : prev.upload_theme }))
    } finally {
      setInstalling(false)
    }
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
          <Rocket className="w-4 h-4" style={{ color: '#7c3aed' }} />
        </div>
        <div>
          <h3 className="font-black text-sm" style={{ color: '#111' }}>Installer sur ma boutique</h3>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Upload du thème Konvert CRO + création du produit + activation</p>
        </div>
      </div>

      {!scopesOk && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-xs mb-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Cette connexion n&apos;a pas (encore) les permissions requises pour installer — reconnecte-la depuis l&apos;onglet Connexion.
        </div>
      )}

      <div
        className="flex items-start gap-2 rounded-xl p-3 text-xs mb-4"
        style={{ background: 'rgba(124,58,237,0.06)', color: '#6d28d9' }}
      >
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        Le générateur IA ne récupère pas encore le prix ni les images du produit scrapé — complète-les ici avant l&apos;installation (limitation connue, cf. rapport).
      </div>

      <form onSubmit={submitInstall} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1.5" htmlFor="sb-price" style={{ color: '#374151' }}>Prix (€)</label>
            <input
              id="sb-price" type="text" required inputMode="decimal" placeholder="29.99"
              value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" htmlFor="sb-compare-price" style={{ color: '#374151' }}>Prix barré (optionnel)</label>
            <input
              id="sb-compare-price" type="text" inputMode="decimal" placeholder="49.99"
              value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5" htmlFor="sb-images" style={{ color: '#374151' }}>
            Images produit (une URL par ligne, optionnel)
          </label>
          <textarea
            id="sb-images" rows={3} placeholder={'https://.../image1.jpg\nhttps://.../image2.jpg'}
            value={imagesText} onChange={(e) => setImagesText(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
          />
        </div>

        {result && (
          <div
            className="flex items-start gap-2 rounded-xl p-3 text-sm"
            style={result.ok
              ? { background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#166534' }
              : { background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#991b1b' }}
          >
            {result.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            {result.message}
          </div>
        )}

        {installing || result ? <InstallSteps status={steps} /> : null}

        <button
          type="submit"
          disabled={installing || !scopesOk}
          className="w-full text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
        >
          {installing ? <><Loader2 className="w-4 h-4 animate-spin" /> Installation en cours...</> : 'Installer sur ma boutique'}
        </button>
      </form>
    </div>
  )
}

/* ── Formulaire "infos réelles" (merchant_facts) ──────────────────────────── */

function MerchantFactsFields({ value, onChange }: { value: MerchantFactsForm; onChange: (v: MerchantFactsForm) => void }) {
  const [open, setOpen] = useState(false)
  const fields: { key: keyof MerchantFactsForm; label: string; placeholder: string }[] = [
    { key: 'brand_name', label: 'Nom de ta marque', placeholder: 'Ex : Aura Studio' },
    { key: 'processing_delay', label: 'Délai de traitement réel', placeholder: 'Ex : 24-48h' },
    { key: 'shipping_delay', label: 'Délai de livraison réel', placeholder: 'Ex : 5 à 10 jours ouvrés' },
    { key: 'return_policy', label: 'Politique de retour réelle', placeholder: 'Ex : 14 jours, produit non ouvert' },
    { key: 'warranty_duration', label: 'Durée de garantie réelle', placeholder: 'Ex : 2 ans' },
    { key: 'support_response_time', label: 'Délai de réponse SAV réel', placeholder: 'Ex : sous 24h' },
    { key: 'payment_methods', label: 'Moyens de paiement (séparés par une virgule)', placeholder: 'Carte bancaire, PayPal, Apple Pay' },
  ]

  return (
    <div className="rounded-xl" style={{ border: '1px solid #e5e7eb' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold"
        style={{ color: '#374151' }}
      >
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: '#7c3aed' }} />
          Infos réelles (optionnel) — pour éviter les gabarits à trous
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Ce que tu renseignes ici est utilisé tel quel par le générateur. Ce que tu laisses vide devient un gabarit à trous
            [comme ceci] que tu complètes toi-même après — jamais une valeur inventée.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>{f.label}</label>
                <input
                  type="text"
                  value={value[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function StoreBuilderGeneratePage() {
  const { connections, loading: loadingConnections } = useStoreBuilderConnections()
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeConnection = useMemo(
    () => connections.find((c) => c.id === activeId) ?? connections[0] ?? null,
    [connections, activeId]
  )

  const [url, setUrl] = useState('')
  const [vertical, setVertical] = useState<'auto' | Vertical>('auto')
  const [facts, setFacts] = useState<MerchantFactsForm>(EMPTY_FACTS)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<GenerateResponseData | null>(null)

  async function submitGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setGenerating(true)
    setError(null)
    setGenerated(null)

    const merchant_facts: Record<string, unknown> = {}
    if (facts.brand_name.trim()) merchant_facts.brand_name = facts.brand_name.trim()
    if (facts.processing_delay.trim()) merchant_facts.processing_delay = facts.processing_delay.trim()
    if (facts.shipping_delay.trim()) merchant_facts.shipping_delay = facts.shipping_delay.trim()
    if (facts.return_policy.trim()) merchant_facts.return_policy = facts.return_policy.trim()
    if (facts.warranty_duration.trim()) merchant_facts.warranty_duration = facts.warranty_duration.trim()
    if (facts.support_response_time.trim()) merchant_facts.support_response_time = facts.support_response_time.trim()
    if (facts.payment_methods.trim()) {
      merchant_facts.payment_methods = facts.payment_methods.split(',').map((s) => s.trim()).filter(Boolean)
    }

    try {
      const res = await fetch('/api/shopify/store-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          vertical: vertical === 'auto' ? undefined : vertical,
          merchant_facts: Object.keys(merchant_facts).length > 0 ? merchant_facts : undefined,
        }),
      })
      const json: ApiResult<GenerateResponseData> = await res.json()
      if (!json.ok) {
        setError(json.error.message)
        return
      }
      setGenerated(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réseau — réessaie.')
    } finally {
      setGenerating(false)
    }
  }

  if (!loadingConnections && connections.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="Connecte d'abord une boutique"
        description="Le générateur a besoin d'une boutique Shopify connectée pour pouvoir ensuite y installer la page produit."
        action={
          <Link
            href="/dashboard/store-builder"
            className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            Aller à l&apos;onglet Connexion
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ConnectionPicker
          connections={connections}
          activeId={activeConnection?.id ?? null}
          onChange={setActiveId}
        />
      </div>

      <form onSubmit={submitGenerate} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h3 className="font-black" style={{ color: '#111' }}>Générer une page produit</h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Colle un lien produit — on scrape et on rédige les 8 blocs de la page.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5" htmlFor="sb-product-url" style={{ color: '#374151' }}>URL du produit</label>
          <input
            id="sb-product-url" type="url" required placeholder="https://exemple.com/produits/mon-produit"
            value={url} onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5" htmlFor="sb-vertical" style={{ color: '#374151' }}>Vertical</label>
          <select
            id="sb-vertical" value={vertical} onChange={(e) => setVertical(e.target.value as 'auto' | Vertical)}
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
          >
            <option value="auto">Détection automatique (recommandé)</option>
            {(Object.keys(VERTICAL_LABELS) as Vertical[]).map((v) => (
              <option key={v} value={v}>{VERTICAL_LABELS[v]}</option>
            ))}
          </select>
        </div>

        <MerchantFactsFields value={facts} onChange={setFacts} />

        {error && (
          <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={generating}
          className="w-full text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Scrape + génération en cours (jusqu&apos;à ~90s)...</> : <><Sparkles className="w-4 h-4" /> Générer le contenu IA</>}
        </button>
      </form>

      {generated && (
        <>
          <GeneratedPreview data={generated} />
          {activeConnection && (
            <InstallPanel
              connectionId={activeConnection.id}
              generated={generated}
              scopesOk={hasStoreBuilderScopes(activeConnection.scopes)}
            />
          )}
        </>
      )}
    </div>
  )
}
