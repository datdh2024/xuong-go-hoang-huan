# US-03 — Add real project image gallery on Project Detail page

**Status:** pending
**Category:** Core
**Task ID:** #3

---

## User Story

As a **visitor viewing a specific project**, I want to see the actual photos of that construction project so that I can evaluate the quality and style of the workshop's work.

---

## Background

`src/app/(site)/cong-trinh/[slug]/page.tsx` uses a hardcoded `DETAIL_IMAGES` array with 4 generic Unsplash photos for all projects regardless of slug. The Sanity `project` schema has an `images` field (array of images) and `projectBySlugQuery` already fetches `images[]`. This data just needs to be used.

---

## Acceptance Criteria

- [ ] Project detail page shows images from the Sanity `images[]` field for that specific project
- [ ] If no images are uploaded in Sanity, falls back gracefully (shows thumbnail or a placeholder)
- [ ] Gallery supports lightbox/zoom on click (can use a simple client component)
- [ ] Images are lazy-loaded for performance
- [ ] Alt text is descriptive (`${project.title} - ảnh ${i + 1}`)
- [ ] Thumbnail hero image also comes from Sanity (not Unsplash)

---

## Files to Touch

- `src/app/(site)/cong-trinh/[slug]/page.tsx`
- Potentially create `src/components/ui/ImageGallery.tsx` for the lightbox
