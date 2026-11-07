import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import GalleryPageContent from "@/components/gallery/GalleryPageContent";
import { getVisibleGallery } from "@/lib/gallery";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const om = isLocale(lang) && lang === "om";
  return {
    title: om ? "Suuraalee Imalaa" : "Travel Gallery",
    description: om
      ? "Suuraalee imala garee HIKAYA — ziyaaraa Madiinaa fi daawwannaa."
      : "Photos from HIKAYA pilgrim groups on their Madinah ziyarat and tours.",
    alternates: { canonical: `/${lang}/gallery` },
  };
}

export default async function GalleryPage() {
  const items = await getVisibleGallery();
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen px-4 pb-24 pt-32 sm:px-6 lg:px-8 dark:bg-dark-500">
        <div className="mx-auto max-w-7xl">
          <GalleryPageContent items={items} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
