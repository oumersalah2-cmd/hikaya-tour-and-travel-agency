"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { useLanguage } from "@/context/LanguageContext";
import type { GalleryItem } from "@/lib/store";

export default function GallerySection({ items, total }: { items: GalleryItem[]; total: number }) {
  const { lang, t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="section-padding bg-white dark:bg-dark-500">
      <div className="mx-auto max-w-7xl">
        <SectionHeading subtitle={t.gallery.subtitle} title={t.gallery.title} description={t.gallery.description} />
        <GalleryGrid items={items} />
        {total > items.length && (
          <div className="mt-12 text-center">
            <Link href={`/${lang}/gallery`} className="btn-primary px-8 py-4">
              {t.gallery.viewAll} ({total})
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
