# US-23 — Premium 404 page redesign

**Status:** done
**Priority:** High
**Risk:** Medium
**Category:** Enhancement

---

## User Story

As a **visitor who lands on a broken or mistyped URL**, I want to see a visually rich, on-brand 404 page with woodworking artistry and clear recovery actions, so that I feel the premium quality of the brand even on error pages and can easily find my way back.

---

## Acceptance Criteria

- [x] Page features a decorative SVG woodworking element (tools, furniture, or wood motif)
- [x] "404" number is styled with ornamental gold framing or decorative divider lines — not just plain text
- [x] Background section uses a warm gradient or subtle texture (wood-50 → wood-100) for visual depth
- [x] Heading uses Cormorant Garamond serif font, Vietnamese copy: "Trang không tồn tại"
- [x] Buttons are consistent: primary gold (`bg-gold-500`) for "Trang chủ", secondary wood outline for "Công trình" and "Liên hệ"
- [x] Phone CTA is clearly separated and visually distinct
- [x] Page includes Header and Footer (already present, must be kept)
- [x] Navigation has `aria-label` and is keyboard-accessible
- [x] Unit tests pass (`src/__tests__/components/NotFound.test.tsx`)
- [x] E2E tests pass (`tests/e2e/not-found.spec.ts`)

---

## Files to Modify

- `src/app/not-found.tsx` — visual redesign
- `src/__tests__/components/NotFound.test.tsx` — unit tests (TDD: write first)
- `tests/e2e/not-found.spec.ts` — E2E tests

---

## Design Reference

| Token | Usage |
|-------|-------|
| `wood-50` / `wood-100` | Background gradient |
| `wood-800` / `wood-700` | Text, secondary buttons |
| `gold-400` / `gold-500` / `gold-600` | Primary CTA, 404 ornament, decorative lines |
| `font-cormorant` | Headings |
