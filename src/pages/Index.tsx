import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <FeaturedProperties />
        <Features />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
