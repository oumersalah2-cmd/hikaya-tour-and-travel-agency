"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { GalleryItem } from "@/lib/store";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { t } = useLanguage();
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  if (items.length === 0) {
    return <p className="py-12 text-center text-gray-500 dark:text-gray-400">{t.gallery.empty}</p>;
  }

  const current = active !== null ? items[active] : null;

  return (
    <>
      {/* Full-visibility natural masonry columns like before: uncropped, pure photos without text overlays */}
      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            className="mb-3 break-inside-avoid sm:mb-4"
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${t.gallery.open} ${i + 1}`}
              className="group relative block w-full overflow-hidden rounded-2xl bg-gray-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:bg-dark-300"
            >
              <Image
                src={item.thumb}
                alt={`${t.gallery.title} ${i + 1}`}
                width={item.width}
                height={item.height}
                unoptimized
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              {/* Clean hover overlay: zero text, stylish subtle zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <ZoomIn className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${t.gallery.title} ${active! + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95"
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm font-medium text-white/75">
                {active! + 1} {t.gallery.of} {items.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t.gallery.close}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-16">
              <button
                type="button"
                aria-label={t.gallery.prev}
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-2 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative h-full w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={current.src}
                    alt={`${t.gallery.title} ${active! + 1}`}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                aria-label={t.gallery.next}
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-2 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-4"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
