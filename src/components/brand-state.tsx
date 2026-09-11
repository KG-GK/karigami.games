"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

const layouts = ["above", "split", "horizontal", "between"] as const;
export type BrandLayout = typeof layouts[number];
const BrandContext = createContext<{ layout: BrandLayout; cycle: () => void } | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  // Start with the familiar horizontal mark; preserve the sequence across navigation.
  const [index, cycle] = useReducer((current: number) => (current + 1) % layouts.length, 2);
  return <BrandContext.Provider value={{ layout: layouts[index], cycle }}>{children}</BrandContext.Provider>;
}

export function useBrandLayout() {
  const brand = useContext(BrandContext);
  if (!brand) throw new Error("useBrandLayout must be used inside BrandProvider");
  return brand;
}
