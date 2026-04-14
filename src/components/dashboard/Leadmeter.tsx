'use client'

import { useMemo } from 'react'
import { Target } from 'lucide-react'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Criterion {
  id: string
  label: string
  hint: string
  points: number
  passed: boolean
}

/* ─────────────────────────────────────────────
   ANALYSE HTML → CRITÈRES
───────────────────────────────────────────── */
function analyzeHtml(html: string): Criterion[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const bodyHtml = doc.body?.innerHTML ?? ''
  const getText = (el: Element | null) => el?.textContent?.trim() ?? ''

  // 1. H1 présent et > 5 mots (+15)
  const h1 = doc.querySelector('h1')
  const h1Words = getText(h1).split(/\s+/).filter(Boolean)
  const hasH1 = h1Words.length > 5

  // 2. Sous-titre ou accroche présent (+10)
  const h2 = doc.querySelector('h2, h3, [class*="subtitle"], [class*="subheadline"], [class*="tagline"]')
  const firstP = doc.querySelector('p')
  const hasSubtitle = !!(h2 || (firstP && getText(firstP).length > 20))

  // 3. Bouton CTA avec mot d'action (+15)
  const ACTION_RE = /acheter|commander|essayer|commencer|obtenir|s['']inscrire|rejoindre|d[eé]couvrir|t[eé]l[eé]charger|get|buy|order|start|try|download|shop|ajouter au panier|add to cart/i
  const clickables = doc.querySelectorAll('button, a, [class*="btn"], [class*="cta"]')
  const hasCTA = Array.from(clickables).some(el => ACTION_RE.test(getText(el)))

  // 4. Image produit présente (+10)
  const hasImage = doc.querySelectorAll('img').length > 0

  // 5. Preuve sociale (+10)
  const PROOF_RE = /avis|[eé]toile|star|review|t[eé]moignage|client|⭐|★|\d+\s*(avis|reviews?|clients?)/i
  const hasProof = PROOF_RE.test(bodyHtml)

  // 6. Prix affiché clairement (+10)
  const PRICE_RE = /\d[\d\s,.]*\s*(€|\$|£|EUR|USD|CHF)|prix|price/i
  const hasPrice = PRICE_RE.test(bodyHtml)

  // 7. Urgence / scarcité (+10)
  const URGENCY_RE = /stock limit[eé]|derni[eè]res pi[eè]ces|offre limit[eé]e|expire|compte.?[aà].?rebours|timer|urgent|aujourd.?hui seulement|limited stock|hurry|countdown|\d+\s*h\s*\d+\s*m|ends in/i
  const hasUrgency = URGENCY_RE.test(bodyHtml)

  // 8. Garantie mentionnée (+5)
  const GUARANTEE_RE = /garantie|rembours[eé]|satisfait|sans risque|guarantee|money.?back|refund|\d+\s*jours?/i
  const hasGuarantee = GUARANTEE_RE.test(bodyHtml)

  // 9. Meta viewport présent (+5)
  const hasViewport = !!doc.querySelector('meta[name="viewport"]')

  // 10. Moins de 3 liens de fuite (+10)
  const externalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
    const href = a.getAttribute('href') ?? ''
    return href.startsWith('http') || href.startsWith('//')
  })
  const fewLeaks = externalLinks.length < 3

  return [
    { id: 'h1',        label: 'Titre H1',           hint: 'Ajoute un H1 avec au moins 6 mots clairs',              points: 15, passed: hasH1 },
    { id: 'subtitle',  label: 'Accroche',            hint: 'Ajoute un H2 ou un paragraphe d\'accroche',             points: 10, passed: hasSubtitle },
    { id: 'cta',       label: 'Bouton CTA',          hint: 'Bouton avec "Acheter", "Commander", "Essayer"…',        points: 15, passed: hasCTA },
    { id: 'image',     label: 'Image produit',       hint: 'Ajoute une image de ton produit',                       points: 10, passed: hasImage },
    { id: 'proof',     label: 'Preuve sociale',      hint: 'Ajoute des étoiles, avis ou témoignages clients',       points: 10, passed: hasProof },
    { id: 'price',     label: 'Prix visible',        hint: 'Affiche clairement le prix du produit',                 points: 10, passed: hasPrice },
    { id: 'urgency',   label: 'Urgence / scarcité',  hint: 'Timer ou mention "Stock limité" / "Offre limitée"',     points: 10, passed: hasUrgency },
    { id: 'guarantee', label: 'Garantie',            hint: 'Mentionne "Satisfait ou remboursé" ou garantie X jours', points: 5,  passed: hasGuarantee },
    { id: 'viewport',  label: 'Mobile responsive',   hint: 'Meta viewport doit être présente dans le HTML',         points: 5,  passed: hasViewport },
    { id: 'leaks',     label: 'Peu de liens fuite',  hint: 'Retire les liens de navigation/footer superflus',       points: 10, passed: fewLeaks },
  ]
}

