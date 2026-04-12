import Link from 'next/link'

export const metadata = { title: 'RGPD — Konvert' }

export default function RgpdPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
        <div className="mb-10">
          <Link href="/" className="text-sm text-[#5B47F5] hover:underline">← Retour</Link>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-3">Conformité RGPD</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Notre engagement</h2>
            <p>Konvert respecte le Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679). La protection de vos données personnelles est une priorité pour nous.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Vos droits RGPD</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {[
                { title: 'Droit d\'accès', desc: 'Obtenir une copie de toutes vos données personnelles.' },
                { title: 'Droit de rectification', desc: 'Corriger des informations inexactes vous concernant.' },
                { title: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données ("droit à l\'oubli").' },
                { title: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format lisible par machine.' },
                { title: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données à des fins marketing.' },
                { title: 'Droit à la limitation', desc: 'Restreindre temporairement le traitement de vos données.' },
              ].map(({ title, desc }) => (
                <div key={title} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Comment exercer vos droits</h2>
            <p>Envoyez votre demande par email à <a href="mailto:privacy@konvert.app" className="text-[#5B47F5] hover:underline">privacy@konvert.app</a> avec la mention "Demande RGPD" en objet. Nous répondrons dans un délai maximum de 30 jours.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Localisation des données</h2>
            <p>Vos données sont hébergées et traitées en Europe. Notre infrastructure Vercel est déployée dans la région Paris (cdg1). Supabase stocke vos données dans l'UE.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Sécurité</h2>
            <p>Nous appliquons les mesures de sécurité suivantes : chiffrement TLS en transit, mots de passe hashés (bcrypt), Row Level Security (RLS) sur Supabase, authentification JWT avec expiration.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">DPO</h2>
            <p>Notre délégué à la protection des données peut être contacté à : <a href="mailto:privacy@konvert.app" className="text-[#5B47F5] hover:underline">privacy@konvert.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Réclamation</h2>
            <p>Vous pouvez déposer une plainte auprès de la CNIL : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-[#5B47F5] hover:underline">cnil.fr/fr/plaintes</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/legal/cgu" className="text-[#5B47F5] hover:underline">CGU</Link>
          <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">Confidentialité</Link>
          <Link href="/legal/mentions" className="text-[#5B47F5] hover:underline">Mentions légales</Link>
        </div>
      </div>
    </div>
  )
}
