"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Globe,
  User,
  Phone,
  Users,
  Send,
  MessageSquare,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSite } from "@/context/SiteContext";
import { DEFAULT_SETTINGS } from "@/data/site";

interface DiasporaQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.76C7.62 10.96 8.5 12.12 8.62 12.28C8.75 12.45 10.33 14.89 12.76 15.94C13.34 16.19 13.79 16.34 14.14 16.45C14.73 16.64 15.26 16.61 15.69 16.55C16.16 16.47 17.15 15.94 17.36 15.37C17.56 14.8 17.56 14.31 17.5 14.21C17.44 14.11 17.28 14.05 17.03 13.93C16.78 13.81 15.58 13.22 15.35 13.14C15.13 13.06 14.96 13.01 14.8 13.26C14.63 13.51 14.16 14.05 14.01 14.21C13.87 14.38 13.73 14.4 13.48 14.28C13.23 14.16 12.43 13.89 11.48 13.05C10.74 12.39 10.24 11.58 10.1 11.33C9.95 11.08 10.08 10.95 10.21 10.82C10.32 10.71 10.46 10.53 10.58 10.39C10.71 10.24 10.75 10.14 10.83 9.98C10.91 9.81 10.87 9.67 10.81 9.55C10.75 9.42 10.25 8.21 10.05 7.71C9.85 7.23 9.64 7.29 9.48 7.28C9.33 7.28 9.17 7.44 9.11 7.44Z" />
    </svg>
  );
}

