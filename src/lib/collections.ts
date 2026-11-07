import type { Locale } from "@/lib/i18n";

/**
 * Schema-driven definition of every list the owner can edit in the admin panel
 * (packages, destinations, testimonials, FAQ). One generic editor + one generic
 * server action handle all of them.
 *
 * Stored item shape:  { id, visible, <field>: value }
 *  - localized fields are stored as { en, om }
 *  - "lines" fields are string[] (or { en: string[], om: string[] } when localized)
 */

export type L10n = { en: string; om: string };
export type L10nLines = { en: string[]; om: string[] };

export type FieldType = "text" | "textarea" | "number" | "select" | "bool" | "image" | "lines";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  localized?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  max?: number;
  min?: number;
  step?: number;
  half?: boolean; // render side by side with the next half field
  required?: boolean;
}

export type CollectionName = "packages" | "destinations" | "testimonials" | "faq";

export interface CollectionSchema {
  name: CollectionName;
  title: string;
  singular: string;
  description: string;
  /** field used as the card title in the editor */
  titleField: string;
  /** field used as subtitle in the editor card */
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
}

export type Item = Record<string, unknown> & { id: string; visible: boolean };

const num = (key: string, label: string, extra: Partial<Field> = {}): Field => ({
  key,
  label,
  type: "number",
  half: true,
  ...extra,
});

export const SCHEMAS: Record<CollectionName, CollectionSchema> = {
  packages: {
    name: "packages",
    title: "Packages & Prices",
    singular: "package",
    description: "Umrah packages, tours and flight/hotel offers shown in “Featured packages” and the booking form.",
    titleField: "title",
    subtitleField: "duration",
    imageField: "image",
    fields: [
      { key: "title", label: "Package name", type: "text", localized: true, required: true, max: 120 },
      {
        key: "category",
        label: "Category",
        type: "select",
        half: true,
        options: [
          { value: "umrah", label: "Umrah" },
          { value: "tours", label: "Ethiopia tours" },
          { value: "travel", label: "Flights & hotels" },
        ],
      },
      { key: "badge", label: "Badge (small label on the card)", type: "text", localized: true, half: true, max: 40 },
      { key: "destination", label: "Destination / route text", type: "text", localized: true, max: 120 },
      { key: "duration", label: "Duration", type: "text", localized: true, half: true, max: 60, placeholder: "11 Days / 10 Nights" },
      { key: "occupancy", label: "Occupancy / group type", type: "text", localized: true, half: true, max: 60 },
      num("price", "Price (USD)", { min: 0, max: 1000000 }),
      { key: "priceETB", label: "Price in ETB (text)", type: "text", half: true, max: 40, placeholder: "150,000 ETB" },
      num("originalPrice", "Old price (USD, optional — shows a discount)", { min: 0, max: 1000000 }),
      { key: "routeBadge", label: "Route line", type: "text", half: true, max: 80, placeholder: "Addis ➔ Madinah ➔ Makkah ➔ Addis" },
      num("rating", "Rating (0–5)", { min: 0, max: 5, step: 0.1 }),
      num("reviews", "Number of reviews", { min: 0, max: 100000 }),
      { key: "description", label: "Description", type: "textarea", localized: true, max: 900 },
      { key: "highlights", label: "Highlights (one per line)", type: "lines", localized: true, max: 120 },
      { key: "image", label: "Photo", type: "image" },
      { key: "featured", label: "Mark as featured", type: "bool" },
    ],
  },
  destinations: {
    name: "destinations",
    title: "Destinations",
    singular: "destination",
    description: "The “Popular destinations” cards on the home page. The first two are shown large.",
    titleField: "name",
    subtitleField: "country",
    imageField: "image",
    fields: [
      { key: "name", label: "Name", type: "text", localized: true, required: true, max: 100 },
      { key: "country", label: "Region / country", type: "text", localized: true, max: 80 },
      num("tours", "Number of tours", { min: 0, max: 10000 }),
      { key: "image", label: "Photo", type: "image" },
      { key: "featured", label: "Featured", type: "bool" },
    ],
  },
  testimonials: {
    name: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    description: "Customer reviews shown on the home page. Only add real feedback from real customers.",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { key: "name", label: "Customer name", type: "text", required: true, max: 80, half: true },
      { key: "role", label: "Role / trip type", type: "text", localized: true, max: 60, half: true },
      num("rating", "Rating (1–5)", { min: 1, max: 5, step: 1 }),
      { key: "quote", label: "Review", type: "textarea", localized: true, max: 600, required: true },
    ],
  },
  faq: {
    name: "faq",
    title: "FAQ",
    singular: "question",
    description: "Frequently asked questions. Tip: write {{whatsapp}} to insert your WhatsApp number automatically.",
    titleField: "question",
    fields: [
      { key: "question", label: "Question", type: "text", localized: true, required: true, max: 220 },
      { key: "answer", label: "Answer", type: "textarea", localized: true, required: true, max: 1200 },
    ],
  },
};

export const COLLECTION_NAMES = Object.keys(SCHEMAS) as CollectionName[];

/* ------------------------------------------------------------------ */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const toStr = (v: unknown, max = 500): string =>
  typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" ? String(v) : "";

