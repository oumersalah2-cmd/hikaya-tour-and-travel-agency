"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n";

export default function NotFound() {
  const first = usePathname()?.split("/")[1] ?? "";
  const lang = isLocale(first) ? first : defaultLocale;

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-800 to-primary-950 px-6 text-center text-white"
    >
      <p className="font-display text-7xl font-bold text-gradient-gold">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">
        {lang === "om" ? "Fuulli kun hin argamne" : "Page not found"}
      </h1>
      <p className="mt-3 max-w-md text-gray-300">
        {lang === "om"
          ? "Fuulli barbaaddan hin jiru ykn bakka biraatti ceesisameera."
          : "The page you are looking for doesn’t exist or has been moved."}
      </p>
      <Link href={`/${lang}`} className="btn-primary mt-8 px-8">
        {lang === "om" ? "Gara jalqabaatti deebi’i" : "Back to home"}
      </Link>
    </main>
  );
}
