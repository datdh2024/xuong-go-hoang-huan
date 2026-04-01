# US-02 — Implement functional category filter on Projects page

**Status:** pending
**Category:** Core
**Task ID:** #2

---

## User Story

As a **visitor**, I want to filter the projects gallery by category (e.g., "Nhà gỗ 3 gian", "Nhà thờ họ") so that I can quickly find examples of the type of construction I am interested in.

---

## Background

`src/app/(site)/cong-trinh/page.tsx` already renders category filter buttons, but they are static UI with no functionality — a comment in the code says "client interaction can be added later". The CATEGORIES array is hardcoded; categories should come from Sanity `projectCategoriesQuery`.

---

## Acceptance Criteria

- [ ] Filter buttons are interactive and clicking one filters the visible project cards
- [ ] "Tất cả" button shows all projects (default state)
- [ ] Active category button has the highlighted style (currently only "Tất cả" is styled as active)
- [ ] Filter state is managed client-side (no page reload needed)
- [ ] Categories are dynamically loaded from Sanity, not hardcoded
- [ ] URL search param (`?category=nha-go-3-gian`) is updated so filtered state is shareable and bookmarkable
- [ ] Page shows count of results per category

---

## Implementation Notes

- Convert projects page to a client component or use a client `ProjectFilter` wrapper component
- Pass all projects + categories as props from the server component, filter client-side

---

## Files to Touch

- `src/app/(site)/cong-trinh/page.tsx`
- Possibly create `src/components/sections/ProjectFilter.tsx`
