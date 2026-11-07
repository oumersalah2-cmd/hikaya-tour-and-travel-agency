"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, ClipboardList, ShieldCheck, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";
import { useSite } from "@/context/SiteContext";

const slides = [
  { image: "/images/destinations/umrah-makkah.jpg", alt: "Makkah Al-Mukarramah Umrah Package" },
  { image: "/images/destinations/sof-omar.jpg", alt: "Sof Omar Caves in Bale, Ethiopia" },
  { image: "/images/destinations/wonchi.jpg", alt: "Wonchi Crater Lake in Oromia, Ethiopia" },
  { image: "/images/destinations/bale-mountains.jpg", alt: "Bale Mountains National Park, Ethiopia" },
  { image: "/images/destinations/semien-mountains.jpg", alt: "Semien Mountains Samen Terara, Ethiopia" },
  { image: "/images/destinations/afar-danakil.jpg", alt: "Afar Depression Dallol & Erta Ale, Ethiopia" },
  { image: "/images/destinations/medina-ziyarah.jpg", alt: "Al-Masjid an-Nabawi Medina Ziyarah Tour" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { t, lang } = useLanguage();
  const { whatsappLink } = useSite();

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
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-900/60 to-primary-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/70 via-transparent to-primary-950/40" />

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

        {/* Trust badges pills */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:gap-2.5"
        >
          {[
            { icon: MapPin, text: t.hero.pills.route },
            { icon: ClipboardList, text: t.hero.pills.quoteFirst },
            { icon: ShieldCheck, text: t.hero.pills.passportCheck },
            { icon: Globe, text: t.hero.pills.diaspora },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md"
            >
              <Icon className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
              {text}
            </li>
          ))}
          <li>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-[#25D366]/50 bg-[#25D366]/30 px-3.5 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur-md transition hover:bg-[#25D366]/50"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
              {t.hero.pills.support}
            </a>
          </li>
        </motion.ul>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex gap-2 mt-8 sm:mt-10"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === current ? "w-10 bg-accent-400" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`${lang === "en" ? "Go to slide" : "Gara suuraa"} ${index + 1}`}
              aria-current={index === current}
            />
          ))}
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
