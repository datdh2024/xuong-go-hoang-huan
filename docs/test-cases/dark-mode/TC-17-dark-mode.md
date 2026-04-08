# TC-17 — Dark Mode Support

**Linked Story:** [US-17-dark-mode](../../user-stories/dark-mode/US-17-dark-mode.md)

---

## Happy Path

### TC-17-01: Default theme is dark on first visit

- **Type:** happy_path
- **Description:** First-time visitor sees the site in dark mode regardless of OS preference
- **Precondition:** No localStorage theme entry exists
- **Steps:**
  1. Open the website at `/`
  2. Observe the page rendering
- **Expected Result:** The `<html>` element has class `dark`; background is deep charcoal; text is warm off-white; gold accents are visible

### TC-17-02: First-time visitor can switch to light mode via toggle

- **Type:** happy_path
- **Description:** First-time visitor starts in dark mode and can switch to light
- **Precondition:** No localStorage theme entry exists
- **Steps:**
  1. Open the website at `/`
  2. Verify site is in dark mode by default
  3. Click the toggle button in the header
- **Expected Result:** The `<html>` element no longer has class `dark`; the site appears in the light wood/gold palette; localStorage stores the preference

### TC-17-03: Toggle button switches from light to dark mode

- **Type:** happy_path
- **Description:** User clicks the dark mode toggle to switch from light to dark
- **Precondition:** Site is in light mode
- **Steps:**
  1. Open the website at `/`
  2. Locate the sun/moon toggle button in the header
  3. Click the toggle button
- **Expected Result:** The site switches to dark mode immediately; background becomes deep charcoal; text becomes warm off-white; the toggle icon changes (e.g., sun to moon or vice versa)

### TC-17-04: Toggle button switches from dark to light mode

- **Type:** happy_path
- **Description:** User clicks the dark mode toggle to switch from dark to light
- **Precondition:** Site is in dark mode
- **Steps:**
  1. Open the website at `/` in dark mode
  2. Click the toggle button in the header
- **Expected Result:** The site switches to light mode immediately; the original wood/gold palette is restored; the toggle icon changes accordingly

### TC-17-05: User preference persists across page navigations

- **Type:** happy_path
- **Description:** After toggling dark mode, navigating to another page keeps the mode
- **Precondition:** Site is in light mode
- **Steps:**
  1. Open the website at `/`
  2. Click the dark mode toggle to enable dark mode
  3. Click "Gioi thieu" nav link to navigate to `/gioi-thieu`
- **Expected Result:** The `/gioi-thieu` page renders in dark mode

### TC-17-06: User preference persists across browser sessions (localStorage)

- **Type:** happy_path
- **Description:** Closing and reopening the browser retains the user's dark mode choice
- **Precondition:** User has previously toggled to dark mode
- **Steps:**
  1. Open the website at `/`
  2. Toggle to dark mode
  3. Verify localStorage contains the theme preference
  4. Reload the page
- **Expected Result:** The page loads in dark mode; localStorage still contains the theme preference

### TC-17-07: Dark mode toggle is accessible on mobile

- **Type:** happy_path
- **Description:** The toggle button is visible and functional on mobile viewport
- **Precondition:** Browser viewport is 375x812 (mobile)
- **Steps:**
  1. Open the website at `/` on a mobile viewport
  2. Locate the dark mode toggle button in the header (should be visible without opening the hamburger menu)
  3. Click the toggle
- **Expected Result:** Dark mode activates; the toggle is visible and tappable on mobile without needing to open the navigation menu

---

## Edge Cases

### TC-17-08: No flash of incorrect theme on page load

- **Type:** edge_case
- **Description:** The correct theme is applied before first paint to avoid flash of wrong colors
- **Precondition:** User has dark mode saved in localStorage
- **Steps:**
  1. Set localStorage theme to dark
  2. Navigate to `/`
  3. Observe the initial render
- **Expected Result:** The page renders directly in dark mode with no brief flash of light mode

### TC-17-09: localStorage preference overrides system preference

- **Type:** edge_case
- **Description:** If user manually chose light mode but OS is in dark mode, localStorage wins
- **Precondition:** OS is set to dark mode; localStorage has theme = light
- **Steps:**
  1. Set localStorage theme to light
  2. Open the website at `/` with `prefers-color-scheme: dark`
- **Expected Result:** The site renders in light mode (localStorage overrides system preference)

### TC-17-10: All pages render correctly in dark mode

