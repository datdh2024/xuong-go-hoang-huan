# US-05 — Add SEO sitemap, robots.txt, and OpenGraph meta tags

**Status:** pending
**Category:** Infrastructure
**Task ID:** #5

---

## User Story

As a **business owner**, I want my website to rank well on Google and look great when shared on social media (Facebook, Zalo) so that more potential customers can discover and trust the workshop.

---

## Background

There is no `sitemap.xml`, no `robots.txt`, and no OpenGraph/Twitter card meta tags. Some pages define `metadata` objects but they lack og:image, og:type, og:locale, and Twitter card fields. The site is a Vietnamese-language site targeting Vietnamese customers.

---

## Acceptance Criteria

- [ ] `src/app/sitemap.ts` is created, generating sitemap entries for: `/`, `/gioi-thieu`, `/cong-trinh`, `/mau-nha`, `/lien-he`, and all dynamic `/cong-trinh/[slug]` URLs fetched from Sanity
- [ ] `src/app/robots.ts` is created allowing crawlers and pointing to the sitemap
- [ ] Root `layout.tsx` includes base OpenGraph metadata: `og:site_name`, `og:locale` (vi_VN), `og:type`, default `og:image` (workshop photo)
- [ ] Each page overrides with page-specific `og:title`, `og:description`, `og:image`
- [ ] Structured data (JSON-LD) is added as a `LocalBusiness` schema in the root layout using `SITE_SETTINGS` (company name, address, phone, geo coordinates)
- [ ] `<link rel="canonical">` is set per page
- [ ] `next/head` viewport and theme-color meta tags are configured

---

## Files to Create/Touch

- Create `src/app/sitemap.ts`
- Create `src/app/robots.ts`
- `src/app/layout.tsx` — extend metadata export
- `src/app/(site)/gioi-thieu/page.tsx` — add og:image
- `src/app/(site)/cong-trinh/page.tsx` — add og:image
- `src/app/(site)/lien-he/page.tsx` — add og:image
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — og:image from project thumbnail
