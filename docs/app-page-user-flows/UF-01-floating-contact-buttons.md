# UF-01 — Floating Contact Buttons (FloatingCTA)

**Discovered:** 2026-04-01
**Related User Stories:** US-20, US-21, US-22

---

## Current Behavior

A `FloatingCTA` component renders two floating action buttons in the bottom-right corner (`fixed bottom-6 right-4 z-50`).

**Visibility:** Hidden on page load, appears after user scrolls > 200px (CSS opacity + translateY transition).

### Buttons

| Button | Style | Action |
|--------|-------|--------|
| Zalo | Blue circle (`bg-blue-500`), Zalo SVG icon | Opens `https://zalo.me/0985241204` in new tab |
| Phone | Gold circle (`bg-gold-500`), Phone icon, `animate-pulse` | Opens `tel:0985241204` |

Both buttons show a tooltip label on hover (slides in from right, `opacity-0 → opacity-100`).

---

## What's Missing (Gap Analysis for US-20/21/22)

| Feature | Status |
|---------|--------|
| Popup panel that expands on click | ❌ Not built |
| Facebook Messenger channel | ❌ Not built |
| Close/toggle button | ❌ Not built |
| Staff greeting + avatar | ❌ Not built |
| Auto-prompt bubble after 10s | ❌ Not built |
| Click-outside to close | ❌ Not built |

---

## Current Component

- **File:** `src/components/layout/FloatingCTA.tsx`
- **Used in:** `src/app/(site)/layout.tsx` (wraps all public pages)
- **Data source:** `SITE_SETTINGS` from `src/lib/data.ts` (`zaloNumber`, `phone`, `phoneRaw`)

---

## Notes for US-20 Implementation

The two existing icon buttons should become channel entries inside the new popup panel. The toggle button (chat bubble icon) replaces the role of the current floating group. The `animate-pulse` on the phone button may be re-used on the new toggle button to draw attention.
