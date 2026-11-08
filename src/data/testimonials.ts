import type { Locale } from "@/lib/i18n";
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

export const getTestimonials = (lang: Locale): Testimonial[] => [
  { 
    id: "t1", 
    name: "Sh. Habib Hussen", 
    role:
      lang === "am"
        ? "የኡምራ ተጓዥ (ምዕመን)"
        : lang === "om"
        ? "Imalaa Umraa"
        : "Umrah Pilgrim",  
    rating: 5, 
    quote:
      lang === "am"
        ? "ሂካያ ቱር ወደ መካ እና መዲና ያደረግኩትን መንፈሳዊ ጉዞ እጅግ የተባረከና የማይረሳ አድርጎታል። ከሀረም ጥቂት እርምጃዎች የሚገኘው ባለ 5 ኮከብ ሆቴል እና የተመቻቸው ዚያራ ሙሉ ትኩረቴን በኢባዳ ላይ እንዳደርግ አስችሎኛል።"
        : lang === "om"
        ? "HIKAYA Tour imala hafuuraa koo gara Makkaa fi Madiinaatti baay'ee salphaa fi eebbifamaa taasise. Hoteelli Haramatti dhihoo ta'uu fi qajeelfamni ziyaaraa isaanii baay'ee na gammachiise."
        : "HIKAYA Tour made my spiritual journey to Mecca and Medina unforgettable. Their attention to detail, 5-star hotel steps from the Haram, and guided Ziyarah allowed me to focus purely on devotion.",
  },
  { 
    id: "t2", 
    name: "Tolasaa & Ifrah", 
    role:
      lang === "am"
        ? "የተፈጥሮ ጉብኝት ተጓዦች"
        : lang === "om"
        ? "Imaltoota Daawwannaa"
        : "Eco-Tour Traveler",  
    rating: 5, 
    quote:
      lang === "am"
        ? "ከሂካያ ጋር ወደ ሶፍ ኡመር ዋሻ እና ወንጪ ሐይቅ ያደረግነው ጉዞ እጅግ አስደናቂ ነበር! የተፈጥሮ ውበቱ፣ ዋሻዎቹ እና ምቹ የ4x4 ትራንስፖርት ዝግጅቱ በጣም አስደስቶናል። ከልብ እናመሰግናለን!"
        : lang === "om"
        ? "Daawwannaan Holqa Soof Umar fi Haroo Wonchii HIKAYA wajjin taasifne baay'ee nama ajaa'iba! Uumama dinqisiisaa fi geejjiba mijataa nuuf qopheessaniiru. Baay'ee galatoomaa!"
        : "Our tour to Sof Omar Caves and Wonchi Crater Lake with HIKAYA was mind-blowing! The limestone cathedral caverns and the lake views were stunning, and our 4x4 transport was so comfortable.",
  },
  { 
    id: "t3", 
    name: "Dr. Fuad Kedir", 
    role:
      lang === "am"
        ? "ተደጋጋሚ መንገደኛ"
        : lang === "om"
        ? "Imalaa Daldalaa"
        : "Frequent Traveler",  
    rating: 5, 
    quote:
      lang === "am"
        ? "ለሀገር ውስጥና ለዓለም አቀፍ የአየር ትኬት ሂካያ ወደር የለውም። ፈጣን ምላሽ፣ ምርጥ ዋጋ እና ምቹ ሆቴሎችን በአስተማማኝ ሁኔታ አዘጋጅተውልኛል። ሁልጊዜ የመጀመሪያ ምርጫዬ ናቸው።"
        : lang === "om"
        ? "Tikeettii xiyyaaraa biyya keessaa fi idil-addunyaa qabsiisuuf HIKAYA qofti ga'aadha. Gatii gaarii, ariitii, fi hoteela mijataa nuuf qabsiisaniiru. Yeroo hunda isaanin filadha."
        : "For domestic and international flight ticketing, HIKAYA is unmatched. They handled our multi-city flights and hotel reservations smoothly with best fares and 24/7 responsiveness.",
  },
];

