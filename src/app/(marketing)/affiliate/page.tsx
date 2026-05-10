'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Coins,
  Megaphone,
  Users,
  TrendingUp,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'

/* ─────────────────────────────────────────────────────────────────────────
   PAGE AFFILIÉS — Pré-inscription waitlist (programme officiel J+14)
   ─────────────────────────────────────────────────────────────────────────
   Le programme final tournera sur Tolt (ou Rewardful), branché au webhook
   Stripe `commission_created`. En attendant, on capture les intéressés via
   l'endpoint /api/waitlist existant avec context='affiliate'.
─────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    icon: Megaphone,
    n: '01',
    title: 'Tu partages ton lien',
    desc: 'On te donne un lien personnalisé à partager sur ton blog, tes réseaux, tes emails.',
  },
  {
    icon: Users,
    n: '02',
    title: 'Tes contacts s\'inscrivent',
    desc: 'Chaque visiteur qui clique ton lien est tracké pendant 60 jours.',
  },
  {
    icon: Coins,
    n: '03',
    title: 'Tu touches une commission',
    desc: '20 à 30 % récurrents, à vie tant que ton filleul reste abonné. Versement mensuel.',
  },
]

const PERKS = [
  { value: '20-30 %', label: 'commission récurrente', detail: 'À vie sur tous les paiements' },
  { value: '60 jours', label: 'fenêtre cookie', detail: 'Plus longue que la moyenne du marché' },
  { value: 'Mensuel', label: 'paiement', detail: 'Stripe Connect ou virement, dès 50€' },
  { value: '0€', label: 'frais d\'entrée', detail: 'Programme gratuit, ouvert à tous' },
]

const FAQ = [
  {
    q: 'Combien je gagne par filleul ?',
    a: 'Tu touches 20% sur les plans Starter (39€/mois) et Pro (79€/mois), et 30% sur le plan Agency (199€/mois). Si ton filleul reste abonné 12 mois sur Pro, tu touches ~190€ sur sa première année.',
  },
  {
    q: 'Quand je suis payé ?',
    a: 'Versement mensuel automatique dès que ton solde dépasse 50€. Au choix par virement SEPA ou via Stripe Connect (frais réduits).',
  },
  {
    q: 'Combien de temps dure le tracking d\'un visiteur ?',
    a: 'Le cookie d\'attribution dure 60 jours. Si quelqu\'un clique ton lien aujourd\'hui et s\'inscrit dans 2 mois, la commission est pour toi.',
  },
  {
    q: 'Faut-il une audience pour postuler ?',
    a: 'Non. Le programme est ouvert à tous : créateurs, e-commerçants, agences, freelances, blogueurs, podcasteurs. Si tu cibles l\'e-commerce, ça matche.',
  },
  {
    q: 'Quels supports marketing tu fournis ?',
    a: 'Bannières (300x250, 728x90, 1200x630), templates email prêts à l\'emploi, screenshots HD, vidéo démo, et deux landing pages pré-rédigées en français et en anglais.',
  },
  {
    q: 'Quand ouvre le programme ?',
    a: 'Lancement officiel sous 2 semaines. Inscris-toi maintenant pour recevoir ton lien d\'affilié dès l\'ouverture, avec une commission boostée +5 % le premier mois.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border transition-colors duration-200"
      style={{ borderColor: open ? '#d1d5db' : '#e5e7eb' }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="px-6 overflow-hidden transition-all duration-300"
        style={open
          ? { maxHeight: '400px', opacity: 1, paddingBottom: '20px' }
          : { maxHeight: '0px', opacity: 0, paddingBottom: '0px' }
        }
      >
        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

function SignupForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [audience, setAudience] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exists'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Email invalide')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          // context permet de filtrer les inscrits affiliés vs waitlist beta
          // dans la table `waitlist` (cf /api/admin/waitlist).
          context: `affiliate${audience ? ' · ' + audience : ''}`,
        }),
      })
      const data = await res.json()
      setStatus(data.message === 'already_registered' ? 'exists' : 'success')
    } catch {
      toast.error('Erreur réseau, réessaie')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(91,71,245,0.06)', border: '1px solid rgba(91,71,245,0.2)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(91,71,245,0.15)' }}>
          <Check className="w-8 h-8" style={{ color: '#5B47F5' }} />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Tu es sur la liste prioritaire</h3>
        <p className="text-sm text-gray-500">
          On t&apos;envoie ton lien d&apos;affilié dès l&apos;ouverture du programme — avec ta commission boostée +5 % le premier mois.
        </p>
      </div>
    )
  }

  if (status === 'exists') {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <p className="text-sm font-semibold text-amber-700">
          Tu es déjà inscrit ! On te recontacte à l&apos;ouverture.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Prénom</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Alex"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all bg-white"
            style={{ border: '1px solid #e5e7eb' }}
            onFocus={e => (e.target.style.borderColor = '#5B47F5')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all bg-white"
            style={{ border: '1px solid #e5e7eb' }}
            onFocus={e => (e.target.style.borderColor = '#5B47F5')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Ton audience</label>
        <select
          value={audience}
          onChange={e => setAudience(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none bg-white"
          style={{ border: '1px solid #e5e7eb', color: audience ? '#111827' : '#9ca3af' }}
        >
          <option value="">Sélectionne ton profil…</option>
          <option value="creator">Créateur de contenu (YouTube, TikTok, blog)</option>
          <option value="agency">Agence / freelance e-commerce</option>
          <option value="ecommerce">E-commerçant avec audience</option>
          <option value="newsletter">Newsletter / podcast</option>
          <option value="community">Communauté / Discord / Slack</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
        style={{
          background: status === 'loading' ? '#a78bfa' : 'linear-gradient(135deg,#5B47F5,#7c3aed)',
          boxShadow: '0 4px 20px rgba(91,71,245,0.3)',
        }}
      >
        {status === 'loading'
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Inscription…</>
          : <>Recevoir mon lien d&apos;affilié <ArrowRight className="w-4 h-4" /></>
        }
      </button>
      <p className="text-xs text-gray-400 text-center">
        Aucun engagement. Désinscription en 1 click. RGPD compliant.
      </p>
    </form>
  )
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-gray-50 border-b border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(91,71,245,0.1)', color: '#5B47F5' }}>
            <Coins className="w-3.5 h-3.5" />
            PROGRAMME AFFILIÉ
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Recommande KONVERT,<br />
            <span style={{ background: 'linear-gradient(135deg,#5B47F5,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              touche 20-30 % à vie.
            </span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Le programme affilié le plus généreux du marché SaaS e-commerce. Commission récurrente, fenêtre 60 jours, paiement mensuel. Pour créateurs, agences et e-commerçants avec audience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Commission à vie</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Cookie 60 jours</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Paiement mensuel</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Aucun engagement</span>
          </div>
        </div>
      </section>

      {/* 3 ÉTAPES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ icon: Icon, n, title, desc }) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-7 transition-all duration-200"
                style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(91,71,245,0.1)' }}>
                    <Icon className="w-6 h-6" style={{ color: '#5B47F5' }} />
                  </div>
                  <span className="font-black text-3xl" style={{ color: '#e5e7eb' }}>{n}</span>
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-3" style={{ letterSpacing: '-0.02em' }}>
            Les chiffres clés
          </h2>
          <p className="text-center text-gray-500 mb-12">Comparé aux programmes affiliés SaaS standards (10 % une fois, cookie 30j).</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {PERKS.map(({ value, label, detail }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 text-center"
                style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
              >
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#5B47F5', letterSpacing: '-0.02em' }}>{value}</div>
                <div className="text-sm font-bold text-gray-900 mb-1.5">{label}</div>
                <div className="text-xs text-gray-500 leading-snug">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALC EXEMPLE */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-3" style={{ letterSpacing: '-0.02em' }}>
            Combien tu peux gagner
          </h2>
          <p className="text-center text-gray-500 mb-10">Exemple concret avec 20 filleuls actifs sur le plan Pro (79€/mois).</p>
          <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c3aed)', boxShadow: '0 8px 32px rgba(91,71,245,0.3)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Filleuls actifs</div>
                <div className="text-3xl font-black">20</div>
              </div>
              <div className="border-l border-r border-white/15">
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Commission par mois</div>
                <div className="text-3xl font-black">316 €</div>
                <div className="text-[11px] text-white/60 mt-1">79€ × 20 × 20%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Sur 12 mois</div>
                <div className="text-3xl font-black">3 792 €</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Hors taxes. Estimation basée sur un taux de rétention moyen 12 mois pour les abonnements SaaS B2B (~85 %).
          </p>
        </div>
      </section>

      {/* FORM PRÉ-INSCRIPTION */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3" style={{ letterSpacing: '-0.02em' }}>
              Rejoins la liste prioritaire
            </h2>
            <p className="text-gray-500">
              Programme officiel ouvert sous 2 semaines. Les inscrits prioritaires reçoivent <span className="font-bold text-gray-900">+5 % de commission boost</span> le premier mois.
            </p>
          </div>
          <SignupForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-10" style={{ letterSpacing: '-0.02em' }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 text-center" style={{ background: '#111827' }}>
        <TrendingUp className="w-12 h-12 mx-auto mb-5" style={{ color: '#a78bfa' }} />
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
          Prêt à monétiser ton audience ?
        </h2>
        <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          5 minutes pour t&apos;inscrire, des années pour toucher tes commissions.
        </p>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c3aed)', boxShadow: '0 4px 20px rgba(91,71,245,0.4)' }}
        >
          Devenir affilié KONVERT <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
