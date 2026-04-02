import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { SITE_SETTINGS } from "@/lib/data";

export const revalidate = 3600;

async function getSiteSettings() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return SITE_SETTINGS;
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { siteSettingsQuery } = await import("@/sanity/lib/queries");
    const data = await client.fetch(siteSettingsQuery);
    return data ?? SITE_SETTINGS;
  } catch {
    return SITE_SETTINGS;
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main>{children}</main>
      <Footer siteSettings={siteSettings} />
      <FloatingCTA />
    </>
  );
}
