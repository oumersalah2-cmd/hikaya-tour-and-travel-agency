"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { en } from "@/dictionaries/en";
import { om } from "@/dictionaries/om";
import type { Locale } from "@/lib/i18n";

export type Dictionary = typeof en;

interface LanguageContextType {
  lang: Locale;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Locale;
}) {
  const value = useMemo(
    () => ({ lang, t: (lang === "om" ? om : en) as Dictionary }),
    [lang]
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
