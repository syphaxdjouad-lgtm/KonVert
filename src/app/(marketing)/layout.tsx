import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import CookieBanner from '@/components/marketing/CookieBanner'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
