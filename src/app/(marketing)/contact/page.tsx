'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Phone, MapPin, ArrowRight, Check, Clock, Zap, Building2 } from 'lucide-react'

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
    title: 'Chat en direct',
    desc: 'Réponse en moins de 2 minutes.',
    detail: 'Lun–Ven, 9h–19h',
    action: 'Ouvrir le chat',
    href: '#chat',
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

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200)) // simulation
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Mail className="w-3.5 h-3.5" />
            Contact
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            On est là pour vous aider.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#8b8baa' }}>
            Une question, une suggestion, un besoin spécifique ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      {/* ── CARDS CONTACT ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {CONTACT_CARDS.map(({ icon: Icon, title, desc, detail, action, href, color, bg }) => (
              <a
                key={title}
                href={href}
                className="group p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all hover:-translate-y-0.5"
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
          <div>
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
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
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
    </>
  )
}
