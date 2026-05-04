import { NextResponse } from 'next/server'

// Endpoint de health check pour monitoring / uptime checks externes.
// Volontairement minimal — ne touche PAS la DB ni les services tiers
// pour ne pas créer de dépendances qui feraient passer le check en rouge
// si Supabase a un blip alors que l'app est OK.
export const runtime = 'edge'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'konvert',
      time: new Date().toISOString(),
      region: process.env.VERCEL_REGION ?? 'unknown',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
