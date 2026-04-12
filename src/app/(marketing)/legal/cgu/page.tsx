import Link from 'next/link'

export const metadata = { title: "Conditions Générales d'Utilisation — Konvert" }

export default function CguPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
        <div className="mb-10">
          <Link href="/" className="text-sm text-[#5B47F5] hover:underline">← Retour</Link>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-3">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Konvert, éditée par Konvert SAS, et disponible à l'adresse <strong>konvert.app</strong>. En accédant à la plateforme, vous acceptez sans réserve les présentes CGU.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description du service</h2>
            <p>Konvert est un outil SaaS permettant aux e-commerçants de générer automatiquement des landing pages et fiches produits optimisées pour la conversion, à partir d'une URL produit ou d'informations saisies manuellement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accès au service</h2>
            <p>L'accès à Konvert nécessite la création d'un compte avec une adresse email valide. Un essai gratuit de 14 jours est disponible sans carte bancaire. Passé ce délai, l'accès est conditionné à la souscription d'un abonnement payant.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Utilisation acceptable</h2>
            <p>L'utilisateur s'engage à utiliser Konvert uniquement à des fins licites et conformes aux présentes CGU. Il est notamment interdit de :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Reproduire, copier ou revendre l'accès à la plateforme sans autorisation</li>
              <li>Utiliser le service pour générer du contenu illégal, trompeur ou contrefait</li>
              <li>Tenter de contourner les mesures de sécurité ou d'accéder à des comptes tiers</li>
              <li>Scraper ou extraire massivement des données de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Propriété intellectuelle</h2>
            <p>Le contenu généré par Konvert à partir des informations fournies par l'utilisateur appartient à ce dernier. La plateforme, son code source, son design et sa marque restent la propriété exclusive de Konvert SAS.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Abonnements et paiements</h2>
            <p>Les abonnements sont facturés mensuellement ou annuellement via Stripe. Tout abonnement commencé est dû en intégralité. Le remboursement peut être demandé dans les 7 jours suivant la première facturation en contactant support@konvert.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Résiliation</h2>
            <p>L'utilisateur peut résilier son abonnement à tout moment depuis son tableau de bord. La résiliation prend effet à la fin de la période en cours. Konvert SAS se réserve le droit de suspendre ou résilier tout compte en cas de violation des CGU.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation de responsabilité</h2>
            <p>Konvert SAS ne garantit pas que le service sera disponible en permanence ni que les pages générées atteindront un taux de conversion précis. La responsabilité de Konvert SAS ne saurait excéder le montant des abonnements payés au cours des 3 derniers mois.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>Pour toute question relative aux CGU : <a href="mailto:legal@konvert.app" className="text-[#5B47F5] hover:underline">legal@konvert.app</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">Politique de confidentialité</Link>
          <Link href="/legal/mentions" className="text-[#5B47F5] hover:underline">Mentions légales</Link>
          <Link href="/legal/rgpd" className="text-[#5B47F5] hover:underline">RGPD</Link>
        </div>
      </div>
    </div>
  )
}
