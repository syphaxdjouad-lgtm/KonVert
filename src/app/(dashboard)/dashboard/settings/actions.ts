'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) return { error: 'Erreur envoi email' }
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }

  // Supprimer les données utilisateur
  await Promise.all([
    supabase.from('pages').delete().eq('user_id', user.id),
    supabase.from('stores').delete().eq('user_id', user.id),
  ])
  await supabase.from('users').delete().eq('id', user.id)
  await supabase.auth.signOut()

  return { success: true }
}
