# US-01: Connect Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all pages and components to fetch live data from Sanity CMS, replacing hardcoded `src/lib/data.ts` imports, while keeping `data.ts` as a fallback when Sanity is not configured.

**Architecture:** A `fetchSanity<T>()` helper wraps `client.fetch()` and returns `null` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set. Page-level Server Components call this helper and pass data as props to child components. Client Components (HeroSlider, Header) continue to receive data via props — they never fetch directly.

**Tech Stack:** Next.js App Router Server Components, `next-sanity` client, GROQ queries (already written in `src/sanity/lib/queries.ts`), Vitest + React Testing Library, Playwright.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/sanity/lib/types.ts` | TypeScript interfaces matching GROQ query shapes |
| Create | `src/sanity/lib/fetch.ts` | `fetchSanity<T>()` helper with null-fallback |
| Create | `src/__tests__/sanity/fetch.test.ts` | Unit tests for `fetchSanity` |
| Modify | `src/components/layout/Header.tsx` | Accept `siteSettings` prop |
| Modify | `src/components/layout/Footer.tsx` | Accept `siteSettings` prop |
| Create | `src/__tests__/components/Header.test.tsx` | Component test: renders with Sanity data and fallback |
| Create | `src/__tests__/components/Footer.test.tsx` | Component test: renders with Sanity data and fallback |
| Modify | `src/app/(site)/layout.tsx` | Fetch siteSettings, pass to Header + Footer |
| Modify | `src/components/sections/HeroSlider.tsx` | Accept `slides` prop |
| Modify | `src/components/sections/Highlights.tsx` | Accept `highlights` prop |
| Modify | `src/components/sections/ProjectsGrid.tsx` | Accept `projects` prop |
| Modify | `src/components/sections/HouseTemplates.tsx` | Accept `templates` prop |
| Create | `src/__tests__/components/HeroSlider.test.tsx` | Component test: Sanity data + fallback |
| Create | `src/__tests__/components/Highlights.test.tsx` | Component test: Sanity data + fallback |
| Create | `src/__tests__/components/ProjectsGrid.test.tsx` | Component test: Sanity data + fallback |
| Create | `src/__tests__/components/HouseTemplates.test.tsx` | Component test: Sanity data + fallback |
| Modify | `src/app/(site)/page.tsx` | Fetch homepage data, pass to sections |
| Modify | `src/app/(site)/gioi-thieu/page.tsx` | Fetch aboutPageQuery |
| Modify | `src/app/(site)/cong-trinh/page.tsx` | Fetch allProjectsQuery + projectCategoriesQuery |
| Modify | `src/app/(site)/cong-trinh/[slug]/page.tsx` | Fetch projectBySlugQuery |
| Create | `tests/e2e/homepage.spec.ts` | E2E smoke: homepage loads with content |

---

## Task 1: Define Sanity types

**Files:**
- Create: `src/sanity/lib/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/sanity/lib/types.ts

export interface SanityImageAsset {
  url: string;
  metadata?: { lqip?: string };
}

export interface SanityImage {
  asset: SanityImageAsset;
}

export interface SanitySiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  zaloNumber: string;
  email: string;
  address: string;
  workingHours: string;
  facebookUrl: string;
  youtubeUrl: string;
}

export interface SanityHeroSlide {
  _id: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
  image: SanityImage;
}

export interface SanityHighlight {
  _id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  completedYear: number;
  description: string;
  category: { name: string; slug?: { current: string } };
  thumbnail: SanityImage;
  images?: SanityImage[];
}

export interface SanityProjectCategory {
  _id: string;
  name: string;
  slug: { current: string };
}

export interface SanityTemplate {
  _id: string;
  name: string;
  description: string;
  specs: { area?: string; bays?: number; columns?: number };
  thumbnail: SanityImage;
}

export interface SanityAboutPage {
  story: string;
  teamDescription: string;
  highlights: Array<{ number: string; label: string }>;
  heroImage: SanityImage;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/lib/types.ts
git commit -m "feat: add Sanity TypeScript types for all document shapes"
```

---

## Task 2: Create `fetchSanity` helper (TDD)

**Files:**
- Create: `src/sanity/lib/fetch.ts`
- Create: `src/__tests__/sanity/fetch.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/sanity/fetch.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We mock the client module before importing fetchSanity
const mockFetch = vi.fn()
vi.mock('@/sanity/lib/client', () => ({
  client: { fetch: mockFetch },
}))

// Import AFTER mock is set up
const { fetchSanity } = await import('@/sanity/lib/fetch')

describe('fetchSanity', () => {
  const originalProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = originalProjectId
  })