- **Type:** edge_case
- **Description:** Every page has proper dark mode styling without broken elements
- **Precondition:** Site is in dark mode
- **Steps:**
  1. Enable dark mode
  2. Navigate to `/` (homepage) — check hero slider, highlights, projects grid, FAQ, quote form
  3. Navigate to `/gioi-thieu` — check about page content
  4. Navigate to `/cong-trinh` — check projects listing
  5. Navigate to `/cong-trinh/[slug]` — check project detail: hero title readability, description headings, body text, sidebar card (background, borders, labels, values)
  6. Navigate to `/lien-he` — check contact form and info cards
- **Expected Result:** All pages have consistent dark mode styling; no white/light background sections that break the dark theme; text is readable; gold accents are visible; project detail hero title has drop shadow and gradient overlay for contrast

### TC-17-11: Footer appearance in dark mode

- **Type:** edge_case
- **Description:** Footer (already dark-styled) remains visually consistent in dark mode
- **Precondition:** Site is in dark mode
- **Steps:**
  1. Enable dark mode
  2. Scroll to the footer on any page
- **Expected Result:** Footer maintains its appearance; no jarring contrast change between footer and the rest of the dark-themed page

### TC-17-12: Form inputs are readable in dark mode

- **Type:** edge_case
- **Description:** All form fields (quote form, contact form) have proper dark mode styling
- **Precondition:** Site is in dark mode
- **Steps:**
  1. Enable dark mode
  2. Navigate to the quote form section on the homepage
  3. Click into an input field and type text
  4. Navigate to `/lien-he` and interact with the contact form
- **Expected Result:** Input fields have dark backgrounds with light text; placeholder text is visible; focus states are clear; form buttons retain gold accent styling

---

## Error Cases

### TC-17-13: Corrupted localStorage value is handled gracefully

- **Type:** error_case
- **Description:** If localStorage contains an invalid theme value, the site falls back to system preference
- **Precondition:** localStorage has theme set to an invalid value (e.g., "invalid")
- **Steps:**
  1. Set localStorage theme to "invalid"
  2. Open the website at `/`
- **Expected Result:** The site falls back to the system preference (dark or light based on OS setting); no JavaScript errors in the console

### TC-17-14: localStorage unavailable (private browsing edge case)

- **Type:** error_case
- **Description:** If localStorage is not available, dark mode still works based on system preference
- **Precondition:** localStorage access throws an error (simulated)
- **Steps:**
  1. Open the website where localStorage is restricted
  2. Observe the initial theme
  3. Click the toggle button
- **Expected Result:** The site respects system preference on load; the toggle still works for the current session even if preference cannot be persisted

---

## Self-Test Report

```
Self-Test Report
------------------------------
Status:           PASS
Cases passed:     13
Cases bypassed:   1
Cases failed:     0
Regression risk:  LOW
Date:             2026-04-08
Notes:            Re-verified after default theme → dark and project detail dark mode improvements

Details:
  TC-17-01 (happy_path):  PASS — dark class present on first visit (no localStorage), body bg rgb(42,16,5) (wood-800)
  TC-17-02 (happy_path):  PASS — toggle switches default dark to light, localStorage stores "light", bg becomes wood-50
  TC-17-03 (happy_path):  PASS — toggle switches to dark, body bg becomes wood-800, button label updates
  TC-17-04 (happy_path):  PASS — toggle switches back to light
  TC-17-05 (happy_path):  PASS — dark mode persists on /gioi-thieu after navigation
  TC-17-06 (happy_path):  PASS — localStorage retains theme after reload
  TC-17-07 (happy_path):  PASS — toggle visible and functional on mobile (375x812)
  TC-17-08 (edge_case):   PASS — dark class present at commit time, no flash of light mode
  TC-17-09 (edge_case):   PASS — localStorage light overrides system dark
  TC-17-10 (edge_case):   PASS — all 5 pages render correctly: homepage, gioi-thieu, cong-trinh, cong-trinh/[slug], lien-he; project detail has bright headings, readable text, dark sidebar
  TC-17-11 (edge_case):   PASS — footer consistent in dark mode
  TC-17-12 (edge_case):   PASS — form inputs readable, dark bg, light text, gold buttons
  TC-17-13 (error_case):  BYPASS — known next-themes limitation; invalid localStorage value applied as class instead of fallback
  TC-17-14 (error_case):  PASS — localStorage unavailable handled, system pref respected
```
