# US-30 — Live Highlights Section on Homepage

**Status:** pending
**Category:** Core
**Task ID:** #30
**Priority:** Medium
**Risk:** Low

---

## User Story

As a **content manager**, I want to manage the highlights/features block on the homepage (icons, titles, descriptions) in Sanity CMS so that I can update our key selling points without a code deploy.

---

## Background

`Highlights.tsx` currently reads from the hardcoded `HIGHLIGHTS` array in `src/lib/data.ts`. The `highlightsQuery` GROQ query is already written and returns `_id, icon, title, description, order`.

---

## Acceptance Criteria

- [ ] Highlights section fetches items from Sanity using `highlightsQuery`
- [ ] Items are ordered by the `order` field set in Sanity
- [ ] If Sanity is not configured, falls back to `HIGHLIGHTS` from `src/lib/data.ts`
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/components/sections/Highlights.tsx`
- `src/app/(site)/page.tsx` (pass fetched highlights as props)
