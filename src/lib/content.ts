import "server-only";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/data/site";
import { getDestinations } from "@/data/destinations";
import { getFaqItems } from "@/data/faq";
import { getPackages } from "@/data/packages";
import { getTestimonials } from "@/data/testimonials";
import {
  buildDefaults,
  sanitizeItems,
  type CollectionName,
  type Item,
} from "@/lib/collections";
import { readContent } from "@/lib/store";

import type { Locale } from "@/lib/i18n";

const FAQ_PHONE = DEFAULT_SETTINGS.whatsappDisplay;

/** Built-in content (English + Afaan Oromoo + Amharic merged) used until the owner edits a list. */
export function defaultItems(name: CollectionName): Item[] {
  const trio = <T,>(fn: (l: Locale) => T[]) => [fn("en"), fn("om"), fn("am")] as const;
  switch (name) {
    case "packages": {
      const [en, om, am] = trio(getPackages);
      return buildDefaults(name, en as never, om as never, am as never);
    }
    case "destinations": {
      const [en, om, am] = trio(getDestinations);
      return buildDefaults(name, en as never, om as never, am as never);
    }
    case "testimonials": {
      const [en, om, am] = trio(getTestimonials);
      return buildDefaults(name, en as never, om as never, am as never);
    }
    case "faq": {
      const [en, om, am] = trio(getFaqItems);
      // Replace the placeholder number with a token so it follows the real WhatsApp number
      const swap = (list: typeof en) =>
        list.map((f) => ({ ...f, answer: f.answer.split(FAQ_PHONE).join("{{whatsapp}}") }));
      return buildDefaults(name, swap(en) as never, swap(om) as never, swap(am) as never);
    }
  }
}

export async function getItems(name: CollectionName): Promise<Item[]> {
  try {
    const saved = await readContent<unknown>(name, null);
    if (saved === null) return defaultItems(name);
    return sanitizeItems(name, saved);
  } catch (error) {
    console.error(`[content] falling back to defaults for ${name}`, error);
    return defaultItems(name);
  }
}

/** true once the owner has saved something (so "Restore originals" makes sense) */
export async function hasContent(name: string): Promise<boolean> {
  try {
    return (await readContent<unknown>(name, null)) !== null;
  } catch {
    return false;
  }
}

/* ------------------------------ Settings ------------------------------ */

const str = (v: unknown, max: number, fallback = "") =>
  typeof v === "string" ? v.trim().slice(0, max) : fallback;

const strList = (v: unknown, max: number, limit: number, fallback: string[]) =>
  Array.isArray(v)
    ? v.map((x) => str(x, max)).filter(Boolean).slice(0, limit)
    : fallback;

const count = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100_000_000, Math.max(0, Math.round(n))) : fallback;
};

const url = (v: unknown) => {
  const s = str(v, 300);
  return /^https?:\/\/[^\s"'<>]+$/.test(s) ? s : "";
};

/** English is required; an empty Afaan Oromoo list falls back to the English lines. */
function bilingual(
  r: Record<string, unknown>,
  max: number,
  fallback: { en: readonly string[]; om: readonly string[] }
) {
  const en = strList(r.en, max, 4, [...fallback.en]);
  const om = strList(r.om, max, 4, []);
  return { en: en.length ? en : [...fallback.en], om: om.length ? om : en.length ? en : [...fallback.om] };
}

export function sanitizeSettings(input: unknown): SiteSettings {
  const d = DEFAULT_SETTINGS;
  const r = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const addr = (r.address ?? {}) as Record<string, unknown>;
  const hrs = (r.hours ?? {}) as Record<string, unknown>;
  const soc = (r.social ?? {}) as Record<string, unknown>;
  const st = (r.stats ?? {}) as Record<string, unknown>;

  const phones = strList(r.phones, 40, 5, d.phones);
  const emails = strList(r.emails, 120, 5, d.emails).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e));
  const whatsapp = str(r.whatsapp, 20).replace(/\D/g, "") || d.whatsapp;

  return {
    name: str(r.name, 80) || d.name,
    shortName: str(r.shortName, 30) || d.shortName,
    phones: phones.length ? phones : d.phones,
    whatsapp,
    whatsappDisplay: str(r.whatsappDisplay, 30) || `+${whatsapp}`,
    whatsappMessage: str(r.whatsappMessage, 200) || d.whatsappMessage,
    emails: emails.length ? emails : d.emails,
    address: bilingual(addr, 120, d.address),
    hours: bilingual(hrs, 80, d.hours),
    social: {
      facebook: url(soc.facebook),
      instagram: url(soc.instagram),
      tiktok: url(soc.tiktok),
      telegram: url(soc.telegram),
      youtube: url(soc.youtube),
    },
    mapUrl: url(r.mapUrl),
    stats: {
      travelers: count(st.travelers, d.stats.travelers),
      destinations: count(st.destinations, d.stats.destinations),
      trips: count(st.trips, d.stats.trips),
      experience: count(st.experience, d.stats.experience),
    },
  };
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const saved = await readContent<unknown>("settings", null);
    return saved === null ? DEFAULT_SETTINGS : sanitizeSettings(saved);
  } catch (error) {
    console.error("[content] falling back to default settings", error);
    return DEFAULT_SETTINGS;
  }
}

export async function getAllContent() {
  const [settings, packages, destinations, testimonials, faq] = await Promise.all([
    getSettings(),
    getItems("packages"),
    getItems("destinations"),
    getItems("testimonials"),
    getItems("faq"),
  ]);
  return { settings, packages, destinations, testimonials, faq };
}

export type AllContent = Awaited<ReturnType<typeof getAllContent>>;