  it('returns null when NEXT_PUBLIC_SANITY_PROJECT_ID is not set', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const result = await fetchSanity('*[_type == "test"]')
    expect(result).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls client.fetch with query, params, and revalidate when project ID is set', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
    mockFetch.mockResolvedValueOnce([{ _id: '1', title: 'Test' }])

    const result = await fetchSanity('*[_type == "test"]', { slug: 'foo' })

    expect(mockFetch).toHaveBeenCalledWith(
      '*[_type == "test"]',
      { slug: 'foo' },
      { next: { revalidate: 3600 } }
    )
    expect(result).toEqual([{ _id: '1', title: 'Test' }])
  })

  it('calls client.fetch with empty params object when no params given', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
    mockFetch.mockResolvedValueOnce(null)

    await fetchSanity('*[_type == "test"][0]')

    expect(mockFetch).toHaveBeenCalledWith(
      '*[_type == "test"][0]',
      {},
      { next: { revalidate: 3600 } }
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/sanity/fetch.test.ts
```

Expected: FAIL with "Cannot find module '@/sanity/lib/fetch'"

- [ ] **Step 3: Create the helper**

```typescript
// src/sanity/lib/fetch.ts
import { client } from './client'

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return null
  }
  return client.fetch<T>(query, params, { next: { revalidate: 3600 } })
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/sanity/fetch.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/sanity/lib/fetch.ts src/__tests__/sanity/fetch.test.ts
git commit -m "feat: add fetchSanity helper with null fallback when Sanity not configured"
```

---

## Task 3: Update Header to accept siteSettings prop (TDD)

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Create: `src/__tests__/components/Header.test.tsx`

The Header is a `"use client"` component. It currently reads `SITE_SETTINGS` from `data.ts`. We change it to accept an optional `siteSettings` prop and fall back to `SITE_SETTINGS` when the prop is null.

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '@/components/layout/Header'
import type { SanitySiteSettings } from '@/sanity/lib/types'

const sanitySettings: SanitySiteSettings = {
  companyName: 'Test Company CMS',
  tagline: 'CMS Tagline',
  phone: '0900 000 000',
  zaloNumber: '0900000000',
  email: 'test@cms.com',
  address: 'CMS Address',
  workingHours: '9-17',
  facebookUrl: 'https://facebook.com/test',
  youtubeUrl: 'https://youtube.com/test',
}

describe('Header', () => {
  it('renders company name from Sanity siteSettings prop', () => {
    render(<Header siteSettings={sanitySettings} />)
    expect(screen.getByText('Test Company CMS')).toBeInTheDocument()
  })

  it('falls back to static data when siteSettings prop is null', () => {
    render(<Header siteSettings={null} />)
    // SITE_SETTINGS.companyName from data.ts
    expect(screen.getByText('Xưởng Gỗ Hoàng Huân')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/Header.test.tsx
```

Expected: FAIL — Header does not accept `siteSettings` prop yet

- [ ] **Step 3: Update Header to accept the prop**

Replace `src/components/layout/Header.tsx` with:

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";
import type { SanitySiteSettings } from "@/sanity/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/cong-trinh", label: "Công trình" },
  { href: "/lien-he", label: "Liên hệ" },
];

interface HeaderProps {
  siteSettings: SanitySiteSettings | null;
}

