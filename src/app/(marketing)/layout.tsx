import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import CookieBanner from '@/components/marketing/CookieBanner'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import StickyMobileCTA from '@/components/marketing/StickyMobileCTA'
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
      <StickyMobileCTA />
      <ExitIntentPopup />
    </>
  )
}
