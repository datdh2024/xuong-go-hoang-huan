import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import QuoteForm from "@/components/sections/QuoteForm";
import { getSiteSettings, getFeaturedTemplates } from "@/sanity/lib/fetchers";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với Xưởng Gỗ Hoàng Huân để được tư vấn và báo giá thi công nhà gỗ cổ truyền miễn phí.",
  openGraph: {
    title: "Liên hệ",
    description:
      "Liên hệ với Xưởng Gỗ Hoàng Huân để được tư vấn và báo giá thi công nhà gỗ cổ truyền miễn phí.",
    url: "/lien-he",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/lien-he",
  },
};

export default async function ContactPage() {
  const [siteSettings, templates] = await Promise.all([
    getSiteSettings(),
    getFeaturedTemplates(),
  ]);

  const houseTypes = templates.map((t) => t.name);
  const phoneRaw = siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, "");

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: "Trang chủ", path: "/" },
              { name: "Liên hệ", path: "/lien-he" },
            ])
          ),
        }}
      />
      {/* Hero */}
      <div className="relative h-56 md:h-72">
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80"
          alt="Liên hệ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Liên lạc</p>
            <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white italic">Liên Hệ</h1>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Phone, label: "Điện thoại", value: siteSettings.phone, href: `tel:${phoneRaw}` },
              { icon: Mail, label: "Email", value: siteSettings.email, href: `mailto:${siteSettings.email}` },
              { icon: MapPin, label: "Địa chỉ", value: siteSettings.address, href: undefined },
              { icon: Clock, label: "Giờ làm việc", value: siteSettings.workingHours, href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-wood-50 dark:bg-wood-700 border border-wood-100 dark:border-wood-600 rounded-lg p-5 text-center">
                <div className="w-10 h-10 bg-wood-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <p className="text-xs text-gray-400 dark:text-wood-300 uppercase tracking-wider mb-1">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-wood-700 dark:text-wood-100 hover:text-wood-500 dark:hover:text-gold-400 transition-colors">{value}</a>
                ) : (
                  <p className="text-sm font-medium text-wood-700 dark:text-wood-100">{value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="text-center mb-6">
            <p className="text-gray-500 dark:text-wood-200 text-sm mb-3">Theo dõi chúng tôi</p>
            <div className="flex justify-center gap-3">
              <a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-wood-200 dark:border-wood-500 rounded hover:bg-wood-600 hover:text-white hover:border-wood-600 transition-colors text-sm text-wood-600 dark:text-wood-200">
                <Facebook size={16} /> Facebook
              </a>
              <a href={siteSettings.tiktokUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-wood-200 dark:border-wood-500 rounded hover:bg-wood-600 hover:text-white hover:border-wood-600 transition-colors text-sm text-wood-600 dark:text-wood-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.11V9.01a6.27 6.27 0 0 0-.86-.06 6.28 6.28 0 0 0-6.28 6.28 6.28 6.28 0 0 0 6.28 6.28 6.28 6.28 0 0 0 6.28-6.28V8.69a8.16 8.16 0 0 0 4.78 1.53V6.77a4.85 4.85 0 0 1-.96-.08z"/></svg> TikTok
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote form reuse */}
      <QuoteForm houseTypes={houseTypes} />
    </div>
  );
}
