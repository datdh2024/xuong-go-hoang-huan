import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Youtube } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-wood-700 text-wood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-gold-500 mb-2">
              {SITE_SETTINGS.companyName}
            </h3>
            <p className="text-sm text-wood-300 italic mb-4">{SITE_SETTINGS.taglineSub}</p>
            <div className="flex gap-3">
              <a href={SITE_SETTINGS.facebookUrl} target="_blank" rel="noreferrer"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <Facebook size={18} />
              </a>
              <a href={SITE_SETTINGS.youtubeUrl} target="_blank" rel="noreferrer"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-wood-100 font-semibold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>{SITE_SETTINGS.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href={`tel:${SITE_SETTINGS.phoneRaw}`} className="hover:text-gold-500 transition-colors">
                  {SITE_SETTINGS.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a href={`mailto:${SITE_SETTINGS.email}`} className="hover:text-gold-500 transition-colors">
                  {SITE_SETTINGS.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-gold-500 shrink-0" />
                <span>{SITE_SETTINGS.workingHours}</span>
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
        © {new Date().getFullYear()} {SITE_SETTINGS.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
