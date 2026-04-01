# UF-02 — 404 Not Found Page

**Discovered:** 2026-04-01
**Related User Stories:** US-09, US-23, US-24

---

## Current Behavior

Visiting any non-existent URL (e.g., `/non-existent-page`) shows the **default Next.js 404 page**:

- Plain white background, no branding
- Text: `404 | This page could not be found.`
- No Header, no Footer, no navigation links
- No site color tokens, no fonts, no logo

The current `not-found.tsx` **does not exist** — Next.js falls back to its built-in handler.

---

## Site Design Reference (for 404 implementation)

### Color Tokens

| Token | Usage |
|-------|-------|
| `wood-800/900` | Header/Footer background (deep warm brown) |
| `wood-50` | Page body background (off-white/cream) |
| `gold-400/500` | CTA buttons, accents |
| White | Text on dark backgrounds |
| Dark brown | Text on light backgrounds |

### Typography

- **Display/headings:** Cormorant Garamond (serif) — used for hero text
- **Body/nav:** sans-serif

### Site Shell (from `(site)/layout.tsx`)

All public pages wrap their content inside:

```
<Header />
<main>{children}</main>
<Footer />
<FloatingCTA />
```

The `not-found.tsx` placed inside `src/app/(site)/` will inherit this shell automatically.

### Header Structure

- Fixed sticky, `wood-800/900` background
- Left: Logo "Xưởng Gỗ Hoàng Huân" + tagline
- Center: Nav — Trang chủ · Giới thiệu · Công trình · Liên hệ
- Right: Gold phone CTA button "0985 241 204"

### Footer Structure

- Dark brown background
- Left: Logo + tagline + social icons
- Center: Contact info (address, phone, email, hours)
- Right: Navigation links

---

## What Needs to Be Built (Gap Analysis for US-09)

| Feature | Status |
|---------|--------|
| `src/app/(site)/not-found.tsx` | ❌ Not created |
| Header + Footer on 404 page | ❌ Missing (no custom page) |
| Vietnamese 404 message | ❌ Missing |
| Site fonts + color tokens applied | ❌ Missing |
| Navigation links back to key pages | ❌ Missing |
| Contact CTA (phone / `/lien-he`) | ❌ Missing |

---

## Expected User Flow (after implementation)

1. Visitor types an invalid URL
2. Next.js serves `not-found.tsx` → page renders with full site Header + Footer
3. Visitor sees branded 404 message in Vietnamese
4. Visitor clicks a nav link (Trang chủ / Công trình / Liên hệ) → goes back to site
5. Or visitor clicks the contact CTA → goes to `/lien-he` or opens phone dialer

---

## File to Create

- `src/app/(site)/not-found.tsx`
