import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy client Supabase service_role exposé comme un Proxy.
//
// Pourquoi : avant, chaque route `api/*` faisait
//   const supabaseAdmin = createClient(URL!, KEY!)
// au top-level du module. Depuis Next 16.2.6, l'étape "Collecting page data"
// du build exécute ce code, et si NEXT_PUBLIC_SUPABASE_URL n'est pas exposée
// au build (ce qui peut arriver selon le scope env Vercel), createClient lève
// "supabaseUrl is required" et le déploiement échoue.
//
// Solution : on n'instancie le client qu'au premier accès à une de ses méthodes
// (.from, .rpc, .storage…) — donc à runtime, jamais au build. Le Proxy permet
// de garder le pattern d'usage `supabaseAdmin.from(...)` partout sans modifier
// les call sites.

let cached: SupabaseClient | null = null

function init(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase admin : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis. ' +
      'Vérifie les env vars Vercel (scope Production + Preview).'
    )
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = init() as unknown as Record<string | symbol, unknown>
    const value = instance[prop]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(instance) : value
  },
})

// Alias factory pour les rares cas où on veut explicitement instancier
// (tests, scripts manuels, logique conditionnelle).
export function getSupabaseAdmin(): SupabaseClient {
  return init()
}
