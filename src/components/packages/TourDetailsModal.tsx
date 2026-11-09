"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Star,
  Clock,
  Users,
  Route,
  Check,
  MapPin,
} from "lucide-react";
import type { Package } from "@/data/packages";
import { useLanguage } from "@/context/LanguageContext";

export interface TourDetailsModalProps {
  tour: Package | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (tour: Package) => void;
}

export default function TourDetailsModal({
  tour,
  isOpen,
  onClose,
  onBook,
}: TourDetailsModalProps) {
  const { lang } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap, Escape key listener, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    prevFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLElement>(
        '[data-autofocus="true"], button'
      );
      closeBtn?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      prevFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tour) return null;

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

  const closeText =
    lang === "am" ? "ዝጋ" : lang === "om" ? "Cufi" : "Close";

  const includedTitle =
    lang === "am"
      ? "የተካተቱ አገልግሎቶች"
      : lang === "om"
      ? "Wanti Dabalame"
      : "What's Included";

  const roomTypeLabel =
    lang === "am"
      ? "የክፍል ዓይነት"
      : lang === "om"
      ? "Gosa Kutaa"
      : "Room Type";

  const durationLabel =
    lang === "am" ? "የቆይታ ጊዜ" : lang === "om" ? "Turtii" : "Duration";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-details-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 transition-opacity duration-300 sm:items-center sm:p-4"
      onClick={onClose}
    >
      {/* Modal / Bottom Sheet Box */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-all duration-300 dark:bg-dark-300 sm:max-h-[88dvh] sm:max-w-2xl sm:rounded-3xl"
      >
        {/* Mobile bottom-sheet drag indicator */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-dark-100" />
        </div>

        {/* Floating Close Button */}
        <button
          type="button"
          data-autofocus="true"
          onClick={onClose}
          aria-label={closeText}
          className="absolute right-3 top-3 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Larger Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-dark-200">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 672px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

            {/* Badges on image */}
            <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
                <Clock className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                <span>{tour.duration}</span>
              </span>
              {tour.badge && (
                <span className="inline-block rounded-full border border-white/20 bg-accent-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                  {tour.badge}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-white">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium drop-shadow">
                <MapPin className="h-4 w-4 text-accent-300 shrink-0" aria-hidden="true" />
                <span>{tour.destination}</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent-600 to-accent-500 px-3 py-1 text-xs font-extrabold text-white shadow-glow">
                {priceLabel}
              </span>
            </div>
          </div>

          {/* Details body */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Title and Rating */}
            <div>
              <h2
                id="tour-details-title"
                className="font-display text-xl font-bold text-primary-700 dark:text-white sm:text-2xl"
              >
                {tour.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Star
                    className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {tour.rating.toFixed(1)}
                  </span>
                  <span>({tour.reviews})</span>
                </div>
                {tour.price && (
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                )}
                {tour.priceETB ? (
                  <span className="font-medium text-accent-600 dark:text-accent-400">
                    {tour.priceETB} (~${tour.price.toLocaleString("en-US")})
                  </span>
                ) : (
                  <span className="font-medium text-accent-600 dark:text-accent-400">
                    ${tour.price.toLocaleString("en-US")}
                  </span>
                )}
              </div>
            </div>

            {/* Meta tags: Duration, Room Type */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-3.5 dark:bg-dark-200/60 sm:p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    {durationLabel}
                  </p>
                  <p className="truncate text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                    {tour.duration}
                  </p>
                </div>
              </div>

              {tour.occupancy && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      {roomTypeLabel}
                    </p>
                    <p className="truncate text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                      {tour.occupancy}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Route (if available) */}
            {tour.routeBadge && (
              <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-3.5 dark:border-primary-900/30 dark:bg-primary-950/20 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-800 dark:text-primary-200 sm:text-sm">
                  <Route className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                  <span>{tour.routeBadge}</span>
                </div>
              </div>
            )}

            {/* Full description */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {tour.description}
              </p>
            </div>

            {/* "What's included" checklist */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-primary-700 dark:text-white">
                  {includedTitle}
                </h3>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {tour.highlights.map((h, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-2.5 text-xs sm:text-sm text-gray-700 dark:bg-dark-200/50 dark:text-gray-200"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Book Now CTA */}
        <div className="border-t border-gray-100 bg-white p-4 dark:border-dark-100 dark:bg-dark-300 sm:p-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:scale-95 dark:border-dark-100 dark:bg-dark-200 dark:text-gray-200 dark:hover:bg-dark-100"
            >
              {closeText}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(tour);
              }}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-accent-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-accent-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            >
              {bookNowText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

