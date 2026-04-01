"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";

// Zalo SVG icon
function ZaloIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-6 h-6">
      <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm9.6 28.4c-.4.4-.85.6-1.35.6-.5 0-.95-.2-1.35-.6l-4.2-4.2c-.8.25-1.65.4-2.5.4-5.15 0-9.35-4.2-9.35-9.35S19.85 9.9 25 9.9s9.35 4.2 9.35 9.35c0 2.1-.7 4.05-1.85 5.6l2.1 2.1 2.1 2.1c.75.75.75 1.95 0 2.7l-3.1 3.1z" />
    </svg>
  );
}

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-4 z-50 flex flex-col gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Zalo */}
      <a
        href={`https://zalo.me/${SITE_SETTINGS.zaloNumber}`}
        target="_blank"
        rel="noreferrer"
        title="Chat Zalo"
        aria-label="Liên hệ qua Zalo"
        className="group relative flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
      >
        <ZaloIcon />
        <span className="absolute right-14 bg-wood-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat Zalo
        </span>
      </a>

      {/* Phone */}
      <a
        href={`tel:${SITE_SETTINGS.phoneRaw}`}
        title="Gọi ngay"
        aria-label="Gọi điện thoại"
        className="group relative flex items-center justify-center w-12 h-12 bg-gold-500 hover:bg-gold-600 text-wood-800 rounded-full shadow-lg transition-all hover:scale-110 animate-pulse"
      >
        <Phone size={20} />
        <span className="absolute right-14 bg-wood-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {SITE_SETTINGS.phone}
        </span>
      </a>
    </div>
  );
}
