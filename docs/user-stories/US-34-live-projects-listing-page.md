# US-34 — Live Projects Listing Page

**Status:** pending
**Category:** Core
**Task ID:** #34
**Priority:** High
**Risk:** Medium

---

## User Story

As a **content manager**, I want the projects listing page (`/cong-trinh`) to show all projects and categories from Sanity CMS so that newly added projects appear on the site without a code deploy.

---

## Background

`src/app/(site)/cong-trinh/page.tsx` currently renders hardcoded project cards and category buttons. The `allProjectsQuery` and `projectCategoriesQuery` GROQ queries are already written. Note: US-02 adds client-side category filtering on top of this story — US-34 only concerns wiring the data source.

---

## Acceptance Criteria

- [ ] Projects listing page fetches all projects from Sanity using `allProjectsQuery`
- [ ] Category filter buttons are populated from Sanity using `projectCategoriesQuery`
- [ ] Project thumbnail images use the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] Project cards link to `/cong-trinh/[slug]` using `slug.current` from Sanity
- [ ] If Sanity is not configured, falls back to `FEATURED_PROJECTS` from `src/lib/data.ts` with a static category list
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/app/(site)/cong-trinh/page.tsx`
