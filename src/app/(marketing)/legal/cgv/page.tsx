import type { Metadata } from 'next'
import Link from 'next/link'
import { TEMPLATE_COUNT } from '@/lib/templates'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente — Konvert',
  description: 'CGV du service Konvert — konvertpilot.com',
}

export default function CGVPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Conditions Générales de Vente</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Dernière mise à jour : 13 mai 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 prose prose-gray prose-sm max-w-none">

          <h2 className="text-xl font-bold text-gray-900 mt-0 mb-4">1. Objet</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les présentes Conditions Générales de Vente (ci-après &quot;CGV&quot;) régissent les relations contractuelles
            entre <strong>Luna Corporation LTD</strong>, société de droit anglais immatriculée sous le numéro 16526908,
            dont le siège social est situé 71-75 Shelton Street, Covent Garden, London WC2H 9JQ, United Kingdom
            (ci-après &quot;Luna Corporation LTD&quot;), exploitant le service Konvert (ci-après &quot;le Service&quot;),
            et tout utilisateur souscrivant à un abonnement payant (ci-après &quot;le Client&quot;).
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Offres et tarifs</h2>
          <p className="text-gray-600 leading-relaxed mb-3">Konvert propose les formules d&apos;abonnement suivantes :</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Formule</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Prix mensuel</th>
                  <th className="text-left py-3 font-bold text-gray-900">Inclus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-semibold">Starter</td>
                  <td className="py-3 pr-4">39 euros/mois</td>
                  <td className="py-3">75 pages/mois, 2 boutiques, {TEMPLATE_COUNT}+ templates, export HTML</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-semibold">Pro</td>
                  <td className="py-3 pr-4">79 euros/mois</td>
                  <td className="py-3">300 pages/mois, 7 boutiques, tous les templates, analytics, copy IA</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-semibold">Agency</td>
                  <td className="py-3 pr-4">199 euros/mois</td>
                  <td className="py-3">Pages illimitées, boutiques illimitées, white-label, support prioritaire</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">Enterprise</td>
                  <td className="py-3 pr-4">Sur devis</td>
                  <td className="py-3">Solutions personnalisées, SLA, account manager dédié</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les tarifs sont exprimés en euros, toutes taxes comprises (TTC). Luna Corporation LTD se réserve le droit de modifier
            ses tarifs à tout moment. Toute modification sera notifiée au Client au moins 30 jours avant son application.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Souscription et paiement</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            La souscription à un abonnement s&apos;effectue en ligne sur konvertpilot.com. Le paiement est traité de
            manière sécurisée par <strong>Stripe</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">Modes de paiement acceptés :</p>
          <ul className="text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-1">
            <li>Carte bancaire (Visa, Mastercard, American Express)</li>
            <li>SEPA (prélèvement automatique)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            L&apos;abonnement est mensuel et se renouvelle automatiquement à chaque date anniversaire. Le prélèvement
            est effectué en début de chaque période de facturation.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Essai gratuit</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Konvert offre la possibilité de générer 1 page gratuitement sans création de compte ni saisie de
            carte bancaire. Cette page d&apos;essai est disponible pendant 7 jours après génération. Au-delà,
            l&apos;utilisateur doit souscrire à un abonnement pour accéder à ses pages et en créer de nouvelles.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Droit de rétractation</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas
            aux contrats de fourniture de contenu numérique non fourni sur un support matériel dont l&apos;exécution a
            commencé avec l&apos;accord du consommateur.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Toutefois, Luna Corporation LTD propose une <strong>garantie satisfait ou remboursé de 30 jours</strong> à compter
            de la première souscription. Si le Client n&apos;est pas satisfait du Service, il peut demander un remboursement
            intégral en contactant <a href="mailto:contact@konvertpilot.com" className="text-[#5B47F5] font-semibold hover:underline">contact@konvertpilot.com</a>.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Résiliation</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Le Client peut résilier son abonnement à tout moment depuis les paramètres de son tableau de bord.
            La résiliation prend effet à la fin de la période de facturation en cours.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Aucun remboursement au prorata ne sera effectué pour la période en cours. Après résiliation, le Client
            conserve l&apos;accès au Service jusqu&apos;à la fin de la période payée. Ses données seront conservées pendant
            30 jours puis définitivement supprimées.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Responsabilité</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            La responsabilité de Luna Corporation LTD au titre des présentes CGV est limitée au montant des sommes effectivement
            versées par le Client au cours des 12 derniers mois. Luna Corporation LTD ne saurait être tenue responsable des
            dommages indirects, pertes de chiffre d&apos;affaires ou pertes de données.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Facturation</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Une facture est émise automatiquement à chaque prélèvement et accessible depuis le tableau de bord
            du Client. Les factures sont envoyées par email à l&apos;adresse associée au compte.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Support client</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Le support est disponible par email à <a href="mailto:support@konvertpilot.com" className="text-[#5B47F5] font-semibold hover:underline">support@konvertpilot.com</a>.
            Les délais de réponse varient selon la formule : sous 48h pour Starter, sous 24h pour Pro, et sous 4h pour Agency et Enterprise.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">10. Droit applicable</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les présentes CGV sont soumises au droit anglais. Toutefois, conformément à l&apos;article 6 du Règlement
            (CE) n°593/2008 (Rome I), le Client consommateur ayant sa résidence habituelle dans un État membre de
            l&apos;Union européenne bénéficie de la protection que lui accordent les dispositions impératives de la
            loi de son pays de résidence.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le Client consommateur
            résidant dans l&apos;Union européenne peut saisir les tribunaux de son pays de résidence ou ceux de Luna
            Corporation LTD (Angleterre et Pays de Galles). Pour les Clients professionnels, les tribunaux d&apos;Angleterre
            et du Pays de Galles seront seuls compétents.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">11. Médiation</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Conformément aux articles L611-1 et suivants du Code de la consommation, le Client consommateur peut
            recourir gratuitement à un médiateur de la consommation en cas de litige non résolu. Les coordonnées
            du médiateur seront communiquées sur simple demande à <a href="mailto:contact@konvertpilot.com" className="text-[#5B47F5] font-semibold hover:underline">contact@konvertpilot.com</a>.
          </p>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <Link href="/legal/cgu" className="text-[#5B47F5] font-semibold hover:underline">CGU</Link>
            <Link href="/legal/mentions" className="text-[#5B47F5] font-semibold hover:underline">Mentions légales</Link>
            <Link href="/legal/privacy" className="text-[#5B47F5] font-semibold hover:underline">Confidentialité</Link>
            <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">Cookies</Link>
          </div>
        </div>
      </section>
    </>
  )
}
