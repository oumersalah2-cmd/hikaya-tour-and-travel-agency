import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import SearchBooking from "@/components/home/SearchBooking";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import PopularDestinations from "@/components/home/PopularDestinations";
import UmrahTimeline from "@/components/home/UmrahTimeline";
import ZiyaratHub from "@/components/home/ZiyaratHub";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import DiasporaSection from "@/components/home/DiasporaSection";
import FounderSection from "@/components/home/FounderSection";
import GallerySection from "@/components/home/GallerySection";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import OfficeDeskSection from "@/components/home/OfficeDeskSection";
import { hasContent } from "@/lib/content";
import { getVisibleGallery } from "@/lib/gallery";

/**
 * Home page flow (top to bottom):
 *  1. Hero + quick enquiry        – what we do, one clear call to action
 *  2. Services → Packages → Destinations – what you can buy
 *  3. Umrah timeline → Ziyarat    – how an Umrah trip works
 *  4. Why us → Diaspora → Founder – why people can trust HIKAYA
 *  5. Gallery → Reviews           – proof (reviews only appear once the owner adds real ones)
 *  6. FAQ → Office & contact      – answers, then the final call to action
 */
export default async function Home() {
  const [gallery, hasRealReviews] = await Promise.all([
    getVisibleGallery(),
    hasContent("testimonials"),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <HeroSection />
        <SearchBooking />
        <ServicesSection />
        <FeaturedPackages />
        <PopularDestinations />
        <UmrahTimeline />
        <ZiyaratHub />
        <WhyChooseUs />
        <FounderSection />
        <DiasporaSection />
        <GallerySection items={gallery} total={gallery.length} />
        {hasRealReviews && <Testimonials />}
        <FAQ />
        <OfficeDeskSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
