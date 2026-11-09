export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikayatour.com";

export interface SiteSettings {
  name: string;
  shortName: string;
  phones: string[];
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  emails: string[];
  address: { en: string[]; om: string[]; am?: string[] };
  hours: { en: string[]; om: string[]; am?: string[] };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    telegram: string;
    youtube: string;
  };
  mapUrl: string;
  stats: {
    travelers: number;
    destinations: number;
    trips: number;
    experience: number;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  name: "HIKAYA Tour and Travel Agency",
  shortName: "HIKAYA",
  phones: ["+251 91 212 4876"],
  whatsapp: "251912124876",
  whatsappDisplay: "+251 91 212 4876",
  whatsappMessage: "Hello HIKAYA, I would like to inquire about your services",
  emails: ["hikayatravelagency12@gmail.com"],
  address: {
    en: ["Bole Road, Near Friendship Mall", "Addis Ababa, Ethiopia"],
    om: ["Daandii Boolee, Friendship Mall Bira", "Finfinnee, Itoophiyaa"],
    am: ["ቦሌ መንገድ፣ ፍሬንድሺፕ ሞል አጠገብ", "አዲስ አበባ፣ ኢትዮጵያ"],
  },
  hours: {
    en: ["Mon – Fri: 8:30 AM – 5:30 PM", "Sat: 9:00 AM – 1:00 PM"],
    om: ["Wiixata – Jimaata: 8:30 – 17:30", "Sanbata: 9:00 – 13:00"],
    am: ["ከሰኞ – ዓርብ፡ 2:30 – 11:30", "ቅዳሜ፡ 3:00 – 7:00"],
  },
  social: {
    facebook: "https://www.facebook.com/share/1E8V8mrJDf/",
    instagram: "",
    tiktok: "https://www.tiktok.com/@hikaya1212",
    telegram: "https://t.me/Hikayatravrl",
    youtube: "",
  },
  mapUrl: "",
  stats: {
    travelers: 12500,
    destinations: 45,
    trips: 1200,
    experience: 8,
  },
};

export const SITE = {
  ...DEFAULT_SETTINGS,
  url: SITE_URL,
};

export type LocalizedLines = Record<"en" | "om", readonly string[]>;

export const DEFAULT_WHATSAPP_MESSAGE = DEFAULT_SETTINGS.whatsappMessage;

export function buildWhatsappLink(phone: string, message?: string) {
  const p = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${p}${text}`;
}

export function whatsappLink(message: string = DEFAULT_SETTINGS.whatsappMessage) {
  return buildWhatsappLink(DEFAULT_SETTINGS.whatsapp, message);
}

/** "https://t.me/name" or "https://www.tiktok.com/@name" -> "@name" */
export function handleFromUrl(url: string) {
  const last = url.replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop() ?? "";
  return last ? (last.startsWith("@") ? last : `@${last}`) : url;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
