# US-28 — Live Company Info in Header and Footer

**Status:** done
**Category:** Core
**Task ID:** #28
**Priority:** High
**Risk:** Medium

---

## User Story

As a **content manager**, I want the company name, logo, phone number, address, and social links in the header and footer to be managed in Sanity CMS so that I can update contact details without touching the codebase.

---

## Background

`Header.tsx` and `Footer.tsx` currently read from `SITE_SETTINGS` in `src/lib/data.ts` (hardcoded). The `siteSettingsQuery` GROQ query is already written in `src/sanity/lib/queries.ts` and returns `companyName, tagline, phone, zaloNumber, email, address, workingHours, facebookUrl, youtubeUrl`.

---

## Acceptance Criteria

- [x] Header displays company name, phone, and navigation links fetched from Sanity `siteSettings` document
- [x] Footer displays address, phone, email, working hours, and social links (Facebook, YouTube) fetched from Sanity
- [x] If Sanity is not configured (missing `NEXT_PUBLIC_SANITY_PROJECT_ID`), falls back to `SITE_SETTINGS` from `src/lib/data.ts`
- [x] Data is fetched server-side with ISR (`revalidate: 3600`) so updates in Sanity appear within 1 hour
- [x] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/(site)/layout.tsx` (fetch once, pass as props to Header and Footer)
