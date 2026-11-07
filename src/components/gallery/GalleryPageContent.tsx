"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { useLanguage } from "@/context/LanguageContext";
import type { GalleryItem } from "@/lib/store";

export default function GalleryPageContent({ items }: { items: GalleryItem[] }) {
  const { t } = useLanguage();
  return (
    <>
      <SectionHeading subtitle={t.gallery.subtitle} title={t.gallery.title} description={t.gallery.description} />
      <GalleryGrid items={items} />
    </>
  );
}
