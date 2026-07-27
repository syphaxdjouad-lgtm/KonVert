// GET /api/cron/store-builder-audit — cron quotidien (Sprint 8, Partie B)
//
// Pour chaque connexion avec `theme_installed_at` non nul : calcule les
// jours écoulés, envoie le checkpoint J+7 puis J+30 (le plus tôt dû, un
// seul par run — cf. spec KAKASHI §B.4). Score sur les 18 critères
// (evaluateAuditCriteria), email Resend avec TOP 3 recommandations
// uniquement (jamais les 18 critères dans l'email).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27) :
// jamais exécuté contre un vrai store (asset key `templates/product.json`,
// structure PageSpeed, fetch public produit — tout non vérifié sur un
// store réel, cf. fetch-inputs.ts). Chaque connexion en échec est loguée
// et skip, jamais de crash du batch entier.

import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { emailStoreBuilderAudit } from '@/lib/email/templates'
import { safeCompare } from '@/lib/security/safe-compare'
import { decryptToken } from '@/lib/shopify'
import { DEFAULT_STORE_BUILDER_API_VERSION, shopifyAdminRequest, type StoreBuilderContext } from '@/lib/shopify/store-builder'
import { evaluateAuditCriteria, computeAuditScore, selectTopRecommendations, fetchAuditInputs } from '@/lib/store-builder'

export const maxDuration = 60
export const runtime = 'nodejs'

const AUDIT_CHECKPOINTS = [7, 30] as const
type AuditCheckpointDay = (typeof AUDIT_CHECKPOINTS)[number]

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  const header = req.headers.get('authorization') ?? ''
  return safeCompare(header, `Bearer ${cronSecret}`)
}

interface DueConnection {
  id: string
  user_id: string
  shop_domain: string
  access_token: string
  theme_id: number | null
  product_id: number | null
  theme_installed_at: string | null
  audit_emails_sent: number[]
  users: { email: string | null; name: string | null } | null
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const now = Date.now()
  let audited = 0
  let skipped = 0
  let errors = 0

  const { data: connections, error } = await supabaseAdmin
    .from('shopify_store_connections')
    .select('id, user_id, shop_domain, access_token, theme_id, product_id, theme_installed_at, audit_emails_sent, users(email, name)')
    .not('theme_installed_at', 'is', null)
    .limit(200)

  if (error) {
    console.error('[cron/store-builder-audit] Supabase error:', error.message)
    Sentry.captureException(error, { tags: { cron: 'store-builder-audit', phase: 'fetch' } })
    return NextResponse.json({ error: 'Erreur de lecture des connexions' }, { status: 500 })
  }

  for (const connection of (connections ?? []) as unknown as DueConnection[]) {
    if (!connection.theme_installed_at || !connection.theme_id || !connection.product_id) {
      skipped++
      continue
    }

    const emailsSent = connection.audit_emails_sent ?? []
    const daysElapsed = Math.floor((now - new Date(connection.theme_installed_at).getTime()) / (24 * 60 * 60 * 1000))

    const dueCheckpoint = AUDIT_CHECKPOINTS.find(
      (day) => daysElapsed >= day && !emailsSent.includes(day)
    ) as AuditCheckpointDay | undefined

    if (!dueCheckpoint) {
      skipped++
      continue
    }

    try {
      const ctx: StoreBuilderContext = {
        shopDomain: connection.shop_domain,
        accessToken: decryptToken(connection.access_token),
        apiVersion: DEFAULT_STORE_BUILDER_API_VERSION,
      }

      const productResult = await shopifyAdminRequest<{ product: { handle: string } }>(
        ctx,
        `/products/${connection.product_id}.json`
      )
      if (!productResult.ok) {
        console.error(`[cron/store-builder-audit] fetch product failed for ${connection.shop_domain}:`, productResult.error)
        errors++
        continue
      }
      const publicProductUrl = `https://${connection.shop_domain}/products/${productResult.data.product.handle}`

      const inputs = await fetchAuditInputs({
        ctx,
        themeId: connection.theme_id,
        productId: connection.product_id,
        publicProductUrl,
      })

      const criteria = evaluateAuditCriteria(inputs)
      const { score, band } = computeAuditScore(criteria)
      const topRecommendations = selectTopRecommendations(criteria, 3).map((c) => ({
        label: c.label,
        recommendation: c.recommendation ?? '',
      }))

      await supabaseAdmin.from('store_builder_audits').insert({
        user_id: connection.user_id,
        connection_id: connection.id,
        checkpoint: dueCheckpoint === 7 ? 'j7' : 'j30',
        score,
        band,
        criteria,
      })

      const email = connection.users?.email
      if (email) {
        const name = connection.users?.name ?? email.split('@')[0]

        let previousScore: number | undefined
        if (dueCheckpoint === 30) {
          const { data: previousAudit } = await supabaseAdmin
            .from('store_builder_audits')
            .select('score')
            .eq('connection_id', connection.id)
            .eq('checkpoint', 'j7')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          previousScore = previousAudit?.score
        }

        const { subject, html } = emailStoreBuilderAudit({
          name,
          shopDomain: connection.shop_domain,
          checkpoint: dueCheckpoint === 7 ? 'j7' : 'j30',
          score,
          band,
          topRecommendations,
          previousScore,
        })
        await sendEmail({ to: email, subject, html })
      }

      // Marquer APRÈS l'envoi réussi — cohérent avec "un seul checkpoint par
      // run" : si l'update échoue, le prochain run retentera ce checkpoint
      // (au pire un email en double, jamais un checkpoint silencieusement
      // sauté).
      await supabaseAdmin
        .from('shopify_store_connections')
        .update({ audit_emails_sent: [...emailsSent, dueCheckpoint] })
        .eq('id', connection.id)

      audited++
    } catch (err) {
      console.error(`[cron/store-builder-audit] erreur connexion ${connection.id}:`, err)
      Sentry.captureException(err, {
        tags: { cron: 'store-builder-audit', phase: 'audit' },
        extra: { connection_id: connection.id },
      })
      errors++
    }
  }

  if (errors > 0 && errors / Math.max(1, connections?.length ?? 1) > 0.2) {
    Sentry.captureMessage('[cron/store-builder-audit] taux d\'erreur élevé', {
      level: 'error',
      extra: { audited, skipped, errors, checked: connections?.length ?? 0 },
    })
  }

  return NextResponse.json({ audited, skipped, errors, checked: connections?.length ?? 0 })
}
