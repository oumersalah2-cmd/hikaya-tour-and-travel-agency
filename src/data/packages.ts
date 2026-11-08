import type { Locale } from "@/lib/i18n";

export type PackageCategory = "umrah" | "tours" | "travel";

export interface Package {
  id: string;
  category: PackageCategory;
  title: string;
  destination: string;
  duration: string;
  price: number;
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
    id: "umrah-standard",
    category: "umrah",
    title:
      lang === "am"
        ? "መደበኛ የኡምራ ፓኬጅ"
        : lang === "om"
        ? "Paakeejii Umraa Istaandaardii"
        : "Standard Umrah Package",
    destination:
      lang === "am"
        ? "መካ (7 ምሽቶች) · መዲና (3 ምሽቶች)"
        : lang === "om"
        ? "Makkaa (Halkan 7) · Madiinaa (Halkan 3)"
        : "Makkah (7N) · Madinah (3N)",
    duration:
      lang === "am"
        ? "11 ቀናት / 10 ምሽቶች"
        : lang === "om"
        ? "Guyyaa 11 / Halkan 10"
        : "11 Days / 10 Nights",
    price: 1450,
    priceETB: "150,000 ETB",
    originalPrice: 1650,
    occupancy:
      lang === "am"
        ? "4 በአንድ ክፍል (በጋራ)"
        : lang === "om"
        ? "Nama 4 / Kutaa 1"
        : "4 / Room Sharing",
    routeBadge: "Addis ➔ Madinah ➔ Makkah ➔ Addis",
    badge:
      lang === "am"
        ? "ተወዳጅ ዙር"
        : lang === "om"
        ? "Filatamaa Baay'ee"
        : "Most Popular Round",
    rating: 5.0,
    reviews: 780,
    description:
      lang === "am"
        ? "ሙሉ ፓኬጅ በ150,000 ብር — 3 ምሽቶች መዲና ከመስጂደ ነበዊ አጠገብ፣ 7 ምሽቶች መካ ከሀረም አቅራቢያ (11 ቀናት ከአዲስ አበባ ጀምሮ እስከ መመለሻ)። 4 ምዕመናን በአንድ ክፍል ከሙሉ ታሪካዊ ዚያራ፣ ቪዛ እና የኡለሞች መመሪያ ጋር።"
        : lang === "om"
        ? "Kaffaltii guutuu 150,000 ETB — Halkan 3 Madiinaa Masjiida Nabawiitti dhihoo, Halkan 7 Makkaa Haramatti dhihoo (Guyyaa 11 Finfinnee irraa deebi'u). Kutaa 1 keessa namoota 4, ziyaaraa guutuu, viizaa fi qajeelchaa amantii waliin."
        : "Full package for 150,000 ETB — 3 nights Madinah near Masjid an-Nabawi, 7 nights Makkah near the Haram (11 days from Addis Ababa and back). 4 pilgrims per room sharing with full historical Ziyarah, visa, and dedicated scholar guidance.",
    image: "/images/destinations/umrah-makkah.jpg",
    highlights:
      lang === "am"
        ? ["3 ምሽቶች መዲና + 7 ምሽቶች መካ", "4 ሰው በአንድ ክፍል", "ሙሉ ታሪካዊ ዚያራ (ቁባ እና ኡሁድ)", "ይፋዊ የኡምራ ቪዛ እና የተሟላ ትራንስፖርት"]
        : lang === "om"
        ? ["Halkan 3 Madiinaa + Halkan 7 Makkaa", "Nama 4 Kutaa Tokkotti", "Ziyaaraa Guutuu (Qubaa fi Uhud)", "Viizaa Umraa fi Geejjiba Guutuu"]
        : ["3N Madinah + 7N Makkah", "4 / Room Sharing", "Full Historical Ziyarat (Quba & Uhud)", "Official Umrah Visa & Ground Support"],
    featured: true,
  },
  {
    id: "umrah-vip",
    category: "umrah",
    title:
      lang === "am"
        ? "ቪአይፒ ሉክሰሪ የኡምራ ፓኬጅ"
        : lang === "om"
        ? "Paakeejii Umraa VIP Qulqullina Olaanaa"
        : "VIP Luxury Umrah Package",
    destination:
      lang === "am"
        ? "መካ (7 ምሽቶች) · መዲና (3 ምሽቶች)"
        : lang === "om"
        ? "Makkaa (Halkan 7) · Madiinaa (Halkan 3)"
        : "Makkah (7N) · Madinah (3N)",
    duration:
      lang === "am"
        ? "11 ቀናት / 10 ምሽቶች"
        : lang === "om"
        ? "Guyyaa 11 / Halkan 10"
        : "11 Days / 10 Nights",
    price: 1850,
    priceETB: "177,500 ETB",
    originalPrice: 2100,
    occupancy:
      lang === "am"
        ? "2 በአንድ ክፍል (ባልና ሚስት / የግል)"
        : lang === "om"
        ? "Nama 2 / Kutaa Dhuunfaa"
        : "2 / Room (Couples / Double)",
    routeBadge: "Addis ➔ Madinah ➔ Makkah ➔ Addis",
    badge: "VIP Luxury",
    rating: 5.0,
    reviews: 420,
    description:
      lang === "am"
        ? "የላቀ ምቾት በ177,500 ብር — ባለ 5 ኮከብ ሉክሰሪ ሆቴሎች ከሀረመይን ጥቂት እርምጃዎች፣ ለ2 ሰዎች በአንድ ክፍል (ለባልና ሚስት ወይም ለግል)። የቪአይፒ አየር ማረፊያ ፈጣን አገልግሎት፣ የግል ትራንስፖርት እና የኡለማ የግል አጋዥነት ያካትታል።"
        : lang === "om"
        ? "Muuxannoo addaa 177,500 ETB — Hoteelota urjii 5 Haramainitti dhihoo, kutaa tokko keessa namoota 2 (abbaa warraa fi haadha warraa ykn dhuunfaa). Geejjiba VIP qabbaneessaa, ziyaaraa dhuunfaa, fi qajeelchaa amantii dhuunfaa."
        : "Premium comfort for 177,500 ETB — 5-star luxury hotels steps from the Haramain, arranged for 2 people per room (couples or private double occupancy). Includes VIP airport fast-track, private transport, and personalized scholar accompaniment.",
    image: "/images/destinations/medina-ziyarah.jpg",
    highlights:
      lang === "am"
        ? ["ባለ 5 ኮከብ ሆቴሎች ከሀረም አጠገብ", "የግል ባለ 2 ሰው ክፍል", "የግል ቪአይፒ ሉክሰሪ ትራንስፖርት", "የግል የኡለማ እና የዚያራ መመሪያ"]
        : lang === "om"
        ? ["Hoteela Urjii 5 Haramatti Dhihoo", "Kutaa Dhuunfaa Nama 2", "Geejjiba VIP Qabbaneessaa", "Qajeelchaa Amantii Dhuunfaa"]
        : ["5-Star Hotels Steps from Haram", "2 / Room Private Double Occupancy", "Private VIP Luxury Transfers", "Personalized Scholar & Ziyarah Guidance"],
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
    price: 480,
    priceETB: "35,000 ETB",
    originalPrice: 590,
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
    price: 190,
    priceETB: "18,500 ETB",
    originalPrice: 240,
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
  {
    id: "semien-mountains-samen",
    category: "tours",
    title:
      lang === "am"
        ? "የሰሜን ተራራ (ሰሜን ተራራ) የእግር ጉዞ"
        : lang === "om"
        ? "Daawwannaa Gaarren Saameen (Samen Terara)"
        : "Semien Mountains (Samen Terara) Peak Trek",
    destination:
      lang === "am"
        ? "ሰሜን ተራራ፣ ኢትዮጵያ"
        : lang === "om"
        ? "Gaarren Saameen, Itoophiyaa"
        : "Semien Mountains, Ethiopia",
    duration:
      lang === "am"
        ? "5 ቀናት / 4 ምሽቶች"
        : lang === "om"
        ? "Guyyaa 5 / Halkan 4"
        : "5 Days / 4 Nights",
    price: 650,
    priceETB: "48,000 ETB",
    originalPrice: 780,
    occupancy:
      lang === "am"
        ? "የእግር ተጓዦች ቡድን"
        : lang === "om"
        ? "Garee Daandii Gaaraa"
        : "Trekking Group",
    routeBadge: "Gondar ➔ Debark ➔ Semien ➔ Addis",
    badge:
      lang === "am"
        ? "የዩኔስኮ ቅርስ"
        : lang === "om"
        ? "Dhaala UNESCO"
        : "UNESCO Heritage",
    rating: 4.9,
    reviews: 215,
    description:
      lang === "am"
        ? "በ'አፍሪካ ጣራ' ላይ የእግር ጉዞ — ጥልቅ ገደሎችን፣ ድንቅ ቋጥኞችንና የራስ ዳሽንን ተራራማ እይታዎች ይጎብኙ። የጭላዳ ዝንጀሮዎችንና የዋልያ አይቤክስን በተፈጥሮ መኖሪያቸው ይመልከቱ።"
        : lang === "om"
        ? "Fiixee Gaarren Saameen (Samen Terara) daawwadhaa. Qarqara qileewwan gadi fageenyi isaanii sodaachisaa ta'an, Jaldeessa Giiladaa, fi bineensota alagaa UNESCOn eegaman daawwadhaa."
        : "Trek across the 'Roof of Africa' with dramatic escarpments, deep chasms, and views near Ras Dashen. Encounter wild troops of Gelada baboons and Walia ibex in their natural UNESCO habitat.",
    image: "/images/destinations/semien-mountains.jpg",
    highlights:
      lang === "am"
        ? ["የዩኔስኮ የዓለም ቅርስ ገደሎች", "የጭላዳ ዝንጀሮዎችን መመልከት", "በተራራ ስር ድንኳን ማሳደር", "ባለሙያ የተራራ መሪዎች"]
        : lang === "om"
        ? ["Iddoo Dhaala Addunyaa UNESCO", "Jaldeessa Giiladaa Daawwachuu", "Buufata Gaarren Keessaa", "Qajeelchitoota Gaaraa Ogeeyyii"]
        : ["UNESCO World Heritage Escarpments", "Gelada Baboon Encounters", "Camp Under Alpine Skies", "Professional Mountain Guides"],
    featured: true,
  },
  {
    id: "gammoojji-affaar-danakil",
    category: "tours",
    title:
      lang === "am"
        ? "የአፋር ዳሎል እና ኤርታ አሌ እሳተ ገሞራ ጉዞ"
        : lang === "om"
        ? "Imala Gammoojjii Affaar fi Erta Ale"
        : "Afar Depression & Erta Ale Volcano Expedition",
    destination:
      lang === "am"
        ? "ዳናኪል፣ አፋር፣ ኢትዮጵያ"
        : lang === "om"
        ? "Dallol fi Erta Ale, Affaar"
        : "Danakil, Afar, Ethiopia",
    duration:
      lang === "am"
        ? "4 ቀናት / 3 ምሽቶች"
        : lang === "om"
        ? "Guyyaa 4 / Halkan 3"
        : "4 Days / 3 Nights",
    price: 690,
    priceETB: "52,000 ETB",
    originalPrice: 850,
    occupancy:
      lang === "am"
        ? "በ4x4 የበረሃ ጉዞ"
        : lang === "om"
        ? "Konkolaataa 4x4"
        : "4x4 Desert Expedition",
    routeBadge: "Semera ➔ Erta Ale ➔ Dallol ➔ Addis",
    badge:
      lang === "am"
        ? "ድንቅ ጀብዱ"
        : lang === "om"
        ? "Imala Addaa"
        : "Extreme Adventure",
    rating: 4.8,
    reviews: 180,
    description:
      lang === "am"
        ? "በምድር ላይ ወደሚገኘው ልዩና እፁብ ድንቅ የአፋር ስምጥ ይጓዙ። የሚፈነዳውን የኤርታ አሌ ፍላት እሳተ ገሞራ ሐይቅ፣ ባለቀለም የዳሎል የሰልፈር ምንጮችን እና የጨው በረሃዎችን ይመልከቱ።"
        : lang === "om"
        ? "Gammoojjii Affaar iddoo addunyaa irraa adda ta'e daawwadhaa. Volkaanoo Erta Ale isa abidda bilcheessu, burqaa ashaboo fi salfarii Dallol isa bifa adda addaan miidhage, fi lafa soogiddaa daawwadhaa."
        : "Journey into one of the most surreal landscapes on Earth in the Afar depression. Witness the boiling lava lake of active volcano Erta Ale, the kaleidoscopic neon sulfur springs of Dallol, and salt desert flats.",
    image: "/images/destinations/afar-danakil.jpg",
    highlights:
      lang === "am"
        ? ["የኤርታ አሌ ንቁ እሳተ ገሞራ ፍላት", "የዳሎል ባለቀለም ሰልፈር ምንጮች", "የካሩም ሐይቅ የጨው በረሃ", "የተሟላ የ4x4 የበረሃ ጉዞ"]
        : lang === "om"
        ? ["Galaana Abiddaa Erta Ale", "Burqaa Salfarii Dallol", "Lafa Soogiddaa Kaarum", "Konkolaattota 4x4 Ammayyaa"]
        : ["Erta Ale Active Volcano Lava Lake", "Dallol Psychedelic Sulfur Springs", "Lake Karum Salt Desert", "Escorted 4x4 Desert Expedition"],
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
    price: 180,
    priceETB: "18,000+ ETB",
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
        ? "የሂካያን ቀጥተኛ የአየር መንገድ ትስስር እና ዓለም አቀፍ የሆቴል ስምምነቶች ይጠቀሙ። የሀገር ውስጥ በረራዎችን፣ ዓለም አቀፍ ትኬቶችንና ምርጥ ሆቴሎችን በ24/7 የቀን ለውጥ ድጋፍ ያስይዙ።"
        : lang === "om"
        ? "Tikeettii balali'iinsa xiyyaaraa biyya keessaa fi idil-addunyaa, akkasumas hoteelota sadarkaa addunyaa gatii madaalawaa fi amansiisaa ta'een HIKAYA waliin qabsiisaa. Jijjiirraa guyyaa sa'aatii 24."
        : "Take advantage of HIKAYA's direct airline reservations and global hotel contracts. Book domestic Ethiopian flights, international tickets across all continents, and luxury hotel rooms with 24/7 date-change support.",
    image: "/images/destinations/medina-ziyarah.jpg",
    highlights:
      lang === "am"
        ? ["ምርጥ የአየር ትኬት ዋጋ ዋስትና", "ዓለም አቀፍና ሀገር ውስጥ የሆቴል ማስያዣ", "ፈጣን የቀን ለውጥ እና ድጋፍ", "ይፋዊ የአየር መንገድ ትኬት ማረጋገጫ"]
        : lang === "om"
        ? ["Gatii Tikeettii Isa Gaarii", "Hoteelota Sadarkaa Olaanaa", "Jijjiirraa Guyyaa Salphaa", "Ragaa Tikeettii Seera Qabeessa"]
        : ["Best Airfare Rates Guarantee", "Worldwide & Domestic Hotel Bookings", "Instant Date Changes & Support", "Official Airline Ticket Confirmation"],
    featured: true,
  },
];
