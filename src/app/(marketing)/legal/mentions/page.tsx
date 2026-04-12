import Link from 'next/link'

export const metadata = { title: 'Mentions Légales — Konvert' }

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
        <div className="mb-10">
          <Link href="/" className="text-sm text-[#5B47F5] hover:underline">← Retour</Link>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-3">Mentions Légales</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Éditeur du site</h2>
            <div className="space-y-1">
              <p><strong>Raison sociale :</strong> Konvert SAS</p>
              <p><strong>Siège social :</strong> Paris, France</p>
              <p><strong>Email :</strong> <a href="mailto:hello@konvert.app" className="text-[#5B47F5] hover:underline">hello@konvert.app</a></p>
              <p><strong>Site web :</strong> <a href="https://konvert.app" className="text-[#5B47F5] hover:underline">konvert.app</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Directeur de la publication</h2>
            <p>Le directeur de la publication est le représentant légal de Konvert SAS.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Hébergement</h2>
            <div className="space-y-1">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
              <p><strong>Région de déploiement :</strong> Paris, France (cdg1)</p>
              <p><strong>Site :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#5B47F5] hover:underline">vercel.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, design, code source, marque "Konvert") est protégé par le droit de la propriété intellectuelle et appartient à Konvert SAS. Toute reproduction, même partielle, sans autorisation préalable est interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Données personnelles</h2>
            <p>Pour toute question relative au traitement de vos données personnelles, consultez notre <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">politique de confidentialité</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
            <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement. Pour en savoir plus, consultez notre <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">politique de confidentialité</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Limitation de responsabilité</h2>
            <p>Konvert SAS ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'inaccessibilité temporaire du service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Droit applicable</h2>
            <p>Le présent site est soumis au droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux de Paris.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/legal/cgu" className="text-[#5B47F5] hover:underline">CGU</Link>
          <Link href="/legal/privacy" className="text-[#5B47F5] hover:underline">Confidentialité</Link>
          <Link href="/legal/rgpd" className="text-[#5B47F5] hover:underline">RGPD</Link>
        </div>
      </div>
    </div>
  )
}
