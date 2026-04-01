# US-10 — Implement loading skeleton UI (Suspense boundaries)

**Status:** pending
**Category:** UX
**Task ID:** #10

---

## User Story

As a **visitor on a slow mobile connection**, I want to see skeleton loading placeholders while content is being fetched from Sanity CMS so that the page feels responsive and I know something is loading rather than seeing a blank screen.

---

## Background

Once Sanity CMS is connected (US-01), server-fetched sections will benefit from Suspense-based loading states. Currently there are no loading skeletons or Suspense boundaries. Next.js App Router supports `loading.tsx` per route and `<Suspense>` wrappers around async components.

---

## Acceptance Criteria

- [ ] `src/app/(site)/loading.tsx` is created with a full-page skeleton
- [ ] `src/app/(site)/cong-trinh/loading.tsx` is created with a grid of project card skeletons
- [ ] `src/app/(site)/tin-tuc/loading.tsx` has article card skeletons (if blog is implemented)
- [ ] Skeleton components use animated pulse effect (Tailwind `animate-pulse`)
- [ ] Skeletons mirror the layout of the actual content (same grid, same card dimensions)
- [ ] Hero sections show a full-width skeleton banner
- [ ] No layout shift when real content loads (skeletons match content dimensions)

---

## Files to Create

- `src/app/(site)/loading.tsx`
- `src/app/(site)/cong-trinh/loading.tsx`
- `src/app/(site)/tin-tuc/loading.tsx`
- Optionally `src/components/ui/Skeleton.tsx` for reusable skeleton primitives

---

## Dependencies

- US-01 (Connect Sanity CMS) should be completed first so there is async data fetching to wrap
