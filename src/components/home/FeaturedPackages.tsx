"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Star, Clock, MapPin, Users, MessageCircle, Check, Route, Send } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingModal from "@/components/ui/BookingModal";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip, type PackageCategory } from "@/context/TripContext";
import type { Package } from "@/data/packages";
import { useSite } from "@/context/SiteContext";

export default function FeaturedPackages() {
  const { lang } = useLanguage();
  const { search, setCategory } = useTrip();
  const { site, packages, whatsappLink } = useSite();

  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = (pkg: Package) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((pkg, index) => (
              <motion.article
                layout
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.06 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft transition-shadow duration-500 hover:shadow-soft-xl dark:border-dark-100 dark:bg-dark-300"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                      <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        <Clock className="h-3 w-3 text-accent-300" /> {pkg.duration}
                      </div>
                      {pkg.occupancy && (
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-medium text-gray-100 backdrop-blur-md">
                          <Users className="h-3 w-3 text-accent-300" /> {pkg.occupancy}
                        </div>
                      )}
                    </div>

                    <div className="absolute right-3 top-3 text-right">
                      {pkg.priceETB ? (
                        <div className="rounded-2xl bg-gradient-to-r from-accent-600 to-accent-500 px-3.5 py-1.5 text-right text-white shadow-glow">
                          <div className="text-[10px] font-bold uppercase leading-none tracking-wider opacity-90">
                            {lang === "am" ? "ከ" : lang === "om" ? "Ka'umsa" : "From"}
                          </div>
                          <div className="text-sm font-extrabold">{pkg.priceETB}</div>
                          <div className="text-[10px] leading-none opacity-90">~${pkg.price.toLocaleString("en-US")}</div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-gradient-to-r from-accent-600 to-accent-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-glow">
                          ${pkg.price.toLocaleString("en-US")}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-xs text-white">
                      <span className="flex min-w-0 items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-300" />
                        <span className="truncate">{pkg.destination}</span>
                      </span>
                      {pkg.badge && (
                        <span className="shrink-0 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-accent-200 backdrop-blur-md">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 font-display text-xl font-bold text-primary-700 transition-colors group-hover:text-accent-700 dark:text-white dark:group-hover:text-accent-300">
                      {pkg.title}
                    </h3>

                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex" role="img" aria-label={`${pkg.rating.toFixed(1)} / 5`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(pkg.rating)
                                ? "fill-accent-400 text-accent-400"
                                : "fill-gray-200 text-gray-200 dark:fill-dark-100 dark:text-dark-100"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {pkg.rating.toFixed(1)} ({pkg.reviews}{" "}
                        {lang === "am" ? "አስተያየቶች" : lang === "om" ? "yaada" : "reviews"})
                      </span>
                    </div>

                    {pkg.routeBadge && (
                      <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-primary-500 dark:text-primary-200">
                        <Route className="h-3.5 w-3.5 shrink-0 text-accent-700 dark:text-accent-300" />
                        {pkg.routeBadge}
                      </p>
                    )}

                    <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {pkg.description}
                    </p>

                    <ul className="mb-2 space-y-1.5">
                      {pkg.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => openModal(pkg)}
                    className="btn-primary w-full py-3 text-sm font-bold shadow-md"
                  >
                    {lang === "am"
                      ? "ቦታ ያስይዙ / ዋጋ ይጠይቁ"
                      : lang === "om"
                      ? "Iddoo Qabsiisaa / Gatii"
                      : "Book Trip / Request Quote"}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={whatsappLink(`Hello HIKAYA, I would like to book: ${pkg.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 py-2.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={site.social.telegram || "https://t.me/Hikayatravrl"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-50/40 py-2.5 text-xs font-semibold text-sky-800 transition hover:border-sky-500 hover:bg-sky-500 hover:text-white dark:border-sky-500/20 dark:bg-sky-950/20 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-white"
                    >
                      <Send className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 group-hover:text-white" />
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        packageTitle={selectedPkg?.title}
        packagePrice={selectedPkg?.price}
      />
    </section>
  );
}
