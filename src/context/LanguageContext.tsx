"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { en } from "@/dictionaries/en";
import { om } from "@/dictionaries/om";
import { am } from "@/dictionaries/am";
import type { Locale } from "@/lib/i18n";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, om, am };

/** Replaces {{token}} placeholders in every string of the dictionary (e.g. the live WhatsApp number). */
function fillTokens<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === "string") {
    return value.replace(/\{\{(\w+)\}\}/g, (m, k: string) => tokens[k] ?? m) as T;
  }
  if (Array.isArray(value)) return value.map((v) => fillTokens(v, tokens)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, fillTokens(v, tokens)])
    ) as T;
  }
  return value;
}

interface LanguageContextType {
  lang: Locale;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  lang,
  tokens = {},
}: {
  children: ReactNode;
  lang: Locale;
  tokens?: Record<string, string>;
}) {
  const whatsapp = tokens.whatsapp ?? "";
  const phones = tokens.phones ?? "";
  const value = useMemo(
    () => ({ lang, t: fillTokens(dictionaries[lang] ?? en, { whatsapp, phones }) }),
    [lang, whatsapp, phones]
  );
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