export default function DiasporaQuoteModal({
  isOpen,
  onClose,
}: DiasporaQuoteModalProps) {
  const { lang, t } = useLanguage();
  const { site, whatsappLink } = useSite();
  const uid = useId();
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    travelers: "2",
    requests: "",
  });

  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    setTimeout(() => firstFieldRef.current?.focus(), 100);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (validationError) setValidationError("");
  };

  const createDiasporaMessage = () => {
    return (
      `Hello HIKAYA Tour and Travel Agency,\n\n` +
      `I am living in the diaspora and would like to request a quote to sponsor my family for Umrah / travel:\n` +
      `• Sponsor Name: ${form.name.trim()}\n` +
      `• Contact Phone / WhatsApp: ${form.phone.trim()}\n` +
      (form.country.trim() ? `• Current Country/City: ${form.country.trim()}\n` : "") +
      `• Number of Family Members to Sponsor: ${form.travelers}` +
      (form.requests.trim() ? `\n• Notes / Requests: ${form.requests.trim()}` : "") +
      `\n\nPlease share transparent pricing (USD / EUR / ETB) and the sponsorship process.`
    );
  };

  const validate = () => {
    if (!form.name.trim()) {
      setValidationError(
        lang === "am"
          ? "እባክዎን ሙሉ ስምዎን ያስገቡ።"
          : lang === "om"
          ? "Maaloo maqaa guutuu keessan galchaa."
          : "Please enter your full name."
      );
      firstFieldRef.current?.focus();
      return false;
    }
    if (!form.phone.trim()) {
      setValidationError(
        lang === "am"
          ? "እባክዎን የስልክ / ዋትስአፕ ቁጥርዎን ያስገቡ።"
          : lang === "om"
          ? "Maaloo lakk. bilbila/Waatsaappii galchaa."
          : "Please enter your phone / WhatsApp number."
      );
      return false;
    }
    return true;
  };

  const handleSendWhatsApp = () => {
    if (!validate()) return;
    const msg = createDiasporaMessage();
    const url = whatsappLink(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleSendTelegram = () => {
    if (!validate()) return;
    const msg = createDiasporaMessage();
    const tgBase = site.social.telegram || DEFAULT_SETTINGS.social.telegram;
    const cleanTg = tgBase.replace(/\/+$/, "");
    const url = `${cleanTg}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const id = (name: string) => `${uid}-${name}`;
  const labelClass = "mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300";

  const labels = {
    en: {
      badge: "Diaspora Family Sponsorship",
      title: "Request Diaspora Quote",
      subtitle: "Secure payment in USD/EUR/ETB · Full Addis Ababa VIP Care",
      nameLabel: "Your Name (Sponsor)",
      phoneLabel: "Your Phone / WhatsApp",
      countryLabel: "Country / City You Live In",
      countryPlaceholder: "e.g. USA, UK, Canada, Saudi Arabia, Germany...",
      travelersLabel: "Family Members to Sponsor",
      requestsLabel: "Special Notes / Requirements (Optional)",
      requestsPlaceholder: "e.g. Sponsoring my elderly parents, need wheelchair assistance...",
      submitPrompt: "Choose where to send your quote request:",
      btnWhatsApp: "Send via WhatsApp",
      btnTelegram: "Send via Telegram",
    },
    am: {
      badge: "የዲያስፖራ ቤተሰብ ስፖንሰርሺፕ",
      title: "የዲያስፖራ ዋጋ ይጠይቁ",
      subtitle: "ክፍያ በUSD/EUR/ETB · በአዲስ አበባ ቢሯችን የተሟላ እንክብካቤ",
      nameLabel: "ስምዎ (ስፖንሰር አድራጊ)",
      phoneLabel: "የስልክ / ዋትስአፕ ቁጥርዎ",
      countryLabel: "የሚኖሩበት ሀገር / ከተማ",
      countryPlaceholder: "ለምሳሌ፡ አሜሪካ፣ እንግሊዝ፣ ካናዳ፣ ሳዑዲ፣ ጀርመን...",
      travelersLabel: "ስፖንሰር የሚያደርጓቸው የቤተሰብ አባላት",
      requestsLabel: "ልዩ ማስታወሻ ወይም ፍላጎት (አማራጭ)",
      requestsPlaceholder: "ለምሳሌ፡ ወላጆቼን ለመላክ ነው፣ ዊልቼር ያስፈልጋቸዋል...",
      submitPrompt: "የዋጋ መጠየቂያውን ለመላክ ይምረጡ፡",
      btnWhatsApp: "በዋትስአፕ ላክ",
      btnTelegram: "በቴሌግራም ላክ",
    },
    om: {
      badge: "Diyaaspooraa Maatii Deeggaruuf",
      title: "Gatii Diyaaspooraa Gaafadhaa",
      subtitle: "Kaffaltii USD/EUR/ETB · Tajaajila Guutuu Finfinneetti",
      nameLabel: "Maqaa Keessan (Spoonsara)",
      phoneLabel: "Lakk. Bilbilaa / Waatsaappii",
      countryLabel: "Biyya / Magaalaa Itti Jiraattan",
      countryPlaceholder: "Fkn: USA, UK, Kaanaadaa, Sa'uudii, Jarman...",
      travelersLabel: "Baayyina Maatii Deeggaramanii",
      requestsLabel: "Yaada Ykn Fedhii Addaa (Yoo jiraate)",
      requestsPlaceholder: "Fkn: Warra koo erguuf, teessoo naanna'u (wheelchair) barbaadu...",
      submitPrompt: "Odeeffannoo gaaffii gatii ittiin erguu barbaaddan filadhaa:",
      btnWhatsApp: "Waatsaappiin Ergi",
      btnTelegram: "Telegiraamaan Ergi",
    },
  }[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-primary-950/75 backdrop-blur-md" aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-dark-300 my-auto border border-gray-100 dark:border-dark-100"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900 px-6 py-5 text-white">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={t.ui.booking.close}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-400/20 px-2.5 py-0.5 text-xs font-semibold text-accent-300">
                  <Globe className="h-3.5 w-3.5" />
                  {labels.badge}
                </span>
                <span className="text-xs text-white/70">HIKAYA Tour & Travel</span>
              </div>

              <h3 id={titleId} className="pr-8 font-display text-xl sm:text-2xl font-bold text-white">
                {labels.title}
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-accent-300 font-medium">
                {labels.subtitle}
              </p>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {validationError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span className="font-semibold">{validationError}</span>
                </div>
              )}

              {/* Sponsor Name */}
              <div>
                <label htmlFor={id("name")} className={labelClass}>
                  <User className="h-3.5 w-3.5 text-accent-500" />
                  <span>{labels.nameLabel} *</span>
                </label>
                <input
                  ref={firstFieldRef}
                  id={id("name")}
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Jamal Kedir"
                  className="form-input"
                />
              </div>

              {/* Phone & Country Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={id("phone")} className={labelClass}>
                    <Phone className="h-3.5 w-3.5 text-accent-500" />
                    <span>{labels.phoneLabel} *</span>
                  </label>
                  <input
                    id={id("phone")}
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+1 555 XXX XXXX"
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor={id("country")} className={labelClass}>
                    <MapPin className="h-3.5 w-3.5 text-accent-500" />
                    <span>{labels.countryLabel}</span>
                  </label>
                  <input
                    id={id("country")}
                    type="text"
                    value={form.country}
                    onChange={set("country")}
                    placeholder={labels.countryPlaceholder}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Family Members Count */}
              <div>
                <label htmlFor={id("travelers")} className={labelClass}>
                  <Users className="h-3.5 w-3.5 text-accent-500" />
                  <span>{labels.travelersLabel}</span>
                </label>
                <select
                  id={id("travelers")}
                  value={form.travelers}
                  onChange={set("travelers")}
                  className="form-input cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? (lang === "am" ? "የቤተሰብ አባል" : lang === "om" ? "miseensa maatii" : "family member") : (lang === "am" ? "የቤተሰብ አባላት" : lang === "om" ? "miseensota maatii" : "family members")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label htmlFor={id("requests")} className={labelClass}>
                  <MessageSquare className="h-3.5 w-3.5 text-accent-500" />
                  <span>{labels.requestsLabel}</span>
                </label>
                <textarea
                  id={id("requests")}
                  rows={2}
                  value={form.requests}
                  onChange={set("requests")}
                  placeholder={labels.requestsPlaceholder}
                  className="form-input resize-none"
                />
              </div>

              {/* Submission Action Prompt */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5">
                  {labels.submitPrompt}
                </span>

                {/* WhatsApp & Telegram Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. WHATSAPP SUBMIT */}
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 font-bold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    <span>{labels.btnWhatsApp}</span>
                  </button>

                  {/* 2. TELEGRAM SUBMIT */}
                  <button
                    type="button"
                    onClick={handleSendTelegram}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl bg-[#2AABEE] hover:bg-[#2299d4] text-white p-3.5 font-bold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="h-5 w-5 shrink-0 ml-0.5" />
                    <span>{labels.btnTelegram}</span>
                  </button>
                </div>
              </div>

              {/* Reassuring note */}
              <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                {lang === "am"
                  ? "የዋጋ መጠየቂያዎ ወዲያውኑ ወደ ኦፊሴላዊ የሂካያ ዋትስአፕ ወይም ቴሌግራም ይተላለፋል።"
                  : lang === "om"
                  ? "Gaaffiin gatii keessan kallattiin Waatsaappii ykn Telegiraamii HIKAYAtti ergama."
                  : "Your quote inquiry is sent directly to HIKAYA's official WhatsApp or Telegram."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

