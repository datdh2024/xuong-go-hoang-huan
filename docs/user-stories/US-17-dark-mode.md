# US-17 — Implement dark mode support

**Status:** pending
**Category:** UX
**Task ID:** #17

---

## User Story

As a **visitor using their phone at night**, I want the website to respect my device's dark mode preference so that I can browse comfortably without eye strain.

---

## Background

The site uses TailwindCSS v4 and a warm wood/gold color palette. Currently there is no dark mode implementation. Tailwind v4 handles dark mode via the `dark:` variant. The `tailwind.config.ts` exists and can be extended.

---

## Acceptance Criteria

- [ ] Dark mode is implemented using Tailwind's `class` strategy (toggled via a class on `<html>`)
- [ ] System preference (`prefers-color-scheme: dark`) is respected by default on first visit
- [ ] A toggle button is added to the Header (sun/moon icon) to manually override
- [ ] User preference is persisted to `localStorage`
- [ ] Dark mode palette:
  - Background: deep charcoal/near-black (not pure black) to complement the wood theme
  - Text: warm off-white
  - Gold accents remain (`gold-500`) — gold looks great on dark
  - Wood tones shift to darker variants
- [ ] All existing pages/components are audited and `dark:` classes added where needed
- [ ] No flash of unstyled content (FOUC) on page load — script injected in `<head>` to apply dark class before paint

---

## Files to Touch

- `tailwind.config.ts`
- `src/app/layout.tsx` — FOUC prevention script
- `src/components/layout/Header.tsx` — dark mode toggle button
- `src/app/globals.css` — dark mode CSS variables
- All section/page components to add `dark:` variants
