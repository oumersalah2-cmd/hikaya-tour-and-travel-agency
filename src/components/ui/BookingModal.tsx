"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  AlertCircle,
  MessageCircle,
  Phone,
  Send,
  Zap,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useSite } from "@/context/SiteContext";
import { submitLead } from "@/lib/submitLead";
import { DEFAULT_SETTINGS, handleFromUrl, telHref } from "@/data/site";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle?: string;
  packagePrice?: number;
}

type Status = "idle" | "sending" | "success" | "error";
type Method = "platform" | "website";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.76C7.62 10.96 8.5 12.12 8.62 12.28C8.75 12.45 10.33 14.89 12.76 15.94C13.34 16.19 13.79 16.34 14.14 16.45C14.73 16.64 15.26 16.61 15.69 16.55C16.16 16.47 17.15 15.94 17.36 15.37C17.56 14.8 17.56 14.31 17.5 14.21C17.44 14.11 17.28 14.05 17.03 13.93C16.78 13.81 15.58 13.22 15.35 13.14C15.13 13.06 14.96 13.01 14.8 13.26C14.63 13.51 14.16 14.05 14.01 14.21C13.87 14.38 13.73 14.4 13.48 14.28C13.23 14.16 12.43 13.89 11.48 13.05C10.74 12.39 10.24 11.58 10.1 11.33C9.95 11.08 10.08 10.95 10.21 10.82C10.32 10.71 10.46 10.53 10.58 10.39C10.71 10.24 10.75 10.14 10.83 9.98C10.91 9.81 10.87 9.67 10.81 9.55C10.75 9.42 10.25 8.21 10.05 7.71C9.85 7.23 9.64 7.29 9.48 7.28C9.33 7.28 9.17 7.44 9.11 7.44Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export default function BookingModal({
  isOpen,
  onClose,
  packageTitle,
}: BookingModalProps) {
  const { lang, t } = useLanguage();
  const { site, whatsappLink } = useSite();
  const { search } = useTrip();
  const uid = useId();
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [method, setMethod] = useState<Method>("platform");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const prefillDates = [search.departure, search.returnDate].filter(Boolean).join(" → ");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: search.travelers || "1",
    dates: prefillDates,
    requests: "",
    website: "", // honeypot
  });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      clearTimeout(closeTimer.current);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (method === "website") {
      firstFieldRef.current?.focus();
    }
  }, [method]);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMessage("");

    const res = await submitLead({
      type: "booking",
      name: form.name,
      email: form.email,
      phone: form.phone,
      travelers: form.travelers,
      package: packageTitle ?? "",
      preferredDates: form.dates,
      message: form.requests,
      website: form.website,
    });

    if (res.ok) {
      setStatus("success");
      closeTimer.current = setTimeout(onClose, 4000);
    } else {
      setStatus("error");
      if (res.error === "invalid_email") {
        setErrorMessage(
          lang === "am"
            ? "እባክዎን ትክክለኛ የኢሜይል አድራሻ ያስገቡ ወይም በዋትስአፕ በቀጥታ ያነጋግሩን።"
            : lang === "om"
            ? "Maaloo teessoo iimeelii sirrii galchaa ykn Waatsaappiin nu qunnamaa."
            : "Please enter a valid email address or chat with us on WhatsApp."
        );
      } else if (res.error === "phone_required") {
        setErrorMessage(
          lang === "am"
            ? "እባክዎን የስልክ ቁጥርዎን ያስገቡ።"
            : lang === "om"
            ? "Maaloo lakk. bilbila keessanii galchaa."
            : "Please enter your phone number."
        );
      } else if (res.error === "name_required") {
        setErrorMessage(
          lang === "am"
            ? "እባክዎን ሙሉ ስምዎን ያስገቡ።"
            : lang === "om"
            ? "Maaloo maqaa guutuu galchaa."
            : "Please enter your full name."
        );
      } else if (res.error === "too_many_requests") {
        setErrorMessage(
          lang === "am"
            ? "በጣም ብዙ ሙከራዎች ተደርገዋል። እባክዎን በዋትስአፕ በቀጥታ ያነጋግሩን።"
            : lang === "om"
            ? "Yaalii baay'ee taasistaniittu. Maaloo Waatsaappiin kallattiin nu qunnamaa."
            : "Too many requests. Please contact us directly on WhatsApp."
        );
      } else {
        setErrorMessage(t.ui.form.sendError);
      }
    }
  };

  const b = t.ui.booking;
  const id = (name: string) => `${uid}-${name}`;
  const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300";

  // Pre-formatted messages for social / messaging platforms
  const baseBookingText = `Hello HIKAYA, I would like to book: ${packageTitle ?? "Umrah / Travel Package"}.`;

  const detailedBookingText = `${baseBookingText}${
    form.name ? `\n• Name: ${form.name}` : ""
  }${form.phone ? `\n• Phone: ${form.phone}` : ""}${
    form.travelers ? `\n• Travelers: ${form.travelers}` : ""
  }${form.dates ? `\n• Preferred Dates: ${form.dates}` : ""}${
    form.requests ? `\n• Notes: ${form.requests}` : ""
  }\nPlease confirm availability and booking requirements.`;

  const whatsappHref = whatsappLink(detailedBookingText);
  const telegramHref = site.social.telegram || DEFAULT_SETTINGS.social.telegram;
  const phoneHref = telHref(site.phones[0] || DEFAULT_SETTINGS.phones[0]);
  const facebookHref = site.social.facebook || DEFAULT_SETTINGS.social.facebook;

  const labels = {
    en: {
      platformTab: "Book on Platform",
      platformBadge: "Instant",
      websiteTab: "Website Form",
      banner: "Choose how you'd like to book: chat directly on WhatsApp or Telegram for instant confirmation, or submit the website request form below.",
      whatsappTitle: "Book via WhatsApp",
      whatsappSub: "Instant 1-on-1 chat with booking consultant",
      whatsappBtn: "Open WhatsApp Booking",
      telegramTitle: "Book via Telegram",
      telegramSub: "Direct messaging on Telegram",
      telegramBtn: "Open Telegram Chat",
      phoneTitle: "Direct Phone Call",
      phoneSub: "Speak with our Addis Ababa travel consultants",
      phoneBtn: "Call Now",
      facebookTitle: "Message on Facebook",
      facebookSub: "Official page & Messenger support",
      facebookBtn: "Open Facebook",
      switchToWeb: "Prefer to fill out an online form? Switch to Website Form →",
      switchToPlatform: "Prefer instant chat? Book on WhatsApp or Telegram instead →",
      sendViaWhatsApp: "Send Details via WhatsApp",
      fastest: "Recommended · Fastest Response",
    },
    am: {
      platformTab: "በፕላትፎርም ያስይዙ",
      platformBadge: "ፈጣን",
      websiteTab: "የድረ-ገጽ ቅጽ",
      banner: "የሚመርጡትን መንገድ ይምረጡ፡ በዋትስአፕ ወይም ቴሌግራም ወዲያውኑ ቦታ ያስይዙ ወይም በድረ-ገጻችን የቦታ ማስያዣ ቅጽ ይላኩ።",
      whatsappTitle: "በዋትስአፕ ያስይዙ",
      whatsappSub: "ከቦታ ማስያዣ አማካሪያችን ጋር ቀጥታ ውይይት",
      whatsappBtn: "በዋትስአፕ ይወያዩ",
      telegramTitle: "በቴሌግራም ያስይዙ",
      telegramSub: "በቴሌግራም ቀጥታ መልእክት",
      telegramBtn: "በቴሌግራም ይወያዩ",
      phoneTitle: "በቀጥታ ስልክ ይደውሉ",
      phoneSub: "በአዲስ አበባ ቢሯችን ካሉ አማካሪዎቻችን ጋር ይነጋገሩ",
      phoneBtn: "አሁን ይደውሉ",
      facebookTitle: "በፌስቡክ ያናግሩን",
      facebookSub: "ኦፊሴላዊ የፌስቡክ ገጻችን እና ሜሴንጀር",
      facebookBtn: "ፌስቡክን ይክፈቱ",
      switchToWeb: "የመስመር ላይ ቅጽ መሙላት ይመርጣሉ? ወደ ድረ-ገጽ ቅጽ ይቀይሩ →",
      switchToPlatform: "ቀጥታ ውይይት ይፈልጋሉ? በዋትስአፕ ወይም ቴሌግራም ያናግሩን →",
      sendViaWhatsApp: "መረጃውን በዋትስአፕ ላክ",
      fastest: "ተመራጭ · ፈጣን ምላሽ",
    },
    om: {
      platformTab: "Pilaatfoormiin Qabsiisaa",
      platformBadge: "Hatattama",
      websiteTab: "Foormii Marsariitii",
      banner: "Karaa filattan filadhaa: Waatsaappii ykn Telegiraamaan kallattiin qabsiisaa, ykn foormii marsariitii keenya guutaa.",
      whatsappTitle: "Waatsaappiin Qabsiisaa",
      whatsappSub: "Ogeessa keenya waliin haasaa kallattii",
      whatsappBtn: "Waatsaappiin Qabsiisaa",
      telegramTitle: "Telegiraamaan Qabsiisaa",
      telegramSub: "Ergaa kallattii Telegiraamiin",
      telegramBtn: "Telegiraamaan Haasa'aa",
      phoneTitle: "Bilbila Kallattii",
      phoneSub: "Biroo keenya Finfinnee jiru bilbilaan qunnamaa",
      phoneBtn: "Amma Bilbilaa",
      facebookTitle: "Feesbuukiin Nu Qunnamaa",
      facebookSub: "Fuula Feesbuukii fi ergaa nuuf ergaa",
      facebookBtn: "Feesbuukii Banaa",
      switchToWeb: "Foormii online guutuu filattu? Gara foormii marsariitiitti jijjiiraa →",
      switchToPlatform: "Haasaa hatattamaa barbaaddu? Waatsaappii ykn Telegiraamaan qabsiisaa →",
      sendViaWhatsApp: "Odeeffannoo Waatsaappiin Ergi",
      fastest: "Filatamaa · Deebii Hatattamaa",
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
          <div className="fixed inset-0 bg-primary-950/70 backdrop-blur-md" aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-dark-300 my-auto"
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
              
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-400/20 px-2.5 py-0.5 text-xs font-semibold text-accent-300">
                  <Zap className="h-3 w-3" />
                  {labels.platformBadge}
                </span>
                <span className="text-xs text-white/60">HIKAYA Tour & Travel</span>
              </div>

              <h3 id={titleId} className="pr-8 font-display text-xl sm:text-2xl font-bold text-white">
                {t.ui.booking.title}
              </h3>

              {packageTitle && (
                <p className="mt-1 text-sm text-accent-300 font-medium">
                  {packageTitle}
                </p>
              )}
            </div>

            {/* Method Switcher Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/80 p-2 dark:border-dark-200 dark:bg-dark-400/50">
              <button
                type="button"
                onClick={() => setMethod("platform")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  method === "platform"
                    ? "bg-white text-primary-800 shadow-sm dark:bg-dark-300 dark:text-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{labels.platformTab}</span>
                <span className="hidden sm:inline-block rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {labels.platformBadge}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("website")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  method === "website"
                    ? "bg-white text-primary-800 shadow-sm dark:bg-dark-300 dark:text-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{labels.websiteTab}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[72dvh] overflow-y-auto p-5 sm:p-6">
              {/* TAB 1: INSTANT PLATFORM BOOKING */}
              {method === "platform" && (
                <motion.div
                  key="platform"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-accent-400/10 p-3.5 rounded-2xl border border-accent-400/20">
                    {labels.banner}
                  </p>

                  {/* 1. WHATSAPP INSTANT BOOKING */}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 p-4 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-glow dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-600"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md group-hover:bg-white group-hover:text-[#25D366] transition-colors">
                        <WhatsAppIcon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-white dark:text-white">
                            {labels.whatsappTitle}
                          </h4>
                          <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 group-hover:bg-white/20 group-hover:text-white dark:bg-emerald-900/50 dark:text-emerald-200">
                            {labels.fastest}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 group-hover:text-white/90 dark:text-gray-400 truncate">
                          {site.whatsappDisplay} · {labels.whatsappSub}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-white dark:text-emerald-400">
                      <span className="hidden sm:inline">{labels.whatsappBtn}</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </a>

                  {/* 2. TELEGRAM INSTANT BOOKING */}
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-sky-500/30 bg-sky-50/50 p-4 transition-all duration-200 hover:border-sky-500 hover:bg-sky-500 hover:text-white hover:shadow-md dark:border-sky-500/20 dark:bg-sky-950/20 dark:hover:bg-sky-600"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2AABEE] text-white shadow-md group-hover:bg-white group-hover:text-[#2AABEE] transition-colors">
                        <Send className="h-6 w-6 ml-0.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-white dark:text-white">
                            {labels.telegramTitle}
                          </h4>
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 group-hover:bg-white/20 group-hover:text-white dark:bg-sky-900/50 dark:text-sky-200">
                            {handleFromUrl(telegramHref)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 group-hover:text-white/90 dark:text-gray-400 truncate">
                          {labels.telegramSub}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-white dark:text-sky-400">
                      <span className="hidden sm:inline">{labels.telegramBtn}</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </a>

                  {/* 3. DIRECT PHONE CALL */}
                  <a
                    href={phoneHref}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm dark:border-dark-100 dark:bg-dark-400 dark:hover:bg-dark-200"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                          {labels.phoneTitle}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {site.phones[0]} · {labels.phoneSub}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary-700 dark:text-primary-300">
                      <span className="hidden sm:inline">{labels.phoneBtn}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>

                  {/* 4. FACEBOOK */}
                  {site.social.facebook && (
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 dark:border-dark-100 dark:bg-dark-400 dark:hover:bg-dark-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-[#1877F2] dark:bg-[#1877F2]/20">
                          <FacebookIcon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                            {labels.facebookTitle}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {labels.facebookSub}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#1877F2]">
                        <span className="hidden sm:inline">{labels.facebookBtn}</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  )}

                  {/* Switch to Form option */}
                  <div className="pt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setMethod("website")}
                      className="text-xs sm:text-sm font-semibold text-accent-700 hover:text-accent-800 dark:text-accent-300 underline underline-offset-4"
                    >
                      {labels.switchToWeb}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: WEBSITE REQUEST FORM */}
              {method === "website" && (
                <motion.div
                  key="website"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {status === "success" ? (
                    <div className="py-8 text-center" role="status">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="mb-2 text-xl font-bold text-primary-700 dark:text-white">
                        {b.successTitle}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto text-sm">
                        {b.successDesc}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor={id("name")} className={labelClass}>
                          {b.fullName} *
                        </label>
                        <input
                          ref={firstFieldRef}
                          id={id("name")}
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Ahmad Mohammed"
                          className="form-input"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor={id("phone")} className={labelClass}>
                            {b.phone} *
                          </label>
                          <input
                            id={id("phone")}
                            type="tel"
                            required
                            autoComplete="tel"
                            value={form.phone}
                            onChange={set("phone")}
                            placeholder="+251 9XX XXX XXX"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label htmlFor={id("email")} className={labelClass}>
                            {b.email} <span className="font-normal text-gray-400 dark:text-gray-500">({lang === "am" ? "አማራጭ" : lang === "om" ? "filannoo" : "optional"})</span>
                          </label>
                          <input
                            id={id("email")}
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={set("email")}
                            placeholder="ahmad@example.com"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor={id("travelers")} className={labelClass}>
                            {b.travelers}
                          </label>
                          <select
                            id={id("travelers")}
                            value={form.travelers}
                            onChange={set("travelers")}
                            className="form-input"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? b.traveler : b.travelers}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor={id("dates")} className={labelClass}>
                            {b.preferredDates}
                          </label>
                          <input
                            id={id("dates")}
                            type="text"
                            value={form.dates}
                            onChange={set("dates")}
                            placeholder="e.g. December 2026 / Ramadan"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={id("requests")} className={labelClass}>
                          {b.requests}
                        </label>
                        <textarea
                          id={id("requests")}
                          rows={2}
                          value={form.requests}
                          onChange={set("requests")}
                          placeholder="e.g. Room sharing preference, visa assistance, hotel near Haram..."
                          className="form-input resize-none"
                        />
                      </div>

                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={form.website}
                        onChange={set("website")}
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      />

                      {status === "error" && (
                        <div
                          role="alert"
                          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <div>
                            <p className="font-semibold">{errorMessage || t.ui.form.sendError}</p>
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 underline underline-offset-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {t.ui.form.chatWhatsApp}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2.5 pt-2">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-md"
                        >
                          {status === "sending" ? b.sending : b.submit}
                        </button>

                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/60 py-3 text-xs sm:text-sm font-bold text-emerald-800 transition hover:bg-emerald-500 hover:text-white dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          <span>{labels.sendViaWhatsApp}</span>
                        </a>
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setMethod("platform")}
                          className="text-xs sm:text-sm font-semibold text-accent-700 hover:text-accent-800 dark:text-accent-300 underline underline-offset-4"
                        >
                          {labels.switchToPlatform}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
