# US-17 — Dark Mode Support

**Jira:** [SR-889](https://synctrackreturns.atlassian.net/browse/SR-889)

## User Story

As a visitor browsing the website at night or in low-light conditions, I want the website to respect my device's dark mode preference and allow me to manually toggle dark mode, so that I can browse comfortably without eye strain.

## Goal

Provide a dark color scheme that activates automatically based on the user's system preference, with a manual toggle in the header to override, and persistence of the user's choice across sessions.

## Current State (Implemented 2026-04-08)

- Dark mode is **fully implemented** using `next-themes` with Tailwind `class` strategy
- **ThemeProvider** wraps the app in `src/components/providers/ThemeProvider.tsx` (`attribute="class"`, `defaultTheme="system"`, `storageKey="theme"`)
- **ThemeToggle** button (Sun/Moon icons via `lucide-react`) in Header — visible on both desktop and mobile without opening the hamburger menu
- Uses `useSyncExternalStore` hydration guard to prevent SSR mismatch
- `<html>` element has `suppressHydrationWarning`; `<body>` uses `dark:bg-wood-800 dark:text-wood-100`
- All pages have `dark:` variant classes: Homepage, Gioi thieu, Cong trinh, Lien he
- localStorage key: `theme` — persists user preference across sessions
- Footer already dark-styled — minimal changes needed, remains visually consistent
- **Known limitation:** next-themes does not validate stored theme values (TC-17-13)
- **Bug fix (2026-04-08):** Removed hardcoded `background-color` and `color` from the `body` rule in `globals.css` — these had higher specificity than Tailwind's `dark:bg-wood-800` / `dark:text-wood-100` utility classes, causing near-invisible text in dark mode across all pages

## Acceptance Criteria

1. Dark mode is implemented using Tailwind `class` strategy (toggled via a `dark` class on the `<html>` element)
2. On first visit, the system preference (`prefers-color-scheme: dark`) is respected — if the user's OS is in dark mode, the site shows dark mode; otherwise light mode
3. A toggle button (sun/moon icon) is added to the Header, visible on both desktop and mobile views
4. Clicking the toggle switches between light and dark mode immediately
5. The user's manual preference is persisted to `localStorage` so it survives page reloads and return visits
6. Dark mode palette uses: deep charcoal background, warm off-white text, gold accents (`gold-400/500/600`) retained
7. All existing pages and components are audited and appropriate `dark:` variant classes are added
8. No flash of incorrect theme on page load (theme is applied before first paint)

## Steps (User Flow)

1. User visits the website for the first time
2. The site detects the user's system color scheme preference
3. If the system is in dark mode, the site renders in dark mode automatically
4. User sees a sun/moon icon button in the header (next to nav links on desktop, in the header bar on mobile)
5. User clicks the toggle — the site switches to the opposite mode instantly
6. User navigates to other pages — the chosen mode persists
7. User closes the browser and returns later — the chosen mode is still applied

## Notes

- The footer already uses a dark background — minimal changes needed in dark mode
- Hero slider overlay text remains readable in both modes
- Form inputs (quote form, contact form) have dark mode styling applied
- The floating CTA button and Zalo widget remain visible in dark mode
- TC-17-13 (corrupted localStorage) is a known next-themes limitation — invalid values are applied as CSS class rather than falling back to system preference

## Related

- **Test Cases:** [TC-17-dark-mode](../../test-cases/dark-mode/TC-17-dark-mode.md)
- **Design Spec:** [dark-mode-design](../../superpowers/specs/2026-04-08-dark-mode-design.md)

---

*Last synced: 2026-04-08 (updated for globals.css dark mode fix)*
