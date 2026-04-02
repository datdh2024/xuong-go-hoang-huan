# US-32 — Live House Templates Section on Homepage

**Status:** pending
**Category:** Core
**Task ID:** #32
**Priority:** Medium
**Risk:** Low

---

## User Story

As a **content manager**, I want the house templates section on the homepage to display the templates I have marked as "featured" in Sanity CMS so that I can showcase current design offerings without a code deploy.

---

## Background

`HouseTemplates.tsx` currently reads from `HOUSE_TEMPLATES` in `src/lib/data.ts`. The `featuredTemplatesQuery` GROQ query is already written and returns `_id, name, description, specs { area, bays, columns }, thumbnail { asset->{url, metadata} }` for templates where `featured == true`.

---

## Acceptance Criteria

- [ ] House templates section fetches templates from Sanity using `featuredTemplatesQuery`
- [ ] Template thumbnail images use the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] If Sanity is not configured, falls back to `HOUSE_TEMPLATES` from `src/lib/data.ts`
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/components/sections/HouseTemplates.tsx`
- `src/app/(site)/page.tsx` (pass fetched templates as props)
