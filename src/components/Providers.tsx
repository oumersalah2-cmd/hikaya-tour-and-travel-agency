"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TripProvider } from "@/context/TripContext";
import { SiteProvider, type RawContent } from "@/context/SiteContext";
import type { Locale } from "@/lib/i18n";

export default function Providers({
  lang,
  content,
  children,
}: {
  lang: Locale;
  content: RawContent;
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <LanguageProvider lang={lang}>
        <SiteProvider lang={lang} content={content}>
          <TripProvider>
            {/* Honour the visitor's "reduce motion" OS setting */}
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </TripProvider>
        </SiteProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
