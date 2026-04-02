# US-29 — Live Hero Slider on Homepage

**Status:** pending
**Category:** Core
**Task ID:** #29
**Priority:** High
**Risk:** Medium

---

## User Story

As a **content manager**, I want to add, edit, reorder, and remove hero slides (background image, headline, subheadline, CTA button) in Sanity CMS so that the homepage hero reflects current promotions and projects.

---

## Background

`HeroSlider.tsx` currently reads from the hardcoded `HERO_SLIDES` array in `src/lib/data.ts`. The `heroSlidesQuery` GROQ query is already written and returns `_id, headline, subheadline, ctaLabel, ctaLink, order, image { asset->{url, metadata} }`.

---

## Acceptance Criteria

- [ ] Hero slider on the homepage fetches slides from Sanity using `heroSlidesQuery`
- [ ] Slides are ordered by the `order` field set in Sanity
- [ ] Images are rendered using the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] If Sanity is not configured, falls back to `HERO_SLIDES` from `src/lib/data.ts`
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual or behavioral change to the slider — only the data source changes

---

## Files to Touch

- `src/components/sections/HeroSlider.tsx`
- `src/app/(site)/page.tsx` (pass fetched slides as props)
