import Link from 'next/link'
import { faqSchema, jsonLd } from '@/lib/schema'
import { Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { TEMPLATE_COUNT } from '@/lib/templates'
import PricingHeroAndPlans from '@/components/marketing/pricing/PricingHeroAndPlans'
import PricingFaqAccordion from '@/components/marketing/pricing/PricingFaqAccordion'

/* ─── COMPARE ROWS — KONVERT vs DIY vs Freelance ────────────────────── */
const COMPARE_ROWS = [
  { label: 'Temps par page produit',  konvert: '30 secondes',      diy: '2-4 heures',        freelance: '2-5 jours' },
  { label: 'Coût par page',           konvert: '< 0,15€',          diy: 'Temps = argent',     freelance: '150-500€' },
  { label: 'Qualité copy',            konvert: 'IA e-commerce',    diy: 'Variable',            freelance: 'Variable selon profil' },
  { label: 'Intégration Shopify',     konvert: '1 clic natif',     diy: 'Manuel + code',      freelance: 'Dépend du freelance' },
  { label: 'A/B testing',             konvert: 'Intégré',          diy: 'Outil externe payant', freelance: 'Non inclus' },
  { label: 'Scalabilité',             konvert: 'Illimitée',        diy: 'Limitée par le temps', freelance: 'Coût x pages' },
  { label: 'Analytics intégrés',      konvert: 'Oui (Pro+)',       diy: 'Non',                freelance: 'Non inclus' },
  { label: 'Support',                 konvert: 'Dédié inclus',     diy: 'Seul',               freelance: 'Hors contrat' },
]

/* ─── FAQ CONTENT (réutilisé par UI + Schema FAQPage) ─────────────────── */
const PRICING_FAQ = [
  {
    q: 'Puis-je changer de plan à tout moment ?',
    a: 'Oui. Tu peux upgrader ou downgrader depuis ton dashboard à tout moment. Le changement prend effet immédiatement et le prorata est calculé automatiquement par Stripe.',
  },
  {
    q: 'Comment fonctionne la facturation annuelle ?',
    a: 'En choisissant le plan annuel, tu paies 12 mois en avance et bénéficies d\'une réduction de 25%. Une seule facture est émise au moment du paiement.',
  },
  {
    q: 'Que se passe-t-il si je dépasse mon quota mensuel ?',
    a: 'La génération est temporairement suspendue jusqu\'à la prochaine période de facturation. Tu peux upgrader ton plan à tout moment pour débloquer immédiatement plus de pages.',
  },
  {
    q: 'Y a-t-il une période d\'essai gratuite ?',
    a: 'Oui — tu peux générer 1 page produit gratuitement sans créer de compte. Aucune carte bancaire, résultat immédiat. Si la page te convainc, tu choisis un plan pour l\'utiliser sur ta boutique.',
  },
  {
    q: 'Comment annuler mon abonnement ?',
    a: 'Tu peux annuler depuis Paramètres → Abonnement dans ton dashboard, en quelques clics. L\'accès est maintenu jusqu\'à la fin de ta période payée.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org FAQPage — pour rich snippet Google + AI Overviews
          (questions en regex sont chargées avec PRICING_FAQ ci-dessus). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(faqSchema(PRICING_FAQ.map((f) => ({ question: f.q, answer: f.a })))),
        }}
      />

      {/* ── HERO + TOGGLE + CARTES PLANS (checkout Stripe, état client) ──── */}
      <PricingHeroAndPlans />

      {/* ── COMPARATIF FEATURES ──────────────────────────────────────────── */}
      <div className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>
            Comparatif des fonctionnalités
          </h2>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-4 col-span-1" />
              {[
                { label: 'Starter', highlight: false, dark: false },
                { label: 'Pro', highlight: true, dark: false },
                { label: 'Agency', highlight: false, dark: false },
                { label: 'Enterprise', highlight: false, dark: true },
              ].map(({ label, highlight, dark }) => (
                <div
                  key={label}
                  className="p-4 text-center font-black text-sm"
                  style={
                    highlight
                      ? { background: '#f0fdf4', color: '#16a34a' }
                      : dark
                      ? { background: '#111827', color: '#ffffff' }
                      : { color: '#374151' }
                  }
                >
                  {label}
                  {highlight && (
                    <div className="text-[10px] font-semibold text-green-500 mt-0.5">Recommandé</div>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              { feature: 'Pages / mois',     values: ['75', '300', 'Illimitées', 'Illimitées'] },
              { feature: 'Stores connectés', values: ['2', '7', 'Illimités', 'Illimités'] },
              { feature: 'Templates',        values: [`${TEMPLATE_COUNT}+`, 'Tous', 'Tous', 'Tous'] },
              { feature: 'Copy AI',          values: [true, true, true, true] },
              { feature: 'Export HTML',      values: [true, true, true, true] },
              { feature: 'Analytics',        values: [false, true, true, true] },
              { feature: 'White-label',      values: [false, false, true, true] },
              { feature: 'Multi-clients',    values: [false, false, true, true] },
              { feature: 'Rapports PDF',     values: [false, false, true, true] },
              { feature: 'SLA garanti',      values: [false, false, false, true] },
              { feature: 'Account manager', values: [false, false, false, true] },
              { feature: 'Support',          values: ['Email 48h', 'Prioritaire 24h', 'Dédié', 'Dédié + SLA'] },
            ].map(({ feature, values }, rowIdx) => (
              <div
                key={feature}
                className="grid grid-cols-5 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                style={{ borderBottomColor: rowIdx === 12 ? 'transparent' : undefined }}
              >
                <div className="p-3.5 text-sm text-gray-600 font-medium">{feature}</div>
                {values.map((val, i) => (
                  <div
                    key={i}
                    className="p-3.5 text-center"
                    style={
                      i === 1
                        ? { background: 'rgba(240,253,244,0.4)' }
                        : i === 3
                        ? { background: 'rgba(17,24,39,0.04)' }
                        : {}
                    }
                  >
                    {typeof val === 'boolean' ? (
                      val
                        ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                        : <span className="text-gray-200 text-lg">—</span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPARATIF KONVERT vs DIY vs FREELANCE ───────────────────────── */}
      <div className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>
            KONVERT vs Faire soi-même vs Freelance
          </h2>

          {/* Header colonnes — Desktop uniquement */}
          <div className="hidden md:grid grid-cols-4 gap-3 mb-3 px-2">
            <div />
            <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
              <p className="text-white font-black text-sm">KONVERT</p>
              <p className="text-white/70 text-xs mt-0.5">La solution IA</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Faire soi-même</p>
              <p className="text-gray-400 text-xs mt-0.5">DIY</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Freelance</p>
              <p className="text-gray-400 text-xs mt-0.5">Agence / Indépendant</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-100">

            {/* VERSION MOBILE (< md) : cards empilées par critère */}
            <div className="md:hidden space-y-3 p-4">
              {COMPARE_ROWS.map((row) => (
                <div key={row.label} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-gray-100">
                    <span className="text-xs font-bold text-slate-700">{row.label}</span>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-100">
                    <div className="px-3 py-3 flex flex-col gap-0.5" style={{ background: 'rgba(91,71,245,0.04)' }}>
                      <span className="text-[10px] font-bold text-[#5B47F5] uppercase tracking-wide block">KONVERT</span>
                      <span className="text-xs font-semibold text-[#5B47F5]">{row.konvert}</span>
                    </div>
                    <div className="px-3 py-3 flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">DIY</span>
                      <span className="text-xs text-slate-500">{row.diy}</span>
                    </div>
                    <div className="px-3 py-3 flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Freelance</span>
                      <span className="text-xs text-slate-500">{row.freelance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VERSION DESKTOP (md+) : grid 4 colonnes */}
            <div className="hidden md:block">
              {COMPARE_ROWS.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-4 gap-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-xs font-semibold text-gray-600">{row.label}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center justify-center" style={{ background: 'rgba(91,71,245,0.06)' }}>
                    <span className="text-xs font-bold text-[#5B47F5] text-center">{row.konvert}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center">{row.diy}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center">{row.freelance}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── FAQ PRICING ──────────────────────────────────────────────────── */}
      <div className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>
            Questions fréquentes sur les tarifs
          </h2>

          <PricingFaqAccordion items={PRICING_FAQ} />
        </div>
      </div>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <div
        className="py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #F0EDFF 0%, #F8F7FF 100%)' }}
      >
        <h2
          className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Prêt à générer ta première page ?
        </h2>
        <p className="text-lg mb-8 text-slate-600">
          Génère ta 1ère page gratuitement — vois le résultat avant de payer.
        </p>
        <Link
          href="/essai"
          className="focus-konvert inline-flex items-center gap-2 font-bold px-10 py-4 rounded-lg text-white text-base transition-colors"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 20px rgba(91,71,245,0.35)' }}
        >
          Générer ma première page — gratuit
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-3 text-sm text-slate-400">
          Stripe · Annulation à tout moment · Sans engagement
        </p>
        <p className="mt-2 text-sm font-semibold text-green-700">
          <ShieldCheck className="inline w-3.5 h-3.5 mr-1" /> Satisfait ou remboursé 30 jours — Sans question
        </p>
      </div>

      {/* ── FOOTER MINIMAL ───────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>
            KON<span style={{ color: '#16a34a' }}>VERT</span>
          </Link>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
            <Link href="/legal/mentions" className="hover:text-gray-700 transition-colors">Mentions légales</Link>
            <Link href="/legal/privacy" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
            <a href="mailto:support@konvertpilot.com" className="hover:text-gray-700 transition-colors">Support</a>
          </div>
          <p className="text-xs text-gray-300">© 2026 KONVERT</p>
        </div>
      </footer>
    </div>
  )
}
