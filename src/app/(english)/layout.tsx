import type { ReactNode } from "react";
import { siteMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata = siteMetadata("en");
export { viewport } from "@/lib/metadata";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
