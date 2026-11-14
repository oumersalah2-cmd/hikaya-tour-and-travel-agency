"use client";

import { Building2, MapPin, Clock, MessageCircle, ShieldCheck, ArrowRight, PhoneCall, Send } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSite } from "@/context/SiteContext";
import { DEFAULT_SETTINGS, handleFromUrl, telHref } from "@/data/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.76C7.62 10.96 8.5 12.12 8.62 12.28C8.75 12.45 10.33 14.89 12.76 15.94C13.34 16.19 13.79 16.34 14.14 16.45C14.73 16.64 15.26 16.61 15.69 16.55C16.16 16.47 17.15 15.94 17.36 15.37C17.56 14.8 17.56 14.31 17.5 14.21C17.44 14.11 17.28 14.05 17.03 13.93C16.78 13.81 15.58 13.22 15.35 13.14C15.13 13.06 14.96 13.01 14.8 13.26C14.63 13.51 14.16 14.05 14.01 14.21C13.87 14.38 13.73 14.4 13.48 14.28C13.23 14.16 12.43 13.89 11.48 13.05C10.74 12.39 10.24 11.58 10.1 11.33C9.95 11.08 10.08 10.95 10.21 10.82C10.32 10.71 10.46 10.53 10.58 10.39C10.71 10.24 10.75 10.14 10.83 9.98C10.91 9.81 10.87 9.67 10.81 9.55C10.75 9.42 10.25 8.21 10.05 7.71C9.85 7.23 9.64 7.29 9.48 7.28C9.33 7.28 9.17 7.44 9.11 7.44Z" />
    </svg>
  );
}

export default function OfficeDeskSection() {
  const { t, lang } = useLanguage();
  const { site, whatsappLink } = useSite();
  const office = t.officeDesk;

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-500/30 border-t border-gray-100 dark:border-dark-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-100 shadow-soft-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-400/10 text-accent-700 dark:text-accent-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" />
                {office.badge}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary-700 dark:text-white mb-4">
                {office.title}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {office.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-400/50">
                  <MapPin className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-primary-700 dark:text-white uppercase tracking-wider block">
                      {lang === "en" ? "Physical Address" : lang === "am" ? "የቢሮ አድራሻ" : "Teessoo Waajjiraa"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(site.address[lang] ?? site.address.en).join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-400/50">
                  <Clock className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-primary-700 dark:text-white uppercase tracking-wider block">
                      {lang === "en" ? "Consultation Hours" : lang === "am" ? "የስራ ሰዓታት" : "Sa'aatii Tajaajilaa"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(site.hours[lang] ?? site.hours.en).join(" · ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappLink(decodeURIComponent("Hello%20HIKAYA%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3.5 text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>
                    {lang === "en"
                      ? `Chat on WhatsApp (${site.whatsappDisplay})`
                      : lang === "am"
                      ? `በዋትስአፕ ያናግሩን (${site.whatsappDisplay})`
                      : `Waatsaappiin Nu Qunnamaa (${site.whatsappDisplay})`}
                  </span>
                </a>

                <Link
                  href={`/${lang}/contact`}
                  className="btn-secondary px-6 py-3.5 text-sm flex items-center gap-2"
                >
                  <span>
                    {lang === "en"
                      ? "View Full Contact & Map"
                      : lang === "am"
                      ? "ሙሉ አድራሻ እና ካርታ ይመልከቱ"
                      : "Teessoo Guutuu & Kaartaa"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Side Stats / Security */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-primary-900 text-white shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-6 h-6 text-accent-400" />
                  <span className="font-display font-bold text-base">
                    {lang === "en"
                      ? "Licensed Tour & Travel Agency"
                      : lang === "am"
                      ? "ህጋዊ የጉዞ እና የቱሪዝም ኤጀንሲ"
                      : "Ejansii Imalaa Seera Qabeessa"}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === "en"
                    ? "Full compliance with Ethiopian tourism regulations and official Saudi Umrah pilgrimage protocols."
                    : lang === "am"
                    ? "ከኢትዮጵያ ቱሪዝም ደንቦች እና ከሳዑዲ ይፋዊ የዑምራ ጉዞ መመሪያዎች ጋር ሙሉ በሙሉ የተጣጣመ።"
                    : "Heeyyama seera qabeessaa fi sirna imala Umraa Sa'uudii guutuu kan hordofu."}
                </p>
              </div>

              {/* Direct Pilgrimage Hotline & Instant Chat */}
              <div className="p-6 rounded-2xl bg-accent-50/80 dark:bg-accent-950/20 border border-accent-200/70 dark:border-accent-800/40 shadow-soft">
                {/* 1. Header: Icon & Hotline Title */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-accent-700 dark:text-accent-300 uppercase tracking-wider">
                    {lang === "en"
                      ? "Direct Pilgrimage Hotline"
                      : lang === "am"
                      ? "ቀጥታ የጉዞ መስመር"
                      : "Lakk. Bilbila Hatattamaa"}
                  </span>
                </div>

                {/* 2. Primary Clickable Phone Number */}
                <div className="mb-1">
                  <a
                    href={`tel:${telHref(site.phones[0] || "+251912124876")}`}
                    className="font-display text-2xl sm:text-3xl font-extrabold text-primary-800 hover:text-accent-600 dark:text-white dark:hover:text-accent-300 transition-colors tracking-tight block"
                  >
                    {site.phones.join(" / ")}
                  </a>
                </div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-4">
                  {lang === "en"
                    ? "Available 24/7 for Umrah booking, flights & visa assistance"
                    : lang === "am"
                    ? "ለኡምራ ምዝገባ፣ የአየር ትኬት እና ቪዛ የ24 ሰዓት ቀጥታ መስመር"
                    : "Galmee Umraa, tikeettii xiyyaaraa fi viizaaf sa'aatii 24 banaadha"}
                </p>

                {/* Divider */}
                <div className="border-t border-accent-200/60 dark:border-accent-800/30 my-3.5" />

                {/* 3. Instant Chat Heading */}
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                  {lang === "en"
                    ? "Or chat directly on messaging apps:"
                    : lang === "am"
                    ? "ወይም በቀጥታ በመልእክት ያናግሩን፦"
                    : "Ykn karaa ergaa gabaabaan nu qunnamaa:"}
                </p>

                {/* 4. Beautifully Ordered WhatsApp & Telegram Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-dark-400/70 border border-emerald-500/25 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/25 shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white shadow-sm group-hover:scale-105 transition-transform">
                        <WhatsAppIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          WhatsApp
                        </span>
                        <span className="block text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {site.whatsappDisplay}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {lang === "am" ? "ክፈት" : lang === "om" ? "Bani" : "Chat"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>

                  <a
                    href={site.social.telegram || DEFAULT_SETTINGS.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-dark-400/70 border border-sky-500/25 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/25 shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2AABEE] text-white shadow-sm group-hover:scale-105 transition-transform">
                        <Send className="h-4 w-4 ml-0.5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-xs font-bold text-gray-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                          Telegram
                        </span>
                        <span className="block text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {handleFromUrl(site.social.telegram || DEFAULT_SETTINGS.social.telegram)}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {lang === "am" ? "ክፈት" : lang === "om" ? "Bani" : "Open"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
