"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingModal from "@/components/ui/BookingModal";
import TourCard from "@/components/packages/TourCard";
import TourDetailsModal from "@/components/packages/TourDetailsModal";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip, type PackageCategory } from "@/context/TripContext";
import type { Package } from "@/data/packages";
import { useSite } from "@/context/SiteContext";

export default function FeaturedPackages() {
  const { lang } = useLanguage();
  const { search, setCategory } = useTrip();
  const { packages } = useSite();

  // Booking Modal State (existing booking flow preserved)
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = (pkg: Package) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
  };

  // Details Modal State
  const [detailsPkg, setDetailsPkg] = useState<Package | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const closeDetails = useCallback(() => setDetailsOpen(false), []);
  const openDetails = (pkg: Package) => {
    setDetailsPkg(pkg);
    setDetailsOpen(true);
  };

  const filters: { id: PackageCategory; label: string }[] = [
    {
      id: "all",
      label: lang === "am" ? "ሁሉም" : lang === "om" ? "Hunda" : "All",
    },
    {
      id: "umrah",
      label: lang === "am" ? "ኡምራ" : lang === "om" ? "Umraa" : "Umrah",
    },
    {
      id: "tours",
      label: lang === "am" ? "የኢትዮጵያ ቱሮች" : lang === "om" ? "Daawwannaa Itoophiyaa" : "Ethiopia Tours",
    },
    {
      id: "travel",
      label: lang === "am" ? "በረራና ሆቴል" : lang === "om" ? "Xiyyaaraa fi Hoteela" : "Flights & Hotels",
    },
  ];

  const visible = packages.filter((pkg) => {
    if (search.packageId) return pkg.id === search.packageId;
    return search.category === "all" || pkg.category === search.category;
  });

  return (
    <section id="packages" className="relative overflow-hidden bg-gray-50 py-24 scroll-mt-20 dark:bg-dark-500/50">
      <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-accent-400/10 opacity-50 blur-3xl dark:opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={
            lang === "am"
              ? "ግልጽ ዋጋና የጉዞ ዙሮች"
              : lang === "om"
              ? "Gatii Ifaa & Paakeejota"
              : "Transparent Pricing & Rounds"
          }
          title={
            lang === "am"
              ? "ተመራጭ የኡምራና የጉዞ ፓኬጆች"
              : lang === "om"
              ? "Paakeejota Umraa fi Imalaa Filatamoo"
              : "Featured Umrah & Travel Packages"
          }
          description={
            lang === "am"
              ? "ግልጽ የክፍልና የዋጋ ዝርዝር፣ ታሪካዊ ዚያራዎችን ያካተተ እና ያለ ቅድመ ፓስፖርት የሚሰጥ ዋጋ።"
              : lang === "om"
              ? "Gatii ifa ta'e, kutaa filatamaa, ziyaaraa guutuu waliin, fi paaspoortii dura hin barbaachisne."
              : "Clear quotations with room occupancy breakdown, historical Ziyarat included, and no upfront passport documents."
          }
        />

        {/* Category Filter Pills */}
        <div
          className="-mt-6 mb-10 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label={lang === "am" ? "ፓኬጆችን ለይ" : lang === "om" ? "Paakeejota calalisi" : "Filter packages"}
        >
          {filters.map((f) => {
            const active = !search.packageId && search.category === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(f.id)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-accent-600 bg-accent-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-primary-700 hover:border-accent-500 dark:border-dark-100 dark:bg-dark-300 dark:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Compact Tour Cards Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((pkg, index) => (
              <motion.div
                layout
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.04 }}
                className="h-full"
              >
                <TourCard
                  tour={pkg}
                  priority={index < 4}
                  onBook={openModal}
                  onViewDetails={openDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Package Details Modal / Mobile Bottom Sheet */}
      <TourDetailsModal
        tour={detailsPkg}
        isOpen={detailsOpen}
        onClose={closeDetails}
        onBook={(tour) => {
          closeDetails();
          openModal(tour);
        }}
      />

      {/* Existing Booking Modal (Kept completely intact) */}
      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        packageTitle={selectedPkg?.title}
        packagePrice={selectedPkg?.price}
      />
    </section>
  );
}
