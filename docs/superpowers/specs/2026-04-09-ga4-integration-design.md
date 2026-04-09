# GA4 Integration Design

| Field       | Value                               |
| ----------- | ----------------------------------- |
| **Story**   | US-11 — GA4 Integration             |
| **Date**    | 2026-04-09                          |
| **Status**  | Approved                            |
| **Approach**| Manual gtag.js + Next.js `<Script>` |

---

## Overview

Integrate Google Analytics 4 into the website using manual gtag.js loading via Next.js `<Script>` component. A centralized analytics utility module provides helper functions that all components call for event tracking. No external analytics packages are added.

---

## Architecture

### New Files

| File | Type | Purpose |
|------|------|---------|
| `src/lib/analytics.ts` | Utility module | Exports `GA_MEASUREMENT_ID`, `pageview()`, `trackEvent()` |
| `src/components/GoogleAnalytics.tsx` | Client component | Loads gtag.js scripts, listens to route changes |

### Modified Files

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `<GoogleAnalytics />` inside `<body>` |
| `src/components/layout/Header.tsx` | Add `trackEvent('phone_click')` to phone links |
| `src/components/layout/Footer.tsx` | Add `trackEvent('phone_click')` to phone link |
| `src/components/layout/FloatingCTA.tsx` | Add `trackEvent('phone_click')` to phone link, `trackEvent('zalo_click')` to Zalo link |
| `src/components/sections/QuoteForm.tsx` | Add `trackEvent('form_submit', {...formData})` on successful submission |
| `src/app/(site)/cong-trinh/[slug]/page.tsx` | Add `<TrackProjectView slug={slug} />` client component |

---

## Module: `src/lib/analytics.ts`

### Exports

- **`GA_MEASUREMENT_ID`** — reads `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **`pageview(url: string)`** — calls `window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })`
- **`trackEvent(action: string, params?: Record<string, string>)`** — calls `window.gtag('event', action, params)`

### Guards

- All functions are no-ops if `GA_MEASUREMENT_ID` is falsy
- All functions are no-ops if `window.gtag` is undefined (handles ad blockers)
- Never throws — silent failure by design

### TypeScript

- Declares `window.gtag` type globally via `declare global` block

---

## Component: `src/components/GoogleAnalytics.tsx`

- `'use client'` component
- Returns `null` if `GA_MEASUREMENT_ID` is falsy (no DOM output at all)
- Renders two `<Script strategy="afterInteractive">` tags:
  1. External: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  2. Inline: initializes `window.dataLayer`, calls `gtag('js', new Date())` and `gtag('config', GA_MEASUREMENT_ID)`
- Uses `usePathname()` from `next/navigation` in a `useEffect` to call `pageview(pathname)` on route changes
- Placed in `src/app/layout.tsx` inside `<body>`, before `{children}`

---

## Custom Events

### `phone_click`

| Location | Element | Trigger |
|----------|---------|---------|
| Header (desktop) | `<a href="tel:...">` | `onClick` |
| Header (mobile) | `<a href="tel:...">` | `onClick` |
| Footer | `<a href="tel:...">` | `onClick` |
| FloatingCTA | Phone button `<a>` | `onClick` |

Implementation: Add `onClick={() => trackEvent('phone_click')}` to each phone link. Since Header/Footer/FloatingCTA are already client components (or can add `'use client'` if needed), this is a direct onClick handler.

### `zalo_click`

| Location | Element | Trigger |
|----------|---------|---------|
| FloatingCTA | Zalo button `<a>` | `onClick` |

Implementation: Add `onClick={() => trackEvent('zalo_click')}` to the Zalo link.

### `form_submit`

| Location | Trigger | Payload |
|----------|---------|---------|
| QuoteForm (homepage + /lien-he) | After successful `POST /api/contact` | All form fields |

Payload:
```ts
trackEvent('form_submit', {
  name: data.name,
  phone: data.phone,
  house_type: data.houseType,
  province: data.province,
  area: data.area || '',
  note: data.note || '',
})
```

**PII note:** `name` and `phone` are sent to GA4 per business owner request. Be aware of data deletion obligations under Vietnamese privacy regulations.

**GA4 limit:** Parameter values are truncated at 40 characters by Google. Long `note` values will be cut off.

### `project_view`

| Location | Trigger | Payload |
|----------|---------|---------|
| `/cong-trinh/[slug]` | Page mount | `{ slug }` |

Implementation: The project detail page is a Server Component. Add a small `TrackProjectView` client component defined in `src/components/analytics/TrackProjectView.tsx`. It receives `slug` as a prop and fires `trackEvent('project_view', { slug })` in a `useEffect` on mount. Renders nothing (`return null`). Placed inside the page's JSX.

---

## Environment & Dev Behavior

- **Production:** GA4 loads and tracks when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- **Development:** The env var is present in `.env.local` but `NODE_ENV=development` — the component still renders. To fully skip in dev, add a `process.env.NODE_ENV !== 'production'` guard in the `GoogleAnalytics` component so no scripts load during development
- **Missing env var:** If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is empty/unset, `GoogleAnalytics` returns `null`, all `trackEvent`/`pageview` calls are no-ops. Site functions normally.
- **Blocked by ad blocker:** `window.gtag` will be undefined. All helper functions guard on its existence. No errors thrown. Site functions normally.

---

## Test Coverage Mapping

| Test Case | What Validates It |
|-----------|-------------------|
| TC-11-01 | `GoogleAnalytics` renders `<script>` with gtag.js URL |
| TC-11-02 | gtag config call fires page_view on initial load |
| TC-11-03 | `usePathname` listener fires `pageview()` on navigation |
| TC-11-04 | `onClick` on Header phone link calls `trackEvent('phone_click')` |
| TC-11-05 | `onClick` on FloatingCTA Zalo link calls `trackEvent('zalo_click')` |
| TC-11-06 | `TrackProjectView` fires `trackEvent('project_view', { slug })` on mount |
| TC-11-07 | QuoteForm `onSubmit` fires `trackEvent('form_submit', {...})` on /lien-he |
| TC-11-08 | Same QuoteForm component on homepage — same tracking code |
| TC-11-09 | `NODE_ENV !== 'production'` guard in GoogleAnalytics — no scripts in dev |
| TC-11-10 | `onClick` on Footer phone link calls `trackEvent('phone_click')` |
| TC-11-11 | `onClick` on FloatingCTA phone button calls `trackEvent('phone_click')` |
| TC-11-12 | `usePathname` fires for each navigation — multiple distinct events |
| TC-11-13 | `GA_MEASUREMENT_ID` falsy → component returns null, helpers are no-ops |
| TC-11-14 | `window.gtag` guard in helpers → ad blocker causes silent no-op |

---

## Out of Scope

- Google Tag Manager (GTM) — not needed for this scope
- Server-side analytics or Measurement Protocol
- Consent banner / cookie consent — not requested
- GA4 dashboard configuration — business owner handles this in GA4 UI
