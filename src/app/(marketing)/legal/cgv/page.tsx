import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conditions Generales de Vente — Konvert',
  description: 'CGV du service Konvert — konvert.app',
}

export default function CGVPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Conditions Generales de Vente</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Derniere mise a jour : 21 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 prose prose-gray prose-sm max-w-none">

          <h2 className="text-xl font-bold text-gray-900 mt-0 mb-4">1. Objet</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les presentes Conditions Generales de Vente (ci-apres &quot;CGV&quot;) regissent les relations contractuelles
            entre Konvert SAS et tout utilisateur souscrivant a un abonnement payant au service Konvert
            (ci-apres &quot;le Client&quot;).
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
                  <td className="py-3">10 pages/mois, 1 boutique, templates standards</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-semibold">Pro</td>
                  <td className="py-3 pr-4">79 euros/mois</td>
                  <td className="py-3">50 pages/mois, 5 boutiques, tous les templates, analytics</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-semibold">Agency</td>
                  <td className="py-3 pr-4">199 euros/mois</td>
                  <td className="py-3">Pages illimitees, boutiques illimitees, white-label, support prioritaire</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">Enterprise</td>
                  <td className="py-3 pr-4">Sur devis</td>
                  <td className="py-3">Solutions personnalisees, SLA, account manager dedie</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les tarifs sont exprimes en euros, toutes taxes comprises (TTC). Konvert SAS se reserve le droit de modifier
            ses tarifs a tout moment. Toute modification sera notifiee au Client au moins 30 jours avant son application.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Souscription et paiement</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            La souscription a un abonnement s&apos;effectue en ligne sur konvert.app. Le paiement est traite de
            maniere securisee par <strong>Stripe</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">Modes de paiement acceptes :</p>
          <ul className="text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-1">
            <li>Carte bancaire (Visa, Mastercard, American Express)</li>
            <li>SEPA (prelevement automatique)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            L&apos;abonnement est mensuel et se renouvelle automatiquement a chaque date anniversaire. Le prelevement
            est effectue en debut de chaque periode de facturation.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Essai gratuit</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Konvert offre la possibilite de generer 1 page gratuitement sans creation de compte ni saisie de
            carte bancaire. Cette page d&apos;essai est disponible pendant 7 jours apres generation. Au-dela,
            l&apos;utilisateur doit souscrire a un abonnement pour acceder a ses pages et en creer de nouvelles.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Droit de retractation</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Conformement a l&apos;article L221-28 du Code de la consommation, le droit de retractation ne s&apos;applique pas
            aux contrats de fourniture de contenu numerique non fourni sur un support materiel dont l&apos;execution a
            commence avec l&apos;accord du consommateur.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Toutefois, Konvert SAS propose une <strong>garantie satisfait ou rembourse de 14 jours</strong> a compter
            de la premiere souscription. Si le Client n&apos;est pas satisfait du Service, il peut demander un remboursement
            integral en contactant <a href="mailto:contact@konvert.app" className="text-[#5B47F5] font-semibold hover:underline">contact@konvert.app</a>.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Resiliation</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Le Client peut resilier son abonnement a tout moment depuis les parametres de son tableau de bord.
            La resiliation prend effet a la fin de la periode de facturation en cours.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Aucun remboursement au prorata ne sera effectue pour la periode en cours. Apres resiliation, le Client
            conserve l&apos;acces au Service jusqu&apos;a la fin de la periode payee. Ses donnees seront conservees pendant
            30 jours puis definitivement supprimees.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Responsabilite</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            La responsabilite de Konvert SAS au titre des presentes CGV est limitee au montant des sommes effectivement
            versees par le Client au cours des 12 derniers mois. Konvert SAS ne saurait etre tenue responsable des
            dommages indirects, pertes de chiffre d&apos;affaires ou pertes de donnees.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Facturation</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Une facture est emise automatiquement a chaque prelevement et accessible depuis le tableau de bord
            du Client. Les factures sont envoyees par email a l&apos;adresse associee au compte.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Support client</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Le support est disponible par email a <a href="mailto:support@konvert.app" className="text-[#5B47F5] font-semibold hover:underline">support@konvert.app</a>.
            Les delais de reponse varient selon la formule : sous 48h pour Starter, sous 24h pour Pro, et sous 4h pour Agency et Enterprise.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">10. Droit applicable</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Les presentes CGV sont soumises au droit francais. En cas de litige, une solution amiable sera recherchee
            en priorite. A defaut, les tribunaux competents de Paris seront saisis.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">11. Mediation</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Conformement aux articles L611-1 et suivants du Code de la consommation, le Client consommateur peut
            recourir gratuitement a un mediateur de la consommation en cas de litige non resolu. Les coordonnees
            du mediateur seront communiquees sur simple demande a <a href="mailto:contact@konvert.app" className="text-[#5B47F5] font-semibold hover:underline">contact@konvert.app</a>.
          </p>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <Link href="/legal/cgu" className="text-[#5B47F5] font-semibold hover:underline">CGU</Link>
            <Link href="/legal/mentions" className="text-[#5B47F5] font-semibold hover:underline">Mentions legales</Link>
            <Link href="/legal/privacy" className="text-[#5B47F5] font-semibold hover:underline">Confidentialite</Link>
            <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">Cookies</Link>
          </div>
        </div>
      </section>
    </>
  )
}
