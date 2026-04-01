# UF-03: Homepage User Flow

**URL:** `/`  
**Page Title:** Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt

## Sections (top → bottom)

1. **Header** — Logo + nav (Trang chủ, Giới thiệu, Công trình, Liên hệ) + CTA phone button
2. **HeroSlider** — Full-viewport auto-advancing slider with 3 slides:
   - "Giữ Hồn Kiến Trúc Việt" (living room shot)
   - "Xưởng Sản Xuất 1.000m²" (workshop shot)
   - "Tâm Huyết Từng Đường Chạm" (craftsman shot)
   - Each slide has headline, subtitle, CTA button ("XEM CÔNG TRÌNH" / "LIÊN HỆ NGAY" / "TƯ VẤN MIỄN PHÍ")
3. **Highlights** — 4 stat counters: 40+ năm KN, 500+ công trình, 30+ tỉnh thành, 1.000m² xưởng
4. **ProjectsGrid** — "Hàng trăm công trình nhà gỗ cổ truyền" — 6-card grid with project thumbnails, tags, location/year
5. **HouseTemplates** — House template cards with price and specs
6. **QuoteForm** — "Tư Vấn Miễn Phí" inline quote request form
7. **Footer** — Logo, contact info, social links, navigation

## Issues Observed
- Console error on load (1 error)
- `scroll-behavior: smooth` warning on `<html>` element (Next.js data attribute missing)
- Image `fill` components missing `sizes` prop (performance warning)

## User Actions
- Click nav links → navigate to respective pages
- Click hero CTA buttons → navigate or open contact form
- Click project cards → navigate to `/cong-trinh/[slug]`
- Submit quote form → POST to `/api/contact`
- Click floating Zalo/phone buttons → open Zalo / phone dialer
