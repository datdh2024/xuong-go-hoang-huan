# US-09 — Add custom 404 Not Found page

**Status:** pending
**Category:** Feature
**Task ID:** #9

---

## User Story

As a **visitor who lands on a broken or mistyped URL**, I want to see a helpful 404 page that matches the site's design and guides me back to useful content, instead of a generic Next.js error page.

---

## Background

There is no `not-found.tsx` file in the project. Next.js App Router uses `src/app/not-found.tsx` for the custom 404 page. Currently users hitting a bad URL see the default Next.js 404 page which has no branding.

---

## Acceptance Criteria

- [ ] `src/app/(site)/not-found.tsx` is created
- [ ] Page uses the site's fonts (Cormorant Garamond), color palette (wood/gold tones), and layout conventions
- [ ] Displays a relevant 404 message in Vietnamese (e.g., "Trang không tồn tại")
- [ ] Provides helpful navigation links back to: Trang chủ, Công trình, Liên hệ
- [ ] Includes a CTA to contact the workshop (phone number or link to `/lien-he`)
- [ ] Page is visually consistent with the rest of the site (includes Header and Footer via the `(site)` layout)

---

## Files to Create

- `src/app/(site)/not-found.tsx`
