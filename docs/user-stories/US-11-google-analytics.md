# US-11 — Add Google Analytics 4 (GA4) integration

**Status:** pending
**Category:** Infrastructure
**Task ID:** #11

---

## User Story

As a **business owner**, I want to track visitor behavior (page views, most viewed projects, form submission conversions) in Google Analytics 4 so that I can understand what content resonates with customers and measure the ROI of my website.

---

## Background

There is no analytics tracking implemented. For a business website, key events to track are: page views, quote form submissions, phone number clicks, and project detail views.

---

## Acceptance Criteria

- [ ] GA4 measurement ID is stored in environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] GA4 script is loaded via Next.js `Script` component with `strategy="afterInteractive"` in root `layout.tsx`
- [ ] Page view events fire automatically on route changes (Next.js App Router navigation)
- [ ] Custom events are tracked:
  - `form_submit` when quote form is successfully submitted
  - `phone_click` when the phone number CTA is clicked (header, floating button, contact page)
  - `zalo_click` when the Zalo floating button is clicked
  - `project_view` when a project detail page is opened (with project title as parameter)
- [ ] Analytics is skipped in development (`process.env.NODE_ENV !== 'production'`)

---

## Files to Create/Touch

- Create `src/components/analytics/GoogleAnalytics.tsx`
- `src/app/layout.tsx` — add `<GoogleAnalytics />`
- `src/components/layout/FloatingCTA.tsx` — add click tracking
- `src/components/sections/QuoteForm.tsx` — add conversion tracking
- `.env.local.example` — document environment variable
