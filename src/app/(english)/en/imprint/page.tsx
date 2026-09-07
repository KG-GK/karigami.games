import { LegalPage } from "@/components/legal-page";
import { legalMetadata } from "@/lib/metadata";

export const metadata = legalMetadata("en", "imprint");
export default function Page() { return <LegalPage locale="en" kind="imprint" />; }
