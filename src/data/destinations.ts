import type { Locale } from "@/lib/i18n";
export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  tours: number;
  featured?: boolean;
}

export const getDestinations = (lang: Locale): Destination[] => [
  {
    id: "sof-omar",
    name:
      lang === "am"
        ? "የሶፍ ኡመር ዋሻ"
        : lang === "om"
        ? "Holqa Soof Umar"
        : "Sof Omar Caves",
    country:
      lang === "am"
        ? "ባሌ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Baalee, Itoophiyaa"
        : "Bale, Ethiopia",
    image: "/images/destinations/sof-omar.jpg",
    tours: 18,
    featured: true,
  },
  {
    id: "wonchi",
    name:
      lang === "am"
        ? "የወንጪ ሐይቅ"
        : lang === "om"
        ? "Haroo Wonchii"
        : "Wonchi Crater Lake",
    country:
      lang === "am"
        ? "ኦሮሚያ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Oromiyaa, Itoophiyaa"
        : "Oromia, Ethiopia",
    image: "/images/destinations/wonchi.jpg",
    tours: 22,
    featured: true,
  },
  {
    id: "bale-mountains",
    name:
      lang === "am"
        ? "የባሌ ተራሮች ብሔራዊ ፓርክ"
        : lang === "om"
        ? "Gaarren Baalee"
        : "Bale Mountains",
    country:
      lang === "am"
        ? "ባሌ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Baalee, Itoophiyaa"
        : "Bale, Ethiopia",
    image: "/images/destinations/bale-mountains.jpg",
    tours: 16,
    featured: true,
  },
  {
    id: "semien-mountains",
    name:
      lang === "am"
        ? "የሰሜን ተራራ (ሰሜን ተራራ ብሔራዊ ፓርክ)"
        : lang === "om"
        ? "Gaarren Saameen (Samen Terara)"
        : "Semien Mountains (Samen Terara)",
    country:
      lang === "am"
        ? "ኢትዮጵያ"
        : lang === "om"
        ? "Itoophiyaa"
        : "Ethiopia",
    image: "/images/destinations/semien-mountains.jpg",
    tours: 15,
    featured: true,
  },
  {
    id: "afar-depression",
    name:
      lang === "am"
        ? "የአፋር ስምጥ (ዳሎል እና ኤርታ አሌ)"
        : lang === "om"
        ? "Gammoojjii Affaar (Dallol & Erta Ale)"
        : "Afar Depression (Danakil & Erta Ale)",
    country:
      lang === "am"
        ? "አፋር፣ ኢትዮጵያ"
        : lang === "om"
        ? "Affaar, Itoophiyaa"
        : "Afar, Ethiopia",
    image: "/images/destinations/afar-danakil.jpg",
    tours: 14,
    featured: true,
  },
  {
    id: "mecca-medina",
    name:
      lang === "am"
        ? "መካ እና መዲና (ኡምራ እና ዚያራ)"
        : lang === "om"
        ? "Makkaa fi Madiinaa (Umrah fi Daawwannaa)"
        : "Mecca & Medina (Umrah & Ziyarah)",
    country:
      lang === "am"
        ? "ሳውዲ አረቢያ"
        : lang === "om"
        ? "Saawud Arabiyaa"
        : "Saudi Arabia",
    image: "/images/destinations/umrah-makkah.jpg",
    tours: 35,
    featured: true,
  },
];

