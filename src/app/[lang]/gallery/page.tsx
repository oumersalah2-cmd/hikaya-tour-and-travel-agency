import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import GalleryPageContent from "@/components/gallery/GalleryPageContent";
import { getVisibleGallery } from "@/lib/gallery";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title =
    lang === "am"
      ? "የጉዞ ጋለሪ"
      : lang === "om"
      ? "Suuraalee Imalaa"
      : "Travel Gallery";
  const description =
    lang === "am"
      ? "የሂካያ የምዕመናን ቡድኖች ፎቶዎች — በመዲና ዚያራና ጉብኝት ወቅት።"
      : lang === "om"
      ? "Suuraalee imala garee HIKAYA — ziyaaraa Madiinaa fi daawwannaa."
      : "Photos from HIKAYA pilgrim groups on their Madinah ziyarat and tours.";
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/gallery` },
  };
}

export default async function GalleryPage() {
  const items = await getVisibleGallery();
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8 dark:bg-dark-500">
        <div className="mx-auto max-w-7xl">
          <GalleryPageContent items={items} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
