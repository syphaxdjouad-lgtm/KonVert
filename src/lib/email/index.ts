import { Resend } from 'resend'

export type TrialEmailStep = 0 | 3 | 7 | 10 | 13 | 14

// Lazy init — évite l'erreur au build si RESEND_API_KEY n'est pas définie
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY manquante')
  return new Resend(key)
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'KONVERT <onboarding@konvert.app>',
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const resend = getResend()
  const { data, error } = await resend.emails.send({ from, to, subject, html })
  if (error) throw new Error(`[email] Resend error: ${error.message}`)
  return data
}
