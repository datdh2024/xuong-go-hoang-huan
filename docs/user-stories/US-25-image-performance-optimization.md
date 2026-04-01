# US-25 — Image performance optimization across all pages

**Status:** pending
**Category:** Performance
**Priority:** High
**Risk:** Low

---

## User Story

As a **visitor on mobile or a slow connection**, I want images to load quickly and at the right size for my screen, so the site feels fast and doesn't waste my data.

---

## Background

All `next/image` components using the `fill` prop are missing the required `sizes` attribute. This causes the browser to download full-resolution images regardless of the viewport size — unnecessary on mobile. Next.js emits a console warning for each occurrence. There are 5+ affected images across the project detail and homepage. Additionally, the `<html>` element has `scroll-behavior: smooth` in CSS but is missing the `data-scroll-behavior="smooth"` attribute required by Next.js App Router to preserve smooth scrolling during route transitions.

---

## Acceptance Criteria

- [ ] All `<Image fill …>` components have an appropriate `sizes` prop (e.g. `"100vw"` for full-width, `"(max-width: 768px) 100vw, 50vw"` for grid items)
- [ ] No `next/image` size warnings appear in the browser console
- [ ] The `<html>` element in `src/app/layout.tsx` has `data-scroll-behavior="smooth"` so smooth scrolling survives navigation
- [ ] No scroll-behavior console warning from Next.js

---

## Files to Touch

- `src/components/sections/HeroSlider.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/app/(site)/cong-trinh/[slug]/page.tsx`
- `src/app/(site)/gioi-thieu/page.tsx`
- `src/app/(site)/cong-trinh/page.tsx`
- `src/app/layout.tsx` — add `data-scroll-behavior="smooth"` to `<html>`
