import type { Locale } from "@/lib/i18n";
import { Plane, MapPin, Globe, Palmtree, FileCheck, Hotel, Shield, Car, Briefcase, Moon, Compass, Ticket, Mountain } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof serviceIcons;
}

export const serviceIcons = {
  Plane, MapPin, Globe, Palmtree, FileCheck, Hotel, Shield, Car, Briefcase, Moon, Compass, Ticket, Mountain,
};

export const getServices = (lang: Locale): Service[] => [
  {
    id: "umrah-packages",
    title:
      lang === "am"
        ? "የኡምራ ፓኬጆች (መካ፣ መዲና እና ዚያራ)"
        : lang === "om"
        ? "Paakeejii Umraa (Makkaa, Madiinaa fi Ziyaaraa)"
        : "Umrah Packages (Makkah & Medina)",
    description:
      lang === "am"
        ? "በመካና በመዲና ከሀረም አቅራቢያ የሚገኙ ባለ 5 ኮከብ ሆቴሎች፣ የኡለሞች መንፈሳዊ መመሪያና ታሪካዊ ዚያራዎችን ያካተተ የተሟላ የኡምራ ፓኬጅ።"
        : lang === "om"
        ? "Paakeejii Umraa guutuu kan Makkaa, Madiinaa fi daawwannaa/ziyaaraa iddoowwan seena qabeessaa, qajeelchitoota beekumsa qabaniifi bakka bultii Haramatti dhihoo ta'e."
        : "Comprehensive spiritual Umrah packages with 5-star accommodations near Haram in Makkah & Medina, religious guidance, and historical Ziyarah tours.",
    icon: "Moon",
  },
  {
    id: "international-ticket",
    title:
      lang === "am"
        ? "ዓለም አቀፍ የአየር ትኬት (International Ticket)"
        : lang === "om"
        ? "Tikeettii Xiyyaaraa Idil-Addunyaa (International Ticket)"
        : "International Flight Tickets",
    description:
      lang === "am"
        ? "ወደ መካከለኛው ምስራቅ፣ አውሮፓ፣ ሰሜን አሜሪካና መላው ዓለም ፈጣን የአየር ትኬት አቆራረጥ በተመጣጣኝና ተወዳዳሪ ዋጋዎች።"
        : lang === "om"
        ? "Tikeettii xiyyaaraa addunyaa gara Baha Giddugaleessaa, Awurooppaa, Ameerikaa fi addunyaa guutuutti gatii madaalawaa fi filannoo mijataan isiniif qabsiisna."
        : "Fast, seamless global flight ticket booking with best guaranteed rates to Middle East, Europe, North America, and worldwide.",
    icon: "Plane",
  },
  {
    id: "domestic-ticket",
    title:
      lang === "am"
        ? "የሀገር ውስጥ የአየር ትኬት (Domestic Ticket)"
        : lang === "om"
        ? "Tikeettii Xiyyaaraa Biyya Keessaa (Domestic Ticket)"
        : "Domestic Flight Tickets",
    description:
      lang === "am"
        ? "አዲስ አበባን፣ ጎባ/ባሌን፣ ድሬዳዋን፣ ባህር ዳርን፣ ሰመራ/አፋርን እና ሁሉንም የኢትዮጵያ ከተሞች የሚያገናኙ አስተማማኝ የአየር ትኬቶች።"
        : lang === "om"
        ? "Tikeettii xiyyaaraa biyya keessaa Finfinnee, Baalee, Dirree Dhawaa, Bahaar Daar, Samaraa/Affaar fi magaalaawwan Itoophiyaa hundaaf dhiyeessina."
        : "Reliable domestic air tickets across Ethiopia connecting Addis Ababa, Goba/Bale, Dire Dawa, Bahir Dar, Semera/Afar, and all destinations.",
    icon: "Ticket",
  },
  {
    id: "international-hotel",
    title:
      lang === "am"
        ? "ዓለም አቀፍ የሆቴል ቦታ ማስያዝ"
        : lang === "om"
        ? "Hoteelota Idil-Addunyaa (International Hotel Booking)"
        : "International Hotel Booking",
    description:
      lang === "am"
        ? "በመካ፣ መዲና፣ ዱባይ፣ ኢስታንቡል እና በዓለም ዙሪያ በሚገኙ ምርጥና ምቹ ሆቴሎች አስተማማኝ የቦታ ማስያዣ አገልግሎት።"
        : lang === "om"
        ? "Hoteelota sadarkaa olaanaa Makkaa, Madiinaa, Dubaay, Istanbuul fi addunyaa guutuutti bakka bultii mijataa fi gatii filatamaadhaan isiniif qabsiisna."
        : "Exclusive hotel and resort bookings worldwide — from luxury hotels in Mecca, Medina, Dubai, and Istanbul to global boutique stays.",
    icon: "Hotel",
  },
  {
    id: "domestic-hotel",
    title:
      lang === "am"
        ? "የሀገር ውስጥ የሆቴልና ሎጅ ቦታ ማስያዝ"
        : lang === "om"
        ? "Hoteelota Biyya Keessaa (Domestic Hotel Booking)"
        : "Domestic Hotel Booking",
    description:
      lang === "am"
        ? "በኢትዮጵያ የተመረጡ ሪዞርቶች፣ የባሌ ተራሮች ሎጅ፣ የወንጪ ሎጆች እና የሰሜን ተራራ ሪዞርቶች የሆቴል ቦታ ማስያዣ አገልግሎት።"
        : lang === "om"
        ? "Hoteelota fi loojjota filatamoo Itoophiyaa keessaa kan akka loojii Gaarren Baalee, Wonchii, fi Gaarren Saameen haala ammayyaawaan isiniif qabsiisna."
        : "Handpicked eco-lodges, resorts, and premium hotels across Ethiopia including Bale Mountain Lodge, Wonchi crater lodges, and Semien resorts.",
    icon: "Hotel",
  },
  {
    id: "ethiopia-tours",
    title:
      lang === "am"
        ? "የኢትዮጵያ ቱሮች (ሶፍ ኡመር፣ ወንጪ፣ ባሌ፣ ሰሜን፣ አፋር)"
        : lang === "om"
        ? "Daawwannaa: Soof Umar, Wonchii, Baalee, Saameen, Affaar"
        : "Ethiopia Tours (Sof Omar, Wonchii, Bale, Semien, Afar)",
    description:
      lang === "am"
        ? "ወደ ሶፍ ኡመር ዋሻ፣ ወንጪ ሐይቅ፣ ባሌ ተራሮች፣ ሰሜን ተራራ እና አፋር ዳሎል የሚደረጉ የማይረሱ የተመሩ የተፈጥሮ ጉዞዎች።"
        : lang === "om"
        ? "Imala daawwannaa dinqisiisaa Holqa Soof Umar, Haroo Wonchii, Gaarren Baalee, Gaarren Saameen (Samen Terara), Gammoojjii Affaar fi kanneen biroo."
        : "Unforgettable expeditions to Sof Omar Caves, Wonchi Crater Lake, Bale Mountains, Semien Mountains (Samen Terara), and Afar Depression.",
    icon: "Mountain",
  },
  {
    id: "visa-assistance",
    title:
      lang === "am"
        ? "የኡምራና የቱሪስት ቪዛ አገልግሎት"
        : lang === "om"
        ? "Tajaajila Viizaa Umraa fi Daawwannaa"
        : "Umrah & Tourist Visa Services",
    description:
      lang === "am"
        ? "የሳውዲ አረቢያ የኡምራ ቪዛዎች፣ የቱሪስት ቪዛዎች እና የጉዞ ሰነዶች ክትትል ፈጣንና አስተማማኝ በሆነ መንገድ።"
        : lang === "om"
        ? "Viizaa Umraa Saawudii, viizaa daawwannaa fi qophii waraqaa imalaa haala saffisaa fi amansiisaa ta'een hordofnee isiniif xumurra."
        : "Expedited visa processing for Saudi Arabia Umrah, Middle East travel, and international tourist visas with 100% dedicated support.",
    icon: "FileCheck",
  },
  {
    id: "vip-transport",
    title:
      lang === "am"
        ? "የአየር ማረፊያ አቀባበልና ቪአይፒ ትራንስፖርት"
        : lang === "om"
        ? "Geejjiba Buufata Xiyyaaraa & VIP"
        : "Airport Transfer & VIP Logistics",
    description:
      lang === "am"
        ? "የግል ዘመናዊ አውቶቡሶች፣ 4x4 የጉብኝት መኪኖችና ከአየር ማረፊያ እስከ ማረፊያ ምቹና አስተማማኝ ትራንስፖርት።"
        : lang === "om"
        ? "Tajaajila konkolaataa ammayyaa buufata xiyyaaraatii simachuu, konkolaattota 4x4 daawwannaaf ta'an fi geejjiba mijataa imaltoota keenyaaf."
        : "Private luxury airport pickups, modern 4x4 tour vehicles, and comfortable transportation throughout your pilgrimage and vacations.",
    icon: "Car",
  },
];

