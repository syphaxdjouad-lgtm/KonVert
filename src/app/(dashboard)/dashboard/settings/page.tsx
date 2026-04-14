import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLAN_LIMITS } from '@/types'
import Link from 'next/link'
import { User, CreditCard, Shield, Trash2, Zap, ArrowUpRight } from 'lucide-react'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, subRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
  ])

  const profile = profileRes.data
  const sub     = subRes.data
  const plan    = profile?.plan || 'starter'
  const limits  = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const used    = profile?.pages_used_this_month || 0
  const pct     = Math.min(Math.round((used / limits.pages) * 100), 100)

  const planLabel: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    agency: 'Agency',
  }

  const renewalDate = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="p-8" style={{ maxWidth: '720px', margin: '0 auto' }}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: '#0f0f1e', letterSpacing: '-0.02em' }}>
          Paramètres
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: '#6b6b84' }}>
          Gère ton profil, ton plan et ta sécurité
        </p>
      </div>

      <div className="space-y-4">

        {/* ── PROFIL ── */}
        <section className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E4E2EE' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff' }}>
              <User className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <h2 className="text-[15px] font-black" style={{ color: '#0f0f1e' }}>Profil</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
            >
              {(profile?.name || user.email || 'K')[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-[15px]" style={{ color: '#0f0f1e' }}>
                {profile?.name || 'Sans nom'}
              </div>
              <div className="text-[13px]" style={{ color: '#6b6b84' }}>{user.email}</div>
            </div>
          </div>

          <SettingsClient
            initialName={profile?.name || ''}
            email={user.email || ''}
          />
        </section>

        {/* ── PLAN ── */}
        <section className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E4E2EE' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff' }}>
              <CreditCard className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <h2 className="text-[15px] font-black" style={{ color: '#0f0f1e' }}>Plan & Facturation</h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-[12px] font-black capitalize"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff' }}
                >
                  {planLabel[plan] || plan}
                </span>
                {sub?.status === 'trialing' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: '#fef3c7', color: '#d97706' }}>
                    Essai
                  </span>
                )}
              </div>
              {renewalDate && (
                <p className="text-[12px] mt-1.5" style={{ color: '#6b6b84' }}>
                  Renouvellement le {renewalDate}
                </p>
              )}
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: '#f3f0ff', color: '#7c3aed' }}
            >
              <Zap className="w-3.5 h-3.5" />
              Changer de plan
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quota */}
          <div className="rounded-xl p-4" style={{ background: '#F5F4FA' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold" style={{ color: '#0f0f1e' }}>
                Pages ce mois
              </span>
              <span className="text-[13px] font-black" style={{ color: '#0f0f1e' }}>
                {used} / {limits.pages}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E4E2EE' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : 'linear-gradient(90deg, #7c3aed, #b5f23d)',
                }}
              />
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: '#6b6b84' }}>
              Quota réinitialisé le 1er de chaque mois
            </p>
          </div>
        </section>

        {/* ── SÉCURITÉ ── */}
        <section className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E4E2EE' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff' }}>
              <Shield className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <h2 className="text-[15px] font-black" style={{ color: '#0f0f1e' }}>Sécurité</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold" style={{ color: '#0f0f1e' }}>Mot de passe</div>
              <div className="text-[12px]" style={{ color: '#6b6b84' }}>
                Un email de réinitialisation sera envoyé à {user.email}
              </div>
            </div>
            <SettingsClient
              initialName={profile?.name || ''}
              email={user.email || ''}
              showPasswordOnly
            />
          </div>
        </section>

        {/* ── DANGER ZONE ── */}
        <section className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #fecaca' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
            </div>
            <h2 className="text-[15px] font-black" style={{ color: '#ef4444' }}>Zone dangereuse</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold" style={{ color: '#0f0f1e' }}>Supprimer mon compte</div>
              <div className="text-[12px]" style={{ color: '#6b6b84' }}>
                Action irréversible — toutes tes pages et données seront supprimées
              </div>
            </div>
            <SettingsClient
              initialName={profile?.name || ''}
              email={user.email || ''}
              showDeleteOnly
            />
          </div>
        </section>

      </div>
    </div>
  )
}
