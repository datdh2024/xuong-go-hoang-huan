# US-24 — Fix broken hero image on About page

**Status:** done
**Category:** Bug Fix
**Priority:** High
**Risk:** Low

---

## User Story

As a **visitor on the Giới Thiệu page**, I want to see a proper hero image instead of a grey box with broken alt text, so the page looks professional and trustworthy.

---

## Background

The `/gioi-thieu` hero banner currently shows a grey placeholder with the text "Xưởng Gỗ Hoàng Huân" — the image URL is not loading. This is likely a broken external URL or a missing local asset. The hero section uses a Next.js `<Image>` component and the source image needs to be replaced with a working one.

---

## Acceptance Criteria

- [x] The hero image on `/gioi-thieu` renders correctly (no grey placeholder, no broken alt text visible)
- [x] The image is relevant to the workshop/craftsmanship theme
- [x] The overlay text "VỀ CHÚNG TÔI / Giới Thiệu" remains readable on top of the image
- [x] Image loads on both desktop and mobile without layout shift

---

## Files to Touch

- `src/app/(site)/gioi-thieu/page.tsx` — fix or replace the hero image source
