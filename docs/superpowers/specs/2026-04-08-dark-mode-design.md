# Dark Mode Support — Design Spec

**Story:** [US-17-dark-mode](../../user-stories/dark-mode/US-17-dark-mode.md)
**Test Cases:** [TC-17-dark-mode](../../test-cases/dark-mode/TC-17-dark-mode.md)
**Date:** 2026-04-08

---

## 1. Architecture & Theme Infrastructure

- **Library:** `next-themes` for SSR-safe theme management
- **Tailwind:** Configure `darkMode: 'class'` in `tailwind.config.ts`
- **ThemeProvider:** Client component wrapping `next-themes`'s `<ThemeProvider>` with:
  - `attribute="class"` — toggles `dark` class on `<html>`
  - `defaultTheme="system"` — respects OS preference on first visit
  - `enableSystem` — listens for `prefers-color-scheme` changes
  - `storageKey="theme"` — persists to localStorage
- **Mounting point:** `src/app/layout.tsx` — provider wraps `{children}` inside `<body>`
- **Flash prevention:** next-themes injects an inline script before first paint that reads localStorage/system preference and applies the `dark` class immediately. The existing `suppressHydrationWarning` on `<html>` is already in place.

## 2. Dark Mode Toggle Component

- **File:** `src/components/ui/ThemeToggle.tsx` (client component)
- **Hook:** `useTheme()` from `next-themes`
- **Icons:** Sun icon (shown in dark mode) / Moon icon (shown in light mode) from `lucide-react`
- **Styling:** No background, `text-wood-100 hover:text-gold-400`, matching header aesthetic
- **Hydration:** Renders nothing until mounted (avoids SSR icon mismatch)

### Placement

- **Desktop header:** Between nav links and phone CTA button — icon-only button, no label
- **Mobile header:** In the header bar next to the hamburger menu icon — always visible, not inside the menu

## 3. Dark Mode Color Mapping

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | `bg-wood-50` | `dark:bg-wood-800` |
| Body text | `text-gray-900` | `dark:text-wood-100` |
| Secondary text | `text-gray-600` | `dark:text-wood-200` |
| Cards/surfaces | `bg-white` | `dark:bg-wood-700` |
| Card borders | `border-wood-100` | `dark:border-wood-600` |
| Section alt bg | `bg-wood-50/100` | `dark:bg-wood-900` |
| Input fields | `bg-white` | `dark:bg-wood-700` |
| Input borders | `border-gray-300` | `dark:border-wood-500` |
| Gold accents | `gold-400/500/600` | **Unchanged** |
| Header | `bg-wood-600` | **Unchanged** |
| Footer | `bg-wood-700` | **Unchanged** |
| QuoteForm section | `bg-wood-600` | **Unchanged** |
| HeroSlider | overlay on images | **Unchanged** |
| FloatingCTA | `bg-gold-500`, `bg-blue-500` | **Unchanged** |

**Key:** `wood-800` (#2d1810) is the primary dark background. `wood-100` (#f5ede4) is the primary dark text. Gold accents are retained unchanged.

## 4. Component Audit

### No changes needed (already dark)

- `Header.tsx` — `bg-wood-600`, light text
- `Footer.tsx` — `bg-wood-700`, light text
- `QuoteForm.tsx` — `bg-wood-600`, glassmorphism
- `HeroSlider.tsx` — image overlays, white text
- `FloatingCTA.tsx` — accent-colored buttons

### Add `dark:` variants

- `SectionHeading.tsx` — dark mode text colors on default (non-light) variant
- `ProjectCard.tsx` — card bg, borders, text colors
- `FaqSection.tsx` — section bg, accordion item bg, text colors
- `Highlights.tsx` — card backgrounds and text

### Form styling

- Contact form (`lien-he/page.tsx`) — inputs, labels, card backgrounds
- Quote form inputs are on dark bg already — likely fine

### Layout-level

- `src/app/layout.tsx` — wrap with ThemeProvider, add `dark:bg-wood-800 dark:text-wood-100` to body
- `src/app/globals.css` — update body default styles to support dark mode

### Pages

- Homepage sections composed of components above — no direct page changes expected
- `gioi-thieu/page.tsx`, `cong-trinh/page.tsx`, `lien-he/page.tsx` — check for inline color classes

## 5. Testing Strategy

### Unit Tests

- **`src/__tests__/components/ui/ThemeToggle.test.tsx`** — toggle renders, click switches theme, correct icon per theme, hydration state (nothing before mount)
- Mock `next-themes` `useTheme()` in unit tests

### E2E Tests (`tests/e2e/dark-mode.spec.ts`)

Maps to TC-17 test cases:

| Test | TC | What it verifies |
|------|-----|-----------------|
| System dark preference on first visit | TC-17-01 | `<html>` has `dark` class when OS is dark |
| System light preference on first visit | TC-17-02 | `<html>` lacks `dark` class when OS is light |
| Toggle light → dark | TC-17-03 | Click toggle, verify dark mode activates |
| Toggle dark → light | TC-17-04 | Click toggle, verify light mode restores |
| Preference persists across navigation | TC-17-05 | Toggle dark, navigate, verify still dark |
| localStorage persistence | TC-17-06 | Toggle dark, reload, verify still dark |
| Mobile toggle accessible | TC-17-07 | 375x812 viewport, toggle visible and functional |
| No flash of incorrect theme | TC-17-08 | Pre-seed localStorage, navigate, no flash |
| localStorage overrides system | TC-17-09 | localStorage=light + OS=dark → site is light |
| All pages dark mode | TC-17-10 | Navigate all pages in dark mode, visual check |
| Footer consistency | TC-17-11 | Footer appearance in dark mode |
| Form inputs readable | TC-17-12 | Dark mode form interaction |
| Corrupted localStorage | TC-17-13 | Invalid value → falls back to system preference |
| localStorage unavailable | TC-17-14 | Toggle works for session, system preference on load |

### TDD Cycle

1. Write unit tests for ThemeToggle (RED)
2. Implement ThemeToggle component (GREEN)
3. Refactor
4. Write E2E tests for full integration
5. Add `dark:` classes to components, verifying E2E tests pass progressively

## 6. Dependencies

- **Install:** `next-themes`
- **Icons:** `lucide-react` (already installed — `^0.577.0`)
- **No other new dependencies**

## 7. Out of Scope

- Dark mode for Sanity Studio (`/studio` route)
- Dark mode for image content (hero slider photos, project images)
- Color scheme meta tag (`<meta name="color-scheme">`) — next-themes handles this
- Animated transitions between themes (simple instant switch per spec)
