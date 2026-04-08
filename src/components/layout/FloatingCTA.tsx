"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";

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
        className="group relative flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all hover:scale-110 animate-pulse"
      >
        <Image src="/zalo-logo.png" alt="Zalo" width={28} height={28} />
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
