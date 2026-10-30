/**
 * Remplace `await res.json()` côté client.
 *
 * Quand une route plante (500 Vercel, timeout, page HTML d'erreur), la réponse
 * n'est pas du JSON : `res.json()` jette alors "Unexpected token 'I', "Internal S"...
 * is not valid JSON" et c'est ce message technique qui finit sous les yeux de
 * l'utilisateur. Ici on renvoie toujours un objet, avec un `error` lisible.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- même contrat que Response.json()
export async function readJson(res: Response): Promise<any> {
  let text = ''
  try {
    text = await res.text()
    return text ? JSON.parse(text) : {}
  } catch {
    return {
      success: false,
      error: serverErrorMessage(res.status),
    }
  }
}

export function serverErrorMessage(status: number): string {
  if (status === 504 || status === 408) return 'Le serveur a mis trop de temps à répondre. Réessaie dans un instant.'
  if (status === 429) return 'Trop de requêtes. Patiente quelques secondes puis réessaie.'
  return `Le serveur a rencontré une erreur (HTTP ${status}). Réessaie dans un instant — si ça persiste, contacte le support.`
}
