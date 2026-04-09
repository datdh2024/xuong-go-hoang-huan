"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";
import type { SiteSettingsData } from "@/components/layout/Header";
import { trackEvent } from "@/lib/analytics";

export default function Footer({ siteSettings = SITE_SETTINGS }: { siteSettings?: SiteSettingsData }) {
  const phoneHref = siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, '');

  return (
    <footer className="bg-wood-700 text-wood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-gold-500 mb-2">
              {siteSettings.companyName}
            </h3>
            {siteSettings.taglineSub && (
              <p className="text-sm text-wood-300 italic mb-4">{siteSettings.taglineSub}</p>
            )}
            <div className="flex gap-3">
              <a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer"
                aria-label="Facebook Xưởng Gỗ Hoàng Huân"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <Facebook size={18} />
              </a>
              <a href={siteSettings.tiktokUrl} target="_blank" rel="noreferrer"
                aria-label="TikTok Xưởng Gỗ Hoàng Huân"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.11V9.01a6.27 6.27 0 0 0-.86-.06 6.28 6.28 0 0 0-6.28 6.28 6.28 6.28 0 0 0 6.28 6.28 6.28 6.28 0 0 0 6.28-6.28V8.69a8.16 8.16 0 0 0 4.78 1.53V6.77a4.85 4.85 0 0 1-.96-.08z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-wood-100 font-semibold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href={`tel:${phoneHref}`} onClick={() => trackEvent('phone_click')} className="hover:text-gold-500 transition-colors">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-gold-500 transition-colors">
                  {siteSettings.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-gold-500 shrink-0" />
                <span>{siteSettings.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-wood-100 font-semibold mb-4 uppercase text-sm tracking-wider">Điều hướng</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/gioi-thieu", label: "Giới thiệu" },
                { href: "/cong-trinh", label: "Công trình" },
                { href: "/lien-he", label: "Liên hệ & Báo giá" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-wood-600 py-4 text-center text-xs text-wood-400">
        © {new Date().getFullYear()} {siteSettings.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
