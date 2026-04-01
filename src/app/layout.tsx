import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
    template: "%s | Xưởng Gỗ Hoàng Huân",
  },
  description:
    "Xưởng Gỗ Hoàng Huân - Chuyên thi công nhà gỗ cổ truyền, nhà thờ họ, đồ thờ gỗ cao cấp. 40 năm kinh nghiệm, hàng trăm công trình toàn quốc. Tư vấn miễn phí - Bảo hành dài hạn.",
  keywords: [
    "xưởng gỗ Hoàng Huân",
    "nhà gỗ cổ truyền Hà Nội",
    "thi công nhà gỗ",
    "nhà gỗ 3 gian 5 gian",
    "nhà thờ họ bằng gỗ",
    "đồ thờ gỗ cao cấp",
    "xưởng mộc Hà Nội",
  ],
  openGraph: {
    title: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
    description:
      "Chuyên thi công nhà gỗ cổ truyền, nhà thờ họ, đồ thờ gỗ cao cấp. 40 năm kinh nghiệm.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${beVietnam.variable}`}>
      <body className="font-be-vietnam bg-wood-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
