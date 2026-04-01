# US-26 — Accessibility improvements for icon-only buttons

**Status:** done
**Category:** Accessibility
**Priority:** Medium
**Risk:** Low

---

## User Story

As a **visitor using a screen reader or keyboard navigation**, I want all interactive buttons to have descriptive labels, so I can understand and use them without seeing the screen.

---

## Background

Several interactive elements across the site contain only icons with no accessible text:
- **FloatingCTA** — Zalo and phone floating action buttons have no `aria-label`
- **Footer social links** — Facebook and YouTube icon links have no `aria-label`
- **Header phone CTA** — phone icon button may lack descriptive label for screen readers

Without `aria-label`, screen readers announce these as generic "button" or "link" with no context.

---

## Acceptance Criteria

- [x] FloatingCTA Zalo button has `aria-label="Liên hệ qua Zalo"` (or equivalent)
- [x] FloatingCTA phone button has `aria-label="Gọi điện thoại"` (or equivalent)
- [x] Footer Facebook link has `aria-label="Facebook Xưởng Gỗ Hoàng Huân"`
- [x] Footer YouTube link has `aria-label="YouTube Xưởng Gỗ Hoàng Huân"`
- [x] All interactive elements are reachable and usable via keyboard (Tab + Enter)
- [x] No accessibility violations for icon-only controls when tested with a screen reader or axe DevTools

---

## Files to Touch

- `src/components/layout/FloatingCTA.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
