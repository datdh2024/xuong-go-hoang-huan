# US-31 — Live Featured Projects on Homepage

**Status:** pending
**Category:** Core
**Task ID:** #31
**Priority:** High
**Risk:** Low

---

## User Story

As a **content manager**, I want the featured projects grid on the homepage to show the projects I have marked as "featured" in Sanity CMS so that I can highlight recent or notable work without a code deploy.

---

## Background

`ProjectsGrid.tsx` on the homepage currently reads from `FEATURED_PROJECTS` in `src/lib/data.ts`. The `featuredProjectsQuery` GROQ query is already written and returns `_id, title, slug, location, completedYear, description, category->{ name }, thumbnail { asset->{url, metadata} }` for projects where `featured == true`.

---

## Acceptance Criteria

- [ ] Homepage projects grid fetches projects from Sanity using `featuredProjectsQuery`
- [ ] Project thumbnail images use the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] Project cards link to `/cong-trinh/[slug]` using the Sanity `slug.current` value
- [ ] If Sanity is not configured, falls back to `FEATURED_PROJECTS` from `src/lib/data.ts`
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/components/sections/ProjectsGrid.tsx`
- `src/app/(site)/page.tsx` (pass fetched featured projects as props)
