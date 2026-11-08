"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Moon, Plane, Hotel, Mountain } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip, type PackageCategory } from "@/context/TripContext";
import { useSite } from "@/context/SiteContext";

type Tab = "umrah" | "flights" | "hotels" | "tours";

const tabCategory: Record<Tab, PackageCategory> = {
  umrah: "umrah",
  flights: "travel",
  hotels: "travel",
  tours: "tours",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-xs text-primary-700 transition focus:outline-none focus:ring-2 focus:ring-accent-400 dark:border-dark-100 dark:bg-dark-400 dark:text-white sm:text-sm";
const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

export default function SearchBooking() {
  const { lang } = useLanguage();
  const { packages } = useSite();
  const { setSearch } = useTrip();
  const uid = useId();
  const en = lang === "en";

  const [activeTab, setActiveTab] = useState<Tab>("umrah");
  const [form, setForm] = useState({ packageId: "", departure: "", returnDate: "", travelers: "1" });
  const today = new Date().toISOString().split("T")[0];

  const tabs = [
    { id: "umrah", icon: Moon, label: en ? "Umrah Packages" : "Paakeejii Umraa" },
    { id: "flights", icon: Plane, label: en ? "Flight Tickets" : "Tikeettii Xiyyaaraa" },
    { id: "hotels", icon: Hotel, label: en ? "Hotel Booking" : "Hoteela Qabsiisuu" },
    { id: "tours", icon: Mountain, label: en ? "Ethiopia Tours" : "Daawwannaa Itoophiyaa" },
  ] as const;

  // Only offer destinations that belong to the selected service tab
  const options = useMemo(
    () => packages.filter((pkg) => pkg.category === tabCategory[activeTab]),
    [packages, activeTab]
  );

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    setForm((prev) => ({ ...prev, packageId: "" }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch({ category: tabCategory[activeTab], ...form });
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
                onClick={() => selectTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-all duration-300 sm:px-5 sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-glow"
                    : "bg-white/90 text-primary-700 backdrop-blur-md hover:bg-white dark:bg-dark-400 dark:text-gray-300 dark:hover:bg-dark-300"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearch} className="glass-card rounded-2xl p-6 shadow-soft-lg md:p-8 dark:shadow-none">
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor={field("dest")} className={labelClass}>
                {en ? "Destination / Service" : "Bakka / Tajaajila"}
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" aria-hidden="true" />
                <select
                  id={field("dest")}
                  value={form.packageId}
                  onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{en ? "All options" : "Filannoo hunda"}</option>
                  {options.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={field("dep")} className={labelClass}>
                {en ? "Departure Date" : "Guyyaa Ka'umsaa"}
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" aria-hidden="true" />
                <input
                  id={field("dep")}
                  type="date"
                  min={today}
                  value={form.departure}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      departure: e.target.value,
                      returnDate: form.returnDate && form.returnDate < e.target.value ? "" : form.returnDate,
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor={field("ret")} className={labelClass}>
                {en ? "Return Date" : "Guyyaa Deebii"}
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" aria-hidden="true" />
                <input
                  id={field("ret")}
                  type="date"
                  min={form.departure || today}
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor={field("trav")} className={labelClass}>
                {en ? "Travelers" : "Baayyina Imaltootaa"}
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" aria-hidden="true" />
                <select
                  id={field("trav")}
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} {en ? (n === 1 ? "Person" : "People") : n === 1 ? "Nama" : "Namoota"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-sm sm:text-base">
              <Search className="h-5 w-5" aria-hidden="true" />
              {en ? "Find Packages" : "Paakeejii Barbaadi"}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
