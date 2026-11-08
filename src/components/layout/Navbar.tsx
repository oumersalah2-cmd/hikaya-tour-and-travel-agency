"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HikayaLogo from "@/components/ui/HikayaLogo";
import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/lib/i18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname() ?? `/${lang}`;

  // The transparent-over-hero style only works on the home page (dark hero image).
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const solid = isScrolled || isMobileOpen || !isHome;

  const switchLanguage = (newLang: Locale) => {
    if (newLang === lang) return;
    const rest = pathname.replace(/^\/(en|om|am)(?=\/|$)/, "");
    router.push(`/${newLang}${rest}${window.location.hash}`);
  };

  const navLinks = [
    { href: `/${lang}#home`, label: t.nav.home },
    { href: `/${lang}#services`, label: t.nav.services },
    { href: `/${lang}#packages`, label: t.nav.packages },
    {
      href: `/${lang}#founder`,
      label: lang === "en" ? "Founder" : lang === "am" ? "መስራች" : "Hundeeffaa",
    },
    { href: `/${lang}#schedule`, label: t.nav.schedule },
    { href: `/${lang}#diaspora`, label: t.nav.diaspora },
    { href: `/${lang}/gallery`, label: t.nav.gallery },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-gray-100/60 bg-white/90 shadow-soft backdrop-blur-xl dark:border-white/5 dark:bg-dark-500/90"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label={t.ui.mainNav}
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8"
        >
          <Link href={`/${lang}`} className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
            <HikayaLogo
              variant="full"
              inverted={!solid}
              size="md"
              priority
            />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 xl:px-4 ${
                  solid
                    ? "text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-dark-200 dark:hover:text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {/* 3-Language segmented switcher */}
            <div
              className={`inline-flex items-center rounded-xl p-0.5 text-xs font-bold transition-colors ${
                solid
                  ? "border border-primary-200/80 bg-gray-100/80 dark:border-white/10 dark:bg-dark-300"
                  : "border border-white/25 bg-black/30 backdrop-blur-md"
              }`}
              role="group"
              aria-label={t.ui.switchLanguage}
            >
              {(["en", "om", "am"] as const).map((l) => {
                const active = lang === l;
                const label = l === "en" ? "EN" : l === "om" ? "OM" : "አማ";
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLanguage(l)}
                    className={`rounded-lg px-2.5 py-1 transition-all duration-200 ${
                      active
                        ? "bg-accent-600 text-white shadow-sm"
                        : solid
                        ? "text-primary-700 hover:text-accent-600 dark:text-gray-300 dark:hover:text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <ThemeToggle onDark={!solid} />
            <Link href={`/${lang}#packages`} className="btn-primary px-6 py-2.5 text-sm">
              {t.ui.bookNow}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile language switcher */}
            <div
              className={`inline-flex items-center rounded-xl p-0.5 text-[11px] font-bold ${
                solid
                  ? "border border-primary-200/80 bg-gray-100 dark:border-white/10 dark:bg-dark-300"
                  : "border border-white/25 bg-black/30 backdrop-blur-md"
              }`}
            >
              {(["en", "om", "am"] as const).map((l) => {
                const active = lang === l;
                const label = l === "en" ? "EN" : l === "om" ? "OM" : "አማ";
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLanguage(l)}
                    className={`rounded-lg px-2 py-0.5 transition-all ${
                      active
                        ? "bg-accent-600 text-white shadow-sm"
                        : solid
                        ? "text-primary-700 dark:text-gray-300"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <ThemeToggle onDark={!solid} />
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className={`rounded-lg p-2 transition-colors ${
                solid ? "text-primary-700 dark:text-white" : "text-white"
              }`}
              aria-label={isMobileOpen ? t.ui.closeMenu : t.ui.openMenu}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[min(300px,85vw)] overflow-y-auto bg-white shadow-2xl dark:bg-dark-400"
            >
              <div className="p-6 pt-24">
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="block rounded-xl px-4 py-3 font-medium text-primary-700 transition-colors hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-dark-200"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    href={`/${lang}#packages`}
                    onClick={() => setIsMobileOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    {t.ui.bookNow}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
