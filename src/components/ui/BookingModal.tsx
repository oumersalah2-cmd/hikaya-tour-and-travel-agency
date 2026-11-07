"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useSite } from "@/context/SiteContext";
import { submitLead } from "@/lib/submitLead";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle?: string;
  packagePrice?: number;
}

type Status = "idle" | "sending" | "success" | "error";

function BookingForm({
  onClose,
  packageTitle,
}: Pick<BookingModalProps, "onClose" | "packageTitle">) {
  const { t } = useLanguage();
  const { whatsappLink } = useSite();
  const { search } = useTrip();
  const uid = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const prefillDates = [search.departure, search.returnDate].filter(Boolean).join(" → ");
  const [status, setStatus] = useState<Status>("idle");
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
    firstFieldRef.current?.focus();
    return () => clearTimeout(closeTimer.current);
  }, []);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const ok = await submitLead({
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
    setStatus(ok ? "success" : "error");
    if (ok) closeTimer.current = setTimeout(onClose, 4000);
  };

  const b = t.ui.booking;
  const id = (name: string) => `${uid}-${name}`;
  const label = "mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300";

  if (status === "success") {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 text-center"
        role="status"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h4 className="mb-2 text-xl font-bold text-primary-700 dark:text-white">{b.successTitle}</h4>
        <p className="text-gray-600 dark:text-gray-400">{b.successDesc}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
      <div>
        <label htmlFor={id("name")} className={label}>{b.fullName} *</label>
        <input
          ref={firstFieldRef}
          id={id("name")}
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          className="form-input"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("email")} className={label}>{b.email} *</label>
          <input
            id={id("email")}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor={id("phone")} className={label}>{b.phone} *</label>
          <input
            id={id("phone")}
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("travelers")} className={label}>{b.travelers}</label>
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
          <label htmlFor={id("dates")} className={label}>{b.preferredDates}</label>
          <input
            id={id("dates")}
            type="text"
            value={form.dates}
            onChange={set("dates")}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor={id("requests")} className={label}>{b.requests}</label>
        <textarea
          id={id("requests")}
          rows={3}
          value={form.requests}
          onChange={set("requests")}
          className="form-input resize-none"
        />
      </div>

      {/* Honeypot – hidden from people, bots fill it in */}
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
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>{t.ui.form.sendError}</p>
            <a
              href={whatsappLink(
                `Hello HIKAYA, I would like to book: ${packageTitle ?? ""}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-semibold underline"
            >
              <MessageCircle className="h-4 w-4" />
              {t.ui.form.chatWhatsApp}
            </a>
          </div>
        </div>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full py-4 text-base">
        {status === "sending" ? b.sending : b.submit}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        {b.note}
      </p>
    </form>
  );
}

export default function BookingModal({
  isOpen,
  onClose,
  packageTitle,
  packagePrice,
}: BookingModalProps) {
  const { t } = useLanguage();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-dark-300"
          >
            <div className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={t.ui.booking.close}
              >
                <X className="h-5 w-5" />
              </button>
              <h3 id={titleId} className="pr-8 font-display text-xl font-bold text-white">
                {t.ui.booking.title}
              </h3>
              {packageTitle && (
                <p className="mt-1 text-sm text-accent-300">
                  {packageTitle}
                  {packagePrice ? (
                    <span className="font-semibold text-white">
                      {" "}— ${packagePrice.toLocaleString("en-US")}
                    </span>
                  ) : null}
                </p>
              )}
            </div>

            <BookingForm onClose={onClose} packageTitle={packageTitle} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
