import { SITE_URL, SITE_SETTINGS } from "@/lib/data";

export function generateBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_SETTINGS.companyName,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: SITE_SETTINGS.phone,
    email: SITE_SETTINGS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_SETTINGS.address,
      addressCountry: "VN",
    },
    url: SITE_URL,
  };
}
