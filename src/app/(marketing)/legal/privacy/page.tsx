import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Konvert',
  description: 'Politique de confidentialité et RGPD du service Konvert — konvertpilot.com',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-14 bg-slate-50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Politique de confidentialité</h1>
          <p className="text-sm text-slate-600">Dernière mise à jour : 1er juin 2026 — Conforme RGPD (UE &amp; UK GDPR) — v1.1.0</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Responsable du traitement</H2>
          <P>
            Le responsable du traitement des données personnelles est <strong>Luna Corporation LTD</strong>,
            société de droit anglais immatriculée sous le numéro 16526908, dont le siège social est situé
            71-75 Shelton Street, Covent Garden, London WC2H 9JQ, United Kingdom. Pour toute question relative
            à tes données personnelles : <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A>.
          </P>

          <H2>2. Données collectées</H2>

          <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">Données d&apos;identification</h3>
          <Ul items={['Nom et prénom', 'Adresse email', 'Mot de passe (chiffré)']} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données de facturation</h3>
          <Ul items={[
            'Informations de paiement (traitées par Stripe, jamais stockées sur nos serveurs)',
            'Adresse de facturation',
            'Historique des transactions',
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données d&apos;utilisation</h3>
          <Ul items={[
            'Pages générées et leur contenu',
            "Boutiques connectées (URL, tokens d'accès OAuth)",
            "Statistiques d'utilisation (nombre de pages, vues, clics)",
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données techniques</h3>
          <Ul items={[
            'Adresse IP',
            "Type de navigateur et système d'exploitation",
            'Pages visitées et durée de visite',
            'Cookies et identifiants de session',
          ]} />

          <H2>3. Finalités du traitement</H2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalité</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Base légale</th>
                  <th className="text-left py-3 font-bold text-gray-900">Durée</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Gestion du compte utilisateur', 'Exécution du contrat', 'Durée du compte + 30 jours'],
                  ['Facturation et paiements', 'Obligation légale', '10 ans (obligation comptable)'],
                  ['Génération de landing pages', 'Exécution du contrat', 'Durée du compte + 30 jours'],
                  ['Emails transactionnels et séquences', 'Intérêt légitime', "Jusqu'à désinscription"],
                  ['Amélioration du Service', 'Intérêt légitime', '26 mois (données anonymisées)'],
                  ["Mesure d'audience", 'Consentement', '13 mois'],
                ].map(([f, b, d]) => (
                  <tr key={f} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{f}</td>
                    <td className="py-3 pr-4">{b}</td>
                    <td className="py-3">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2>4. Sous-traitants et transferts de données</H2>
          <P>
            Pour faire fonctionner KONVERT, LUNA CORPORATION LTD fait appel à des entreprises tierces (appelées &quot;sous-traitants&quot;) qui traitent certaines de tes données pour notre compte, dans le strict cadre de la mission qu&apos;on leur confie. C&apos;est une obligation de transparence prévue par l&apos;article 28 du RGPD. Chaque sous-traitant est contractuellement tenu de protéger tes données et de ne les utiliser que pour la finalité déclarée.
          </P>
          <P>
            Lorsque des données sont transférées hors de l&apos;Union européenne, ce transfert est encadré par un mécanisme juridique reconnu par la Commission européenne (articles 44 à 49 du RGPD) : soit une décision d&apos;adéquation (le pays offre un niveau de protection équivalent à l&apos;UE), soit les Clauses Contractuelles Types (CCT/SCC — des clauses juridiques standard approuvées par la Commission), soit le Data Privacy Framework (DPF — accord UE-USA en vigueur depuis juillet 2023).
          </P>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Sous-traitant</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalité</th>
                  <th className="text-left py-3 font-bold text-gray-900">Localisation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Supabase', 'Base de données et authentification', 'EU (Francfort)'],
                  ['Vercel', 'Hébergement (région cdg1 Paris)', 'France'],
                  ['Stripe', 'Paiement', 'EU / USA (SCC)'],
                  ['Resend', "Envoi d'emails", 'USA (SCC)'],
                  ['Anthropic (Claude AI)', 'Génération de contenu', 'USA (SCC)'],
                ].map(([name, purpose, loc]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium">{name}</td>
                    <td className="py-3 pr-4">{purpose}</td>
                    <td className="py-3">{loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Sous-traitants additionnels</h3>

          {/* DeepSeek */}
          <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-2">DeepSeek (Hangzhou DeepSeek Artificial Intelligence Co., Ltd.)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Finalité :</strong> Génération automatique de textes pour tes pages produit (copy, descriptions, accroches). DeepSeek est l&apos;un des modèles de langage IA que KONVERT utilise pour produire du contenu à ta place.</li>
              <li><strong>Données traitées :</strong> Prompts techniques contenant l&apos;URL de la page produit à analyser, le nom du produit, la catégorie et les paramètres de génération choisis. Par défaut, aucune donnée permettant de t&apos;identifier directement (email, nom, identifiant de compte) n&apos;est incluse dans les prompts envoyés à DeepSeek. Nous appliquons une politique de minimisation des données : seul le strict nécessaire à la génération est transmis.</li>
              <li><strong>Localisation :</strong> République populaire de Chine (serveurs en Chine) — avec capacité de traitement aux États-Unis selon leur infrastructure.</li>
              <li><strong>Base légale du transfert (hors EU) :</strong> La Chine ne bénéficie pas d&apos;une décision d&apos;adéquation de la Commission européenne (RGPD Art. 44). En l&apos;absence de SCC formellement signées avec DeepSeek à ce jour, le transfert repose sur la minimisation et l&apos;anonymisation des données transmises. Une évaluation régulière du risque est effectuée. Si tu souhaites que tes pages soient générées sans recourir à DeepSeek, contacte-nous à <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A>.</li>
              <li><strong>Durée de conservation :</strong> Les données transmises ne sont pas stockées de manière persistante par DeepSeek au-delà du temps de traitement nécessaire à la génération (durée de la requête API), selon leur politique de confidentialité.</li>
              <li><strong>Politique DeepSeek :</strong> <A href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html">deepseek-privacy-policy.html</A></li>
            </ul>
          </div>

          {/* Meta CAPI */}
          <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-2">Meta Platforms (Conversions API — Meta CAPI)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Finalité :</strong> Mesure de la performance des campagnes publicitaires Meta (Facebook, Instagram) via l&apos;API Conversions server-side. Meta CAPI nous permet de transmettre les événements de conversion directement depuis nos serveurs, sans dépendre du navigateur.</li>
              <li><strong>Données traitées :</strong> Événements de conversion (type d&apos;action, horodatage, valeur), identifiants hachés (email haché en SHA-256, IP hachée) uniquement si tu as donné ton consentement explicite. Aucune donnée n&apos;est transmise à Meta sans ton accord préalable.</li>
              <li><strong>Localisation :</strong> États-Unis (Meta Platforms, Inc., 1 Meta Way, Menlo Park, CA 94025, USA) — entités européennes traitant les données EU : Meta Platforms Ireland Limited.</li>
              <li><strong>Base légale du transfert (hors EU) :</strong> Data Privacy Framework UE-USA (DPF) — Meta est certifiée. + Clauses Contractuelles Types (SCC) via les Meta Data Processing Terms.</li>
              <li><strong>Consentement requis :</strong> Oui. Le pixel Meta et Meta CAPI sont activés uniquement après ton accord explicite dans le bandeau cookies. Si tu refuses les cookies marketing, aucune donnée n&apos;est transmise à Meta. Tu peux modifier ton choix à tout moment via notre page <Link href="/legal/cookies" className="text-[#5B47F5] hover:underline">/legal/cookies</Link>.</li>
              <li><strong>Durée de conservation :</strong> Selon la politique Meta — données publicitaires conservées 180 jours par défaut dans Meta Ads Manager.</li>
              <li><strong>Lien DPA / Politique :</strong> <A href="https://www.facebook.com/legal/terms/dataprocessing">facebook.com/legal/terms/dataprocessing</A></li>
            </ul>
          </div>

          {/* GA4 */}
          <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-2">Google LLC (Analytics 4 — GA4)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Finalité :</strong> Mesure d&apos;audience et analyse du comportement des visiteurs sur konvertpilot.com. GA4 nous permet de comprendre quelles pages sont les plus visitées, d&apos;où viennent les utilisateurs, et comment améliorer le service.</li>
              <li><strong>Données traitées :</strong> Données de navigation (pages visitées, durée de session, actions cliquées), identifiant de session anonymisé, adresse IP tronquée (anonymisation activée — le dernier octet de l&apos;IP est supprimé avant stockage), type de navigateur, pays de connexion. Aucun nom ni email n&apos;est transmis à Google Analytics.</li>
              <li><strong>Localisation :</strong> États-Unis (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) — traitement EU disponible via la fonctionnalité de localisation des données GA4.</li>
              <li><strong>Base légale du transfert (hors EU) :</strong> Data Privacy Framework UE-USA (DPF) — Google est certifiée. + Clauses Contractuelles Types (SCC) via les Data Processing Terms Google Analytics.</li>
              <li><strong>Consentement requis :</strong> Oui. GA4 est activé uniquement après ton accord explicite dans le bandeau cookies (catégorie &quot;Analytics&quot;). Si tu refuses les cookies analytics, aucune donnée n&apos;est transmise à Google Analytics. Tu peux modifier ton choix à tout moment via notre page <Link href="/legal/cookies" className="text-[#5B47F5] hover:underline">/legal/cookies</Link>.</li>
              <li><strong>Durée de conservation :</strong> 14 mois (paramétrage GA4 minimal retenu par KONVERT) — données anonymisées conservées 26 mois.</li>
              <li><strong>Lien DPA / Politique :</strong> <A href="https://support.google.com/analytics/answer/3379636">support.google.com/analytics/answer/3379636</A></li>
            </ul>
          </div>

          {/* TikTok — TODO: retirer si campagnes TikTok pas encore actives au J0 */}
          <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-2">TikTok for Business (TikTok Ads — pixel + Events API)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Finalité :</strong> Mesure de la performance des campagnes publicitaires TikTok et ciblage publicitaire. Le pixel TikTok et l&apos;Events API permettent de tracer les conversions (abonnements, essais) pour optimiser les campagnes.</li>
              <li><strong>Données traitées :</strong> Événements de conversion (type d&apos;action, horodatage, valeur de commande), identifiants hachés (email haché en SHA-256) uniquement avec ton consentement. Aucune donnée n&apos;est transmise à TikTok sans ton accord préalable.</li>
              <li><strong>Localisation :</strong> TikTok Technology Limited (Irlande) pour les utilisateurs EU/EEE — siège européen : Dublin, Irlande. Traitement possible également depuis Singapour (TikTok Pte. Ltd.) et États-Unis.</li>
              <li><strong>Base légale du transfert (hors EU) :</strong> Clauses Contractuelles Types (SCC) via les TikTok Data Processing Terms pour les transferts hors EEE.</li>
              <li><strong>Consentement requis :</strong> Oui. Le pixel TikTok est activé uniquement après ton accord explicite dans le bandeau cookies (catégorie &quot;Marketing&quot;). Si tu refuses les cookies marketing, aucune donnée n&apos;est transmise à TikTok. Tu peux modifier ton choix à tout moment via notre page <Link href="/legal/cookies" className="text-[#5B47F5] hover:underline">/legal/cookies</Link>.</li>
              <li><strong>Durée de conservation :</strong> Selon la politique TikTok for Business — données événements conservées 13 mois maximum.</li>
              <li><strong>Lien DPA / Politique :</strong> <A href="https://ads.tiktok.com/i18n/official/policy/data-processing-terms">ads.tiktok.com — Data Processing Terms</A></li>
            </ul>
          </div>

          {/* Crisp */}
          <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-2">Crisp (Crisp IM SAS)</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Finalité :</strong> Support client et chat en direct. Crisp est l&apos;outil que tu utilises pour nous contacter directement via la bulle de chat en bas à droite de konvertpilot.com.</li>
              <li><strong>Données traitées :</strong> Contenu des messages échangés avec le support, adresse email si tu la fournis dans le chat, adresse IP, informations de session (navigateur, page en cours au moment du contact).</li>
              <li><strong>Localisation :</strong> France — Crisp IM SAS est une société française basée à Nantes. Les données sont hébergées en Europe.</li>
              <li><strong>Base légale du transfert :</strong> Aucun transfert hors EU — Crisp est une société française, données hébergées en Europe.</li>
              <li><strong>Durée de conservation :</strong> Conversations conservées pendant la durée du compte + 6 mois après résiliation. Tu peux demander la suppression de tes conversations via <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A>.</li>
              <li><strong>Lien DPA / Politique :</strong> <A href="https://crisp.chat/fr/privacy/">crisp.chat/fr/privacy/</A></li>
            </ul>
          </div>

          <P>
            Cette liste est mise à jour à chaque ajout ou changement de sous-traitant. Si tu veux savoir avec précision quelles données ont été transmises à quel sous-traitant en ton nom, tu peux exercer ton droit d&apos;accès via <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A>.
          </P>

          <H2>5. Tes droits sur tes données (RGPD Art. 15 à 22)</H2>
          <P>
            Le RGPD te donne un ensemble de droits sur tes données personnelles. Tu peux les exercer à tout moment en nous écrivant à <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A>. On te répondra dans un délai maximum de 30 jours (délai légal, article 12 du RGPD). Si ta demande est complexe, ce délai peut être prolongé de 2 mois — on te prévient dans ce cas dans les 30 premiers jours.
          </P>
          <ul className="text-sm text-gray-600 leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li><strong>Droit d&apos;accès (Art. 15) :</strong> tu peux demander une copie de toutes les données personnelles que KONVERT détient sur toi, dans un format lisible.</li>
            <li><strong>Droit de rectification (Art. 16) :</strong> si des données sont incorrectes ou incomplètes, tu peux les faire corriger. Les informations de base (email, nom) sont modifiables directement depuis ton compte.</li>
            <li><strong>Droit à l&apos;effacement — &quot;droit à l&apos;oubli&quot; (Art. 17) :</strong> tu peux demander la suppression de toutes tes données personnelles. Attention : certaines données de facturation doivent être conservées 10 ans par obligation légale comptable et ne peuvent pas être effacées avant ce délai.</li>
            <li><strong>Droit à la portabilité (Art. 20) :</strong> tu peux recevoir tes données dans un format structuré et lisible par machine (JSON ou CSV) pour les transférer vers un autre service.</li>
            <li><strong>Droit d&apos;opposition (Art. 21) :</strong> tu peux t&apos;opposer au traitement de tes données basé sur notre intérêt légitime (ex : amélioration du service, analytics non-consentis). Tu peux aussi te désinscrire de nos emails marketing à tout moment via le lien de désinscription présent en bas de chaque email.</li>
            <li><strong>Droit à la limitation (Art. 18) :</strong> tu peux demander la suspension temporaire du traitement de tes données (par exemple, pendant que tu contestes leur exactitude).</li>
            <li><strong>Droit de retirer ton consentement (Art. 7) :</strong> pour tous les traitements basés sur ton consentement (cookies analytics, cookies marketing), tu peux retirer ton accord à tout moment via notre page <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">/legal/cookies</Link>. Le retrait n&apos;affecte pas les traitements effectués avant.</li>
          </ul>
          <P>
            <strong>Comment exercer tes droits :</strong> Envoie un email à <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A> en indiquant clairement le droit que tu souhaites exercer. Pour qu&apos;on puisse vérifier ton identité et éviter toute usurpation, on te demandera une confirmation via l&apos;adresse email associée à ton compte. Tu peux aussi passer par notre page <Link href="/contact" className="text-[#5B47F5] font-semibold hover:underline">/contact</Link>.
          </P>
          <P>
            <strong>Mise en oeuvre technique en cours :</strong> Les routes d&apos;export automatique de données (Art. 15 et 20) et de suppression de compte automatique (Art. 17) sont en cours de déploiement. En attendant, toutes les demandes sont traitées manuellement via <A href="mailto:privacy@konvertpilot.com">privacy@konvertpilot.com</A> dans le délai de 30 jours garanti.
          </P>
          <P>Si tu estimes que le traitement de tes données ne respecte pas le RGPD, tu as le droit de déposer une plainte auprès d&apos;une autorité de protection des données :</P>
          <ul className="text-sm text-gray-600 leading-relaxed mb-4 list-disc pl-5 space-y-1">
            <li>En France : <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) — <strong>cnil.fr</strong></li>
            <li>Au Royaume-Uni : <strong>ICO</strong> (Information Commissioner&apos;s Office) — <strong>ico.org.uk</strong></li>
            <li>Dans tout autre État membre de l&apos;UE : l&apos;autorité de contrôle de ton pays de résidence</li>
          </ul>

          <H2>6. Sécurité des données</H2>
          <P>Nous mettons en place les mesures suivantes pour protéger tes données :</P>
          <Ul items={[
            'Chiffrement des données en transit (TLS 1.3) et au repos',
            'Authentification sécurisée avec hachage bcrypt des mots de passe',
            'Row Level Security (RLS) sur toutes les tables de la base de données',
            "Tokens d'accès OAuth chiffrés pour les intégrations tierces",
            'Revue régulière des accès et des permissions',
          ]} />

          <H2>7. Cookies</H2>
          <P>
            Notre utilisation des cookies est détaillée dans notre{' '}
            <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">politique de cookies</Link>.
          </P>

          <H2>8. Modifications</H2>
          <P>
            Nous pouvons mettre à jour cette politique périodiquement. Toute modification substantielle sera notifiée
            par email ou par notification dans le Service au moins 15 jours avant son entrée en vigueur.
          </P>

          <H2>9. Intelligence artificielle et AI Act</H2>
          <P>
            KONVERT est un service de génération de contenu par intelligence artificielle. Les textes produits pour tes pages produit (descriptions, accroches, arguments de vente) sont générés automatiquement par des modèles de langage IA, notamment Claude (Anthropic) et DeepSeek.
          </P>
          <P><strong>Ce que ça veut dire concrètement :</strong></P>
          <Ul items={[
            "Les contenus générés par KONVERT sont produits par une IA, pas écrits par un humain.",
            "Tu restes le seul responsable des pages que tu publies — vérifie toujours que le contenu généré est exact, légal et conforme à ta réalité commerciale avant de le publier.",
            "KONVERT ne garantit pas l'exactitude des affirmations contenues dans les textes générés. Les chiffres, statistiques et allégations doivent être vérifiés par tes soins.",
          ]} />
          <P>
            <strong>Conformité AI Act (Règlement UE 2024/1689) :</strong> Conformément à l&apos;article 50 du Règlement européen sur l&apos;intelligence artificielle (AI Act), une mention explicite &quot;Contenu généré avec assistance IA&quot; sera ajoutée de manière visible sur chaque page produit générée via KONVERT, à compter du 2 août 2026 (date d&apos;entrée en vigueur de l&apos;obligation de transparence).
          </P>
          <P>
            Une métadonnée machine-readable sera également intégrée dans le code des pages générées (<code className="text-xs bg-gray-100 px-1 rounded">{'<meta name="ai-generated" content="true">'}</code>) pour permettre une identification automatisée des contenus IA, conformément à l&apos;article 50(2) du AI Act.
          </P>
          <P last>
            Nous conservons des logs de génération (horodatage, identifiant session, modèle utilisé, empreinte de l&apos;output) pour permettre l&apos;auditabilité de nos systèmes IA, conformément aux exigences du AI Act.
          </P>

          <Nav current="privacy" />
        </div>
      </section>
    </>
  )
}

function H2({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return <h2 className={`text-xl font-bold text-gray-900 mb-4 ${first ? 'mt-0' : 'mt-8'}`}>{children}</h2>
}
function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <p className={`text-sm text-gray-600 leading-relaxed ${last ? 'mb-0' : 'mb-4'}`}>{children}</p>
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-[#5B47F5] font-semibold hover:underline">{children}</a>
}
function Ul({ items }: { items: string[] }) {
  return (
    <ul className="text-sm text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-1">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}
function Nav({ current }: { current: string }) {
  const links = [
    { href: '/legal/cgu', label: 'CGU' },
    { href: '/legal/cgv', label: 'CGV' },
    { href: '/legal/privacy', label: 'Confidentialité' },
    { href: '/legal/cookies', label: 'Cookies' },
    { href: '/legal/mentions', label: 'Mentions légales' },
  ]
  return (
    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
      {links.filter(l => !l.href.endsWith(current)).map(l => (
        <Link key={l.href} href={l.href} className="text-[#5B47F5] font-semibold hover:underline">{l.label}</Link>
      ))}
    </div>
  )
}