export default function Header({ siteSettings }: HeaderProps) {
  const settings = siteSettings ?? SITE_SETTINGS;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-wood-600 shadow-lg py-2"
          : "bg-wood-600/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-cormorant text-2xl font-bold text-gold-500 tracking-wide">
            {settings.companyName}
          </span>
          <span className="text-wood-200 text-xs tracking-widest uppercase">
            {settings.tagline}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-gold-500 ${
                pathname === link.href ? "text-gold-500" : "text-wood-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone CTA */}
        <a
          href={`tel:${settings.phone.replace(/\s/g, "")}`}
          className="hidden md:flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold text-sm px-4 py-2 rounded transition-colors"
        >
          <Phone size={16} />
          {settings.phone}
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-wood-100 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-wood-700 border-t border-wood-500">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                  pathname === link.href ? "text-gold-500" : "text-wood-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 bg-gold-500 text-wood-800 font-semibold text-sm px-4 py-2 rounded w-fit"
            >
              <Phone size={16} />
              {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/Header.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/__tests__/components/Header.test.tsx
git commit -m "feat: Header accepts siteSettings prop with data.ts fallback"
```

---

## Task 4: Update Footer to accept siteSettings prop (TDD)

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Create: `src/__tests__/components/Footer.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '@/components/layout/Footer'
import type { SanitySiteSettings } from '@/sanity/lib/types'

const sanitySettings: SanitySiteSettings = {
  companyName: 'Test Company CMS',
  tagline: 'CMS Tagline',
  phone: '0900 000 000',
  zaloNumber: '0900000000',
  email: 'cms@example.com',
  address: '123 CMS Street',
  workingHours: '9-17',
  facebookUrl: 'https://facebook.com/cms',
  youtubeUrl: 'https://youtube.com/cms',
}

describe('Footer', () => {
  it('renders company name from Sanity siteSettings prop', () => {
    render(<Footer siteSettings={sanitySettings} />)
    expect(screen.getAllByText('Test Company CMS').length).toBeGreaterThan(0)
  })

  it('renders email from Sanity siteSettings prop', () => {
    render(<Footer siteSettings={sanitySettings} />)
    expect(screen.getByText('cms@example.com')).toBeInTheDocument()
  })

  it('falls back to static data when siteSettings prop is null', () => {
    render(<Footer siteSettings={null} />)
    expect(screen.getAllByText('Xưởng Gỗ Hoàng Huân').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/Footer.test.tsx
```

Expected: FAIL — Footer does not accept `siteSettings` prop yet

- [ ] **Step 3: Update Footer to accept the prop**

Replace `src/components/layout/Footer.tsx` with:

```typescript
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Youtube } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/data";
import type { SanitySiteSettings } from "@/sanity/lib/types";

interface FooterProps {
  siteSettings: SanitySiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const settings = siteSettings ?? SITE_SETTINGS;

  return (
    <footer className="bg-wood-700 text-wood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-gold-500 mb-2">
              {settings.companyName}
            </h3>
            <p className="text-sm text-wood-300 italic mb-4">
              {"taglineSub" in settings
                ? (settings as typeof SITE_SETTINGS).taglineSub
                : settings.tagline}
            </p>
            <div className="flex gap-3">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <Facebook size={18} />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"
                className="p-2 bg-wood-600 hover:bg-gold-500 hover:text-wood-800 rounded transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-wood-100 font-semibold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold-500 transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-500 transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-gold-500 shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-wood-100 font-semibold mb-4 uppercase text-sm tracking-wider">Điều hướng</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/gioi-thieu", label: "Giới thiệu" },
                { href: "/cong-trinh", label: "Công trình" },
                { href: "/lien-he", label: "Liên hệ & Báo giá" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-wood-600 py-4 text-center text-xs text-wood-400">
        © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/Footer.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/__tests__/components/Footer.test.tsx
git commit -m "feat: Footer accepts siteSettings prop with data.ts fallback"
```

---

## Task 5: Update site layout to fetch siteSettings

**Files:**
- Modify: `src/app/(site)/layout.tsx`

No unit test needed here — this is a Next.js layout (async Server Component wiring). The E2E test at the end will cover it.

- [ ] **Step 1: Update the layout**

Replace `src/app/(site)/layout.tsx` with:

```typescript
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { fetchSanity } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SanitySiteSettings } from "@/sanity/lib/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await fetchSanity<SanitySiteSettings>(siteSettingsQuery);

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main>{children}</main>
      <Footer siteSettings={siteSettings} />
      <FloatingCTA />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(site)/layout.tsx
git commit -m "feat: site layout fetches siteSettings from Sanity"
```

---

## Task 6: Update HeroSlider to accept slides prop (TDD)

**Files:**
- Modify: `src/components/sections/HeroSlider.tsx`
- Create: `src/__tests__/components/HeroSlider.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/HeroSlider.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HeroSlider from '@/components/sections/HeroSlider'
import type { SanityHeroSlide } from '@/sanity/lib/types'

const sanitySlides: SanityHeroSlide[] = [
  {
    _id: 'slide-1',
    headline: 'CMS Headline One',
    subheadline: 'CMS subheadline',
    ctaLabel: 'Click CMS',
    ctaLink: '/cms-link',
    order: 1,
    image: { asset: { url: 'https://example.com/img.jpg' } },
  },
]

describe('HeroSlider', () => {
  it('renders headline from Sanity slides prop', () => {
    render(<HeroSlider slides={sanitySlides} />)
    expect(screen.getByText('CMS Headline One')).toBeInTheDocument()
  })

  it('falls back to static HERO_SLIDES when slides prop is null', () => {
    render(<HeroSlider slides={null} />)
    // First static slide headline
    expect(screen.getByText('Giữ Hồn Kiến Trúc Việt')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/HeroSlider.test.tsx
```

Expected: FAIL — HeroSlider does not accept `slides` prop yet

- [ ] **Step 3: Update HeroSlider to accept the prop**

Replace `src/components/sections/HeroSlider.tsx` with:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/data";
import type { SanityHeroSlide } from "@/sanity/lib/types";

interface HeroSliderProps {
  slides: SanityHeroSlide[] | null;
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const items = slides ?? HERO_SLIDES.map((s, i) => ({
    _id: s.id,
    headline: s.headline,
    subheadline: s.subheadline,
    ctaLabel: s.ctaLabel,
    ctaLink: s.ctaLink,
    order: i,
    image: { asset: { url: s.image } },
  }));

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {items.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={slide.image.asset.url}
            alt={slide.headline}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            {items.map((slide, i) => (
              <div
                key={slide._id}
                className={`transition-all duration-700 ${
                  i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"
                }`}
              >
                {i === current && (
                  <>
                    <h1 className="font-cormorant text-5xl md:text-7xl font-bold text-white italic leading-tight mb-4">
                      {slide.headline}
                    </h1>
                    <p className="text-wood-200 text-lg md:text-xl mb-8 leading-relaxed">
                      {slide.subheadline}
                    </p>
                    <Link
                      href={slide.ctaLink}
                      className="inline-block bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold px-8 py-3 rounded transition-colors text-sm tracking-wide uppercase"
                    >
                      {slide.ctaLabel}
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors">
        <ChevronLeft size={28} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors">
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-gold-500" : "w-4 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/HeroSlider.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSlider.tsx src/__tests__/components/HeroSlider.test.tsx
git commit -m "feat: HeroSlider accepts slides prop with data.ts fallback"
```

---

## Task 7: Update Highlights to accept highlights prop (TDD)

**Files:**
- Modify: `src/components/sections/Highlights.tsx`
- Create: `src/__tests__/components/Highlights.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/Highlights.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Highlights from '@/components/sections/Highlights'
import type { SanityHighlight } from '@/sanity/lib/types'

const sanityHighlights: SanityHighlight[] = [
  { _id: 'h1', icon: 'Award', title: 'CMS Highlight', description: 'CMS description', order: 1 },
]

describe('Highlights', () => {
  it('renders title from Sanity highlights prop', () => {
    render(<Highlights highlights={sanityHighlights} />)
    expect(screen.getByText('CMS Highlight')).toBeInTheDocument()
  })

  it('falls back to static HIGHLIGHTS when highlights prop is null', () => {
    render(<Highlights highlights={null} />)
    expect(screen.getByText('40 Năm Kinh Nghiệm')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/Highlights.test.tsx
```

Expected: FAIL — Highlights does not accept `highlights` prop yet

- [ ] **Step 3: Update Highlights to accept the prop**

Replace `src/components/sections/Highlights.tsx` with:

```typescript
import { Award, Warehouse, TreePine, PenTool, Shield, MapPin, LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { HIGHLIGHTS } from "@/lib/data";
import type { SanityHighlight } from "@/sanity/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Warehouse, TreePine, PenTool, Shield, MapPin,
};

interface HighlightsProps {
  highlights: SanityHighlight[] | null;
}

export default function Highlights({ highlights }: HighlightsProps) {
  const items = highlights ?? HIGHLIGHTS.map((h) => ({
    _id: h.id,
    icon: h.icon,
    title: h.title,
    description: h.description,
    order: 0,
  }));

  return (
    <section className="py-20 bg-wood-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Tại sao chọn chúng tôi"
          title="Cam Kết Chất Lượng"
          description="Mỗi công trình là một tác phẩm nghệ thuật, được thực hiện bởi đội ngũ nghệ nhân tâm huyết với hơn 40 năm kinh nghiệm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Award;
            return (
              <div key={item._id} className="bg-white rounded-lg p-6 shadow-sm border border-wood-100 hover:shadow-md hover:border-gold-400 transition-all group">
                <div className="w-12 h-12 bg-wood-50 group-hover:bg-gold-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <Icon size={24} className="text-wood-600 group-hover:text-wood-800 transition-colors" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/Highlights.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Highlights.tsx src/__tests__/components/Highlights.test.tsx
git commit -m "feat: Highlights accepts highlights prop with data.ts fallback"
```

---

## Task 8: Update ProjectsGrid to accept projects prop (TDD)

**Files:**
- Modify: `src/components/sections/ProjectsGrid.tsx`
- Create: `src/__tests__/components/ProjectsGrid.test.tsx`

`ProjectCard` currently expects `slug: string`, but Sanity returns `slug: { current: string }`. We adapt in ProjectsGrid when mapping Sanity data.

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/ProjectsGrid.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import type { SanityProject } from '@/sanity/lib/types'

const sanityProjects: SanityProject[] = [
  {
    _id: 'p1',
    title: 'CMS Project Alpha',
    slug: { current: 'cms-project-alpha' },
    location: 'Hà Nội',
    completedYear: 2024,
    description: 'A CMS project description',
    category: { name: 'Nhà gỗ 3 gian' },
    thumbnail: { asset: { url: 'https://example.com/thumb.jpg' } },
  },
]

describe('ProjectsGrid', () => {
  it('renders project title from Sanity projects prop', () => {
    render(<ProjectsGrid projects={sanityProjects} />)
    expect(screen.getByText('CMS Project Alpha')).toBeInTheDocument()
  })

  it('falls back to static FEATURED_PROJECTS when projects prop is null', () => {
    render(<ProjectsGrid projects={null} />)
    expect(screen.getByText('Nhà Gỗ 3 Gian')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/ProjectsGrid.test.tsx
```

Expected: FAIL — ProjectsGrid does not accept `projects` prop yet

- [ ] **Step 3: Update ProjectsGrid to accept the prop**

Replace `src/components/sections/ProjectsGrid.tsx` with:

```typescript
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { FEATURED_PROJECTS } from "@/lib/data";
import type { SanityProject } from "@/sanity/lib/types";

interface ProjectsGridProps {
  projects: SanityProject[] | null;
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const items = projects
    ? projects.map((p) => ({
        slug: p.slug.current,
        title: p.title,
        location: p.location,
        category: p.category.name,
        completedYear: p.completedYear,
        description: p.description,
        thumbnail: p.thumbnail.asset.url,
      }))
    : FEATURED_PROJECTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        location: p.location,
        category: p.category,
        completedYear: p.completedYear,
        description: p.description,
        thumbnail: p.thumbnail,
      }));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Công trình tiêu biểu"
          title="Dự Án Đã Thực Hiện"
          description="Hàng trăm công trình nhà gỗ cổ truyền trên khắp cả nước, mỗi công trình là một câu chuyện về tâm huyết và nghề"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/cong-trinh"
            className="inline-flex items-center gap-2 border border-wood-600 text-wood-600 hover:bg-wood-600 hover:text-white font-semibold px-8 py-3 rounded transition-all text-sm"
          >
            Xem tất cả công trình <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/ProjectsGrid.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProjectsGrid.tsx src/__tests__/components/ProjectsGrid.test.tsx
git commit -m "feat: ProjectsGrid accepts projects prop with data.ts fallback"
```

---

## Task 9: Update HouseTemplates to accept templates prop (TDD)

**Files:**
- Modify: `src/components/sections/HouseTemplates.tsx`
- Create: `src/__tests__/components/HouseTemplates.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/components/HouseTemplates.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HouseTemplates from '@/components/sections/HouseTemplates'
import type { SanityTemplate } from '@/sanity/lib/types'

const sanityTemplates: SanityTemplate[] = [
  {
    _id: 't1',
    name: 'CMS Template Gỗ',
    description: 'CMS template description',
    specs: { area: '80-100m²', bays: 5, columns: 20 },
    thumbnail: { asset: { url: 'https://example.com/template.jpg' } },
  },
]

describe('HouseTemplates', () => {
  it('renders template name from Sanity templates prop', () => {
    render(<HouseTemplates templates={sanityTemplates} />)
    expect(screen.getByText('CMS Template Gỗ')).toBeInTheDocument()
  })

  it('falls back to static HOUSE_TEMPLATES when templates prop is null', () => {
    render(<HouseTemplates templates={null} />)
    expect(screen.getByText('Nhà Gỗ 3 Gian 4 Mái')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/components/HouseTemplates.test.tsx
```

Expected: FAIL — HouseTemplates does not accept `templates` prop yet

- [ ] **Step 3: Update HouseTemplates to accept the prop**

Replace `src/components/sections/HouseTemplates.tsx` with:

```typescript
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { HOUSE_TEMPLATES } from "@/lib/data";
import { LayoutGrid, Columns2, Columns3 } from "lucide-react";
import type { SanityTemplate } from "@/sanity/lib/types";

interface HouseTemplatesProps {
  templates: SanityTemplate[] | null;
}

export default function HouseTemplates({ templates }: HouseTemplatesProps) {
  const items = templates ?? HOUSE_TEMPLATES.map((t) => ({
    _id: t.id,
    name: t.name,
    description: t.description,
    specs: t.specs,
    thumbnail: { asset: { url: t.thumbnail } },
  }));

  return (
    <section className="py-20 bg-wood-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Mẫu nhà gỗ"
          title="Catalogue Thiết Kế"
          description="Tham khảo các mẫu nhà gỗ cổ truyền phổ biến. Chúng tôi tư vấn và thiết kế theo yêu cầu riêng của từng gia đình"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((template) => (
            <div key={template._id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-wood-200 hover:shadow-md transition-shadow group">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={template.thumbnail.asset.url}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-cormorant text-lg font-semibold text-wood-700 mb-2">{template.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.specs.area && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 text-wood-600 px-2 py-1 rounded border border-wood-200">
                      <LayoutGrid size={10} /> {template.specs.area}
                    </span>
                  )}
                  {template.specs.bays && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 text-wood-600 px-2 py-1 rounded border border-wood-200">
                      <Columns3 size={10} /> {template.specs.bays} gian
                    </span>
                  )}
                  {template.specs.columns && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 text-wood-600 px-2 py-1 rounded border border-wood-200">
                      <Columns2 size={10} /> {template.specs.columns} cột
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/components/HouseTemplates.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HouseTemplates.tsx src/__tests__/components/HouseTemplates.test.tsx
git commit -m "feat: HouseTemplates accepts templates prop with data.ts fallback"
```

---

## Task 10: Update homepage to fetch all data from Sanity

**Files:**
- Modify: `src/app/(site)/page.tsx`

- [ ] **Step 1: Update the homepage**

Replace `src/app/(site)/page.tsx` with:

```typescript
import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import QuoteForm from "@/components/sections/QuoteForm";
import { fetchSanity } from "@/sanity/lib/fetch";
import {
  heroSlidesQuery,
  highlightsQuery,
  featuredProjectsQuery,
  featuredTemplatesQuery,
} from "@/sanity/lib/queries";
import type {
  SanityHeroSlide,
  SanityHighlight,
  SanityProject,
  SanityTemplate,
} from "@/sanity/lib/types";

export default async function HomePage() {
  const [slides, highlights, projects, templates] = await Promise.all([
    fetchSanity<SanityHeroSlide[]>(heroSlidesQuery),
    fetchSanity<SanityHighlight[]>(highlightsQuery),
    fetchSanity<SanityProject[]>(featuredProjectsQuery),
    fetchSanity<SanityTemplate[]>(featuredTemplatesQuery),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <Highlights highlights={highlights} />
      <ProjectsGrid projects={projects} />
      <HouseTemplates templates={templates} />
      <QuoteForm />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(site)/page.tsx
git commit -m "feat: homepage fetches all sections from Sanity CMS"
```

---

## Task 11: Update About page to fetch from Sanity

**Files:**
- Modify: `src/app/(site)/gioi-thieu/page.tsx`

The about page uses hardcoded `STATS` and the company name from `SITE_SETTINGS`. With Sanity, we fetch `aboutPageQuery` which provides `highlights` (number + label pairs), `story`, `teamDescription`, and `heroImage`. We use Sanity data when available and fall back to the existing static content.

- [ ] **Step 1: Update the About page**

Replace `src/app/(site)/gioi-thieu/page.tsx` with:

```typescript
import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_SETTINGS } from "@/lib/data";
import { fetchSanity } from "@/sanity/lib/fetch";
import { aboutPageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { SanityAboutPage, SanitySiteSettings } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết với nghề mộc truyền thống, chuyên thi công nhà gỗ cổ truyền Bắc Bộ.",
};

const STATIC_STATS = [
  { number: "40+", label: "Năm kinh nghiệm" },
  { number: "500+", label: "Công trình hoàn thành" },
  { number: "30+", label: "Tỉnh thành trên cả nước" },
  { number: "1.000m²", label: "Diện tích xưởng" },
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1565793979732-8ae1cc8a5e55?w=1600&q=80";
const STORY_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

export default async function AboutPage() {
  const [aboutData, siteSettings] = await Promise.all([
    fetchSanity<SanityAboutPage>(aboutPageQuery),
    fetchSanity<SanitySiteSettings>(siteSettingsQuery),
  ]);

  const companyName = siteSettings?.companyName ?? SITE_SETTINGS.companyName;
  const stats = aboutData?.highlights ?? STATIC_STATS;
  const story = aboutData?.story ?? null;
  const heroImageUrl = aboutData?.heroImage?.asset?.url ?? HERO_IMAGE;

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image
          src={heroImageUrl}
          alt="Xưởng Gỗ Hoàng Huân"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Về chúng tôi</p>
            <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white italic">
              Giới Thiệu
            </h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-wood-600 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-cormorant text-4xl font-bold text-gold-400">{s.number}</div>
              <div className="text-wood-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-10 bg-gold-500" />
                <span className="text-xs text-gold-600 tracking-widest uppercase font-semibold">Câu chuyện</span>
              </div>
              <h2 className="font-cormorant text-4xl font-semibold text-wood-700 mb-6">
                Tâm Huyết Với Nghề Mộc Truyền Thống
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {story ? (
                  <p>{story}</p>
                ) : (
                  <>
                    <p>
                      <strong className="text-wood-600">{companyName}</strong> được thành lập với niềm đam mê gìn giữ và phát triển nghề mộc truyền thống Việt Nam. Với đội ngũ thợ lành nghề có hơn 40 năm kinh nghiệm, chúng tôi tự hào mang đến những công trình nhà gỗ đẹp, bền và đậm chất văn hóa dân tộc.
                    </p>
                    <p>
                      Mỗi công trình được chúng tôi thực hiện đều xuất phát từ sự tôn trọng với kiến trúc cổ truyền Bắc Bộ, kết hợp với kỹ thuật thi công hiện đại để đảm bảo độ bền và tính thẩm mỹ cao nhất.
                    </p>
                    <p>
                      Từ những ngôi nhà gỗ 3 gian, 5 gian truyền thống đến nhà thờ họ, đình chùa, đồ thờ gỗ — mỗi sản phẩm đều là tâm huyết của cả đội ngũ nghệ nhân.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={STORY_IMAGE}
                alt="Nghệ nhân chạm khắc"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-wood-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeading
            label="Đội ngũ"
            title="Những Người Thợ Tâm Huyết"
            description="Đội ngũ nghệ nhân của chúng tôi là những người con của làng nghề truyền thống, mang trong mình tình yêu và sự tôn trọng với từng thớ gỗ"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: "Thợ chạm khắc", desc: "Nghệ nhân chạm khắc hoa văn cổ điển với độ tỉ mỉ và chính xác cao" },
              { role: "Thợ mộc kết cấu", desc: "Đội ngũ xử lý kết cấu cột kèo, đảm bảo độ vững chắc của công trình" },
              { role: "Kiến trúc tư vấn", desc: "Đội tư vấn thiết kế kết hợp kiến trúc truyền thống và nhu cầu hiện đại" },
            ].map((item) => (
              <div key={item.role} className="bg-white rounded-lg p-6 border border-wood-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-wood-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gold-400 text-2xl font-cormorant font-bold">木</span>
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-2">{item.role}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(site)/gioi-thieu/page.tsx
git commit -m "feat: About page fetches content from Sanity CMS"
```

---

## Task 12: Update Projects listing page to fetch from Sanity

**Files:**
- Modify: `src/app/(site)/cong-trinh/page.tsx`

- [ ] **Step 1: Update the Projects page**

Replace `src/app/(site)/cong-trinh/page.tsx` with:

```typescript
import type { Metadata } from "next";
import Image from "next/image";
import ProjectCard from "@/components/ui/ProjectCard";
import { FEATURED_PROJECTS } from "@/lib/data";
import { fetchSanity } from "@/sanity/lib/fetch";
import { allProjectsQuery, projectCategoriesQuery } from "@/sanity/lib/queries";
import type { SanityProject, SanityProjectCategory } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Công trình",
  description: "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
};

export default async function ProjectsPage() {
  const [sanityProjects, sanityCategories] = await Promise.all([
    fetchSanity<SanityProject[]>(allProjectsQuery),
    fetchSanity<SanityProjectCategory[]>(projectCategoriesQuery),
  ]);

  const projects = sanityProjects
    ? sanityProjects.map((p) => ({
        slug: p.slug.current,
        title: p.title,
        location: p.location,
        category: p.category.name,
        completedYear: p.completedYear,
        description: p.description,
        thumbnail: p.thumbnail.asset.url,
      }))
    : FEATURED_PROJECTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        location: p.location,
        category: p.category,
        completedYear: p.completedYear,
        description: p.description,
        thumbnail: p.thumbnail,
      }));

  const categories = sanityCategories
    ? ["Tất cả", ...sanityCategories.map((c) => c.name)]
    : ["Tất cả", "Nhà gỗ 3 gian", "Nhà gỗ 5 gian", "Nhà thờ họ", "Nhà gỗ sân vườn"];

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image
          src="https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=1600&q=80"
          alt="Công trình nhà gỗ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Portfolio</p>
            <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white italic">
              Công Trình
            </h1>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  cat === "Tất cả"
                    ? "bg-wood-600 text-white border-wood-600"
                    : "border-wood-300 text-wood-600 hover:bg-wood-600 hover:text-white hover:border-wood-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(site)/cong-trinh/page.tsx
git commit -m "feat: Projects page fetches all projects and categories from Sanity"
```

---

## Task 13: Update Project detail page to fetch from Sanity

**Files:**
- Modify: `src/app/(site)/cong-trinh/[slug]/page.tsx`

- [ ] **Step 1: Update the Project detail page**

Replace `src/app/(site)/cong-trinh/[slug]/page.tsx` with:

```typescript
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, ArrowLeft, Tag } from "lucide-react";
import { FEATURED_PROJECTS } from "@/lib/data";
import { notFound } from "next/navigation";
import { fetchSanity } from "@/sanity/lib/fetch";
import { projectBySlugQuery } from "@/sanity/lib/queries";
import type { SanityProject } from "@/sanity/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sanityProject = await fetchSanity<SanityProject>(projectBySlugQuery, { slug });
  if (sanityProject) {
    return { title: sanityProject.title, description: sanityProject.description };
  }
  const project = FEATURED_PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export function generateStaticParams() {
  return FEATURED_PROJECTS.map((p) => ({ slug: p.slug }));
}

const STATIC_DETAIL_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
];

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const sanityProject = await fetchSanity<SanityProject>(projectBySlugQuery, { slug });

  if (sanityProject) {
    const galleryImages = sanityProject.images?.map((img) => img.asset.url) ?? STATIC_DETAIL_IMAGES;

    return (
      <div className="pt-24">
        <div className="relative h-72 md:h-[500px]">
          <Image src={sanityProject.thumbnail.asset.url} alt={sanityProject.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
              <Link href="/cong-trinh" className="inline-flex items-center gap-1 text-wood-200 hover:text-gold-400 text-sm mb-4 transition-colors">
                <ArrowLeft size={14} /> Tất cả công trình
              </Link>
              <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-white italic">{sanityProject.title}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-wood-200">
                <span className="flex items-center gap-1"><MapPin size={14} />{sanityProject.location}</span>
                <span className="flex items-center gap-1"><CalendarDays size={14} />{sanityProject.completedYear}</span>
                <span className="flex items-center gap-1"><Tag size={14} />{sanityProject.category.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-cormorant text-3xl font-semibold text-wood-700 mb-4">Mô tả công trình</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{sanityProject.description}</p>
              <h3 className="font-cormorant text-2xl font-semibold text-wood-700 mb-4">Thư viện ảnh</h3>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, i) => (
                  <div key={i} className="relative h-48 rounded overflow-hidden">
                    <Image src={img} alt={`${sanityProject.title} - ảnh ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-wood-50 border border-wood-200 rounded-lg p-6 mb-6 sticky top-28">
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-4">Thông tin dự án</h3>
                <dl className="space-y-3 text-sm">
                  {[
                    { label: "Loại công trình", value: sanityProject.category.name },
                    { label: "Địa điểm", value: sanityProject.location },
                    { label: "Năm hoàn thành", value: sanityProject.completedYear },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between border-b border-wood-200 pb-2">
                      <dt className="text-gray-500">{item.label}</dt>
                      <dd className="font-medium text-wood-700">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/lien-he" className="block mt-6 text-center bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold py-3 rounded transition-colors text-sm">
                  Yêu cầu báo giá
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to static data
  const project = FEATURED_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="pt-24">
      <div className="relative h-72 md:h-[500px]">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
            <Link href="/cong-trinh" className="inline-flex items-center gap-1 text-wood-200 hover:text-gold-400 text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Tất cả công trình
            </Link>
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-white italic">{project.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-wood-200">
              <span className="flex items-center gap-1"><MapPin size={14} />{project.location}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} />{project.completedYear}</span>
              <span className="flex items-center gap-1"><Tag size={14} />{project.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-cormorant text-3xl font-semibold text-wood-700 mb-4">Mô tả công trình</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{project.description}</p>
            <h3 className="font-cormorant text-2xl font-semibold text-wood-700 mb-4">Thư viện ảnh</h3>
            <div className="grid grid-cols-2 gap-3">
              {STATIC_DETAIL_IMAGES.map((img, i) => (
                <div key={i} className="relative h-48 rounded overflow-hidden">
                  <Image src={img} alt={`${project.title} - ảnh ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-wood-50 border border-wood-200 rounded-lg p-6 mb-6 sticky top-28">
              <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-4">Thông tin dự án</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Loại công trình", value: project.category },
                  { label: "Địa điểm", value: project.location },
                  { label: "Năm hoàn thành", value: project.completedYear },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-wood-200 pb-2">
                    <dt className="text-gray-500">{item.label}</dt>
                    <dd className="font-medium text-wood-700">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/lien-he" className="block mt-6 text-center bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold py-3 rounded transition-colors text-sm">
                Yêu cầu báo giá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(site)/cong-trinh/[slug]/page.tsx
git commit -m "feat: Project detail page fetches from Sanity with static fallback"
```

---

## Task 14: Run full unit test suite and fix any failures

- [ ] **Step 1: Run all unit tests**

```bash
npx vitest run
```

Expected: All tests pass. If any fail, fix the component or test before proceeding.

- [ ] **Step 2: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve unit test failures after Sanity wiring"
```

---

## Task 15: E2E smoke test for homepage

**Files:**
- Create: `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Write the E2E test**

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and shows hero section with headline', async ({ page }) => {
    await page.goto('/')
    // The first hero slide headline from static fallback
    await expect(page.getByText('Giữ Hồn Kiến Trúc Việt')).toBeVisible({ timeout: 10000 })
  })

  test('shows highlights section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Cam Kết Chất Lượng')).toBeVisible()
  })

  test('shows projects grid section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Dự Án Đã Thực Hiện')).toBeVisible()
  })

  test('shows house templates section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Catalogue Thiết Kế')).toBeVisible()
  })

  test('header shows company name', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Xưởng Gỗ Hoàng Huân').first()).toBeVisible()
  })
})
```

- [ ] **Step 2: Run E2E tests (requires dev server)**

```bash
npx playwright test tests/e2e/homepage.spec.ts
```

Expected: All 5 tests pass (using static fallback data since no Sanity project ID is set in dev).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/homepage.spec.ts
git commit -m "test(e2e): add homepage smoke tests for Sanity CMS wiring"
```

---

## Task 16: Update US-01 status in README

**Files:**
- Modify: `docs/user-stories/README.md`

- [ ] **Step 1: Update status**

In `docs/user-stories/README.md`, change the US-01 row from:

```
| 01 | [Connect Sanity CMS to all pages](./US-01-connect-sanity-cms.md) | Core | pending |
```

to:

```
| 01 | [Connect Sanity CMS to all pages](./US-01-connect-sanity-cms.md) | Core | done |
```

Also update `docs/user-stories/US-01-connect-sanity-cms.md` — change `**Status:** pending` to `**Status:** done`.

- [ ] **Step 2: Commit**

```bash
git add docs/user-stories/README.md docs/user-stories/US-01-connect-sanity-cms.md
git commit -m "docs: mark US-01 as done"
```
