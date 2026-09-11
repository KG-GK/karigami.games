import type { ReactNode } from "react";
import { siteMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { BrandProvider } from "@/components/brand-state";
import { themeBootScript } from "@/lib/theme.mjs";
import "../globals.css";

export const metadata = siteMetadata("de");
export { viewport } from "@/lib/metadata";

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <html lang="de" data-theme="paper" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeBootScript }} /></head><body><ThemeProvider><BrandProvider>{children}</BrandProvider></ThemeProvider></body></html>;
}
