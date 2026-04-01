# UF-06: Project Detail Page

**URL:** `/cong-trinh/[slug]` (e.g. `/cong-trinh/nha-go-5-gian-hung-yen`)  
**Page Title:** [Project Name] | Xưởng Gỗ Hoàng Huân

## Sections (top → bottom)

1. **Header** — standard
2. **Hero Image** — Full-width project cover image with project name overlay
   - Back link: "← Tất cả công trình"
   - Project title (large italic serif)
   - Meta: location icon + city, calendar + year, tag + category
3. **Content Area** — Two-column layout:
   - **Left (main):** "Mô tả công trình" text + "Thư viện ảnh" (photo gallery grid 2-col)
   - **Right (sidebar):** "Thông tin dự án" card — Loại công trình, Địa điểm, Năm hoàn thành + "Yêu cầu báo giá" gold CTA button
4. **Footer**

## User Actions
- Click "← Tất cả công trình" → back to `/cong-trinh`
- Click gallery images → (currently no lightbox — US-15)
- Click "Yêu cầu báo giá" → navigates to contact/quote form
- Click floating buttons → Zalo/phone contact

## Issues Observed
- 5 console warnings about `next/image` missing `sizes` prop
- No image lightbox on gallery (US-15 pending)
