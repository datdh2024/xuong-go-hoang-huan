# US-06 — Embed Google Maps on Contact page

**Status:** pending
**Category:** Feature
**Task ID:** #6

---

## User Story

As a **potential customer**, I want to see the workshop's location on a map on the contact page so that I can easily find directions and know exactly where to visit.

---

## Background

`src/app/(site)/lien-he/page.tsx` shows the address ("Thôn Yên Quán, xã Hưng Đạo, Hà Nội") as text only. There is no map embed. Customers visiting in person cannot easily get directions from the page.

---

## Acceptance Criteria

- [ ] Google Maps embed (iframe or Google Maps JavaScript API) is added to the contact page below the contact info cards
- [ ] Map is centered on the workshop's address
- [ ] Map shows a marker/pin with the company name
- [ ] Embed is responsive (100% width, appropriate height on mobile and desktop)
- [ ] Map loads lazily (`loading="lazy"`) to avoid slowing page load
- [ ] If using iframe embed, it uses the standard Google Maps embed URL (no API key required)
- [ ] An "Xem trên Google Maps" button opens Google Maps in a new tab with directions

---

## Files to Touch

- `src/app/(site)/lien-he/page.tsx`
- Optionally create `src/components/ui/MapEmbed.tsx`
