# US-33 — Live About Page

**Status:** pending
**Category:** Core
**Task ID:** #33
**Priority:** Medium
**Risk:** Low

---

## User Story

As a **content manager**, I want to manage the About page content (company story, team description, key stats, hero image) in Sanity CMS so that I can keep the page up to date without a code deploy.

---

## Background

`src/app/(site)/gioi-thieu/page.tsx` currently renders hardcoded content inline. The `aboutPageQuery` GROQ query is already written and returns `story, teamDescription, highlights[] { number, label }, heroImage { asset->{url, metadata} }`.

---

## Acceptance Criteria

- [ ] About page fetches content from Sanity using `aboutPageQuery`
- [ ] Hero image uses the `@sanity/image-url` builder from `src/sanity/lib/image.ts`
- [ ] Key stats (number + label pairs) are rendered dynamically from the `highlights` array
- [ ] If Sanity is not configured or returns null, the page falls back to hardcoded content
- [ ] Data is fetched server-side with ISR (`revalidate: 3600`)
- [ ] No visual change to the existing UI — only the data source changes

---

## Files to Touch

- `src/app/(site)/gioi-thieu/page.tsx`
