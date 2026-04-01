# US-08 — Create Blog/News section (tin tức & kiến thức gỗ)

**Status:** pending
**Category:** New Page
**Task ID:** #8

---

## User Story

As a **business owner**, I want a blog section where we can publish woodworking tips, project stories, and company news so that we can attract organic traffic from Google and position the workshop as an expert in traditional Vietnamese architecture.

---

## Background

There is no blog feature. A content-driven blog is essential for SEO long-tail keywords (e.g., "chi phí làm nhà gỗ 3 gian", "gỗ lim hay gỗ mít tốt hơn"). Sanity CMS makes this straightforward to add.

---

## Acceptance Criteria

- [ ] New Sanity schema `post` with fields: `title`, `slug`, `publishedAt` (datetime), `coverImage` (image), `excerpt` (text), `body` (array of blocks — rich text), `category` (string: "Kiến thức gỗ" | "Dự án" | "Tin tức"), `featured` (boolean)
- [ ] Schema registered in `src/sanity/schemas/index.ts`
- [ ] GROQ queries added: `allPostsQuery`, `featuredPostsQuery`, `postBySlugQuery`
- [ ] Blog listing page at `/tin-tuc` with article cards (cover image, title, excerpt, date, category badge)
- [ ] Blog detail page at `/tin-tuc/[slug]` with full rich-text rendering using `@portabletext/react`
- [ ] Featured posts preview section on homepage (3 latest posts) added after `QuoteForm`
- [ ] Navigation link "Tin tức" added to `Header` and `Footer`
- [ ] All blog pages have proper SEO metadata
- [ ] Reading time estimate displayed on article pages

---

## Files to Create/Touch

- Create `src/sanity/schemas/post.ts`
- `src/sanity/schemas/index.ts`
- `src/sanity/lib/queries.ts`
- Create `src/app/(site)/tin-tuc/page.tsx`
- Create `src/app/(site)/tin-tuc/[slug]/page.tsx`
- Create `src/components/sections/LatestPosts.tsx`
- `src/app/(site)/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
