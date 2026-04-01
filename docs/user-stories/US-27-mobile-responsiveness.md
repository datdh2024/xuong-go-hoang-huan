# US-27 — Mobile responsiveness audit and fixes

**Status:** done
**Category:** UX
**Priority:** High
**Risk:** Medium

---

## User Story

As a **visitor browsing on a smartphone**, I want all pages to display correctly and be easy to use on a small screen, so I can browse projects and submit a quote request from my phone.

---

## Background

The site has not been systematically audited on mobile viewports. Key sections to verify and fix:
- **Header** — nav links may overflow on small screens; needs a hamburger/mobile menu
- **HeroSlider** — headline text may be too large or overlap on 375px screens
- **ProjectsGrid** — 3-column grid should collapse to 1–2 columns on mobile
- **Project detail** — 2-column layout (content + sidebar) should stack on mobile
- **QuoteForm** — side-by-side fields should stack vertically on mobile
- **HouseTemplates** — card grid layout on small screens
- **Footer** — multi-column footer should collapse cleanly

---

## Acceptance Criteria

- [x] All pages render without horizontal scroll on 375px (iPhone SE) viewport
- [x] Header has a functional mobile nav menu (hamburger or drawer) on screens < 768px
- [x] HeroSlider text and CTAs are readable and tappable on 375px
- [x] ProjectsGrid collapses to 1 column on mobile, 2 columns on tablet
- [x] Project detail sidebar stacks below content on mobile
- [x] QuoteForm fields stack to full-width on mobile
- [x] Footer columns stack vertically on mobile
- [x] All tap targets are at least 44×44px (Apple/Google guidelines)

---

## Files to Touch

- `src/components/layout/Header.tsx` — mobile nav menu
- `src/components/sections/HeroSlider.tsx` — responsive text sizes
- `src/components/sections/ProjectsGrid.tsx` — responsive grid columns
- `src/components/sections/HouseTemplates.tsx` — responsive card layout
- `src/components/sections/QuoteForm.tsx` — responsive form fields
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — responsive 2-col layout
- `src/components/layout/Footer.tsx` — responsive footer columns
