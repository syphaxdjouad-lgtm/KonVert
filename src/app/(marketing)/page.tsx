import LeadEnrichmentDemo from '@/components/marketing/LeadEnrichmentDemo'
import KonvertEasterEgg from '@/components/marketing/KonvertEasterEgg'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import LogoMarquee from '@/components/marketing/LogoMarquee'
import FAQ from '@/components/marketing/FAQ'
import RevealController from '@/components/marketing/home/RevealController'
import HeroSlider from '@/components/marketing/home/HeroSlider'
import DarkFeatureCards from '@/components/marketing/home/DarkFeatureCards'
import TemplatesPreview from '@/components/marketing/home/TemplatesPreview'
import PricingTeaser from '@/components/marketing/home/PricingTeaser'
import FinalCTA from '@/components/marketing/home/FinalCTA'
import {
  TrustBar,
  ProofSection,
  FeaturesSection,
  ABTestingSection,
  HowItWorks,
  IntegrationsSection,
  AIBuilderDemoSection,
  BuilderSection,
  AnalyticsShowcase,
  PublishSection,
  Testimonials,
} from '@/components/marketing/home/StaticSections'

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES GLOBAUX
═══════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes float-card {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-8px) rotate(0.5deg); }
    66%       { transform: translateY(-4px) rotate(-0.3deg); }
  }
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.1); }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popOut {
    from { opacity: 0; transform: scale(0.7) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes wave-move {
    0%   { transform: scaleY(1); }
    50%  { transform: scaleY(1.15); }
    100% { transform: scaleY(1); }
  }

  .marquee-track { display: flex; flex-shrink: 0; animation: marquee 40s linear infinite; }
  .marquee-wrap  { display: flex; overflow: hidden; }
  .float-anim    { animation: float 4s ease-in-out infinite; }
  .float-card    { animation: float-card 5s ease-in-out infinite; }
  .orb-anim      { animation: orb-pulse 3s ease-in-out infinite; }
  .btn-shimmer   {
    background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%);
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
  }
  .btn-shimmer:hover { animation-play-state: paused; }
  .reveal        { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible{ opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }

  .slide-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(.16,1,.3,1);
    will-change: transform;
  }
  .slide-item {
    width: 100%;
    min-width: 100%;
    flex-shrink: 0;
  }
`

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════════════════════ */
// Note : le schema SoftwareApplication + Organization est monté globalement
// dans src/app/layout.tsx via softwareApplicationSchema() + organizationSchema.
// Pas de script JSON-LD local ici pour éviter la duplication (ratingCount
// divergent 247 vs 1247 → Google peut rejeter les deux). Source unique = layout.

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <RevealController />
      <main>
        <HeroSlider />
        <LogoMarquee />
        <TrustBar />
        <ProofSection />
        <FeaturesSection />
        <LeadEnrichmentDemo />
        <HowItWorks />
        <BeforeAfter />
        <AIBuilderDemoSection />
        <BuilderSection />
        <ABTestingSection />
        <AnalyticsShowcase />
        <IntegrationsSection />
        <DarkFeatureCards />
        <PublishSection />
        <TemplatesPreview />
        <Testimonials />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>
      <KonvertEasterEgg />
    </>
  )
}
