'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Lock, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { track } from '@/lib/analytics'
import { readUtmCookie } from '@/lib/analytics/utm'
import { pixels } from '@/lib/tracking/pixels'

function SignupContent() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [name, setName]             = useState('')
  const [loading, setLoading]       = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenEmail, setTokenEmail] = useState<string | null>(null)
  // Quand Supabase a "Confirm email" activé, signUp() renvoie data.session = null
  // → on doit afficher un écran d'attente au lieu de pousser sur /dashboard avec
  // une session inexistante (le user atterrissait sur dashboard, voyait l'écran
  // une milliseconde, puis était kické vers /login → UX cassée + perte conversion).
  const [pendingConfirm, setPendingConfirm] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  // Plan pré-sélectionné depuis /pricing — déclenche relance checkout après signup
  const planParam = searchParams.get('plan')
  const intervalParam = searchParams.get('interval')
  const couponParam = searchParams.get('coupon')

  // Valide le token au chargement (optionnel : signup ouvert à tous depuis launch)
  useEffect(() => {
    track.signupStarted()
    if (!token) { setTokenValid(true); return }
    setValidating(true)
    fetch(`/api/invitations/validate?token=${token}`)
      .then(r => r.json())
      .then(data => {
        // Token invalide → on laisse quand même passer (signup ouvert)
        setTokenValid(true)
        if (data.email) { setTokenEmail(data.email); setEmail(data.email) }
      })
      .catch(() => setTokenValid(true))
      .finally(() => setValidating(false))
  }, [token])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Mot de passe minimum 8 caractères'); return }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    // Attribution : on injecte les UTM first-touch capturés par le middleware
    // dans user_metadata. Devient lisible côté server pour les pixels CAPI
    // (Meta + Google enhanced conversions) et les rapports BI.
    const utm = readUtmCookie() ?? {}

    // Si "Confirm email" Supabase est activé, data.session sera null après signUp
    // et l'auto-checkout Stripe ne peut pas se déclencher. On redirige donc le
    // magic link vers /pricing avec un flag autocheckout — la page pricing détecte
    // ce flag au mount + session valide et relance handleCheckout automatiquement.
    const planValid = planParam && ['starter', 'pro', 'agency'].includes(planParam)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectParams = new URLSearchParams()
    if (planValid) {
      redirectParams.set('autocheckout', planParam!)
      redirectParams.set('interval', intervalParam === 'annual' ? 'annual' : 'monthly')
      if (couponParam) redirectParams.set('coupon', couponParam)
    }
    const emailRedirectTo = planValid
      ? `${origin}/pricing?${redirectParams.toString()}`
      : `${origin}/dashboard`

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, ...utm }, emailRedirectTo },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Marque le token comme utilisé
    if (token) {
      await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    }

    // Email de bienvenue J+0 — envoyé dès l'inscription, session ou pas.
    // Si "Confirm email" est activé côté Supabase, data.session est null mais
    // data.user.email est toujours disponible et l'email est syntaxiquement
    // valide (Supabase vérifie avant d'émettre le lien de confirmation).
    // On préfère un welcome envoyé avant confirmation plutôt que zéro email J0
    // pour 100% des users en mode "confirm email" (risque prod DEIDARA QW2).
    const sessionCreated = !!data.session
    const recipientEmail = email || data.user?.email
    track.signupCompleted('email')
    // Pixels CompleteRegistration : déclenché même si pending email confirm
    // (l'event représente l'intention, pas l'activation). On peut affiner
    // avec un event Activation séparé après 1ère page créée.
    pixels.completeRegistration({ method: 'email', value: 0 })
    if (recipientEmail) {
      // Route welcome email désormais publique (rate-limited) — pas de Bearer
      // token requis. La session Supabase n'est pas encore hydratée côté serveur
      // au moment du fetch post-signup, ce qui causait un 401 systématique.
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recipientEmail, name }),
      }).catch(() => {})
    }
    if (sessionCreated) {

      // Plan pré-sélectionné depuis /pricing → on relance le checkout Stripe
      // directement plutôt que de renvoyer l'user sur /dashboard puis /pricing.
      if (planParam && ['starter', 'pro', 'agency'].includes(planParam)) {
        try {
          const checkoutRes = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan: planParam,
              interval: intervalParam === 'annual' ? 'annual' : 'monthly',
              ...(couponParam && { coupon: couponParam }),
            }),
          })
          const checkoutJson = await checkoutRes.json()
          if (checkoutRes.ok && checkoutJson.url) {
            window.location.href = checkoutJson.url
            return
          }
        } catch {
          // Fallback dashboard si Stripe down — user peut relancer depuis /pricing
        }
      }

      router.push('/dashboard')
      return
    }

    // Pas de session → Supabase a envoyé un email de confirmation.
    // On affiche l'écran d'attente au lieu de rediriger sur dashboard sans auth.
    setPendingConfirm(true)
    setLoading(false)
  }

  // Confirmation email envoyée — on bloque la navigation jusqu'à ce que l'user
  // clique le lien magique reçu dans sa boîte. C'est l'écran qui manquait avant
  // ce fix : on poussait sur /dashboard avec session=null, l'user voyait un flash
  // puis était kické vers /login sans comprendre.
  if (pendingConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
            </span>
          </div>
          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Check className="w-7 h-7" style={{ color: '#4ade80' }} />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Vérifie ta boîte email</h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(196,181,253,0.6)' }}>
              On vient d&apos;envoyer un lien de confirmation à <span className="text-white font-semibold">{email}</span>.
              Clique dessus pour activer ton compte et accéder au dashboard.
            </p>
            <p className="text-xs mb-2" style={{ color: 'rgba(167,139,250,0.5)' }}>
              Pas reçu ? Vérifie tes spams ou{' '}
              <button onClick={() => setPendingConfirm(false)} className="underline font-semibold" style={{ color: '#a78bfa' }}>
                réessaie
              </button>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Loading token validation
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#a78bfa' }} />
          <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>Vérification de l&apos;invitation...</p>
        </div>
      </div>
    )
  }

  // Token invalide / absent → page waitlist
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
            </span>
          </div>

          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Lock className="w-7 h-7" style={{ color: '#a78bfa' }} />
            </div>

            <h1 className="text-2xl font-black text-white mb-2">Bêta fermée</h1>
            <p className="text-sm mb-8" style={{ color: 'rgba(196,181,253,0.6)' }}>
              KONVERT est actuellement en bêta privée. Rejoins la liste d&apos;attente pour être invité en priorité.
            </p>

            <WaitlistMiniForm />

            <p className="mt-6 text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
              Déjà une invitation ?{' '}
              <Link href="/login" className="font-semibold" style={{ color: '#a78bfa' }}>Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Token valide → formulaire signup
  return (
    <div className="min-h-screen flex" style={{ background: '#0d0d1a' }}>

      {/* ── Colonne gauche — showcase pages e-commerce ─────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 flex-shrink-0"
        style={{
          width: '50%',
          background: 'linear-gradient(160deg, #0d0b20 0%, #130f2e 50%, #0d0b20 100%)',
          borderRight: '1px solid rgba(139,92,246,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div className="relative z-10">
          <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>KON</span>
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
          </span>
        </div>

        {/* Showcase central */}
        <div className="flex-1 flex flex-col justify-center py-8 relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Des pages qui<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                donnent envie d&apos;acheter.
              </span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(167,139,250,0.55)' }}>
              Rejoins 2 800+ e-commerçants qui convertissent avec KONVERT.
            </p>
          </div>

          {/* Overlapping product page cards */}
          <div className="relative" style={{ height: 340 }}>
            {/* Card 1 — back left — Beauty store */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: 260,
                height: 300,
                top: 20,
                left: 0,
                transform: 'rotate(-4deg)',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 1,
              }}
            >
              <div className="h-full bg-white flex flex-col">
                {/* Mini navbar */}
                <div className="flex items-center justify-between px-3 py-2" style={{ background: '#faf5f0', borderBottom: '1px solid #f0e8df' }}>
                  <span className="text-[9px] font-bold text-gray-800">blusho</span>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>
                </div>
                {/* Hero image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"
                  alt="Produits cosmétiques beauté"
                  className="w-full h-32 object-cover"
                />
                {/* Content */}
                <div className="p-3 flex-1">
                  <p className="text-[8px] text-rose-400 font-semibold mb-0.5">BEAUTE & SOIN</p>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight mb-1.5">
                    High Cosmetics<br />Product For You
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className="w-2 h-2" viewBox="0 0 20 20" fill="#f59e0b"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z"/></svg>
                    ))}
                    <span className="text-[7px] text-gray-400">4.9</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded bg-gray-100" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 — center — Fashion/Accessories store (main) */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: 280,
                height: 320,
                top: 0,
                left: '50%',
                transform: 'translateX(-50%) rotate(0deg)',
                border: '1px solid rgba(139,92,246,0.3)',
                zIndex: 3,
                boxShadow: '0 20px 60px rgba(124,58,237,0.25)',
              }}
            >
              <div className="h-full bg-white flex flex-col">
                {/* Mini navbar */}
                <div className="flex items-center justify-between px-3 py-2" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}>
                      <span className="text-[6px] font-black text-white">K</span>
                    </div>
                    <span className="text-[8px] font-bold text-gray-800">KONVERT</span>
                  </div>
                  <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#5B47F5' }}>Acheter</span>
                </div>
                {/* Promo */}
                <div className="text-center py-1" style={{ background: 'linear-gradient(90deg,#5B47F5,#7c6af7)' }}>
                  <span className="text-[7px] text-white font-semibold">Livraison GRATUITE — Offre limitee</span>
                </div>
                {/* Product image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                  alt="Montre design minimaliste"
                  className="w-full h-28 object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
                {/* Content */}
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className="w-2 h-2" viewBox="0 0 20 20" fill="#f59e0b"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z"/></svg>
                    ))}
                    <span className="text-[7px] text-gray-400 ml-0.5">2 847 avis</span>
                  </div>
                  <p className="text-[11px] font-black text-gray-900 leading-tight mb-1">
                    Montre Minimaliste Pro —<br />Design qui fait tourner les têtes
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-sm font-black text-gray-900">89,90€</span>
                    <span className="text-[10px] text-gray-400 line-through">149,90€</span>
                    <span className="text-[7px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">-40%</span>
                  </div>
                  <div className="space-y-0.5 mb-2">
                    {['Verre saphir anti-rayures', 'Étanche 50m', 'Bracelet cuir italien'].map(b => (
                      <div key={b} className="flex items-center gap-1">
                        <span className="text-[8px] text-green-500">✓</span>
                        <span className="text-[8px] text-gray-600">{b}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-1.5 rounded-lg text-[8px] font-bold text-white mt-auto" style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}>
                    Commander — Livraison gratuite
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 — back right — Tech store */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: 240,
                height: 290,
                top: 30,
                right: 0,
                transform: 'rotate(5deg)',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 2,
              }}
            >
              <div className="h-full flex flex-col" style={{ background: '#0a0a1a' }}>
                {/* Mini navbar dark */}
                <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-[9px] font-bold text-white/70">TECHWAVE</span>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
                {/* Product image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80"
                  alt="Ecouteurs sans fil tech"
                  className="w-full h-28 object-cover"
                />
                {/* Content dark */}
                <div className="p-3 flex-1">
                  <p className="text-[8px] font-semibold mb-0.5" style={{ color: '#a78bfa' }}>BEST-SELLER</p>
                  <p className="text-[10px] font-bold text-white leading-tight mb-1.5">
                    SoundPro X5<br />40h de musique
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-xs font-black text-white">29,90€</span>
                    <span className="text-[9px] text-white/40 line-through">49,90€</span>
                  </div>
                  <button className="w-full py-1.5 rounded-lg text-[8px] font-bold text-white" style={{ background: '#5B47F5' }}>
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>

            {/* Glow effect behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', zIndex: 0 }} />
          </div>
        </div>

        {/* Stats bas de page */}
        <div className="relative z-10 flex items-center gap-6">
          {[
            { icon: '📈', value: '+300%', label: 'CTR moyen' },
            { icon: '⚡', value: '28s', label: 'Generation' },
            { icon: '⭐', value: '4.9/5', label: '247 avis' },
          ].map(s => (
            <div key={s.label} className="flex-1 text-center p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <p className="text-sm mb-0.5">{s.icon}</p>
              <p className="text-lg font-black" style={{ color: '#a78bfa' }}>{s.value}</p>
              <p className="text-[10px]" style={{ color: 'rgba(167,139,250,0.5)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Colonne droite — formulaire ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile uniquement */}
          <div className="text-center mb-8 lg:hidden">
            <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
            </span>
          </div>

          {/* Badge contextuel : plan sélectionné OU invitation OU bienvenue */}
          {planParam && ['starter', 'pro', 'agency'].includes(planParam) ? (
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.35)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#a78bfa' }} />
              <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
                Plan <span className="capitalize">{planParam}</span> sélectionné — checkout après création
              </span>
            </div>
          ) : tokenEmail ? (
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#16a34a' }}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>
                Invitation valide — Bienvenue
              </span>
            </div>
          ) : null}

          <form onSubmit={handleSignup} className="rounded-3xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div>
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Prénom</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                readOnly={!!tokenEmail}
                placeholder="toi@exemple.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: tokenEmail ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${tokenEmail ? 'rgba(74,222,128,0.3)' : 'rgba(139,92,246,0.2)'}`,
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
            </div>

            {error && (
              <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
                : <><Sparkles className="w-4 h-4" /> Créer mon compte</>
              }
            </button>

            <p className="text-center text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
              En créant un compte tu acceptes nos <Link href="/legal/cgu" className="underline">CGU</Link>
            </p>

            <p className="text-center text-sm mt-4" style={{ color: 'rgba(167,139,250,0.5)' }}>
              Déjà un compte ?{' '}
              <Link href="/login" className="font-bold" style={{ color: '#a78bfa' }}>Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

function WaitlistMiniForm() {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'exists'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, context }),
    })
    const data = await res.json()
    setStatus(data.message === 'already_registered' ? 'exists' : 'success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
        <div className="text-3xl mb-3">🎉</div>
        <p className="font-bold text-white mb-1">Tu es sur la liste !</p>
        <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>On t&apos;envoie ton invitation dès qu&apos;une place se libère.</p>
      </div>
    )
  }

  if (status === 'exists') {
    return (
      <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
        <p className="text-sm font-semibold" style={{ color: '#fbbf24' }}>✓ Tu es déjà inscrit sur la waitlist !</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ton prénom"
        required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="ton@email.com"
        required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
      />
      <select
        value={context}
        onChange={e => setContext(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: context ? '#fff' : 'rgba(167,139,250,0.5)' }}
      >
        <option value="" style={{ background: '#1a0533' }}>Mon profil...</option>
        <option value="dropshippeur" style={{ background: '#1a0533' }}>Dropshippeur</option>
        <option value="ecommerce" style={{ background: '#1a0533' }}>E-commerçant</option>
        <option value="agence" style={{ background: '#1a0533' }}>Agence / Freelance</option>
        <option value="autre" style={{ background: '#1a0533' }}>Autre</option>
      </select>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
      >
        {status === 'loading'
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <><ArrowRight className="w-4 h-4" /> Rejoindre la bêta</>
        }
      </button>
    </form>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#a78bfa' }} />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
