'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TEMPLATES, PRODUCT_TYPE_LABELS, type ProductType } from '@/lib/templates'
import { detectProductType } from '@/lib/templates/detect-product-type'
import {
  Link2, Pencil, Loader2, ArrowLeft, ArrowRight, Check,
  Upload, Palette, Sparkles,
  Zap, X, ChevronRight, Send, ChevronDown, CheckCircle2, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { LandingPageData } from '@/types'
import { track } from '@/lib/analytics'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _Palette = Palette

const BuilderLoader = dynamic(() => import('@/components/builder/BuilderLoader'), { ssr: false })

type Mode = 'wizard' | 'generating' | 'editor'
type InputMode = 'url' | 'manual'

const STYLES = [
  { id: 'etec-blue',      name: 'Blue',      desc: 'Moderne et universel — bleu électrique, fond blanc, boutons ronds',        emoji: '🔵' },
  { id: 'etec-noir',      name: 'Noir',      desc: 'Dark premium élégant — fond noir profond, accents violets, gaming/luxe',   emoji: '🖤' },
  { id: 'etec-rose',      name: 'Rose',      desc: 'Beauté & skincare — rose chaud, galerie UGC, top conversion beauté',       emoji: '🌸' },
  { id: 'etec-sage',      name: 'Sage',      desc: 'Organic & bien-être — vert forêt, tons naturels, certifications bio',      emoji: '🌿' },
  { id: 'etec-gold',      name: 'Gold',      desc: 'Luxe & exclusivité — fond noir, accents dorés, haute gamme',               emoji: '✨' },
  { id: 'etec-energy',    name: 'Energy',    desc: 'Sport & fitness — orange vif, countdown, dynamisme total',                 emoji: '⚡' },
  { id: 'etec-beauty',    name: 'Beauty',    desc: 'Hair care premium — crème & orange brûlé, routine capillaire, UGC',        emoji: '💆' },
  { id: 'etec-style',     name: 'Style',     desc: 'Fashion & personal styling — beige caramel, minimaliste élégant',          emoji: '👗' },
  { id: 'etec-shopz',     name: 'Shopz',     desc: 'E-commerce clothing — galerie interactive, swatches couleur/taille',       emoji: '🛍️' },
  { id: 'etec-velvety',   name: 'Velvety',   desc: 'Skincare botanique — vert forêt, grille produits, newsletter',             emoji: '🍃' },
  { id: 'etec-prime',     name: 'Prime',     desc: 'Supplements premium — dark + lime, ingrédients cliniques, subscribe',      emoji: '💊' },
  { id: 'etec-blusho',    name: 'Blusho',    desc: 'Cosmetics & skincare — vert olive doux, galerie UGC, routine beauté',      emoji: '🧴' },
  { id: 'etec-casa',      name: 'Casa',      desc: 'Maison & déco artisanale — serif élégant, terre cuite, galerie lifestyle', emoji: '🏠' },
  { id: 'etec-pet',       name: 'Pet',       desc: 'Animaux & pet care — orange chaleureux, sélecteur taille, avis espèce',    emoji: '🐾' },
  { id: 'etec-gadget',    name: 'Gadget',    desc: 'Tech & électronique — Apple-style, glassmorphism, color picker, specs',    emoji: '📱' },
  { id: 'etec-aura',      name: 'Aura',      desc: 'Wellness & rituel — lavande, tons zen, méditation et bien-être',           emoji: '🔮' },
  { id: 'etec-luxe',      name: 'Luxe',      desc: 'Joaillerie & ultra premium — noir & or, serif élégant, exclusivité',       emoji: '💎' },
  { id: 'etec-pulse',     name: 'Pulse',     desc: 'Tech & cyberpunk — dark mode, néon bleu, gadgets futuristes',              emoji: '🌀' },
  { id: 'etec-nordic',    name: 'Nordic',    desc: 'Lifestyle scandinave — minimaliste, tons froids, nature & design',         emoji: '🏔️' },
  { id: 'etec-cosmetix',  name: 'Cosmetix',  desc: 'Clean beauty & cosmétiques — bleu profond, Playfair Display, lab vibes',   emoji: '🧪' },
  { id: 'etec-trendy',    name: 'Trendy',    desc: 'Fashion & streetwear — gradient teal/bleu, Oswald bold, mode urbaine',     emoji: '🔥' },
  { id: 'etec-solo',      name: 'Solo',      desc: 'Mono-produit DTC — focus unique, stats bar, conversion maximale',          emoji: '🎯' },
  { id: 'etec-prestige',  name: 'Prestige',  desc: 'Premium artisanal — rouge profond, serif luxe, haut de gamme',             emoji: '🏆' },
  { id: 'etec-glow',      name: 'Glow',      desc: 'Skincare ritual — corail doux, Cormorant Garamond, routine beauté',        emoji: '✨' },
  { id: 'etec-homestyle',  name: 'HomeStyle', desc: 'Mobilier & déco — tons bois chaud, lifestyle maison, ambiance cosy',       emoji: '🏠' },
  { id: 'etec-jewel',      name: 'Jewel',     desc: 'Bijoux dark luxe — fond sombre, accents dorés, joaillerie premium',        emoji: '💎' },
  { id: 'etec-techcase',   name: 'TechCase',  desc: 'Accessoires tech — minimal noir, coques phone, gadgets Apple style',       emoji: '📱' },
  { id: 'etec-artisan',    name: 'Artisan',   desc: 'Handmade & naturel — tons orangés, savon artisanal, fait main',           emoji: '🧼' },
  { id: 'etec-outfit',     name: 'Outfit',    desc: 'Vêtements e-com — tons neutres chauds, galerie lookbook, warm neutral',   emoji: '👕' },
  { id: 'etec-ella',       name: 'Ella',      desc: 'Mode féminine — mauve élégant, serif raffiné, lifestyle féminin',        emoji: '👠' },
  { id: 'etec-starter',    name: 'Starter',   desc: 'Polyvalent & clean — indigo, design universel, idéal pour débuter',      emoji: '🚀' },
  { id: 'etec-glowup',     name: 'GlowUp',   desc: 'Beauté & makeup — rose glamour, galerie UGC, routine maquillage',        emoji: '💄' },
  { id: 'etec-hue',        name: 'Hue',       desc: 'Créatif & audacieux — orange vif, couleurs vibrantes, design bold',      emoji: '🎨' },
  { id: 'etec-interior',   name: 'Interior',  desc: 'Mobilier & intérieur — vert nature, lifestyle maison, design organique', emoji: '🪴' },
  { id: 'etec-platina',    name: 'Platina',   desc: 'Bijoux & joaillerie — doré raffiné, serif premium, pièces uniques',      emoji: '💍' },
  { id: 'etec-streetz',    name: 'StreetZ',   desc: 'Streetwear & urban — rouge bold, design audacieux, mode urbaine',        emoji: '🧢' },
  { id: 'etec-poterie',    name: 'Poterie',   desc: 'Céramique & artisanat — terre cuite, fait main, style organique',        emoji: '🏺' },
  { id: 'etec-electro',    name: 'Electro',   desc: 'Supplements & sport — bleu cyan, hydratation, energy boost',             emoji: '💧' },
  { id: 'etec-agency',     name: 'Agency',    desc: 'Corporate & services — bleu pro, structure claire, B2B',                 emoji: '🏢' },
  { id: 'etec-supreme',    name: 'Supreme',   desc: 'Streetwear & drops — fond dark, monospace, urgence maximale',            emoji: '🔴' },
  { id: 'etec-quarter',    name: 'Quarter',   desc: 'Minimal luxe — noir & blanc épuré, typographie élégante',                emoji: '◼️' },
  { id: 'etec-boost',      name: 'Boost',     desc: 'Conversion max — badges confiance, preuves sociales, DTC wellness',     emoji: '🚀' },
]

const TONES = [
  { id: 'persuasif',   label: 'Persuasif',     desc: 'Copy de vente direct, urgence, FOMO'           },
  { id: 'premium',     label: 'Premium',       desc: 'Luxe, exclusivité, qualité supérieure'          },
  { id: 'fun',         label: 'Fun & Viral',   desc: 'Casual, émotionnel, adapté réseaux sociaux'     },
  { id: 'informatif',  label: 'Informatif',    desc: 'Factuel, technique, comparatif'                 },
]

const PLATFORMS = [
  { id: 'shopify',      label: 'Shopify',         icon: '🟢' },
  { id: 'woocommerce',  label: 'WooCommerce',      icon: '🟣' },
  { id: 'youcan',       label: 'YouCan',           icon: '🟠' },
  { id: 'standalone',   label: 'Page standalone',  icon: '🔗' },
]

const LANGUAGES = [
  { code: 'fr', flag: '🇫🇷', label: 'Français',   desc: 'Copy optimisé marché FR/BE/CH' },
  { code: 'en', flag: '🇺🇸', label: 'English',    desc: 'US/UK market optimized copy'   },
  { code: 'es', flag: '🇪🇸', label: 'Español',    desc: 'Mercado ES/LATAM'              },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch',    desc: 'DE/AT/CH optimiert'            },
  { code: 'it', flag: '🇮🇹', label: 'Italiano',   desc: 'Mercato IT ottimizzato'        },
  { code: 'pt', flag: '🇧🇷', label: 'Português',  desc: 'Mercado BR/PT'                 },
  { code: 'ar', flag: '🇸🇦', label: 'العربية',    desc: 'سوق الشرق الأوسط'             },
  { code: 'zh', flag: '🇨🇳', label: '中文',       desc: '中国市场优化'                  },
]

// ── Composant StepIndicator ──
function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    const activeEl = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement | null
    if (activeEl) {
      const container = scrollRef.current
      const scrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [current])

  return (
    <div
      ref={scrollRef}
      className="hidden sm:flex items-center gap-0 overflow-x-auto scrollbar-hide pb-1"
      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {labels.map((label, i) => {
        const step = i + 1
        const done   = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center flex-shrink-0" data-active={active ? 'true' : undefined}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={done
                  ? { background: '#7c3aed', color: '#fff' }
                  : active
                  ? { background: '#7c3aed', color: '#fff', boxShadow: '0 0 0 3px rgba(124,58,237,0.2)' }
                  : { background: '#f0f0f5', color: '#8b8b9e' }
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              <span className="text-[10px] font-medium whitespace-nowrap hidden sm:block" style={{ color: active ? '#7c3aed' : '#8b8b9e' }}>
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div className="w-8 md:w-12 h-px mx-1 mb-4 transition-all" style={{ background: done ? '#7c3aed' : '#e3e3e8' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NewPageInner() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const fileInputRef  = useRef<HTMLInputElement>(null)

  const [pageId,       setPageId]       = useState<string | null>(null)
  const [loadingPage,  setLoadingPage]  = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef  = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<Mode>('wizard')
  const [step, setStep] = useState(1)

  // Step 1 — Source
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [url, setUrl]             = useState('')
  const [manual, setManual]       = useState({
    product_name: '', headline: '', subtitle: '',
    price: '', original_price: '', cta: 'Commander maintenant',
  })

  // Step 2 — Photos produit
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  // Step 3 — Vidéos UGC
  const [ugcVideos, setUgcVideos] = useState<string[]>([])
  const [ugcLinks,  setUgcLinks]  = useState<string[]>([''])
  const [ugcTab,    setUgcTab]    = useState(0)

  // Step 4 — Photos Avant/Après
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos,  setAfterPhotos]  = useState<string[]>([])

  // Step 5 — Style & Ton
  const [selectedStyle, setSelectedStyle] = useState('etec-blue')
  const [selectedTone,  setSelectedTone]  = useState('persuasif')

  // Step 6 — Plateforme cible
  const [platform, setPlatform] = useState('shopify')

  // Step 7 — Langue du résultat
  const [resultLang, setResultLang] = useState('fr')

  // Step 8 — Récap + lancement
  const [title,       setTitle]       = useState('')
  const [html,        setHtml]        = useState('')
  const [landingData, setLandingData] = useState<LandingPageData | null>(null)
  const [error,       setError]       = useState<string | null>(null)
  // Warning non-bloquant : affiché quand le scrape a réussi en mode dégradé
  // (titre OU images récupérées mais pas tout). L'user voit la page générée
  // et un message lui suggère de relire/corriger avant publication.
  const [partialWarning, setPartialWarning] = useState<string | null>(null)
  const [saving,      setSaving]      = useState(false)

  // Publication vers store
  const [stores,         setStores]         = useState<any[]>([])
  const [publishOpen,    setPublishOpen]     = useState(false)
  const [publishing,     setPublishing]      = useState<string | null>(null)
  const [publishSuccess, setPublishSuccess]  = useState<{ name: string; url?: string } | null>(null)
  const [publishError,   setPublishError]    = useState<string | null>(null)

  // ── Tracking début wizard (1 seule fois par mount) ──
  useEffect(() => {
    track.newPageWizardStarted()
  }, [])

  // ── Chargement d'une page existante ──
  useEffect(() => {
    const id = searchParams.get('page_id')
    if (!id) return
    setPageId(id)
    setLoadingPage(true)
    const supabase = createClient()
    supabase
      .from('pages')
      .select('id, title, product_url, html_content, json_content, template_id')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setLoadingPage(false); return }
        const json = data.json_content as LandingPageData | null
        if (data.product_url) {
          setInputMode('url')
          setUrl(data.product_url)
        }
        if (json) {
          setManual({
            product_name:   json.product_name || '',
            headline:       json.headline || '',
            subtitle:       json.subtitle || '',
            price:          json.price || '',
            original_price: json.original_price || '',
            cta:            json.cta || 'Commander maintenant',
          })
          setLandingData(json)
          if (json.images?.length) setUploadedPhotos(json.images)
        }
        if (data.template_id) setSelectedStyle(data.template_id)
        if (data.title) setTitle(data.title)
        if (data.html_content) {
          setHtml(data.html_content)
          setMode('editor')
        }
        setLoadingPage(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Chargement stores ──
  useEffect(() => {
    const supabase = createClient()
    supabase.from('stores').select('id, name, platform, store_url').then(({ data }) => {
      setStores(data || [])
    })
  }, [])

  // ── Publication vers store ──
  async function publishToStore(store: any) {
    if (!pageId) return
    setPublishing(store.id)
    setPublishError(null)
    setPublishSuccess(null)
    try {
      const endpoint = store.platform === 'youcan' ? '/api/youcan/push' : store.platform === 'woocommerce' ? '/api/woocommerce/push' : '/api/shopify/push'
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: store.id, page_id: pageId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      // L'API push renvoie data.url (Shopify/Woo/YouCan) — on l'expose dans
      // le toast pour que l'user puisse cliquer "Voir la page publiée".
      setPublishSuccess({ name: store.name, url: json.data?.url })
      setPublishOpen(false)
      track.pagePublished(store.platform as 'shopify' | 'woocommerce' | 'youcan')
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Erreur publication')
    } finally {
      setPublishing(null)
    }
  }

  // ── Upload helper Supabase Storage ──
  // Toutes les photos passent par /api/upload qui pousse sur le bucket
  // pages-images et renvoie une URL publique. On ne stocke JAMAIS de base64
  // côté client (cf bug #3 audit : crash DB sur 3-4 photos).
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function uploadOne(file: File, kind: 'product' | 'before' | 'after'): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'Upload échoué')
    return json.url ?? null
  }

  // ── Gestion upload photos produit ──
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setUploadError(null)
    try {
      for (const file of files) {
        const url = await uploadOne(file, 'product')
        if (url) setUploadedPhotos(prev => [...prev, url])
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur upload')
    } finally {
      setUploading(false)
      e.target.value = '' // permet de réuploader le même fichier
    }
  }

  function removePhoto(index: number) {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // ── Gestion upload vidéos UGC ──
  // Vidéos désactivées : trop lourdes pour le base64, et le storage Supabase
  // n'est pas dimensionné pour des MP4 multi-MB côté MVP. L'utilisateur peut
  // toujours coller des liens YouTube/TikTok via l'onglet "Liens externes".
  // (cf bug #4 audit lancement)
  function handleVideoUpload(_e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError('L\'upload vidéo est temporairement indisponible — utilise l\'onglet "Liens externes" (YouTube, TikTok…)')
  }

  // ── Langue label helper ──
  function getLangLabel(code: string): string {
    const found = LANGUAGES.find(l => l.code === code)
    return found ? `${found.flag} ${found.label}` : code
  }

  // ── Validation URL ──
  // On parse côté front pour éviter le throw "The string did not match the
  // expected pattern" remonté brut par Safari quand l'URL est cassée.
  function isValidHttpUrl(input: string): boolean {
    try {
      const u = new URL(input.trim())
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  // ── Génération ──
  async function generate() {
    if (mode !== 'wizard') return // garde-fou anti double-clic

    if (inputMode === 'url' && !isValidHttpUrl(url)) {
      setError('URL invalide. Colle un lien produit complet commençant par https:// (ex: https://www.aliexpress.com/item/...).')
      return
    }

    setMode('generating')
    setError(null)
    track.newPageWizardCompleted()
    track.generateStarted('dashboard')
    const startedAt = Date.now()
    try {
      const body = inputMode === 'url'
        ? {
            url,
            tone: selectedTone,
            style: selectedStyle,
            ugcVideos: ugcVideos.length > 0 ? '[vidéos uploadées]' : ugcLinks.filter(l => l.trim()),
            beforeAfter: beforePhotos.length > 0 && afterPhotos.length > 0,
            language: resultLang,
          }
        : {
            product: {
              ...manual,
              benefits: [],
              faq: [],
              urgency: '',
              images: uploadedPhotos,
              tone: selectedTone,
            },
            ugcVideos: ugcVideos.length > 0 ? '[vidéos uploadées]' : ugcLinks.filter(l => l.trim()),
            beforeAfter: beforePhotos.length > 0 && afterPhotos.length > 0,
            language: resultLang,
          }

      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const data: LandingPageData = json.data

      // Mismatch produit ↔ template : si le template sélectionné est "themed"
      // (skincare, jewelry, tech…) et qu'on détecte un type différent dans le
      // produit, on warn. Empêche de générer un blender sur velvety.
      const tplMeta = TEMPLATES.find(t => t.id === selectedStyle)
      const detected = detectProductType({
        title: data.product_name,
        description: `${data.headline || ''} ${data.subtitle || ''} ${(data.benefits || []).join(' ')}`,
      })
      const mismatch = !!(tplMeta?.themed && detected && detected !== tplMeta.productType)

      // Mode dégradé : le scrape a marché mais incomplètement. On laisse
      // passer la génération et on affiche un bandeau warning au-dessus de
      // l'éditeur pour que l'user vérifie/complète avant de publier.
      if (mismatch && tplMeta) {
        const tplLabel = PRODUCT_TYPE_LABELS[tplMeta.productType]
        const detectedLabel = PRODUCT_TYPE_LABELS[detected as ProductType]
        setPartialWarning(
          `Template incompatible : "${tplMeta.name}" est conçu pour ${tplLabel}, ton produit ressemble plutôt à ${detectedLabel}. Le rendu peut afficher du contenu hors-sujet — change de template (Blue, Solo, Starter, Hue, Ella sont universels).`
        )
      } else if (json.partial) {
        setPartialWarning(
          json.warning
            ? `Scrape partiel : ${json.warning}. Vérifie le titre, le prix et les images avant de publier.`
            : 'Scrape partiel — vérifie le titre, le prix et les images avant de publier.'
        )
      } else {
        setPartialWarning(null)
      }

      if (uploadedPhotos.length > 0) {
        data.images = [...uploadedPhotos, ...(data.images || [])]
      }
      track.generateCompleted('dashboard', Date.now() - startedAt)
      track.pageGenerated('dashboard')
      setLandingData(data)
      const pageTitle = data.product_name || 'Nouvelle page'
      setTitle(pageTitle)

      const { renderTemplate } = await import('@/lib/templates')
      const generatedHtml = renderTemplate(selectedStyle, data)
      setHtml(generatedHtml)
      setMode('editor')

      // Autosave silencieux : si pas encore de pageId (nouvelle page),
      // on crée la draft en DB tout de suite. Sans ça, le bouton Publier
      // est caché tant que l'user n'a pas cliqué Save manuellement —
      // énorme friction à la conversion (cf bug #10 audit lancement).
      if (!pageId) {
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: inserted, error: insertErr } = await supabase
              .from('pages')
              .insert({
                user_id:      user.id,
                title:        pageTitle,
                product_url:  inputMode === 'url' ? url : null,
                html_content: generatedHtml,
                json_content: data,
                template_id:  selectedStyle,
                status:       'draft',
              })
              .select('id')
              .single()
            if (!insertErr && inserted?.id) {
              setPageId(inserted.id)
              // Met à jour l'URL pour que F5 recharge bien la page
              window.history.replaceState(null, '', `/dashboard/new?page_id=${inserted.id}`)
            }
          }
        } catch (autosaveErr) {
          // Non bloquant : l'user pourra toujours Save manuellement
          console.warn('[autosave]', autosaveErr)
        }
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Erreur'
      track.generateFailed('dashboard', reason)
      setError(reason)
      setMode('wizard')
    }
  }

  async function savePage(savedHtml: string) {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      if (pageId) {
        // Mode édition — mise à jour de la page existante
        await supabase.from('pages').update({
          title:        title || 'Nouvelle page',
          html_content: savedHtml,
          json_content: landingData,
          template_id:  selectedStyle,
        }).eq('id', pageId)
      } else {
        // Nouvelle page
        await supabase.from('pages').insert({
          user_id:      user.id,
          title:        title || 'Nouvelle page',
          product_url:  inputMode === 'url' ? url : null,
          html_content: savedHtml,
          json_content: landingData,
          template_id:  selectedStyle,
          status:       'draft',
        })
      }
      router.push('/dashboard/pages')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  function changeTemplate(id: string) {
    setSelectedStyle(id)
    if (landingData) {
      import('@/lib/templates').then(({ renderTemplate }) => {
        setHtml(renderTemplate(id, landingData))
      })
    }
  }

  // ── Chargement page existante ──
  if (loadingPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ minHeight: '60vh' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7c3aed' }} />
        <p className="text-[14px] font-semibold" style={{ color: '#5c5c7a' }}>Chargement de la page...</p>
      </div>
    )
  }

  // ── Vue éditeur ──
  if (mode === 'editor') {
    return (
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center justify-between px-4 border-b bg-white flex-shrink-0" style={{ borderColor: '#E3E3E8' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('wizard')}
              className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={{ color: '#8b8b9e' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-[13px] font-bold bg-transparent focus:outline-none border-b border-transparent focus:border-purple-400"
              style={{ color: '#1a1a2e' }}
              placeholder="Titre de la page"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => changeTemplate(t.id)}
                  className="text-[12px] px-2.5 py-1 rounded-lg font-semibold transition-all"
                  style={selectedStyle === t.id
                    ? { background: '#7c3aed', color: '#fff' }
                    : { color: '#5c5c7a', background: '#F6F6F7' }
                  }
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Bouton Publier */}
            {stores.length > 0 && pageId && (
              <div className="relative">
                <button
                  onClick={() => setPublishOpen(o => !o)}
                  className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Publier
                  <ChevronDown className="w-3 h-3" />
                </button>
                {publishOpen && (
                  <div
                    className="absolute top-9 right-0 rounded-xl overflow-hidden z-50 min-w-[200px]"
                    style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  >
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                      Choisir un store
                    </div>
                    {stores.map(store => {
                      const isShopify = store.platform === 'shopify'
                      const isYouCan  = store.platform === 'youcan'
                      const color     = isShopify ? '#16a34a' : isYouCan ? '#f97316' : '#7c3aed'
                      const icon      = isShopify ? '🟢' : isYouCan ? '🟠' : '🟣'
                      return (
                        <button
                          key={store.id}
                          onClick={() => publishToStore(store)}
                          disabled={!!publishing}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span>{icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold truncate" style={{ color: '#111' }}>{store.name}</div>
                            <div className="text-[11px] font-semibold capitalize" style={{ color }}>{store.platform}</div>
                          </div>
                          {publishing === store.id && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color }} />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <BuilderLoader html={html} onSave={savePage} />
        </div>
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}
        {partialWarning && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xl bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm shadow-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="flex-1">{partialWarning}</span>
            <button onClick={() => setPartialWarning(null)} className="text-amber-600 hover:text-amber-900" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl p-3 text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            Sauvegarde...
          </div>
        )}
        {publishSuccess && (
          <div
            className="fixed bottom-4 right-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm max-w-sm shadow-lg"
            style={{ background: '#fff', border: '1px solid rgba(22,163,74,0.3)', color: '#166534' }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
            <div className="flex-1">
              <div className="font-bold mb-0.5">Publié sur {publishSuccess.name} !</div>
              {publishSuccess.url ? (
                <a
                  href={publishSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold underline"
                  style={{ color: '#16a34a' }}
                >
                  Voir la page publiée
                  <ChevronRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs" style={{ color: '#6b7280' }}>Disponible dans ton admin store</span>
              )}
            </div>
            <button
              onClick={() => setPublishSuccess(null)}
              className="flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ color: '#9ca3af' }}
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {publishError && (
          <div
            className="fixed bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}
            onClick={() => setPublishError(null)}
          >
            <AlertCircle className="w-4 h-4" />
            {publishError}
          </div>
        )}
        {publishOpen && <div className="fixed inset-0 z-40" onClick={() => setPublishOpen(false)} />}
      </div>
    )
  }

  // ── Vue génération ──
  if (mode === 'generating') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: '#1a1a2e' }}>Génération en cours...</h2>
          <p className="text-[13px] mb-8" style={{ color: '#8b8b9e' }}>L'IA crée ta page produit premium</p>
          <div className="w-64 mx-auto space-y-3">
            {['Analyse du produit', 'Rédaction du copy', 'Application du design', 'Optimisation conversion'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[13px]" style={{ color: '#5c5c7a' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f3f0ff' }}>
                  <Loader2 className="w-2.5 h-2.5 text-purple-600 animate-spin" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Wizard ──
  const STEP_LABELS = ['Source', 'Photos', 'Vidéos', 'Avant/Après', 'Style', 'Plateforme', 'Langue', 'Lancer']
  const canProceed  = step === 1
    ? (inputMode === 'url' ? isValidHttpUrl(url) : manual.product_name.trim().length > 0)
    : true

  const progressPct = ((step - 1) / 7) * 100
  const nextLabel   = step < 8 ? STEP_LABELS[step] : null

  return (
    <div className="min-h-full" style={{ background: '#F6F6F7' }}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#E3E3E8' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: '#8b8b9e' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#c4c4d0' }} />
            <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Nouvelle page</span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>
                Étape {step}/8 — {STEP_LABELS[step - 1]}
              </span>
              {nextLabel && (
                <span className="text-[12px]" style={{ color: '#8b8b9e' }}>
                  Suivant : {nextLabel}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e8e8f0' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: '#5B47F5' }}
              />
            </div>
          </div>

          <StepIndicator current={step} total={8} labels={STEP_LABELS} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* ── STEP 1 : Source ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Source du produit</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>D'où vient le produit que tu veux mettre en avant ?</p>

            {/* Toggle */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'url',    label: 'URL produit',    icon: Link2,  desc: 'AliExpress, Amazon, Shopify, Etsy, eBay…' },
                { id: 'manual', label: 'Saisie manuelle', icon: Pencil, desc: 'Entre les infos du produit à la main'          },
              ].map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => setInputMode(id as InputMode)}
                  className="flex-1 p-4 rounded-xl text-left border-2 transition-all"
                  style={inputMode === id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" style={{ color: inputMode === id ? '#7c3aed' : '#5c5c7a' }} />
                    <span className="text-[13px] font-bold" style={{ color: inputMode === id ? '#7c3aed' : '#1a1a2e' }}>{label}</span>
                  </div>
                  <p className="text-[12px]" style={{ color: '#8b8b9e' }}>{desc}</p>
                </button>
              ))}
            </div>

            {inputMode === 'url' ? (
              <div>
                <label className="block text-[13px] font-bold mb-1.5" style={{ color: '#1a1a2e' }}>URL du produit</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://aliexpress.com/item/... ou ton-store.myshopify.com/products/..."
                  className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none transition-all"
                  style={{ borderColor: url ? '#7c3aed' : '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
                />
                <p className="text-[12px] mt-1.5" style={{ color: '#8b8b9e' }}>Compatible AliExpress, Amazon, Alibaba, Shopify (.myshopify.com), Etsy, eBay, Cdiscount, Fnac, Temu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'product_name',   label: 'Nom du produit *',         placeholder: 'Montre connectée sport Pro X'                 },
                  { key: 'headline',       label: 'Accroche principale',       placeholder: 'Transforme ta routine fitness en 1 geste'     },
                  { key: 'subtitle',       label: 'Sous-titre',                placeholder: 'GPS intégré, 7 jours d\'autonomie, waterproof' },
                  { key: 'price',          label: 'Prix de vente',             placeholder: '49,99€'                                       },
                  { key: 'original_price', label: 'Prix barré (optionnel)',    placeholder: '89,99€'                                       },
                  { key: 'cta',            label: 'Texte du bouton CTA',       placeholder: 'Commander maintenant'                         },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[13px] font-bold mb-1" style={{ color: '#1a1a2e' }}>{label}</label>
                    <input
                      value={manual[key as keyof typeof manual]}
                      onChange={e => setManual({ ...manual, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
                      style={{ borderColor: '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
                      onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                      onBlur={e  => (e.target.style.borderColor = '#E3E3E8')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 : Photos produit ── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Tes photos produit</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Tu as déjà des photos ? Uploade-les pour les intégrer directement dans ta page.</p>

            {/* Drop zone */}
            <div
              className="border-2 border-dashed rounded-2xl p-10 text-center mb-4 cursor-pointer transition-all"
              style={{ borderColor: '#c4b5fd', background: '#faf9ff' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#f3f0ff' }}>
                <Upload className="w-6 h-6" style={{ color: '#7c3aed' }} />
              </div>
              <p className="font-bold text-[14px] mb-1" style={{ color: '#1a1a2e' }}>Glisse tes photos ici</p>
              <p className="text-[12px]" style={{ color: '#8b8b9e' }}>ou clique pour sélectionner · JPG, PNG, WEBP · max 5 photos</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Preview photos */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {uploadedPhotos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden" style={{ border: '1px solid #E3E3E8' }}>
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.6)' }}
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedPhotos.length === 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#16a34a' }} />
                <p className="text-[12px]" style={{ color: '#15803d' }}>Sans photo, l'IA utilisera automatiquement les images scrappées depuis l'URL produit.</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3 : Vidéos UGC ── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Vidéos UGC</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Ajoute des vidéos clients, unboxing ou reviews pour booster la confiance.</p>

            {/* Tabs upload / liens */}
            <div className="flex gap-2 mb-5">
              {['Upload', 'Liens externes'].map((tab, i) => (
                <button key={tab} onClick={() => setUgcTab(i)}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
                  style={ugcTab === i ? { background: '#7c3aed', color: '#fff' } : { background: '#F6F6F7', color: '#5c5c7a' }}>
                  {tab}
                </button>
              ))}
            </div>

            {ugcTab === 0 ? (
              <div>
                <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer mb-4"
                  style={{ borderColor: '#c4b5fd', background: '#faf9ff' }}
                  onClick={() => videoInputRef.current?.click()}>
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="font-bold text-[14px] mb-1" style={{ color: '#1a1a2e' }}>Glisse tes vidéos ici</p>
                  <p className="text-[12px]" style={{ color: '#8b8b9e' }}>MP4, MOV, AVI · max 100MB par vidéo</p>
                  <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideoUpload} />
                </div>
                {ugcVideos.length > 0 && (
                  <div className="space-y-2">
                    {ugcVideos.map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8f8fc', border: '1px solid #E3E3E8' }}>
                        <span className="text-lg">🎥</span>
                        <span className="flex-1 text-[13px] font-medium truncate" style={{ color: '#1a1a2e' }}>Vidéo {i + 1}</span>
                        <button onClick={() => setUgcVideos(prev => prev.filter((__, j) => j !== i))}
                          className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#fee2e2' }}>
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {ugcLinks.map((link, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={link}
                      onChange={e => { const n = [...ugcLinks]; n[i] = e.target.value; setUgcLinks(n) }}
                      placeholder="https://youtube.com/... ou tiktok.com/..."
                      className="flex-1 border rounded-xl px-4 py-2.5 text-[13px] outline-none"
                      style={{ borderColor: '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
                      onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                      onBlur={e => (e.target.style.borderColor = '#E3E3E8')}
                    />
                    {ugcLinks.length > 1 && (
                      <button onClick={() => setUgcLinks(prev => prev.filter((_, j) => j !== i))}
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fee2e2' }}>
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setUgcLinks(prev => [...prev, ''])}
                  className="text-[13px] font-semibold flex items-center gap-1.5 mt-2"
                  style={{ color: '#7c3aed' }}>
                  <span className="text-lg">+</span> Ajouter un lien
                </button>
              </div>
            )}

            <div className="mt-5 p-3 rounded-xl flex items-start gap-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <span className="text-lg">📈</span>
              <p className="text-[12px]" style={{ color: '#15803d' }}>Les vidéos UGC augmentent les conversions de <strong>+34%</strong> en moyenne. Même une courte vidéo fait la différence.</p>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="mt-4 text-[12px] font-medium w-full text-center py-2 rounded-xl transition-all"
              style={{ color: '#8b8b9e', background: 'transparent' }}
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* ── STEP 4 : Photos Avant/Après ── */}
        {step === 4 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Photos Avant / Après</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Les comparaisons avant/après sont les preuves visuelles les plus persuasives.</p>

            <div className="grid grid-cols-2 gap-4">
              {/* AVANT */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black" style={{ background: '#fee2e2', color: '#ef4444' }}>A</div>
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Avant</span>
                </div>
                <div
                  className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer mb-3"
                  style={{ borderColor: '#fca5a5', background: '#fff5f5', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => beforeInputRef.current?.click()}
                >
                  {beforePhotos.length === 0 ? (
                    <>
                      <span className="text-3xl mb-1">📸</span>
                      <p className="text-[12px] font-bold" style={{ color: '#ef4444' }}>Photo AVANT</p>
                    </>
                  ) : (
                    <img src={beforePhotos[0]} className="w-full rounded-xl object-cover" style={{ maxHeight: '100px' }} alt="Avant" />
                  )}
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (!f) return
                      setUploading(true)
                      setUploadError(null)
                      try {
                        const url = await uploadOne(f, 'before')
                        if (url) setBeforePhotos([url])
                      } catch (err) {
                        setUploadError(err instanceof Error ? err.message : 'Erreur upload')
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                </div>
              </div>

              {/* APRÈS */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black" style={{ background: '#dcfce7', color: '#16a34a' }}>A</div>
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Après</span>
                </div>
                <div
                  className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer mb-3"
                  style={{ borderColor: '#86efac', background: '#f0fdf4', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => afterInputRef.current?.click()}
                >
                  {afterPhotos.length === 0 ? (
                    <>
                      <span className="text-3xl mb-1">✨</span>
                      <p className="text-[12px] font-bold" style={{ color: '#16a34a' }}>Photo APRÈS</p>
                    </>
                  ) : (
                    <img src={afterPhotos[0]} className="w-full rounded-xl object-cover" style={{ maxHeight: '100px' }} alt="Après" />
                  )}
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (!f) return
                      setUploading(true)
                      setUploadError(null)
                      try {
                        const url = await uploadOne(f, 'after')
                        if (url) setAfterPhotos([url])
                      } catch (err) {
                        setUploadError(err instanceof Error ? err.message : 'Erreur upload')
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Aperçu comparaison */}
            {beforePhotos.length > 0 && afterPhotos.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl" style={{ background: '#f8f8fc', border: '1px solid #E3E3E8' }}>
                <p className="text-[12px] font-bold mb-3 text-center" style={{ color: '#5c5c7a' }}>Aperçu de la comparaison</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <img src={beforePhotos[0]} className="w-full rounded-xl object-cover" style={{ aspectRatio: '1/1' }} alt="Avant" />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-black" style={{ background: '#ef4444', color: '#fff' }}>AVANT</div>
                  </div>
                  <div className="relative">
                    <img src={afterPhotos[0]} className="w-full rounded-xl object-cover" style={{ aspectRatio: '1/1' }} alt="Après" />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-black" style={{ background: '#16a34a', color: '#fff' }}>APRÈS</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl flex items-start gap-3" style={{ background: '#faf9ff', border: '1px solid #ddd6fe' }}>
              <span>💡</span>
              <p className="text-[12px]" style={{ color: '#5b21b6' }}>Ces photos seront automatiquement intégrées dans une section "Transformation" sur ta page produit.</p>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="mt-4 text-[12px] font-medium w-full text-center py-2 rounded-xl transition-all"
              style={{ color: '#8b8b9e', background: 'transparent' }}
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* ── STEP 5 : Style & Ton ── */}
        {step === 5 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Style & Ton de ta page</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Choisis le style visuel et le ton du copy IA.</p>

            <label className="block text-[13px] font-bold mb-3" style={{ color: '#1a1a2e' }}>Style visuel</label>
            <div className="space-y-2 mb-6">
              {STYLES.map(s => {
                const tpl = TEMPLATES.find(t => t.id === s.id)
                const isUniversal = tpl?.productType === 'universal' || tpl?.themed === false
                const productLabel = tpl ? PRODUCT_TYPE_LABELS[tpl.productType] : null
                return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                  style={selectedStyle === s.id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>{s.name}</span>
                      {s.id === 'etec-blue' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#d97706' }}>POPULAIRE</span>
                      )}
                      {productLabel && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={isUniversal
                          ? { background: '#ecfdf5', color: '#047857' }
                          : { background: '#f3e8ff', color: '#6d28d9' }
                        }>{productLabel}</span>
                      )}
                    </div>
                    <p className="text-[12px]" style={{ color: '#8b8b9e' }}>{s.desc}</p>
                  </div>
                  {selectedStyle === s.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#7c3aed' }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )})}
            </div>

            <label className="block text-[13px] font-bold mb-3" style={{ color: '#1a1a2e' }}>Ton du copywriting IA</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={selectedTone === t.id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <div className="text-[13px] font-bold mb-0.5" style={{ color: selectedTone === t.id ? '#7c3aed' : '#1a1a2e' }}>{t.label}</div>
                  <div className="text-[11px]" style={{ color: '#8b8b9e' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6 : Plateforme ── */}
        {step === 6 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Plateforme cible</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Où vas-tu publier cette page ?</p>

            <div className="space-y-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all"
                  style={platform === p.id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex-1">
                    <span className="text-[14px] font-bold" style={{ color: '#1a1a2e' }}>{p.label}</span>
                  </div>
                  {platform === p.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#7c3aed' }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ background: '#f3f0ff', border: '1px solid #ddd6fe' }}>
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#7c3aed' }} />
                <p className="text-[12px]" style={{ color: '#5b21b6' }}>
                  Après génération, tu pourras publier en 1 clic directement depuis l'éditeur. Assure-toi d'avoir connecté ton store dans <strong>Mes stores</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7 : Langue du résultat ── */}
        {step === 7 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Langue de la page</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Dans quelle langue veux-tu que l'IA génère le contenu de ta page ?</p>

            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(({ code, flag, label, desc }) => (
                <button key={code} onClick={() => setResultLang(code)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
                  style={resultLang === code
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }}>
                  <span className="text-2xl">{flag}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold" style={{ color: resultLang === code ? '#7c3aed' : '#1a1a2e' }}>{label}</div>
                    <div className="text-[11px]" style={{ color: '#8b8b9e' }}>{desc}</div>
                  </div>
                  {resultLang === code && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 8 : Récap ── */}
        {step === 8 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Tout est prêt !</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Vérifie tes choix avant de lancer la génération.</p>

            <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid #E3E3E8' }}>
              {[
                { label: 'Source',      value: inputMode === 'url' ? (url || '—') : (manual.product_name || '—') },
                { label: 'Photos',      value: uploadedPhotos.length > 0 ? `${uploadedPhotos.length} photo(s) uploadée(s)` : 'Auto (depuis URL)' },
                { label: 'Vidéos UGC',  value: ugcVideos.length > 0 ? `${ugcVideos.length} vidéo(s)` : ugcLinks.filter(l => l.trim()).length > 0 ? `${ugcLinks.filter(l => l.trim()).length} lien(s)` : 'Aucune' },
                { label: 'Avant/Après', value: beforePhotos.length > 0 && afterPhotos.length > 0 ? 'Activé ✓' : 'Non ajouté' },
                { label: 'Style',       value: STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle },
                { label: 'Ton',         value: TONES.find(t => t.id === selectedTone)?.label || selectedTone },
                { label: 'Plateforme',  value: PLATFORMS.find(p => p.id === platform)?.label || platform },
                { label: 'Langue',      value: getLangLabel(resultLang) },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex items-center justify-between px-4 py-3"
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: i < 7 ? '1px solid #E3E3E8' : 'none' }}>
                  <span className="text-[13px] font-medium" style={{ color: '#8b8b9e' }}>{label}</span>
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[13px] mb-4">{error}</div>
            )}

            <button
              onClick={generate}
              disabled={mode !== 'wizard'}
              className="w-full font-bold py-4 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Générer ma page avec l'IA
            </button>
            <p className="text-center text-[12px] mt-2" style={{ color: '#8b8b9e' }}>L'IA travaille — patiente 30 à 60 secondes</p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ color: '#5c5c7a', background: '#fff', border: '1px solid #E3E3E8' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 1 ? 'Annuler' : 'Précédent'}
          </button>

          {step < 8 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all"
              style={canProceed
                ? { background: '#1a1a2e', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                : { background: '#E3E3E8', color: '#8b8b9e', cursor: 'not-allowed' }
              }
            >
              Suivant
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>}>
      <NewPageInner />
    </Suspense>
  )
}
