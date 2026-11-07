import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import SearchBooking from "@/components/home/SearchBooking";
import TrustPillars from "@/components/home/TrustPillars";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import PopularDestinations from "@/components/home/PopularDestinations";
import UmrahTimeline from "@/components/home/UmrahTimeline";
import ZiyaratHub from "@/components/home/ZiyaratHub";
import FounderSection from "@/components/home/FounderSection";
import BookingWorkflow from "@/components/home/BookingWorkflow";
import DiasporaSection from "@/components/home/DiasporaSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OfficeDeskSection from "@/components/home/OfficeDeskSection";
import StatsSection from "@/components/home/StatsSection";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import GallerySection from "@/components/home/GallerySection";
import { getVisibleGallery } from "@/lib/gallery";

export default async function Home() {
  const gallery = await getVisibleGallery();
  return (
    <>
      <Navbar />
      <main id="main">
        <HeroSection />
        <SearchBooking />
        <TrustPillars />
        <ServicesSection />
        <FeaturedPackages />
        <PopularDestinations />
        <UmrahTimeline />
        <ZiyaratHub />
        <FounderSection />
        <GallerySection items={gallery.slice(0, 8)} total={gallery.length} />
        <BookingWorkflow />
        <DiasporaSection />
        <WhyChooseUs />
        <OfficeDeskSection />
        <StatsSection />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
