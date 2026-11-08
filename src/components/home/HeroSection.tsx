"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";

interface HeroSlide {
  image: string;
  alt: string;
  label: { en: string; om: string; am: string };
  isFounder?: boolean;
}

const slides: HeroSlide[] = [
  {
    image: "/images/destinations/umrah-makkah.jpg",
    alt: "Makkah Al-Mukarramah Umrah Package",
    label: {
      en: "Makkah Al-Mukarramah · Umrah Pilgrimage",
      om: "Makka Al-Mukarrama · Imala Umraa",
      am: "መካ አል-ሙከረማ · የዑምራ ጉዞ",
    },
  },
  {
    image: "/images/destinations/founder-office-hero.webp",
    alt: "HIKAYA Agency Founder & Office Headquarters",
    label: {
      en: "HIKAYA Leadership · Agency Headquarters",
      om: "Hundeeffaa & Geggeessummaa Ejansii HIKAYA",
      am: "የሂካያ ኤጀንሲ መስራች እና አመራር · አዲስ አበባ",
    },
    isFounder: true,
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

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    // Don't auto-advance for visitors who asked their OS to reduce motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, current]);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16">
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
            className={`object-cover ${slides[current].isFounder ? "object-[78%_center] sm:object-center" : "object-center"}`}
            priority={current === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric dark gradient overlays */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          slides[current].isFounder
            ? "bg-gradient-to-b from-primary-950/75 via-primary-900/40 to-primary-950/80"
            : "bg-gradient-to-b from-primary-950/85 via-primary-900/60 to-primary-950/90"
        }`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          slides[current].isFounder
            ? "bg-gradient-to-r from-primary-950/90 via-primary-950/50 to-primary-950/20"
            : "bg-gradient-to-r from-primary-950/70 via-transparent to-primary-950/40"
        }`}
      />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center my-auto">
        {/* Welcome Pill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent-400/20 border border-accent-400/40 text-accent-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 backdrop-blur-md shadow-glow">
            {t.hero.welcome}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] mb-5 tracking-tight"
        >
          {t.hero.titleStart} <span className="text-gradient-gold">{t.hero.titleHighlight}</span>
          <br className="hidden sm:block" /> {t.hero.titleEnd}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-200/90 max-w-2xl mx-auto mb-8 leading-relaxed font-light"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mb-8 w-full sm:w-auto justify-center"
        >
          <Link href={`/${lang}#packages`} className="btn-primary text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4">
            {t.hero.explore}
          </Link>
          <Link href={`/${lang}/contact`} className="btn-secondary text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4">
            {t.hero.contact}
          </Link>
        </motion.div>

        {/* Slide Indicators & Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col items-center gap-2.5 mt-4 sm:mt-6"
        >
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === current ? "w-10 bg-accent-400 shadow-glow" : "w-4 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`${lang === "en" ? "Go to slide" : lang === "am" ? "ወደ ስላይድ" : "Gara suuraa"} ${index + 1}`}
                aria-current={index === current}
              />
            ))}
          </div>
          <span className="text-xs text-white/80 font-medium tracking-wide drop-shadow-sm">
            {slides[current].label[lang] ?? slides[current].label.en}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator below the main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="relative z-10 mx-auto hidden md:block mt-4"
      >
        <Link
          href={`/${lang}#search`}
          className="flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors"
        >
          <span className="text-[10px] tracking-widest uppercase font-semibold">{t.hero.scroll}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-accent-300" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
