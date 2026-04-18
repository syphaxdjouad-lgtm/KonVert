import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PLAN_LIMITS } from '@/types'
import type { UserProfile, Subscription, Page, Store } from '@/types'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  body: string
  href?: string
  time?: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 60) return `il y a ${minutes}min`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const [
    { data: profile },
    { data: subscription },
    { data: pages },
    { data: stores },
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single<UserProfile>(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single<Subscription>(),
    supabase.from('pages').select('*').eq('user_id', user.id).returns<Page[]>(),
    supabase.from('stores').select('*').eq('user_id', user.id).returns<Store[]>(),
  ])

  const notifications: Notification[] = []
  const now = Date.now()

  // ── 1 & 2. Quota pages ──────────────────────────────────────────────────────
  if (profile) {
    const limit = PLAN_LIMITS[profile.plan].pages
    const used = profile.pages_used_this_month
    const ratio = used / limit

    if (ratio >= 1) {
      notifications.push({
        id: 'quota_full',
        type: 'error',
        title: 'Quota pages atteint',
        body: `Vous avez utilisé ${used}/${limit} pages ce mois-ci. Upgradez votre plan pour continuer.`,
        href: '/pricing',
      })
    } else if (ratio >= 0.8) {
      notifications.push({
        id: 'quota_warning',
        type: 'warning',
        title: 'Quota pages bientôt atteint',
        body: `${used}/${limit} pages utilisées ce mois-ci (${Math.round(ratio * 100)}%).`,
        href: '/pricing',
      })
    }
  }

  // ── 3 & 4. Trial ────────────────────────────────────────────────────────────
  if (subscription?.status === 'trialing') {
    const endMs = new Date(subscription.current_period_end).getTime()
    const daysLeft = Math.ceil((endMs - now) / 86_400_000)

    if (daysLeft < 0) {
      notifications.push({
        id: 'trial_expired',
        type: 'error',
        title: 'Période d\'essai expirée',
        body: 'Votre essai gratuit est terminé. Choisissez un plan pour continuer.',
        href: '/pricing',
      })
    } else if (daysLeft <= 3) {
      notifications.push({
        id: 'trial_ending',
        type: 'warning',
        title: `Essai gratuit : ${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`,
        body: 'Passez à un plan payant pour ne pas perdre vos données.',
        href: '/pricing',
      })
    }
  }

  // ── 5. Welcome ───────────────────────────────────────────────────────────────
  if (profile) {
    const ageMs = now - new Date(profile.created_at).getTime()
    if (ageMs < 86_400_000) {
      notifications.push({
        id: 'welcome',
        type: 'success',
        title: 'Bienvenue sur KONVERT !',
        body: 'Créez votre première page de vente en moins de 2 minutes.',
        href: '/dashboard/new',
        time: relativeTime(profile.created_at),
      })
    }
  }

  // ── 6. Pages publiées (7 derniers jours, max 3) ──────────────────────────────
  if (pages) {
    const sevenDaysAgo = now - 7 * 86_400_000
    const recentPublished = pages
      .filter(p => p.status === 'published' && new Date(p.updated_at).getTime() > sevenDaysAgo)
      .slice(0, 3)

    for (const page of recentPublished) {
      notifications.push({
        id: `page_published_${page.id}`,
        type: 'success',
        title: 'Page publiée',
        body: `"${page.title}" est maintenant en ligne.`,
        href: `/dashboard/pages`,
        time: relativeTime(page.updated_at),
      })
    }
  }

  // ── 7. Stores connectés (7 derniers jours) ───────────────────────────────────
  if (stores) {
    const sevenDaysAgo = now - 7 * 86_400_000
    const recentStores = stores.filter(
      s => new Date(s.created_at).getTime() > sevenDaysAgo
    )

    for (const store of recentStores) {
      notifications.push({
        id: `store_connected_${store.id}`,
        type: 'success',
        title: 'Store connecté',
        body: `"${store.name}" (${store.platform}) est connecté avec succès.`,
        href: `/dashboard/stores`,
        time: relativeTime(store.created_at),
      })
    }
  }

  // ── 8. Page milestone (views > 100) ─────────────────────────────────────────
  if (pages) {
    const milestonePages = pages.filter(p => p.views > 100)
    for (const page of milestonePages) {
      notifications.push({
        id: `page_milestone_${page.id}`,
        type: 'info',
        title: 'Milestone atteint !',
        body: `"${page.title}" a dépassé ${page.views} vues.`,
        href: `/dashboard/analytics`,
      })
    }
  }

  // ── 9. High CTR (CTR > 5% ET views > 20) ────────────────────────────────────
  if (pages) {
    const highCtrPages = pages.filter(
      p => p.views > 20 && p.cta_clicks > 0 && (p.cta_clicks / p.views) * 100 > 5
    )
    for (const page of highCtrPages) {
      const ctrValue = ((page.cta_clicks / page.views) * 100).toFixed(1)
      notifications.push({
        id: `high_ctr_${page.id}`,
        type: 'success',
        title: 'CTR exceptionnel !',
        body: `"${page.title}" affiche un CTR de ${ctrValue}% — excellent résultat.`,
        href: `/dashboard/analytics`,
      })
    }
  }

  return NextResponse.json({
    notifications,
    count: notifications.length,
  })
}
