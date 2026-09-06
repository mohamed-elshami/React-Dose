import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `React Dose · ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "npx create-react-dose",
    "React scaffolding CLI",
    "feature driven React",
  ],
});

export default function Page() {
  return <LandingPage />;
}
