import { LegalPage } from "@/components/legal-page";
import { legalMetadata } from "@/lib/metadata";

export const metadata = legalMetadata("de", "privacy");
export default function Page() { return <LegalPage locale="de" kind="privacy" />; }
