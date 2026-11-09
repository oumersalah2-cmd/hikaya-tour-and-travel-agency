"use client";

import Image from "next/image";
import { Star, Clock } from "lucide-react";
import type { Package } from "@/data/packages";
import { useLanguage } from "@/context/LanguageContext";

export interface TourCardProps {
  tour: Package;
  onBook: (tour: Package) => void;
  onViewDetails: (tour: Package) => void;
  priority?: boolean;
}

export default function TourCard({
  tour,
  onBook,
  onViewDetails,
  priority = false,
}: TourCardProps) {
  const { lang } = useLanguage();

  const priceLabel = tour.priceETB
    ? lang === "am"
      ? `ከ ${tour.priceETB}`
      : lang === "om"
      ? `Ka'umsa ${tour.priceETB}`
      : `From ${tour.priceETB}`
    : lang === "am"
    ? `ከ $${tour.price.toLocaleString("en-US")}`
    : lang === "om"
    ? `Ka'umsa $${tour.price.toLocaleString("en-US")}`
    : `From $${tour.price.toLocaleString("en-US")}`;

  const bookNowText =
    lang === "am"
      ? "አሁኑኑ ያስይዙ"
      : lang === "om"
      ? "Amma Qabsiisaa"
      : "Book Now";

  const detailsText =
    lang === "am" ? "ዝርዝር" : lang === "om" ? "Bal'ina" : "Details";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl dark:border-dark-100 dark:bg-dark-300">
      {/* 1. Image on top (aspect ratio 4:3, object-cover, rounded corners) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-dark-200">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Small badges on image: duration top-left */}
        <div className="absolute left-2.5 top-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm">
            <Clock className="h-3 w-3 text-accent-300 shrink-0" aria-hidden="true" />
            <span>{tour.duration}</span>
          </span>
        </div>

        {/* Price badge on image: "From 150,000 ETB" */}
        <div className="absolute right-2.5 top-2.5">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent-600 to-accent-500 px-2.5 py-1 text-xs font-bold text-white shadow-glow backdrop-blur-md">
            {priceLabel}
          </span>
        </div>

        {/* Label badge on image: bottom-right */}
        {tour.badge && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="inline-block rounded-md border border-white/20 bg-black/65 px-2 py-0.5 text-[10px] font-bold text-accent-200 backdrop-blur-md shadow-sm">
              {tour.badge}
            </span>
          </div>
        )}
      </div>

      {/* 2. Content (Compact: Title, Rating, 2 Buttons) */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2">
          {/* Package title: max 2 lines, truncate with line-clamp-2 */}
          <h3
            id={`tour-title-${tour.id}`}
            title={tour.title}
            className="font-display text-base font-bold text-primary-700 transition-colors line-clamp-2 leading-snug group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-300 sm:text-lg"
          >
            {tour.title}
          </h3>

          {/* Rating in one line: ★ 5.0 (780) */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Star
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0"
              aria-hidden="true"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {tour.rating.toFixed(1)}
            </span>
            <span>({tour.reviews})</span>
          </div>
        </div>

        {/* 3. Two buttons side by side at bottom: "Book Now" and "Details" */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook(tour);
            }}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-accent-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-accent-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 sm:text-sm"
          >
            {bookNowText}
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(tour)}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs font-semibold text-primary-700 transition-colors hover:border-accent-500 hover:text-accent-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:border-dark-100 dark:bg-dark-300 dark:text-gray-200 dark:hover:border-accent-400 dark:hover:text-accent-300 sm:text-sm"
          >
            {detailsText}
          </button>
        </div>
      </div>
    </article>
  );
}

