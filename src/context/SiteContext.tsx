"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildWhatsappLink, type SiteSettings } from "@/data/site";
import { resolveItems, type Item } from "@/lib/collections";
import type { Locale } from "@/lib/i18n";
import type { Package } from "@/data/packages";
import type { Destination } from "@/data/destinations";
import type { Testimonial } from "@/data/testimonials";
import type { FAQItem } from "@/data/faq";

export interface RawContent {
  settings: SiteSettings;
  packages: Item[];
  destinations: Item[];
  testimonials: Item[];
  faq: Item[];
}

interface SiteContextType {
  site: SiteSettings;
  packages: Package[];
  destinations: Destination[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  whatsappLink: (message?: string) => string;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

/** Gives every client component the owner-edited business details and content lists. */
export function SiteProvider({
  lang,
  content,
  children,
}: {
  lang: Locale;
  content: RawContent;
  children: ReactNode;
}) {
  const value = useMemo<SiteContextType>(() => {
    const { settings } = content;
    const tokens = { whatsapp: settings.whatsappDisplay, phone: settings.phones[0] ?? "", email: settings.emails[0] ?? "" };
    return {
      site: settings,
      packages: resolveItems<Package>("packages", content.packages, lang, tokens),
      destinations: resolveItems<Destination>("destinations", content.destinations, lang, tokens),
      testimonials: resolveItems<Testimonial>("testimonials", content.testimonials, lang, tokens),
      faq: resolveItems<FAQItem>("faq", content.faq, lang, tokens),
      whatsappLink: (message = settings.whatsappMessage) => buildWhatsappLink(settings.whatsapp, message),
    };
  }, [content, lang]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within a SiteProvider");
  return context;
}
