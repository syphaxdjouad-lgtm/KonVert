import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions légales — Konvert',
  description: 'Mentions légales du site konvert.app',
}

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Mentions légales</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Dernière mise à jour : 22 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2>1. Éditeur du site</H2>
          <P>Le site <strong>konvert.app</strong> est édité par :</P>
          <ul className="text-gray-600 text-sm leading-relaxed mb-6 list-disc pl-5 space-y-1">
            <li><strong>Raison sociale :</strong> Konvert SAS</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong>Siège social :</strong> France</li>
            <li><strong>Capital social :</strong> 1 000 euros</li>
            <li><strong>Email :</strong> <A href="mailto:contact@konvert.app">contact@konvert.app</A></li>
            <li><strong>Directeur de la publication :</strong> Le Président de Konvert SAS</li>
          </ul>

          <H2>2. Hébergement</H2>
          <P>
            Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            Les données sont stockées sur des serveurs situés dans la région <strong>cdg1 (Paris, France)</strong> conformément
            à notre engagement de souveraineté des données européennes.
          </P>

          <H2>3. Propriété intellectuelle</H2>
          <P>
            L&apos;ensemble des éléments du site konvert.app (textes, images, logos, icônes, logiciels, base de données,
            structure, design, templates) est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
          </P>
          <P>
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site,
            quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Konvert SAS.
          </P>

          <H2>4. Données personnelles</H2>
          <P>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
            vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données personnelles.
          </P>
          <P>
            Pour exercer ces droits, contactez-nous à <A href="mailto:privacy@konvert.app">privacy@konvert.app</A>.
            Pour plus de détails, consultez notre <Link href="/legal/privacy" className="text-[#5B47F5] font-semibold hover:underline">politique de confidentialité</Link>.
          </P>

          <H2>5. Cookies</H2>
          <P>
            Le site utilise des cookies pour assurer son bon fonctionnement et améliorer l&apos;expérience utilisateur.
            Pour en savoir plus, consultez notre <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">politique de cookies</Link>.
          </P>

          <H2>6. Responsabilité</H2>
          <P>
            Konvert SAS s&apos;efforce de fournir des informations aussi précises que possible sur le site.
            Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes ou des carences
            dans la mise à jour de ces informations.
          </P>
          <P>
            Konvert SAS ne saurait être tenue responsable des dommages directs ou indirects causés au matériel
            de l&apos;utilisateur lors de l&apos;accès au site.
          </P>

          <H2>7. Liens hypertextes</H2>
          <P>
            Le site peut contenir des liens hypertextes vers d&apos;autres sites internet. Konvert SAS n&apos;exerce aucun
            contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </P>

          <H2>8. Droit applicable</H2>
          <P last>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </P>

          <Nav current="mentions" />
        </div>
      </section>
    </>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">{children}</h2>
}
function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <p className={`text-sm text-gray-600 leading-relaxed ${last ? 'mb-0' : 'mb-4'}`}>{children}</p>
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-[#5B47F5] font-semibold hover:underline">{children}</a>
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
