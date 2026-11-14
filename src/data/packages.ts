import type { Locale } from "@/lib/i18n";

export type PackageCategory = "umrah" | "tours" | "travel";

export interface Package {
  id: string;
  category: PackageCategory;
  title: string;
  destination: string;
  duration: string;
  price?: number;
  priceETB?: string;
  originalPrice?: number;
  occupancy?: string;
  routeBadge?: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  highlights: string[];
  featured?: boolean;
}

export const getPackages = (lang: Locale): Package[] => [
  {
    id: "umrah-muzayyan",
    category: "umrah",
    title:
      lang === "am"
        ? "ልዩ የኡምራ ጉዞ (ከኡስታዝ ሙዘየን ሙሐመድ ጋር)"
        : lang === "om"
        ? "Paakeejii Umraa Addaa (Ustaaz Muzayyan Muhaammad Wajjiin)"
        : "Special Umrah Pilgrimage (With Ustaz Muzayyan Muhammad)",
    destination:
      lang === "am"
        ? "መካ (7 ቀናት) · መዲና (3 ቀናት)"
        : lang === "om"
        ? "Makkaa (Guyyaa 7) · Madiinaa (Guyyaa 3)"
        : "Makkah (7 Days) · Madinah (3 Days)",
    duration:
      lang === "am"
        ? "10 ቀናት"
        : lang === "om"
        ? "Guyyaa 10"
        : "10 Days",
    occupancy:
      lang === "am"
        ? "ከኡስታዝ ሙዘየን ሙሐመድ ጋር"
        : lang === "om"
        ? "Ustaaz Muzayyan Muhaammad Wajjiin"
        : "With Ustaz Muzayyan Muhammad",
    routeBadge: "Addis ➔ Madinah ➔ Makkah ➔ Addis",
    badge:
      lang === "am"
        ? "ምዝገባ ላይ ነን!"
        : lang === "om"
        ? "Galmee irra jirra!"
        : "Registration Open!",
    rating: 5.0,
    reviews: 980,
    description:
      lang === "am"
        ? "ከኡስታዝ ሙዘየን ሙሐመድ ጋር የሚደረግ ልዩና መንፈሳዊ የኡምራ ጉዞ (ከኅዳር 30 እስከ ታኅሣሥ 9)። በመካ 7 ቀናት እና በመዲና 3 ቀናት። ቪዛ፣ የደርሶ መልስ አየር ትኬት፣ ሆቴል፣ ምቹ ትራንስፖርት (ፈጣን ባቡር እና አውቶቡስ)፣ የታሪክ ቦታዎች ዚያራ እና ኢንሹራንስ ያካተተ የተሟላ አገልግሎት። ስልክ፡ 0912124876።"
        : lang === "om"
        ? "Imala Umraa hafuuraa fi kabajamaa Ustaaz Muzayyan Muhaammad wajjin Sadaasa 30 hanga Muddee 9tti gaggeeffamu. Makkaa guyyaa 7 fi Madiinaa guyyaa 3. Tikeetii xiyyaaraa, Viizaa, Hoteela, Tiraanspoortii (baabura ammayyaa fi awutoobisii qabbaneessaa), Ziyaaraa iddoowwan seenaa qulqulluu, fi Inshuraansii kan of keessatti qabate. Bilbila: 0912124876."
        : "Special spiritual Umrah pilgrimage accompanied and guided by Ustaz Muzayyan Muhammad from November 30 to December 9. Spend 7 days in Makkah and 3 days in Madinah. Includes round-trip flight tickets, official Umrah visa, hotel accommodation, ground transportation (high-speed Haramain train & luxury AC buses), full historical Ziyarah, and travel insurance. Contact: 0912124876.",
    image: "/images/packages/umrah-muzayyan.jpg",
    highlights:
      lang === "am"
        ? [
            "ከኡስታዝ ሙዘየን ሙሐመድ ጋር የሚመራ",
            "ይፋዊ ቪዛ እና የተሟላ ኢንሹራንስ",
            "የደርሶ መልስ አየር ትኬት እና ሆቴል",
            "ትራንስፖርት (ፈጣን ባቡር እና አውቶቡስ)",
            "ሙሉ ታሪካዊ ዚያራ (መካ እና መዲና)",
            "መካ 7 ቀናት እና መዲና 3 ቀናት",
          ]
        : lang === "om"
        ? [
            "Ustaaz Muzayyan Muhaammad Wajjiin",
            "Viizaa fi Inshuraansii Guutuu",
            "Tikeetii Xiyyaaraa & Hoteela",
            "Tiraanspoortii (Baabura & Awutoobisii)",
            "Ziyaaraa Iddoowwan Seenaa Qulqulluu",
            "Makkaa Guyyaa 7 & Madiinaa Guyyaa 3",
          ]
        : [
            "Guided by Ustaz Muzayyan Muhammad",
            "Official Umrah Visa & Travel Insurance",
            "Round-trip Flight Tickets & Hotel Accommodation",
            "Ground Transport (Haramain Train & Luxury Bus)",
            "Historical Holy Sites Ziyarah (Makkah & Madinah)",
            "Makkah 7 Days & Madinah 3 Days",
          ],
    featured: true,
  },
  {
    id: "international-flight-hotel-package",
    category: "travel",
    title:
      lang === "am"
        ? "ዓለም አቀፍና ሀገር ውስጥ የአየር ትኬትና ሆቴል ማስያዝ"
        : lang === "om"
        ? "Tikeettii Xiyyaaraa & Hoteela Idil-Addunyaa fi Biyya Keessaa"
        : "International & Domestic Tickets & Hotel Booking",
    destination:
      lang === "am"
        ? "ዓለም አቀፍና የሀገር ውስጥ መዳረሻዎች"
        : lang === "om"
        ? "Addunyaa Guutuu fi Biyya Keessaa"
        : "Worldwide & Domestic Routes",
    duration:
      lang === "am"
        ? "እንደ ምርጫዎ / ፈጣን"
        : lang === "om"
        ? "Yeroo Fedhii Keessanii"
        : "Flexible / Instant",
    occupancy:
      lang === "am"
        ? "የግልና የቤተሰብ"
        : lang === "om"
        ? "Dhuunfaa fi Maatii"
        : "Individual & Family",
    routeBadge: "Any Destination Worldwide",
    badge:
      lang === "am"
        ? "ፈጣን ማስያዣ"
        : lang === "om"
        ? "Salphaatti Qabsiisaa"
        : "Instant Booking",
    rating: 4.9,
    reviews: 520,
    description:
      lang === "am"
        ? "የሂካያን ቀጥተኛ የአየር መንገድ ትስስር እና ዓለም አቀፍ የሆቴል ስምምነቶች ይጠቀሙ። የሀገር ውስጥ በረራዎችን፣ ዓለም አቀፍ ትኬቶችንና ምርጥ ሆቴሎችን በ24/7 ፈጣን ድጋፍ ያስይዙ።"
        : lang === "om"
        ? "Tikeettii balali'iinsa xiyyaaraa biyya keessaa fi idil-addunyaa, akkasumas hoteelota sadarkaa addunyaa HIKAYA waliin qabsiisaa. Jijjiirraa guyyaa sa'aatii 24 fi deeggarsa guutuu."
        : "Take advantage of HIKAYA's direct airline reservations and global hotel contracts. Book domestic Ethiopian flights, international tickets across all continents, and luxury hotel rooms with 24/7 date-change support.",
    image: "/images/packages/international-domestic-tickets.png",
    highlights:
      lang === "am"
        ? [
            "ምርጥ የአየር ትኬት ዋጋ ዋስትና",
            "ዓለም አቀፍና ሀገር ውስጥ የሆቴል ማስያዣ",
            "ፈጣን የቀን ለውጥ እና ድጋፍ",
            "ይፋዊ የአየር መንገድ ትኬት ማረጋገጫ",
          ]
        : lang === "om"
        ? [
            "Gatii Tikeettii Isa Gaarii",
            "Hoteelota Sadarkaa Olaanaa",
            "Jijjiirraa Guyyaa Salphaa",
            "Ragaa Tikeettii Seera Qabeessa",
          ]
        : [
            "Best Airfare Rates Guarantee",
            "Worldwide & Domestic Hotel Bookings",
            "Instant Date Changes & Support",
            "Official Airline Ticket Confirmation",
          ],
    featured: true,
  },
  {
    id: "sof-omar-bale",
    category: "tours",
    title:
      lang === "am"
        ? "የሶፍ ኡመር ዋሻ እና የባሌ ተራሮች ጉዞ"
        : lang === "om"
        ? "Daawwannaa Holqa Soof Umar fi Gaarren Baalee"
        : "Sof Omar Caves & Bale Mountains Expedition",
    destination:
      lang === "am"
        ? "ባሌ፣ ኦሮሚያ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Baalee, Oromiyaa, Itoophiyaa"
        : "Bale, Oromia, Ethiopia",
    duration:
      lang === "am"
        ? "4 ቀናት / 3 ምሽቶች"
        : lang === "om"
        ? "Guyyaa 4 / Halkan 3"
        : "4 Days / 3 Nights",
    occupancy:
      lang === "am"
        ? "የተመራ አነስተኛ ቡድን"
        : lang === "om"
        ? "Garee Qajeelfama Qabu"
        : "Guided Small Group",
    routeBadge: "Addis ➔ Bale ➔ Sof Omar ➔ Addis",
    badge:
      lang === "am"
        ? "የተፈጥሮ ድንቅ"
        : lang === "om"
        ? "Dinqii Uumamaa"
        : "Natural Wonder",
    rating: 4.9,
    reviews: 312,
    description:
      lang === "am"
        ? "በወይብ ወንዝ የተቦረቦረውን የአፍሪካን እጅግ አስደናቂ የመሬት ውስጥ ዋሻ በሶፍ ኡመር ይጎብኙ፤ ከባሌ ተራሮች ብሔራዊ ፓርክ የአልፓይን ውበት እና ከአገር በቀል የዱር እንስሳት (የቀይ ቀበሮና የድሬ ኒያላ) ጋር።"
        : lang === "om"
        ? "Holqa Soof Umar isa dinqisiisaa Laga Wayibiin tolfame daawwadhaa. Akkasumas qilleensa qabbanaawaa Gaarren Baalee, Sanettii, fi Jeedala Booramee argaa."
        : "Explore Africa's most breathtaking underground cave system at Sof Omar carved by the Weyib River, combined with the alpine beauty of Bale Mountains National Park and endemic wildlife (Ethiopian Wolf, Mountain Nyala).",
    image: "/images/destinations/sof-omar.jpg",
    highlights:
      lang === "am"
        ? ["የኖራ ድንጋይ ዋሻዎች", "የወይብ ወንዝ የእግር ጉዞ", "የሳኔቲ አልፓይን ሜዳ", "የባሌ ኢኮ ሎጅ ማረፊያ"]
        : lang === "om"
        ? ["Holqa Dhagaa Cimmeessaa Dinqii", "Daandii Laga Wayib", "Platowii Sanettii", "Loojii Uumamaa Baalee"]
        : ["Cathedral Limestone Caves", "Weyib River Walk", "Sanetti Alpine Plateau", "Bale Eco Lodge Accommodation"],
    featured: true,
  },
  {
    id: "wonchi-crater-lake",
    category: "tours",
    title:
      lang === "am"
        ? "የወንጪ እሳተ ገሞራ ሐይቅ ጉብኝት"
        : lang === "om"
        ? "Daawwannaa Haroo Wonchii Hawwataa"
        : "Wonchi Crater Lake Paradise Getaway",
    destination:
      lang === "am"
        ? "ወንጪ፣ ኦሮሚያ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Wonchii, Oromiyaa, Itoophiyaa"
        : "Wonchii, Oromia, Ethiopia",
    duration:
      lang === "am"
        ? "2 ቀናት / 1 ምሽት"
        : lang === "om"
        ? "Guyyaa 2 / Halkan 1"
        : "2 Days / 1 Night",
    occupancy:
      lang === "am"
        ? "የሳምንት መጨረሻ / የቀን ጉዞዎች"
        : lang === "om"
        ? "Ayyaana / Torbee"
        : "Weekend / Daily Departures",
    routeBadge: "Addis ➔ Ambo ➔ Wonchi ➔ Addis",
    badge:
      lang === "am"
        ? "የተፈጥሮ ገነት"
        : lang === "om"
        ? "Jannata Uumamaa"
        : "Eco Paradise",
    rating: 4.9,
    reviews: 428,
    description:
      lang === "am"
        ? "በወንጪ ሐይቅ አረንጓዴ የተፈጥሮ ውበት ውስጥ እራስዎን ያድሱ። በጀልባ ወደ ደሴቱ መጓዝ፣ በፈረስ መጋለብ እና ፍልውሃዎችን በመጠቀም አስደሳች የእረፍት ጊዜ ያሳልፉ።"
        : lang === "om"
        ? "Haroo Wonchii isa bareedina uumamaan badhaadhe daawwadhaa. Doonidhaan haroo irra deemuu, farda yaabbachuu, fi burqituu ho'aa dhandhamuudhaan boqonnaa gaarii dabarsaa."
        : "Immerse yourself in the emerald waters and lush amphitheater of Wonchi Crater Lake. Enjoy scenic boat rides to the island church, horseback trekking down the caldera, and soothing mineral hot springs.",
    image: "/images/destinations/wonchi.jpg",
    highlights:
      lang === "am"
        ? ["የጀልባ ጉዞ ወደ ደሴቱ", "የፈረስ ግልቢያ በሸለቆው", "የተፈጥሮ ፍልውሃዎች", "አስደናቂ የተራራ እይታዎች"]
        : lang === "om"
        ? ["Imala Doonii Gara Odolaatti", "Farda Yaabbatanii Bu'uu", "Burqituu Ho'aa Uumamaa", "Mul'ata Gaarren Biyya Keessaa"]
        : ["Scenic Boat Ride to Island", "Caldera Horseback Riding", "Natural Hot Springs", "Stunning Mountain Views"],
    featured: true,
  },
];
