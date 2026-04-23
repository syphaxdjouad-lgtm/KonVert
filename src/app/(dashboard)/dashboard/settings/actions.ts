'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function updateProfileName(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name || name.length < 2) return { error: 'Nom trop court' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }

  const { error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', user.id)

  if (error) return { error: 'Erreur lors de la mise à jour' }
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function sendPasswordReset() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Email introuvable' }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  if (error) return { error: 'Erreur envoi email' }
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }

  // Annuler l'abonnement Stripe si existant
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single()

  if (sub?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
    } catch (err) {
      console.error('[deleteAccount] Stripe cancel error:', err)
    }
  }

  // Supprimer toutes les données utilisateur (service role pour bypasser RLS)
  await Promise.all([
    supabaseAdmin.from('analytics_events').delete().in(
      'page_id',
      (await supabaseAdmin.from('pages').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
    ),
    supabaseAdmin.from('workspace_members').delete().eq('user_id', user.id),
  ])
  await Promise.all([
    supabaseAdmin.from('pages').delete().eq('user_id', user.id),
    supabaseAdmin.from('stores').delete().eq('user_id', user.id),
    supabaseAdmin.from('subscriptions').delete().eq('user_id', user.id),
    supabaseAdmin.from('workspaces').delete().eq('owner_id', user.id),
  ])
  await supabaseAdmin.from('users').delete().eq('id', user.id)

  // Supprimer le compte Supabase Auth
  await supabaseAdmin.auth.admin.deleteUser(user.id)

  // Déconnecter côté client
  await supabase.auth.signOut()

  return { success: true }
}
