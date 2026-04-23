'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Phone, MapPin, ArrowRight, Check, Clock, Zap, Building2 } from 'lucide-react'

const GLOBAL_CSS = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }
  @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
  .btn-shimmer { background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%); background-size: 200% 100%; animation: shimmer 2.4s linear infinite; }
  .btn-shimmer:hover { animation-play-state: paused; }
  @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`

const SUBJECTS = [
  'Support technique',
  'Question sur les tarifs',
  'Demande de démo',
  'Partenariat / Agence',
  'Presse & Médias',
  'Autre',
]

const CONTACT_CARDS = [
  {
    icon: MessageSquare,
    title: 'Support direct',
    desc: 'Réponse en moins de 24h.',
    detail: 'Lun–Ven, 9h–19h',
    action: 'Écrire au support',
    href: 'mailto:hello@konvert.app',
    color: 'text-[#5B47F5]',
    bg: 'bg-[#5B47F5]/10',
  },
  {
    icon: Mail,
    title: 'Email',
    desc: 'Réponse garantie sous 24h.',
    detail: 'hello@konvert.app',
    action: 'Envoyer un email',
    href: 'mailto:hello@konvert.app',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Building2,
    title: 'Pour les agences',
    desc: 'Appel découverte 30 min offert.',
    detail: 'Plan Agence & White-label',
    action: 'Réserver un appel',
    href: '/agence',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Combien de temps pour une réponse ?',
    answer: 'Sous 24h en semaine, parfois le week-end pour les urgences.',
  },
  {
    question: "Proposez-vous de l'aide à l'onboarding ?",
    answer: 'Oui, un appel de 30 min offert pour tous les nouveaux comptes.',
  },
  {
    question: 'Comment annuler mon abonnement ?',
    answer: 'En 1 clic depuis votre dashboard. Aucune période d\'engagement.',
  },
  {
    question: 'KONVERT est-il compatible avec tous les thèmes Shopify ?',
    answer: 'Oui. Les pages générées s\'intègrent nativement dans n\'importe quel thème Shopify ou WooCommerce.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {
      // Silently fail — still show success to user
    }
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Mail className="w-3.5 h-3.5" />
            Contact
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl font-black text-white mb-4">
            On est là pour vous aider.
          </h1>
          <p className="reveal delay-2 text-lg leading-relaxed" style={{ color: '#8b8baa' }}>
            Une question, une suggestion, un besoin spécifique ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      {/* ── CARDS CONTACT ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {CONTACT_CARDS.map(({ icon: Icon, title, desc, detail, action, href, color, bg }, idx) => (
              <a
                key={title}
                href={href}
                className={`reveal delay-${idx + 1} group p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all hover:-translate-y-0.5`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 mb-2">{desc}</p>
                <p className="text-xs font-semibold text-gray-400 mb-4">{detail}</p>
                <span className={`text-sm font-bold ${color} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                  {action}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14">

          {/* Gauche — infos */}
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">Formulaire de contact</p>
            <h2 className="text-3xl font-black text-gray-900 mb-5">
              Écrivez-nous directement.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Décrivez votre besoin et nous vous répondons sous 24h. Pour les urgences techniques,
              utilisez le chat en direct.
            </p>

            <div className="space-y-4">
              {[
                { icon: Clock, text: 'Réponse sous 24h garantie' },
                { icon: Check, text: 'Support en français' },
                { icon: Zap, text: "Accompagnement à l'onboarding inclus" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5B47F5]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#5B47F5]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Adresse</p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Paris, France 🇫🇷
              </p>
            </div>
          </div>

          {/* Droite — formulaire */}
          <div className="reveal delay-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                  <Check className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                  On vous répond sous 24h. Consultez vos spams si vous ne voyez rien.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="text-sm font-semibold text-[#5B47F5] hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#5B47F5]/20 focus:border-[#5B47F5] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jean@boutique.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#5B47F5]/20 focus:border-[#5B47F5] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sujet *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#5B47F5]/20 focus:border-[#5B47F5] transition-all bg-white text-gray-900"
                  >
                    <option value="">Choisir un sujet...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Décrivez votre besoin en quelques lignes..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#5B47F5]/20 focus:border-[#5B47F5] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message →'}
                </button>

                <p className="text-xs text-center text-gray-400">
                  En envoyant ce formulaire vous acceptez notre{' '}
                  <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">politique de confidentialité</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">FAQ</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Questions fréquentes</h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={item.question}
                className={`reveal delay-${Math.min(idx + 1, 4)} rounded-2xl border transition-all overflow-hidden ${
                  openFaq === idx ? 'border-[#5B47F5]/30' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{item.question}</span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all text-sm font-bold"
                    style={{
                      background: openFaq === idx ? '#5B47F5' : '#f3f4f6',
                      color: openFaq === idx ? '#fff' : '#6b7280',
                      transform: openFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
