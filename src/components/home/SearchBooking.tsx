"use client";

import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Moon,
  Plane,
  Hotel,
  Mountain,
  Bed,
  PlaneTakeoff,
  Send,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useSite } from "@/context/SiteContext";

type Tab = "umrah" | "flights" | "hotels" | "tours";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-primary-700 transition focus:outline-none focus:ring-2 focus:ring-accent-400 dark:border-dark-100 dark:bg-dark-400 dark:text-white sm:text-sm";
const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

export default function SearchBooking() {
  const { lang } = useLanguage();
  const { packages, whatsappLink } = useSite();
  const { setSearch, setCategory } = useTrip();
  const uid = useId();

  const [activeTab, setActiveTab] = useState<Tab>("umrah");

  // State for Umrah tab
  const [umrahForm, setUmrahForm] = useState({
    packageId: "",
    departure: "",
    roomSharing: "4-room",
    travelers: "1",
  });

  // State for Flights tab
  const [flightForm, setFlightForm] = useState({
    from: "Addis Ababa (ADD)",
    to: "Jeddah (JED)",
    departure: "",
    returnDate: "",
    class: "Economy",
    passengers: "1",
  });

  // State for Hotels tab
  const [hotelForm, setHotelForm] = useState({
    location: "Makkah (Near Masjid al-Haram)",
    checkin: "",
    checkout: "",
    roomType: "Standard Room (2 Guests)",
  });

  // State for Ethiopia Tours tab
  const [tourForm, setTourForm] = useState({
    packageId: "",
    departure: "",
    groupType: "Guided Small Group",
    travelers: "2",
  });

  const pick = (en: string, om: string, am: string) =>
    lang === "am" ? am : lang === "om" ? om : en;

  // Generate the next 12 months for readable month dropdowns in en, am, and om
  const upcomingMonths = useMemo(() => {
    const months: { value: string; label: string }[] = [];
    const now = new Date();
    const locale = lang === "am" ? "am-ET" : lang === "om" ? "om-ET" : "en-US";
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    });

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const raw = formatter.format(d);
      const label = raw.charAt(0).toUpperCase() + raw.slice(1);
      months.push({ value, label });
    }
    return months;
  }, [lang]);

  const tabs = [
    {
      id: "umrah" as const,
      icon: Moon,
      label: pick("Umrah Packages", "Paakeejii Umraa", "የኡምራ ፓኬጆች"),
      badge: pick("Popular", "Filatamaa", "ተወዳጅ"),
    },
    {
      id: "flights" as const,
      icon: Plane,
      label: pick("Flight Tickets", "Tikeettii Xiyyaaraa", "የአየር ትኬቶች"),
      badge: pick("Fast Booking", "Qabsiisa Hatattamaa", "ፈጣን ማስያዣ"),
    },
    {
      id: "hotels" as const,
      icon: Hotel,
      label: pick("Hotel Booking", "Hoteela Qabsiisuu", "የሆቴል ቦታ ማስያዝ"),
      badge: pick("Haram & Global", "Haram & Addunyaa", "ሀረምና ዓለም አቀፍ"),
    },
    {
      id: "tours" as const,
      icon: Mountain,
      label: pick("Ethiopia Tours", "Daawwannaa Itoophiyaa", "የኢትዮጵያ ቱሮች"),
      badge: pick("Guided", "Qajeelfamaan", "የተመራ"),
    },
  ];

  const umrahPackages = packages.filter((p) => p.category === "umrah");
  const tourPackages = packages.filter((p) => p.category === "tours");

  // Handle Umrah search
  const handleUmrahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategory("umrah");
    setSearch({
      category: "umrah",
      packageId: umrahForm.packageId,
      departure: umrahForm.departure,
      returnDate: "",
      travelers: umrahForm.travelers,
    });
    const el = document.getElementById("packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#packages`);
    }
  };

  // Handle Flights inquiry
  const handleFlightsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello HIKAYA, I would like to inquire about flight tickets: From ${flightForm.from} to ${flightForm.to}, Month/Date: ${flightForm.departure || "flexible"}, Return: ${flightForm.returnDate || "flexible"}, Passengers: ${flightForm.passengers} (${flightForm.class}).`;
    window.open(whatsappLink(msg), "_blank");
  };

  // Handle Hotels inquiry
  const handleHotelsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello HIKAYA, I would like to inquire about hotel booking: Location: ${hotelForm.location}, Month/Date: ${hotelForm.checkin || "flexible"}, Room Type: ${hotelForm.roomType}.`;
    window.open(whatsappLink(msg), "_blank");
  };

  // Handle Ethiopia Tours search
  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategory("tours");
    setSearch({
      category: "tours",
      packageId: tourForm.packageId,
      departure: tourForm.departure,
      returnDate: "",
      travelers: tourForm.travelers,
    });
    const el = document.getElementById("packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#packages`);
    }
  };

  const field = (name: string) => `${uid}-${name}`;

  return (
    <section id="search" className="relative z-20 mb-14 mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl"
      >
        {/* Navigation Tabs: 2 lines on mobile so all 4 services are visible at once without horizontal scrolling */}
        <div
          role="tablist"
          aria-label={pick("Search travel services", "Tajaajila imalaa barbaadi", "የጉዞ አገልግሎቶችን ይፈልጉ")}
          className="mb-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-center text-xs font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-glow scale-[1.02]"
                    : "border border-gray-200/80 bg-white/95 text-primary-700 backdrop-blur-md hover:bg-white dark:border-dark-100 dark:bg-dark-400 dark:text-gray-300 dark:hover:bg-dark-300"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Service Forms based on Active Tab */}
        <div className="glass-card rounded-2xl p-5 shadow-soft-lg sm:p-6 md:p-8 dark:shadow-none">
          <AnimatePresence mode="wait">
            {/* 1. UMRAH PACKAGES TAB */}
            {activeTab === "umrah" && (
              <motion.form
                key="umrah"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleUmrahSubmit}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                {/* Package selection */}
                <div className="w-full">
                  <label htmlFor={field("u-pkg")} className={labelClass}>
                    {pick("Umrah Package", "Paakeejii Umraa", "የኡምራ ፓኬጅ")}
                  </label>
                  <div className="relative">
                    <Moon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("u-pkg")}
                      value={umrahForm.packageId}
                      onChange={(e) => setUmrahForm({ ...umrahForm, packageId: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("All Umrah Packages", "Paakeejii Umraa Hunda", "ሁሉም የኡምራ ፓኬጆች")}</option>
                      {umrahPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Room Type (Short, clear labels that fit without truncation) */}
                <div className="w-full">
                  <label htmlFor={field("u-room")} className={labelClass}>
                    {pick("Room Type", "Gosa Kutaa", "የክፍል ዓይነት")}
                  </label>
                  <div className="relative">
                    <Bed className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("u-room")}
                      value={umrahForm.roomSharing}
                      onChange={(e) => setUmrahForm({ ...umrahForm, roomSharing: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="4-room">{pick("Quad (4 per room)", "Quad (nama 4 kutaatti)", "ክዋድ (4 ሰው በክፍል)")}</option>
                      <option value="3-room">{pick("Triple (3 per room)", "Triple (nama 3 kutaatti)", "ትሪፕል (3 ሰው በክፍል)")}</option>
                      <option value="2-room">{pick("Double (2 per room)", "Double (nama 2 kutaatti)", "ደብል (2 ሰው በክፍል)")}</option>
                      <option value="vip-single">{pick("Single (1 per room)", "Single (nama 1 kutaatti)", "ሲንግል (1 ሰው በክፍል)")}</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date (Month dropdown showing next 12 months) */}
                <div className="w-full">
                  <label htmlFor={field("u-dep")} className={labelClass}>
                    {pick("Preferred Date", "Ji'a Imalaa", "ተመራጭ ወር")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("u-dep")}
                      value={umrahForm.departure}
                      onChange={(e) => setUmrahForm({ ...umrahForm, departure: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("Any month", "Ji'a kamiyyuu", "ማንኛውም ወር")}</option>
                      {upcomingMonths.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pilgrims Count (Clear display) */}
                <div className="w-full">
                  <label htmlFor={field("u-trav")} className={labelClass}>
                    {pick("Pilgrims Count", "Baayyina Imaltootaa", "የምዕመናን ብዛት")}
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("u-trav")}
                      value={umrahForm.travelers}
                      onChange={(e) => setUmrahForm({ ...umrahForm, travelers: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {pick(n === 1 ? "Pilgrim" : "Pilgrims", n === 1 ? "Nama" : "Namoota", n === 1 ? "ሰው" : "ሰዎች")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buttons (Stacked below inputs on mobile, min-h 44px) */}
                <div className="flex flex-col gap-2 w-full sm:col-span-2 lg:col-span-1 pt-1 sm:pt-0">
                  <button
                    type="submit"
                    className="btn-primary min-h-[44px] w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Search className="h-4 w-4 shrink-0" />
                    <span>{pick("Find Packages", "Paakeejii Barbaadi", "ፓኬጆችን ፈልግ")}</span>
                  </button>
                  <a
                    href={whatsappLink(
                      `Hello HIKAYA, I would like to book Umrah: ${umrahForm.travelers} pilgrim(s), Room: ${umrahForm.roomSharing}, Month: ${umrahForm.departure || "flexible"}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-500 hover:text-white dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                    <span>{pick("Book on WhatsApp", "Waatsaappiin Qabsiisaa", "በዋትስአፕ ያስይዙ")}</span>
                  </a>
                </div>
              </motion.form>
            )}

            {/* 2. FLIGHT TICKETS TAB */}
            {activeTab === "flights" && (
              <motion.form
                key="flights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleFlightsSubmit}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                <div className="w-full">
                  <label htmlFor={field("f-from")} className={labelClass}>
                    {pick("Departure From", "Bakka Ka'umsaa", "የመነሻ ከተማ")}
                  </label>
                  <div className="relative">
                    <PlaneTakeoff className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("f-from")}
                      value={flightForm.from}
                      onChange={(e) => setFlightForm({ ...flightForm, from: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Addis Ababa (ADD)">{pick("Addis Ababa (ADD)", "Finfinnee (ADD)", "አዲስ አበባ (ADD)")}</option>
                      <option value="Jeddah (JED)">Jeddah (JED)</option>
                      <option value="Medina (MED)">Medina (MED)</option>
                      <option value="Dubai (DXB)">Dubai (DXB)</option>
                      <option value="Other Airport">{pick("Other Airport", "Buufata Biraa", "ሌላ አውሮፕላን ማረፊያ")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("f-to")} className={labelClass}>
                    {pick("Flying To", "Bakka Imalaa", "የመዳረሻ ከተማ")}
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("f-to")}
                      value={flightForm.to}
                      onChange={(e) => setFlightForm({ ...flightForm, to: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Jeddah (JED) - Umrah">{pick("Jeddah (JED) - Saudi / Umrah", "Jeddah (JED) - Sa'uudii / Umraa", "ጅዳ (JED) - ሳዑዲ / ኡምራ")}</option>
                      <option value="Medina (MED) - Umrah">{pick("Medina (MED) - Saudi / Umrah", "Madiinaa (MED) - Sa'uudii", "መዲና (MED) - ሳዑዲ")}</option>
                      <option value="Dubai (DXB) - UAE">{pick("Dubai (DXB) - UAE", "Dubai (DXB)", "ዱባይ (DXB)")}</option>
                      <option value="Istanbul (IST) - Turkey">{pick("Istanbul (IST) - Turkey", "Istanbul (IST)", "ኢስታንቡል (IST)")}</option>
                      <option value="Riyadh (RUH) - Saudi">{pick("Riyadh (RUH) - Saudi Arabia", "Riyadh (RUH)", "ሪያድ (RUH)")}</option>
                      <option value="Domestic Ethiopia">{pick("Domestic Flight (Ethiopia)", "Balallii Biyya Keessaa", "የሀገር ውስጥ በረራ (ኢትዮጵያ)")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("f-dep")} className={labelClass}>
                    {pick("Departure Month", "Ji'a Ka'umsaa", "የመነሻ ወር")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("f-dep")}
                      value={flightForm.departure}
                      onChange={(e) => setFlightForm({ ...flightForm, departure: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("Any month", "Ji'a kamiyyuu", "ማንኛውም ወር")}</option>
                      {upcomingMonths.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("f-pass")} className={labelClass}>
                    {pick("Passengers & Class", "Baayyina & Sadarkaa", "ተሳፋሪዎችና መደብ")}
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("f-pass")}
                      value={`${flightForm.passengers}-${flightForm.class}`}
                      onChange={(e) => {
                        const [p, c] = e.target.value.split("-");
                        setFlightForm({ ...flightForm, passengers: p, class: c });
                      }}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="1-Economy">{pick("1 Passenger (Economy)", "Nama 1 (Ikonomii)", "1 ተሳፋሪ (ኢኮኖሚ)")}</option>
                      <option value="2-Economy">{pick("2 Passengers (Economy)", "Nama 2 (Ikonomii)", "2 ተሳፋሪዎች (ኢኮኖሚ)")}</option>
                      <option value="3-Economy">{pick("Family Group (3+ Economy)", "Maatii (Nama 3+)", "ቤተሰብ (3+ ተሳፋሪዎች)")}</option>
                      <option value="1-Business">{pick("1 Passenger (Business Class)", "Nama 1 (Business)", "1 ተሳፋሪ (ቢዝነስ ክላስ)")}</option>
                      <option value="2-Business">{pick("2 Passengers (Business Class)", "Nama 2 (Business)", "2 ተሳፋሪዎች (ቢዝነስ ክላስ)")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full sm:col-span-2 lg:col-span-1 pt-1 sm:pt-0">
                  <button
                    type="submit"
                    className="btn-primary min-h-[44px] w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="h-4 w-4 shrink-0" />
                    <span>{pick("Inquire Flights", "Xiyyaara Gaafadhaa", "የአየር ትኬት ይጠይቁ")}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 3. HOTEL BOOKING TAB */}
            {activeTab === "hotels" && (
              <motion.form
                key="hotels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleHotelsSubmit}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                <div className="w-full">
                  <label htmlFor={field("h-loc")} className={labelClass}>
                    {pick("Hotel Destination", "Bakka Hoteelaa", "የሆቴል መዳረሻ")}
                  </label>
                  <div className="relative">
                    <Hotel className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("h-loc")}
                      value={hotelForm.location}
                      onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Makkah (Near Masjid al-Haram)">{pick("Makkah (Near Masjid al-Haram)", "Makkaa (Haramatti Dhihoo)", "መካ (ከመስጂደል ሐረም አጠገብ)")}</option>
                      <option value="Madinah (Near Masjid an-Nabawi)">{pick("Madinah (Near Masjid an-Nabawi)", "Madiinaa (Nabawiitti Dhihoo)", "መዲና (ከመስጂደ ነበዊ አጠገብ)")}</option>
                      <option value="Addis Ababa (Bole Area)">{pick("Addis Ababa (Bole Area)", "Finfinnee (Boolee)", "አዲስ አበባ (ቦሌ አካባቢ)")}</option>
                      <option value="Dubai (Downtown / Deira)">{pick("Dubai (Downtown / Deira)", "Dubai (Giddu-galeessa)", "ዱባይ (ዳውንታውን / ዴይራ)")}</option>
                      <option value="Istanbul (Sultanahmet / Taksim)">{pick("Istanbul (Taksim)", "Istanbul", "ኢስታንቡል (ታክሲም)")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("h-in")} className={labelClass}>
                    {pick("Stay Month", "Ji'a Seensaa", "የቆይታ ወር")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("h-in")}
                      value={hotelForm.checkin}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkin: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("Any month", "Ji'a kamiyyuu", "ማንኛውም ወር")}</option>
                      {upcomingMonths.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full sm:col-span-2 lg:col-span-2">
                  <label htmlFor={field("h-room")} className={labelClass}>
                    {pick("Room & Guests", "Gosa Kutaa & Keessummoota", "የክፍል ዓይነትና እንግዶች")}
                  </label>
                  <div className="relative">
                    <Bed className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("h-room")}
                      value={hotelForm.roomType}
                      onChange={(e) => setHotelForm({ ...hotelForm, roomType: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Standard Room (2 Guests)">{pick("Standard Room (2 Guests)", "Kutaa Istaandaardii (Nama 2)", "መደበኛ ክፍል (2 እንግዶች)")}</option>
                      <option value="Single Room (1 Guest)">{pick("Single Room (1 Guest)", "Kutaa Qeenxee (Nama 1)", "ባለ 1 ሰው ክፍል (1 እንግዳ)")}</option>
                      <option value="Family Suite (4 Guests)">{pick("Family Suite (4 Guests)", "Kutaa Maatii (Nama 4)", "የቤተሰብ ስዊት (4 እንግዶች)")}</option>
                      <option value="Haram View Luxury Suite">{pick("Haram View Luxury Suite", "Kutaa Mul'ata Haramaa Qabu", "የሀረም እይታ ያለው ሉክሰሪ ስዊት")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full sm:col-span-2 lg:col-span-1 pt-1 sm:pt-0">
                  <button
                    type="submit"
                    className="btn-primary min-h-[44px] w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Hotel className="h-4 w-4 shrink-0" />
                    <span>{pick("Check Hotels", "Hoteela Gaafadhaa", "የሆቴል ቦታ ያረጋግጡ")}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 4. ETHIOPIA TOURS TAB */}
            {activeTab === "tours" && (
              <motion.form
                key="tours"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleTourSubmit}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                <div className="w-full">
                  <label htmlFor={field("t-dest")} className={labelClass}>
                    {pick("Tour Destination", "Bakka Daawwannaa", "የቱር መዳረሻ")}
                  </label>
                  <div className="relative">
                    <Mountain className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("t-dest")}
                      value={tourForm.packageId}
                      onChange={(e) => setTourForm({ ...tourForm, packageId: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("All Ethiopia Tours", "Daawwannaa Itoophiyaa Hunda", "ሁሉም የኢትዮጵያ ቱሮች")}</option>
                      {tourPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("t-grp")} className={labelClass}>
                    {pick("Experience Style", "Gosa Daawwannaa", "የጉዞ ልምድ ዓይነት")}
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("t-grp")}
                      value={tourForm.groupType}
                      onChange={(e) => setTourForm({ ...tourForm, groupType: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Guided Small Group">{pick("Guided Small Group", "Garee Qajeelfama Qabu", "የተመራ አነስተኛ ቡድን")}</option>
                      <option value="Private VIP Tour">{pick("Private VIP Tour", "Daawwannaa Dhuunfaa VIP", "የግል ቪአይፒ ጉዞ")}</option>
                      <option value="Weekend Getaway">{pick("Weekend Getaway", "Boqonnaa Ayyaanaa", "የሳምንት መጨረሻ እረፍት")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("t-dep")} className={labelClass}>
                    {pick("Preferred Date", "Ji'a Daawwannaa", "ተመራጭ ወር")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("t-dep")}
                      value={tourForm.departure}
                      onChange={(e) => setTourForm({ ...tourForm, departure: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">{pick("Any month", "Ji'a kamiyyuu", "ማንኛውም ወር")}</option>
                      {upcomingMonths.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor={field("t-trav")} className={labelClass}>
                    {pick("Travelers", "Baayyina Imaltootaa", "የተጓዦች ብዛት")}
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("t-trav")}
                      value={tourForm.travelers}
                      onChange={(e) => setTourForm({ ...tourForm, travelers: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {pick(n === 1 ? "Person" : "People", n === 1 ? "Nama" : "Namoota", n === 1 ? "ሰው" : "ሰዎች")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:col-span-2 lg:col-span-1 pt-1 sm:pt-0">
                  <button
                    type="submit"
                    className="btn-primary min-h-[44px] w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Mountain className="h-4 w-4 shrink-0" />
                    <span>{pick("Explore Tours", "Daawwannaa Ilaali", "ቱሮችን ይመልከቱ")}</span>
                  </button>
                  <a
                    href={whatsappLink(
                      `Hello HIKAYA, I would like to book an Ethiopian Tour: ${tourForm.travelers} traveler(s), Group: ${tourForm.groupType}, Month: ${tourForm.departure || "flexible"}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-500 hover:text-white dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                    <span>{pick("Book on WhatsApp", "Waatsaappiin Qabsiisaa", "በዋትስአፕ ያስይዙ")}</span>
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
