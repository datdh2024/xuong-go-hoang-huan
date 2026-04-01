# US-14 — Add "Dịch vụ" (Services) page with service breakdown

**Status:** pending
**Category:** New Page
**Task ID:** #14

---

## User Story

As a **potential customer**, I want to browse a dedicated services page that clearly explains all types of construction and woodworking services offered (nhà gỗ 3 gian, nhà thờ họ, đồ thờ gỗ, etc.) with descriptions, photos, and starting price ranges, so I can understand if the workshop can fulfill my specific needs before contacting them.

---

## Background

Service types are currently implied by the `HOUSE_TYPES` dropdown in the quote form and the project category filter. There is no dedicated page describing each service in detail. A services page helps SEO (ranking for searches like "làm nhà thờ họ uy tín") and helps pre-qualify customers.

---

## Acceptance Criteria

- [ ] New Sanity schema `service` with fields: `name`, `slug`, `icon` (string — lucide icon name), `shortDescription` (text), `longDescription` (array of blocks), `coverImage` (image), `startingPrice` (string, optional, e.g., "Từ 500 triệu"), `featured` (boolean), `order` (number)
- [ ] Schema registered in `src/sanity/schemas/index.ts`
- [ ] New page at `/dich-vu` listing all services in a grid/list format
- [ ] Each service card links to `/dich-vu/[slug]` for a detail page
- [ ] Service detail page shows: cover image, full description, related projects (matching category), and a CTA to request a quote
- [ ] Navigation link "Dịch vụ" added to `Header` (desktop and mobile) and `Footer`
- [ ] Initial 6 services to seed in Sanity: Nhà gỗ 3 gian, Nhà gỗ 5 gian, Nhà thờ họ, Nhà gỗ sân vườn, Đình/chùa tâm linh, Đồ thờ gỗ

---

## Files to Create/Touch

- Create `src/sanity/schemas/service.ts`
- `src/sanity/schemas/index.ts`
- `src/sanity/lib/queries.ts`
- Create `src/app/(site)/dich-vu/page.tsx`
- Create `src/app/(site)/dich-vu/[slug]/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
