"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/cong-trinh", label: "Công trình" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-wood-600 shadow-lg py-2"
          : "bg-wood-600/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-cormorant text-2xl font-bold text-gold-500 tracking-wide">
            {SITE_SETTINGS.companyName}
          </span>
          <span className="text-wood-200 text-xs tracking-widest uppercase">
            {SITE_SETTINGS.tagline}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-gold-500 ${
                pathname === link.href ? "text-gold-500" : "text-wood-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone CTA */}
        <a
          href={`tel:${SITE_SETTINGS.phoneRaw}`}
          className="hidden md:flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold text-sm px-4 py-2 rounded transition-colors"
        >
          <Phone size={16} />
          {SITE_SETTINGS.phone}
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-wood-100 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-wood-700 border-t border-wood-500">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                  pathname === link.href ? "text-gold-500" : "text-wood-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${SITE_SETTINGS.phoneRaw}`}
              className="flex items-center gap-2 bg-gold-500 text-wood-800 font-semibold text-sm px-4 py-2 rounded w-fit"
            >
              <Phone size={16} />
              {SITE_SETTINGS.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
