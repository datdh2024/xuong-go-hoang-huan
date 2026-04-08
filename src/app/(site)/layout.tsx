import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { getSiteSettings } from "@/sanity/lib/fetchers";

export const revalidate = 3600;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
