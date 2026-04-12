import Link from 'next/link'

export const metadata = { title: 'Politique de Confidentialité — Konvert' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
        <div className="mb-10">
          <Link href="/" className="text-sm text-[#5B47F5] hover:underline">← Retour</Link>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-3">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>Konvert SAS, Paris, France. Contact : <a href="mailto:privacy@konvert.app" className="text-[#5B47F5] hover:underline">privacy@konvert.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Données de compte :</strong> nom, adresse email, mot de passe (hashé)</li>
              <li><strong>Données d'utilisation :</strong> pages créées, templates utilisés, stores connectés</li>
              <li><strong>Données de paiement :</strong> gérées exclusivement par Stripe (nous ne stockons pas vos données bancaires)</li>
              <li><strong>Données techniques :</strong> adresse IP, navigateur, logs d'accès</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Fourniture et amélioration du service Konvert</li>
              <li>Gestion des abonnements et de la facturation</li>
              <li>Envoi d'emails transactionnels et de notifications produit</li>
              <li>Analyse d'usage pour améliorer l'expérience utilisateur</li>
              <li>Prévention de la fraude et sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Base légale</h2>
            <p>Le traitement est fondé sur : l'exécution du contrat (abonnement), le consentement (emails marketing), et l'intérêt légitime (sécurité, analytics).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sous-traitants</h2>
            <p>Nous utilisons les services suivants :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — base de données et authentification (hébergé en Europe)</li>
              <li><strong>Stripe</strong> — paiements en ligne</li>
              <li><strong>Vercel</strong> — hébergement de l'application (région Paris)</li>
              <li><strong>Anthropic</strong> — génération de contenu IA (Claude)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Conservation des données</h2>
            <p>Vos données sont conservées pendant toute la durée de votre abonnement et 3 ans après sa résiliation, sauf obligation légale contraire.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits d'accès, rectification, suppression, portabilité, limitation et opposition. Pour exercer ces droits : <a href="mailto:privacy@konvert.app" className="text-[#5B47F5] hover:underline">privacy@konvert.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>Konvert utilise des cookies techniques nécessaires au fonctionnement du service (session, authentification) et des cookies analytiques anonymisés. Vous pouvez les désactiver via les paramètres de votre navigateur.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Réclamations</h2>
            <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#5B47F5] hover:underline">cnil.fr</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/legal/cgu" className="text-[#5B47F5] hover:underline">CGU</Link>
          <Link href="/legal/mentions" className="text-[#5B47F5] hover:underline">Mentions légales</Link>
          <Link href="/legal/rgpd" className="text-[#5B47F5] hover:underline">RGPD</Link>
        </div>
      </div>
    </div>
  )
}
