"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Laptop,
  Briefcase,
  ShieldCheck,
  Award,
  PhoneCall,
  ArrowRight,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FounderSection() {
  const { t, lang } = useLanguage();
  const f = t.founder;

  return (
    <section id="founder" className="relative py-20 sm:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-500 dark:via-dark-400 dark:to-dark-500 overflow-hidden">
      {/* Subtle decorative background blur shapes */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Founder Portrait & Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-tr from-accent-400/30 via-primary-500/20 to-accent-300/30 blur-lg opacity-70 dark:opacity-40" />

              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-dark-300 border-2 border-accent-400/30 shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/founder.png"
                    alt="Founder & Director of HIKAYA Tour and Travel Agency"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 420px"
                    priority
                  />
                  {/* Subtle dark gradient overlay at bottom for text legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary-950/90 via-primary-950/40 to-transparent" />

                  {/* Verified Founder Badge at bottom of photo */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-base sm:text-lg text-white">
                          HIKAYA Leadership
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-accent-400 fill-accent-400/20" />
                      </div>
                      <span className="text-xs text-accent-300 font-medium block">
                        {lang === "en"
                          ? "Founder & Managing Director"
                          : lang === "am"
                          ? "መስራች እና ማኔጂንግ ዳይሬክተር"
                          : "Hundeeffaa & Daarektara Ejansii"}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-accent-400/20 border border-accent-400/50 text-[11px] font-semibold text-accent-200 backdrop-blur-md">
                      {lang === "en" ? "Verified" : lang === "am" ? "የተረጋገጠ" : "Mirkanaa'e"}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Bar */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-900 to-primary-950 text-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0 border border-accent-400/40">
                      <Award className="w-5 h-5 text-accent-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-white uppercase tracking-wider">
                        10+ Years
                      </span>
                      <span className="text-[11px] text-gray-300">
                        {lang === "en"
                          ? "Online Travel & Overseas Services"
                          : lang === "am"
                          ? "የኦንላይን ጉዞ እና የውጭ አገልግሎቶች"
                          : "Tajaajila Imalaafi Paaspoortii"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === "en" ? "Licensed" : lang === "am" ? "ህጋዊ ፍቃድ ያለው" : "Seera Qabeessa"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio, Credentials & Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-400/15 border border-accent-400/30 text-accent-700 dark:text-accent-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Briefcase className="w-3.5 h-3.5" />
                {f.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700 dark:text-white mb-4 leading-tight">
              {f.title}
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-primary-600 dark:text-accent-300 font-medium mb-5">
              {f.subtitle}
            </p>

            {/* Story */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {f.story}
            </p>

            {/* 3 Credential Cards */}
            <div className="space-y-3.5 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {f.qualificationsTitle}
              </h3>

              {/* Credential 1: Hawassa University */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-200 shadow-soft flex items-start gap-3.5 transition hover:shadow-soft-lg">
                <div className="w-10 h-10 rounded-xl bg-accent-400/10 dark:bg-accent-400/20 flex items-center justify-center shrink-0 mt-0.5 text-accent-600 dark:text-accent-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm sm:text-base text-primary-700 dark:text-white">
                      {f.education1.institution}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-800 dark:text-accent-300 text-[10px] font-bold">
                      Degree
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-accent-700 dark:text-accent-300 mb-1">
                    {f.education1.degree}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {f.education1.desc}
                  </p>
                </div>
              </div>

              {/* Credential 2: Zion Technology & Business College */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-200 shadow-soft flex items-start gap-3.5 transition hover:shadow-soft-lg">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0 mt-0.5 text-primary-600 dark:text-accent-300">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm sm:text-base text-primary-700 dark:text-white">
                      {f.education2.institution}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/60 text-accent-800 dark:text-accent-200 text-[10px] font-bold">
                      Technology
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-accent-700 dark:text-accent-300 mb-1">
                    {f.education2.degree}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {f.education2.desc}
                  </p>
                </div>
              </div>

              {/* Credential 3: 10+ Years in Passport & Online Travel Agency */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-200 shadow-soft flex items-start gap-3.5 transition hover:shadow-soft-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-display font-bold text-sm sm:text-base text-primary-700 dark:text-white block mb-0.5">
                    {f.experience.title}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {f.experience.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Quote */}
            <div className="relative p-5 rounded-2xl bg-accent-50/80 dark:bg-dark-300/80 border-l-4 border-accent-400 mb-8">
              <Quote className="absolute top-3 right-3 w-8 h-8 text-accent-400/20" />
              <p className="italic text-xs sm:text-sm text-primary-800 dark:text-gray-200 leading-relaxed pr-6">
                &ldquo;{f.quote}&rdquo;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:+251910147495"
                className="btn-primary px-6 py-3.5 text-sm flex items-center gap-2 shadow-glow"
              >
                <PhoneCall className="w-4 h-4 text-primary-950" />
                <span>{f.ctaWhatsApp}</span>
              </a>

              <Link
                href={`/${lang}/contact`}
                className="btn-secondary px-6 py-3.5 text-sm flex items-center gap-2"
              >
                <span>{f.ctaVisit}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
