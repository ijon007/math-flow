import { CTASection } from '@/components/landing/cta';
import { FAQSection } from '@/components/landing/faq';
import { FeaturesSection } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero';
import { PricingSection } from '@/components/landing/pricing';
import TopNav from '@/components/landing/top-nav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <main className="w-full bg-white">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
