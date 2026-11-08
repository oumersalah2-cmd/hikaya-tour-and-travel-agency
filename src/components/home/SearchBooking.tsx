"use client";

import { useId, useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useSite } from "@/context/SiteContext";

type Tab = "umrah" | "flights" | "hotels" | "tours";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-xs text-primary-700 transition focus:outline-none focus:ring-2 focus:ring-accent-400 dark:border-dark-100 dark:bg-dark-400 dark:text-white sm:text-sm";
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

  const today = new Date().toISOString().split("T")[0];

  const pick = (en: string, om: string, am: string) =>
    lang === "am" ? am : lang === "om" ? om : en;

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
      badge: pick("Instant Quote", "Gatii Hatattamaa", "ፈጣን ዋጋ"),
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
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Flights inquiry
  const handleFlightsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello HIKAYA, I would like to inquire about flight tickets: From ${flightForm.from} to ${flightForm.to}, Departure: ${flightForm.departure || "flexible"}, Return: ${flightForm.returnDate || "flexible"}, Passengers: ${flightForm.passengers} (${flightForm.class}).`;
    window.open(whatsappLink(msg), "_blank");
  };

  // Handle Hotels inquiry
  const handleHotelsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello HIKAYA, I would like to inquire about hotel booking: Location: ${hotelForm.location}, Check-in: ${hotelForm.checkin || "flexible"}, Check-out: ${hotelForm.checkout || "flexible"}, Room Type: ${hotelForm.roomType}.`;
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
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  const field = (name: string) => `${uid}-${name}`;

  return (
    <section id="search" className="relative z-20 mb-12 -mt-6 sm:-mt-8 lg:-mt-12 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        {/* Navigation Tabs */}
        <div role="tablist" className="mb-3 flex flex-wrap gap-2 px-2 sm:px-4">
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
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-all duration-300 sm:px-5 sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-glow scale-[1.02]"
                    : "bg-white/95 text-primary-700 backdrop-blur-md hover:bg-white dark:bg-dark-400 dark:text-gray-300 dark:hover:bg-dark-300"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Service Forms based on Active Tab */}
        <div className="glass-card rounded-2xl p-6 shadow-soft-lg md:p-8 dark:shadow-none">
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
                <div>
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
                          {pkg.title} ({pkg.priceETB})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={field("u-room")} className={labelClass}>
                    {pick("Room Sharing Type", "Gosa Kutaa", "የክፍል ዓይነት")}
                  </label>
                  <div className="relative">
                    <Bed className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <select
                      id={field("u-room")}
                      value={umrahForm.roomSharing}
                      onChange={(e) => setUmrahForm({ ...umrahForm, roomSharing: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="4-room">{pick("4 Pilgrims / Room (Quad)", "Nama 4 Kutaa Tokkotti (Quad)", "4 ሰው በአንድ ክፍል (በጋራ)")}</option>
                      <option value="3-room">{pick("3 Pilgrims / Room (Triple)", "Nama 3 Kutaa Tokkotti", "3 ሰው በአንድ ክፍል")}</option>
                      <option value="2-room">{pick("2 Pilgrims / Room (Double)", "Nama 2 Kutaa Dhuunfaa", "2 ሰው በአንድ ክፍል (የግል)")}</option>
                      <option value="vip-single">{pick("VIP Single Occupancy", "Kutaa Dhuunfaa Qeenxee", "የግል ባለ 1 ሰው ቪአይፒ")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={field("u-dep")} className={labelClass}>
                    {pick("Preferred Month / Date", "Guyyaa Imalaa", "የመነሻ ወር / ቀን")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <input
                      id={field("u-dep")}
                      type="date"
                      min={today}
                      value={umrahForm.departure}
                      onChange={(e) => setUmrahForm({ ...umrahForm, departure: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
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

                <button type="submit" className="btn-primary w-full py-3.5 text-sm sm:text-base flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  <span>{pick("Find Umrah Packages", "Paakeejii Umraa Barbaadi", "የኡምራ ፓኬጆችን ፈልግ")}</span>
                </button>
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
                <div>
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

                <div>
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

                <div>
                  <label htmlFor={field("f-dep")} className={labelClass}>
                    {pick("Departure Date", "Guyyaa Ka'umsaa", "የመነሻ ቀን")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <input
                      id={field("f-dep")}
                      type="date"
                      min={today}
                      value={flightForm.departure}
                      onChange={(e) => setFlightForm({ ...flightForm, departure: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
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

                <button type="submit" className="btn-primary w-full py-3.5 text-sm sm:text-base flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  <span>{pick("Inquire Flights", "Xiyyaara Gaafadhaa", "የአየር ትኬት ይጠይቁ")}</span>
                </button>
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
                <div>
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

                <div>
                  <label htmlFor={field("h-in")} className={labelClass}>
                    {pick("Check-in Date", "Guyyaa Seensaa", "የመግቢያ ቀን")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <input
                      id={field("h-in")}
                      type="date"
                      min={today}
                      value={hotelForm.checkin}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkin: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={field("h-out")} className={labelClass}>
                    {pick("Check-out Date", "Guyyaa Ba'umsaa", "የመውጫ ቀን")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <input
                      id={field("h-out")}
                      type="date"
                      min={hotelForm.checkin || today}
                      value={hotelForm.checkout}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkout: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
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

                <button type="submit" className="btn-primary w-full py-3.5 text-sm sm:text-base flex items-center justify-center gap-2">
                  <Hotel className="h-5 w-5" />
                  <span>{pick("Check Hotels", "Hoteela Gaafadhaa", "የሆቴል ቦታ ያረጋግጡ")}</span>
                </button>
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
                <div>
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
                          {pkg.title} ({pkg.priceETB})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
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
                      <option value="Private VIP Tour">{pick("Private VIP Expedition", "Daawwannaa Dhuunfaa VIP", "የግል ቪአይፒ ጉዞ")}</option>
                      <option value="Weekend Getaway">{pick("Weekend Getaway", "Boqonnaa Ayyaanaa", "የሳምንት መጨረሻ እረፍት")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={field("t-dep")} className={labelClass}>
                    {pick("Tour Date", "Guyyaa Daawwannaa", "የጉዞ ቀን")}
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                    <input
                      id={field("t-dep")}
                      type="date"
                      min={today}
                      value={tourForm.departure}
                      onChange={(e) => setTourForm({ ...tourForm, departure: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
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

                <button type="submit" className="btn-primary w-full py-3.5 text-sm sm:text-base flex items-center justify-center gap-2">
                  <Mountain className="h-5 w-5" />
                  <span>{pick("Explore Ethiopia Tours", "Daawwannaa Itoophiyaa Ilaalaa", "የኢትዮጵያ ቱሮችን ይመልከቱ")}</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
