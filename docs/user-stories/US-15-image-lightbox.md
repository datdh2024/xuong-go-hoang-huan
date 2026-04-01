# US-15 — Add image lightbox/zoom viewer for project galleries

**Status:** pending
**Category:** UX
**Task ID:** #15

---

## User Story

As a **visitor browsing a project's photo gallery**, I want to click on a photo to open it in a full-screen lightbox with next/previous navigation so that I can see the fine details of the woodworking and carvings at full resolution.

---

## Background

Project detail page (`/cong-trinh/[slug]`) has a 2-column grid of images. Currently clicking an image does nothing. For a woodworking business where craftsmanship details are the main selling point, being able to view images at full size is crucial.

---

## Acceptance Criteria

- [ ] Clicking any image in the project gallery opens a lightbox overlay showing the full-size image
- [ ] Lightbox has: close button (X), previous/next arrows, keyboard navigation (ESC to close, arrow keys to navigate)
- [ ] Image count indicator shown (e.g., "3 / 8")
- [ ] Background overlay is dark semi-transparent
- [ ] Swipe gestures work on mobile (left/right swipe to navigate)
- [ ] Lightbox uses Next.js `<Image>` for optimized loading
- [ ] Thumbnail in the gallery shows a subtle zoom icon on hover to signal it is clickable
- [ ] Implementation is a client component (`use client`) — no external lightbox library required, implement with useState + event listeners

---

## Files to Create/Touch

- Create `src/components/ui/ImageLightbox.tsx`
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — integrate lightbox

---

## Notes

Best implemented together with US-03 (Real project image gallery) since both touch the same detail page.
