import type { Locale } from "@/lib/i18n";
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const getFaqItems = (lang: Locale): FAQItem[] => [
  {
    id: "faq-1",
    question:
      lang === "am"
        ? "የኡምራ ፓኬጅ ወይም የቱር ጉዞ በሂካያ እንዴት ማስያዝ እችላለሁ?"
        : lang === "om"
        ? "Akkamittin paakeejii Umraa ykn daawwannaa HIKAYA Tour wajjin qabsiisuu danda'a?"
        : "How do I book an Umrah package or tour with HIKAYA Tour and Travel Agency?",
    answer:
      lang === "am"
        ? "በድረ-ገጻችን 'ቦታ ያስይዙ' የሚለውን በመጫን ወይም የ24/7 ዋትስአፕ ቢሯችንን (+251 91 014 7495)፣ በስልክ ወይም በኢሜይል በማነጋገር በቀላሉ ማስያዝ ይችላሉ። ቡድናችን የፓኬጅ ዝርዝር፣ ቪዛ፣ በረራና ሆቴሎችን ያመቻችሎታል።"
        : lang === "om"
        ? "Marsariitii keenya irraan mallattoo 'Amma Qabsiisi' jedhu fayyadamuun, ykn Waatsaappii keenya (+251 91 014 7495), bilbila, fi iimeeliidhaan nu qunnamuun qabsiisuu dandeessu. Ogeeyyiin keenya odeeffannoo paakeejii, viizaa, xiyyaaraa fi hoteelaa hunda isiniif qopheessu."
        : "You can book directly through our website by clicking 'Book Now', or contact our team via our 24/7 WhatsApp desk (+251 91 014 7495), phone, or email. We will guide you through package details, visa processing, flight schedules, and personalized hotel accommodations.",
  },
  {
    id: "faq-2",
    question:
      lang === "am"
        ? "በሂካያ የኡምራ ፓኬጅ ውስጥ ምን ምን ነገሮች ተካተዋል?"
        : lang === "om"
        ? "Paakeejii Umraa HIKAYA keessatti maaltu dhiyaata?"
        : "What is included in HIKAYA's Umrah package?",
    answer:
      lang === "am"
        ? "የኡምራ ፓኬጃችን ሁሉንም ያካተተ ነው፡ የኡምራ ቪዛ፣ በመካና በመዲና ከሀረም አቅራቢያ ያሉ ባለ 5 ኮከብ ወይም ፕሪሚየም ሆቴሎች፣ የግል አየር ማቀዝቀዣ ያላቸው ዘመናዊ አውቶቡሶች እንዲሁም በታወቁ ኡለሞች የሚመሩ የተሟሉ ታሪካዊ ዚያራዎች።"
        : lang === "om"
        ? "Paakeejiin Umraa keenya kan guutuu ta'ee dha: Viizaa Umraa, hoteelota sadarkaa olaanaa Haramatti dhihoo Makkaa fi Madiinaatti, geejjiba qabbaneessaa qabu, fi daawwannaa/ziyaaraa iddoowwan seena-qabeeyyii hunda qajeelchitoota amantiin geggeeffamu of keessaa qaba."
        : "Our Umrah package is all-inclusive: Umrah visa processing, 5-star or premium 4-star hotel stays close to the Haram in both Makkah and Medina, airport transfers in private air-conditioned vehicles, and comprehensive historical Ziyarah tours led by experienced Islamic scholars.",
  },
  {
    id: "faq-3",
    question:
      lang === "am"
        ? "ዓለም አቀፍና የሀገር ውስጥ የአየር ትኬቶችን ትቆርጣላችሁ?"
        : lang === "om"
        ? "Tikeettii balali'iinsa xiyyaaraa Idil-addunyaa fi Biyya keessaa ni qabsiistuu?"
        : "Do you book both International and Domestic flight tickets?",
    answer:
      lang === "am"
        ? "አዎ! ወደ ሳውዲ አረቢያ፣ ዱባይ፣ አውሮፓ፣ አሜሪካ እና መላው ዓለም የሚደረጉ ዓለም አቀፍ በረራዎችን እንዲሁም ዋና ዋና የኢትዮጵያ ከተሞችን የሚያገናኙ የሀገር ውስጥ የአየር ትኬቶችን በተመጣጣኝ ዋጋ እናስይዛለን።"
        : lang === "om"
        ? "Eeyyee! Tikeettii balali'iinsa xiyyaaraa idil-addunyaa (Saawudii, Dubaay, Awurooppaa, kkf) akkasumas tikeettii xiyyaaraa biyya keessaa (Finfinnee, Baalee, Dirree Dhawaa, Samaraa, Bahaar Daar) gatii madaalawaan isiniif qabsiisna."
        : "Yes! We issue international flight tickets to all global destinations (Saudi Arabia, UAE, Europe, USA, etc.) as well as domestic flight tickets connecting all major Ethiopian destinations (Addis Ababa, Bale/Robe, Dire Dawa, Semera, Gondar, Bahir Dar) at discounted fares.",
  },
  {
    id: "faq-4",
    question:
      lang === "am"
        ? "ሂካያ የሀገር ውስጥና ዓለም አቀፍ የሆቴል ቦታ ማስያዝ ይችላል?"
        : lang === "om"
        ? "Hoteelota biyya keessaa fi idil-addunyaa qabsiisuun ni danda'amaa?"
        : "Can HIKAYA arrange domestic and international hotel bookings?",
    answer:
      lang === "am"
        ? "በእርግጥ። በመካ፣ መዲና፣ ዱባይ፣ ኢስታንቡል እና በዓለም ዙሪያ ካሉ ታዋቂ ሆቴሎች ጋር እንዲሁም በኢትዮጵያ ካሉ ምርጥ ሎጆችና ሪዞርቶች (የባሌ ተራሮች ሎጅ፣ ወንጪ ሪዞርቶች እና የሰሜን ተራራ ሎጆች) ጋር እንሰራለን።"
        : lang === "om"
        ? "Eeyyee, Makkaa, Madiinaa, Dubaay, Istanbuul fi addunyaa guutuutti hoteelota urjii 5 qabsiisuu dabalatee, Itoophiyaa keessatti loojjota Gaarren Baalee, Wonchii, fi Saameen haala mijataadhaan isiniif qabsiisna."
        : "Absolutely. We partner with top-rated international hotel chains in Mecca, Medina, Dubai, Istanbul, and globally, as well as luxury lodges and eco-resorts across Ethiopia (Bale Mountain Lodge, Wonchi resorts, and Semien mountain lodges).",
  },
  {
    id: "faq-5",
    question:
      lang === "am"
        ? "በኢትዮጵያ ውስጥ ወደ የትኞቹ የቱሪዝም መዳረሻዎች ትወስዳላችሁ?"
        : lang === "om"
        ? "Bakkeewwan daawwannaa Itoophiyaa kamfaan hojjettu?"
        : "Which Ethiopia tour destinations do you operate?",
    answer:
      lang === "am"
        ? "ወደ ሶፍ ኡመር ዋሻ፣ ወንጪ ሐይቅ፣ ባሌ ተራሮች ብሔራዊ ፓርክ፣ ሰሜን ተራራ (ሰሜን ተራራ)፣ አፋር ስምጥ (ዳሎል እና ኤርታ አሌ) እና ወደ ሌሎች ታሪካዊና የተፈጥሮ ስፍራዎች የተመሩ ጉዞዎችን እናዘጋጃለን።"
        : lang === "om"
        ? "Holqa Soof Umar, Haroo Wonchii, Gaarren Baalee, Gaarren Saameen (Samen Terara), Gammoojjii Affaar (Dallol & Erta Ale), fi bakkeewwan uumamaa fi seenaa Itoophiyaa hundaaf imala qajeelfamaa qabna."
        : "We provide guided private and group tours to Sof Omar Caves, Wonchi Crater Lake, Bale Mountains National Park, Semien Mountains (Samen Terara), Afar Depression (Dallol & Erta Ale), and other historic and cultural destinations across Ethiopia.",
  },
  {
    id: "faq-6",
    question:
      lang === "am"
        ? "ምን አይነት የክፍያ አማራጮችን ትቀበላላችሁ?"
        : lang === "om"
        ? "Mala kaffaltii akkamii fudhattu?"
        : "What payment methods are accepted?",
    answer:
      lang === "am"
        ? "የሀገር ውስጥ የባንክ ሂሳቦችን (ንግድ ባንክ፣ አዋሽ ባንክ፣ የኦሮሚያ ባንክ፣ ወዘተ)፣ ቴሌብርን፣ ዓለም አቀፍ የካርድ ክፍያዎችን እና በአዲስ አበባ ቢሯችን ቀጥታ ክፍያን እንቀበላለን።"
        : lang === "om"
        ? "Kaffaltii baankii biyya keessaa (CBE, Awaash, Baankii Oromiyaa, kkf), Telebirr, kaardii idil-addunyaa, fi qaamaan waajjira keenya Finfinneetti kaffaluu dandeessu."
        : "We accept domestic Ethiopian bank transfers (CBE, Awash, Bank of Oromia, etc.), Telebirr, international card payments, and direct booking at our office in Addis Ababa.",
  },
];
