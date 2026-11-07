"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type PackageCategory = "all" | "umrah" | "tours" | "travel";

export interface TripSearch {
  category: PackageCategory;
  packageId: string;
  departure: string;
  returnDate: string;
  travelers: string;
}

interface TripContextType {
  search: TripSearch;
  setSearch: (next: TripSearch) => void;
  setCategory: (category: PackageCategory) => void;
}

const initial: TripSearch = {
  category: "all",
  packageId: "",
  departure: "",
  returnDate: "",
  travelers: "1",
};

const TripContext = createContext<TripContextType | undefined>(undefined);

/** Shares the hero search form with the packages list and booking modal. */
export function TripProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<TripSearch>(initial);

  const value = useMemo<TripContextType>(
    () => ({
      search,
      setSearch,
      setCategory: (category) =>
        setSearch((prev) => ({ ...prev, category, packageId: "" })),
    }),
    [search]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within a TripProvider");
  return context;
}
