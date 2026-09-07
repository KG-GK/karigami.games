import type { ReactNode } from "react";
import { siteMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata = siteMetadata("de");
export { viewport } from "@/lib/metadata";

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
