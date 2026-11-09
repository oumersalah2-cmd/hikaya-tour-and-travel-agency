"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";

interface HeroSlide {
  image: string;
  alt: string;
  label: { en: string; om: string; am: string };
}

const slides: HeroSlide[] = [
  {
    image: "/images/destinations/umrah-makkah.jpg",
    alt: "Makkah Al-Mukarramah Umrah Pilgrimage Kaaba",
    label: {
      en: "Makkah Al-Mukarramah · Umrah Pilgrimage",
      om: "Makka Al-Mukarrama · Imala Umraa",
      am: "መካ አል-ሙከረማ · የዑምራ ጉዞ",
    },
  },
  {
    image: "/images/destinations/medina-ziyarah.jpg",
    alt: "Al-Masjid an-Nabawi Medina Ziyarah Tour",
    label: {
      en: "Al-Masjid an-Nabawi · Madinah Ziyarah",
      om: "Masjiida Nabiyyii · Ziyaaraa Madiinaa",
      am: "አል-መስጂድ አን-ነበዊ · የመዲና ዚያራ",
    },
  },
  {
    image: "/images/destinations/sof-omar.jpg",
    alt: "Sof Omar Caves in Bale, Ethiopia",
    label: {
      en: "Sof Omar Caves · Bale, Ethiopia",
      om: "Holqa Soof Umar · Baale, Itoophiyaa",
      am: "ሶፍ ዑመር ዋሻ · ባሌ፣ ኢትዮጵያ",
    },
  },
  {
    image: "/images/destinations/wonchi.jpg",
    alt: "Wonchi Crater Lake in Oromia, Ethiopia",
    label: {
      en: "Wonchi Crater Lake · Oromia, Ethiopia",
      om: "Haroo Wancii · Oromiyaa, Itoophiyaa",
      am: "ወንጪ እሳተ ገሞራ ሀይቅ · ኦሮሚያ፣ ኢትዮጵያ",
    },
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { t, lang } = useLanguage();
  const { setCategory } = useTrip();
  const router = useRouter();

  const handleExplorePackages = (e: React.MouseEvent) => {
    e.preventDefault();
    setCategory("all");
    const el = document.getElementById("packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#packages`);
    } else {
      router.push(`/${lang}#packages`);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, current]);

  return (
    <section
      id="home"
      className="relative min-h-[92svh] sm:min-h-[100svh] overflow-hidden flex flex-col justify-between pt-32 sm:pt-40 md:pt-44 pb-14 sm:pb-20"
    >
      {/* Background slider with smooth fade transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].alt}
            fill
            className="object-cover object-center"
            priority={current === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlays for high text contrast and clear background readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/75 pointer-events-none" />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center my-auto">
        {/* Welcome Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent-400/25 border border-accent-400/50 text-accent-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 backdrop-blur-md shadow-glow">
            {t.hero.welcome}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] mb-5 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {t.hero.titleStart}{" "}
          <span className="text-gradient-gold drop-shadow-none">
            {t.hero.titleHighlight}
          </span>
          <br className="hidden sm:block" /> {t.hero.titleEnd}
        </motion.h1>

        {/* Shortened Subtitle with Enhanced Readability */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mb-6 w-full sm:w-auto justify-center"
        >
          {/* Primary Explore Packages button */}
          <a
            href={`/${lang}#packages`}
            onClick={handleExplorePackages}
            className="btn-primary min-h-[44px] text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 cursor-pointer"
          >
            {t.hero.explore}
          </a>

          {/* Clearly visible Contact Us button */}
          <Link
            href={`/${lang}/contact`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-white bg-white/10 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-primary-900 hover:shadow-soft active:scale-95"
          >
            {t.hero.contact}
          </Link>
        </motion.div>

        {/* Slide Indicators & Caption (Decluttered bottom, no SCROLL text/arrow) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-3 mt-6 sm:mt-8"
        >
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className="flex min-h-[44px] min-w-[36px] items-center justify-center p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                aria-label={`${
                  lang === "en"
                    ? "Go to slide"
                    : lang === "am"
                    ? "ወደ ስላይድ"
                    : "Gara suuraa"
                } ${index + 1}`}
                aria-current={index === current}
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ${
                    index === current
                      ? "w-10 bg-accent-400 shadow-glow"
                      : "w-4 bg-white/40 hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-medium tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {slides[current].label[lang] ?? slides[current].label.en}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
