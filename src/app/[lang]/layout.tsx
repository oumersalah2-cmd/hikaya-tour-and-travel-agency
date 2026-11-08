import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/data/site";
import { getAllContent, getSettings } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy: Record<Locale, { title: string; description: string; og: string; locale: string }> = {
  en: {
    title: "HIKAYA Tour and Travel Agency | Umrah, Flights & Ethiopia Tours",
    description:
      "Sacred Umrah journeys (Makkah & Medina), domestic & international flight tickets, hotel bookings and guided tours across Ethiopia — Sof Omar, Wonchi, Bale, Semien and Afar.",
    og: "Your gateway to sacred Umrah journeys, flight tickets, and breathtaking tours across Ethiopia.",
    locale: "en_US",
  },
  om: {
    title: "HIKAYA Tour and Travel Agency | Umraa, Tikeettii fi Daawwannaa Itoophiyaa",
    description:
      "Imala Umraa (Makkaa fi Madiinaa), tikeettii xiyyaaraa idil-addunyaa fi biyya keessaa, hoteela qabsiisuu, fi daawwannaa Itoophiyaa — Soof Umar, Wonchii, Baalee, Saameen fi Affaar.",
    og: "Karaa imala Umraa eebbifamaa, tikeettii xiyyaaraa fi daawwannaa Itoophiyaa.",
    locale: "om_ET",
  },
  am: {
    title: "ሂካያ የጉዞና ቱሪዝም ኤጀንሲ | ኡምራ፣ የአየር ትኬት እና የኢትዮጵያ ቱሮች",
    description:
      "የተሟላ የኡምራ ጉዞዎች (መካ እና መዲና ከታሪካዊ ዚያራ ጋር)፣ የሀገር ውስጥና ዓለም አቀፍ የአየር ትኬት፣ የሆቴል ቦታ ማስያዝ እንዲሁም በኢትዮጵያ አስደናቂ ቱሮች — ሶፍ ኡመር ዋሻ፣ ወንጪ ሐይቅ፣ ባሌ ተራሮች፣ ሰሜን ተራራ እና አፋር።",
    og: "ወደ ቅዱሳን የኡምራ ቦታዎች፣ የአየር ትኬት እና ወደ ተመረጡ የኢትዮጵያ መዳረሻዎች መግቢያዎ።",
    locale: "am_ET",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = copy[lang];
  const SITE = { ...(await getSettings()), url: SITE_URL };

  return {
    metadataBase: new URL(SITE.url),
    title: { default: c.title, template: `%s | ${SITE.shortName}` },
    description: c.description,
    icons: { apple: "/apple-touch-icon.png" },
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: SITE.name,
      description: c.og,
      url: `/${lang}`,
      siteName: SITE.name,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: SITE.name,
        },
      ],
      locale: c.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.name,
      description: c.og,
      images: ["/og.jpg"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0842cd" },
    { media: "(prefers-color-scheme: dark)", color: "#051336" },
  ],
};

/** Runs before first paint so the saved / system theme never flashes. */
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

const skipLabel: Record<Locale, string> = {
  en: "Skip to main content",
  om: "Gara qabiyyee fuulaatti darbi",
  am: "ወደ ዋናው ይዘት ይለፉ",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = await getAllContent();
  const SITE = { ...content.settings, url: SITE_URL };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    url: `${SITE.url}/${lang}`,
    telephone: SITE.phones[0],
    email: SITE.emails[0],
    image: `${SITE.url}/og.jpg`,
    sameAs: Object.values(SITE.social).filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.en[0],
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
  };

  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} bg-white font-sans text-primary-700 antialiased transition-colors duration-300 selection:bg-accent-500/20 selection:text-accent-700 dark:bg-dark-500 dark:text-gray-100 dark:selection:text-accent-300`}
      >
        <a
          href="#main"
          className="sr-only z-[200] rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {skipLabel[lang]}
        </a>
        <Providers lang={lang} content={content}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