const toLines = (v: unknown, max: number): string[] => {
  const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
  return arr.map((x) => toStr(x, max)).filter(Boolean).slice(0, 20);
};

function sanitizeImage(v: unknown): string {
  const s = toStr(v, 300);
  // Site-relative paths only (uploads or bundled photos) — remote hosts would be
  // blocked by next/image and could break the page.
  if (/^\/(?!\/)[A-Za-z0-9_\-./]+$/.test(s) && !s.includes("..")) return s;
  return "";
}

/** Server-side validation / normalisation of whatever the browser sends. */
export function sanitizeItems(name: CollectionName, input: unknown): Item[] {
  const schema = SCHEMAS[name];
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: Item[] = [];

  for (const raw of input.slice(0, 200)) {
    if (!isRecord(raw)) continue;
    let id = toStr(raw.id, 60).replace(/[^A-Za-z0-9_-]/g, "");
    if (!id || seen.has(id)) id = `${name}-${Math.random().toString(36).slice(2, 9)}`;
    seen.add(id);

    const item: Item = { id, visible: raw.visible !== false };

    for (const f of schema.fields) {
      const value = raw[f.key];
      const max = f.max ?? 500;
      switch (f.type) {
        case "text":
        case "textarea": {
          if (f.localized) {
            const r = isRecord(value) ? value : {};
            item[f.key] = { en: toStr(r.en, max), om: toStr(r.om, max) } satisfies L10n;
          } else item[f.key] = toStr(value, max);
          break;
        }
        case "lines": {
          if (f.localized) {
            const r = isRecord(value) ? value : {};
            item[f.key] = { en: toLines(r.en, max), om: toLines(r.om, max) } satisfies L10nLines;
          } else item[f.key] = toLines(value, max);
          break;
        }
        case "number": {
          const n = Number(value);
          const lo = f.min ?? 0;
          const hi = f.max ?? 1e9;
          item[f.key] = Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
          break;
        }
        case "select": {
          const allowed = f.options?.map((o) => o.value) ?? [];
          const s = toStr(value, 40);
          item[f.key] = allowed.includes(s) ? s : (allowed[0] ?? "");
          break;
        }
        case "bool":
          item[f.key] = value === true;
          break;
        case "image":
          item[f.key] = sanitizeImage(value);
          break;
      }
    }
    out.push(item);
  }
  return out;
}

/** Empty record for the "Add" button. */
export function blankItem(name: CollectionName): Item {
  const schema = SCHEMAS[name];
  const item: Item = {
    id: `${name}-${Math.random().toString(36).slice(2, 9)}`,
    visible: true,
  };
  for (const f of schema.fields) {
    if (f.type === "text" || f.type === "textarea") item[f.key] = f.localized ? { en: "", om: "" } : "";
    else if (f.type === "lines") item[f.key] = f.localized ? { en: [], om: [] } : [];
    else if (f.type === "number") item[f.key] = name === "testimonials" ? 5 : f.key === "rating" ? 5 : 0;
    else if (f.type === "select") item[f.key] = f.options?.[0]?.value ?? "";
    else if (f.type === "bool") item[f.key] = false;
    else item[f.key] = "";
  }
  return item;
}

/**
 * Merges the English and Afaan Oromoo versions of the built-in data
 * (the old `getX(lang)` helpers) into the bilingual item shape.
 */
export function buildDefaults(
  name: CollectionName,
  en: Record<string, unknown>[],
  om: Record<string, unknown>[]
): Item[] {
  const schema = SCHEMAS[name];
  return en.map((e, i) => {
    const o = om[i] ?? e;
    const item: Item = { id: String(e.id), visible: true };
    for (const f of schema.fields) {
      if (f.localized) item[f.key] = { en: e[f.key] ?? (f.type === "lines" ? [] : ""), om: o[f.key] ?? (f.type === "lines" ? [] : "") };
      else item[f.key] = e[f.key] ?? (f.type === "bool" ? false : f.type === "number" ? 0 : "");
    }
    return item;
  });
}

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/** Flattens bilingual items to the single-language shape the website components use. */
export function resolveItems<T>(name: CollectionName, items: Item[], lang: Locale, tokens: Record<string, string> = {}): T[] {
  const schema = SCHEMAS[name];
  const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (m, k: string) => tokens[k] ?? m);

  return items
    .filter((item) => item.visible)
    .map((item) => {
      const out: Record<string, unknown> = { id: item.id };
      for (const f of schema.fields) {
        const v = item[f.key];
        if (f.localized && isRecord(v)) {
          if (f.type === "lines") {
            const chosen = (v[lang] as string[] | undefined)?.length ? (v[lang] as string[]) : ((v.en as string[]) ?? []);
            out[f.key] = chosen.map(fill);
          } else {
            const chosen = (v[lang] as string) || (v.en as string) || "";
            out[f.key] = fill(chosen);
          }
        } else if (f.type === "image") {
          out[f.key] = typeof v === "string" && v ? v : PLACEHOLDER_IMAGE;
        } else if (f.type === "text" || f.type === "textarea") {
          out[f.key] = typeof v === "string" ? fill(v) : v;
        } else if (f.type === "number" && (v === 0 || v === undefined) && f.key === "originalPrice") {
          out[f.key] = undefined; // 0 = no old price
        } else {
          out[f.key] = v;
        }
      }
      return out as T;
    });
}