/* ─────────────────────────────────────────────
   SCORE PUBLIC (utilisé par GrapesEditor)
───────────────────────────────────────────── */
export function computeLeadmeterScore(html: string) {
  if (typeof window === 'undefined') return { score: 0, criteria: [] as Criterion[] }
  const criteria = analyzeHtml(html)
  const score = criteria.filter(c => c.passed).reduce((sum, c) => sum + c.points, 0)
  return { score, criteria }
}

/* ─────────────────────────────────────────────
   COMPOSANT
───────────────────────────────────────────── */
interface Props {
  html: string
}

export default function Leadmeter({ html }: Props) {
  const { score, criteria } = useMemo(() => {
    if (!html || typeof window === 'undefined') return { score: 0, criteria: [] as Criterion[] }
    return computeLeadmeterScore(html)
  }, [html])

  // Couleur dynamique
  const color    = score >= 71 ? '#10b981' : score >= 41 ? '#f59e0b' : '#ef4444'
  const bgColor  = score >= 71 ? 'rgba(16,185,129,0.1)' : score >= 41 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
  const label    = score >= 90 ? 'Excellent' : score >= 71 ? 'Bon' : score >= 41 ? 'Moyen' : 'Faible'

  const passed      = criteria.filter(c => c.passed)
  const suggestions = criteria.filter(c => !c.passed).slice(0, 3)

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white border-l border-gray-100" style={{ minWidth: 228, maxWidth: 228 }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Leadmeter</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: bgColor, color }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">

        {/* Score + barre */}
        <div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-black leading-none" style={{ color }}>{score}</span>
            <span className="text-sm text-gray-300 mb-0.5 font-semibold">/100</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
            />
          </div>
        </div>

        {/* Critères — dots */}
        <div>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">
            {passed.length}/{criteria.length} critères
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {criteria.map(c => (
              <div
                key={c.id}
                title={`${c.label} (+${c.points}pts)`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ background: c.passed ? color : '#e5e7eb' }}
              />
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-gray-100" />

        {/* Checklist complète */}
        <div className="flex flex-col gap-2">
          {criteria.map(c => (
            <div key={c.id} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  background: c.passed ? color : 'transparent',
                  border: c.passed ? `2px solid ${color}` : '2px solid #d1d5db',
                }}
              >
                {c.passed && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-semibold leading-none"
                  style={{ color: c.passed ? '#111827' : '#9ca3af' }}
                >
                  {c.label}
                </span>
                <span
                  className="text-[9px] ml-1 font-bold"
                  style={{ color: c.passed ? color : '#d1d5db' }}
                >
                  +{c.points}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <>
            <div className="h-px bg-gray-100" />
            <div className="flex flex-col gap-2">
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                À améliorer
              </p>
              {suggestions.map(s => (
                <div
                  key={s.id}
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: '#fafafa', border: '1px solid #f3f4f6' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-[11px] text-gray-500 leading-snug">{s.hint}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Score parfait */}
        {score === 100 && (
          <div
            className="text-center py-3 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}
          >
            <Target className="inline w-3.5 h-3.5 mr-1" /> Page parfaite !
          </div>
        )}
      </div>
    </div>
  )
}
