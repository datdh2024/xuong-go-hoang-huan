# US-35 — Live Project Detail Pages

**Status:** pending
**Category:** Core
**Task ID:** #35
**Priority:** High
**Risk:** High

---

## User Story

As a **content manager**, I want each project's detail page to display its full content (title, description, image gallery, specs, location) from Sanity CMS so that I can publish and update project pages without a code deploy.

---

## Background

`src/app/(site)/cong-trinh/[slug]/page.tsx` currently renders hardcoded or placeholder content. The `projectBySlugQuery` GROQ query is already written and returns `_id, title, slug, location, completedYear, description, category->{ name }, thumbnail, images[]`. Dynamic routes need `generateStaticParams` for SSG and `notFound()` for unknown slugs.

---

## Acceptance Criteria

- [ ] Project detail page fetches data from Sanity using `projectBySlugQuery` with the `slug` route param
- [ ] `generateStaticParams` fetches all project slugs from Sanity at build time so pages are statically generated
- [ ] Page calls `notFound()` when Sanity returns null for the given slug
- [ ] All project images (thumbnail + gallery) use the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] ISR is set to `revalidate: 3600` so edits in Sanity propagate within 1 hour
- [ ] If Sanity is not configured, the page renders a graceful fallback (e.g., "content coming soon") rather than crashing

---

## Files to Touch

- `src/app/(site)/cong-trinh/[slug]/page.tsx`
