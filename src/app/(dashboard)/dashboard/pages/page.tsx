import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PagesClient from './PagesClient'
import type { Page, Store } from '@/types'

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: pages }, { data: stores }] = await Promise.all([
    supabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Page[]>(),
    supabase
      .from('stores')
      .select('id, name, platform')
      .eq('user_id', user.id)
      .returns<Store[]>(),
  ])

  return <PagesClient pages={pages ?? []} stores={stores ?? []} />
}
