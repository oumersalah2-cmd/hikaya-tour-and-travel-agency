"use client";

import Link from "next/link";
import { useState } from "react";
import { Plane, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { telHref } from "@/data/site";
import { useSite } from "@/context/SiteContext";
import SocialIcons from "@/components/ui/SocialIcons";
import { submitLead } from "@/lib/submitLead";
import type { Locale } from "@/lib/i18n";

const pick = (lang: Locale, en: string, om: string) => (lang === "en" ? en : om);

const getQuickLinks = (lang: Locale) => [
  { href: `/${lang}#home`, label: pick(lang, "Home", "Mana") },
  { href: `/${lang}#services`, label: pick(lang, "Services", "Tajaajila") },
  { href: `/${lang}#packages`, label: pick(lang, "Packages & Pricing", "Paakeejota & Gatii") },
  { href: `/${lang}#schedule`, label: pick(lang, "11-Day Schedule", "Sagantaa Guyyaa 11") },
  { href: `/${lang}#ziyarat`, label: pick(lang, "Sacred Ziyarat", "Ziyaaraa Seenaa") },
  { href: `/${lang}#founder`, label: pick(lang, "Founder & Leadership", "Hundeeffaa & Geggeessummaa") },
  { href: `/${lang}#diaspora`, label: pick(lang, "Diaspora Sponsorship", "Kaffaltii Alaa (Diyaaspooraa)") },
  { href: `/${lang}/gallery`, label: pick(lang, "Gallery", "Suuraalee") },
  { href: `/${lang}/contact`, label: pick(lang, "Contact Us", "Nu Qunnamaa") },
];

const getServiceLinks = (lang: Locale) => [
  { href: `/${lang}#packages`, label: pick(lang, "Umrah Packages (Makkah & Medina)", "Paakeejii Umraa (Makkaa fi Madiinaa)") },
  { href: `/${lang}#services`, label: pick(lang, "International Flight Tickets", "Tikeettii Idil-Addunyaa") },
  { href: `/${lang}#services`, label: pick(lang, "Domestic Flight Tickets", "Tikeettii Biyya Keessaa") },
  { href: `/${lang}#services`, label: pick(lang, "Hotel Booking (Haram & Worldwide)", "Hoteelota Haram & Addunyaa") },
  { href: `/${lang}#packages`, label: pick(lang, "Sof Omar Caves Expedition", "Daawwannaa Holqa Soof Umar") },
  { href: `/${lang}#packages`, label: pick(lang, "Wonchi, Bale, Semien & Afar Tours", "Daawwannaa Wonchii, Baalee, Saameen & Affaar") },
];

export default function Footer() {
  const { lang, t } = useLanguage();
  const { site, whatsappLink } = useSite();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    const ok = await submitLead({ type: "newsletter", email });
    setStatus(ok ? "success" : "error");
    if (ok) setEmail("");
  };

  const iconLink =
    "flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-accent-400 hover:text-primary-900 hover:shadow-glow";

  return (
    <footer className="relative overflow-hidden bg-primary-700 text-white dark:bg-dark-600">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 md:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={`/${lang}`} className="mb-6 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 via-accent-300 to-accent-500">
                <Plane className="h-5 w-5 -rotate-45 text-primary-900" />
              </div>
              <div>
                <span className="font-display text-lg font-bold">{site.shortName}</span>
                <span className="-mt-0.5 block text-[10px] uppercase tracking-[0.3em] text-accent-300">
                  {t.ui.tagline}
                </span>
              </div>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">{t.footer.description}</p>
            <div className="flex gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={iconLink}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href={telHref(site.phones[0])} aria-label={pick(lang, "Call us", "Nuuf bilbilaa")} className={iconLink}>
                <Phone className="h-4 w-4" />
              </a>
              <a href={`mailto:${site.emails[0]}`} aria-label="Email" className={iconLink}>
                <Mail className="h-4 w-4" />
              </a>
              <SocialIcons social={site.social} className={iconLink} />
            </div>
          </div>

          <nav aria-label={t.footer.quickLinks}>
            <h4 className="mb-6 font-display text-lg font-bold">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {getQuickLinks(lang).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-accent-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.ourServices}>
            <h4 className="mb-6 font-display text-lg font-bold">{t.footer.ourServices}</h4>
            <ul className="space-y-3">
              {getServiceLinks(lang).map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className="text-sm text-gray-300 transition-colors hover:text-accent-300">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="mb-6 font-display text-lg font-bold">{t.footer.getInTouch}</h4>
            <address className="mb-8 space-y-4 not-italic">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent-400" />
                <span className="text-sm text-gray-300">{site.address[lang].join(", ")}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-accent-400" />
                <span className="text-sm text-gray-300">
                  {site.phones.map((phone, i) => (
                    <span key={phone}>
                      {i > 0 && " / "}
                      <a href={telHref(phone)} className="hover:text-accent-300">{phone}</a>
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" />
                <a href={`mailto:${site.emails[0]}`} className="text-sm text-gray-300 hover:text-accent-300">
                  {site.emails[0]}
                </a>
              </div>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-gray-300 transition-colors hover:text-accent-300"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366] transition-transform group-hover:scale-110" />
                <span className="text-sm">WhatsApp: {site.whatsappDisplay}</span>
              </a>
            </address>

            <h5 className="mb-3 text-sm font-semibold">{t.footer.newsletter}</h5>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                {t.footer.emailPlaceholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={t.footer.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                aria-label={t.footer.subscribe}
                className="rounded-xl bg-accent-400 px-4 py-2.5 text-primary-900 transition-colors duration-300 hover:bg-accent-300 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p aria-live="polite" className="mt-2 min-h-4 text-xs">
              {status === "success" && <span className="text-accent-300">✓ {t.footer.subscribed}</span>}
              {status === "error" && <span className="text-red-300">{t.ui.form.sendError}</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
          <Link href={`/${lang}/privacy`} className="text-sm text-gray-400 transition-colors hover:text-accent-300">
            {pick(lang, "Privacy Policy", "Imaammata Dhuunfaa")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
