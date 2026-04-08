# US-01 Connect Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all static/hardcoded data across the website with live data fetched from Sanity CMS, with graceful fallbacks.

**Architecture:** Page-level Server Components fetch data via typed helper functions that wrap `client.fetch()` with try/catch and fall back to static data from `src/lib/data.ts`. Components receive data as props (plain types — no Sanity-specific references leak). This extends the existing pattern in `src/app/(site)/layout.tsx`.

**Tech Stack:** Next.js 16 (App Router), Sanity v5, TypeScript, `@sanity/image-url`, Vitest, Playwright

**Design Spec:** `docs/superpowers/specs/2026-04-08-connect-sanity-cms-design.md`

---

### Task 1: Create Sanity response type definitions

**Files:**
- Create: `src/sanity/lib/types.ts`
- Test: `src/__tests__/sanity/types.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/sanity/types.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('Sanity type definitions', () => {
  it('exports SanityHeroSlide type', async () => {
    const types = await import('@/sanity/lib/types')
    // Type-level check: if this compiles, the type exists
    const slide: types.SanityHeroSlide = {
      image: 'https://example.com/img.jpg',
      headline: 'Test',
      subheadline: 'Sub',
      ctaLabel: 'Click',
      ctaLink: '/test',
      order: 1,
    }
    expect(slide.headline).toBe('Test')
  })

  it('exports SanityHighlight type', async () => {
    const types = await import('@/sanity/lib/types')
    const highlight: types.SanityHighlight = {
      icon: 'Award',
      title: 'Test',
      description: 'Desc',
      order: 1,
    }
    expect(highlight.icon).toBe('Award')
  })

  it('exports SanityProject type', async () => {
    const types = await import('@/sanity/lib/types')
    const project: types.SanityProject = {
      title: 'Test',
      slug: 'test-slug',
      location: 'Hà Nội',
      category: 'Nhà gỗ 3 gian',
      completedYear: 2023,
      description: 'Desc',
      thumbnail: 'https://example.com/img.jpg',
      images: ['https://example.com/img.jpg'],
      featured: true,
    }
    expect(project.slug).toBe('test-slug')
  })

  it('exports SanityProjectCategory type', async () => {
    const types = await import('@/sanity/lib/types')
    const cat: types.SanityProjectCategory = {
      name: 'Nhà gỗ 3 gian',
      slug: 'nha-go-3-gian',
    }
    expect(cat.name).toBe('Nhà gỗ 3 gian')
  })

  it('exports SanityHouseTemplate type', async () => {
    const types = await import('@/sanity/lib/types')
    const tpl: types.SanityHouseTemplate = {
      name: 'Test',
      thumbnail: 'https://example.com/img.jpg',
      specs: { area: '60m²', bays: 3, columns: 16 },
      description: 'Desc',
      featured: true,
    }
    expect(tpl.specs.bays).toBe(3)
  })

  it('exports SanityAboutPage type', async () => {
    const types = await import('@/sanity/lib/types')
    const about: types.SanityAboutPage = {
      heroImage: 'https://example.com/img.jpg',
      story: [],
      highlights: [{ number: '40+', label: 'Năm' }],
      teamDescription: 'Team desc',
    }
    expect(about.highlights[0].number).toBe('40+')
  })

  it('exports SanityFaqItem type', async () => {
    const types = await import('@/sanity/lib/types')
    const faq: types.SanityFaqItem = {
      _id: '1',
      question: 'Q?',
      answer: 'A.',
    }
    expect(faq.question).toBe('Q?')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/sanity/types.test.ts`
Expected: FAIL — cannot find module `@/sanity/lib/types`

- [ ] **Step 3: Write minimal implementation**

Create `src/sanity/lib/types.ts`:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortableTextBlock = any

export interface SanityHeroSlide {
  image: string
  headline: string
  subheadline?: string
  ctaLabel?: string
  ctaLink?: string
  order?: number
}

export interface SanityHighlight {
  icon: string
  title: string
  description: string
  order?: number
}

export interface SanityProject {
  title: string
  slug: string
  location: string
  category: string
  completedYear: number
  description: string
  thumbnail: string
  images?: string[]
  featured?: boolean
}

export interface SanityProjectCategory {
  name: string
  slug: string
}

export interface SanityHouseTemplate {
  name: string
  thumbnail: string
  specs: {
    area: string
    bays: number
    columns: number
  }
  description: string
  featured?: boolean
}

export interface SanityAboutPage {
  heroImage?: string
  story: PortableTextBlock[]
  highlights: Array<{ number: string; label: string }>
  teamDescription?: string
}

export interface SanityFaqItem {
  _id: string
  question: string
  answer: string
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/sanity/types.test.ts`
Expected: PASS — all 7 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/sanity/lib/types.ts src/__tests__/sanity/types.test.ts
git commit -m "feat(cms): add Sanity response type definitions"
```

---

### Task 2: Create fetch helper functions

**Files:**
- Create: `src/sanity/lib/fetchers.ts`
- Test: `src/__tests__/sanity/fetchers.test.ts`

**Context:** The existing site layout (`src/app/(site)/layout.tsx:8-19`) has a `getSiteSettings()` function that dynamically imports the client and query, checks for `NEXT_PUBLIC_SANITY_PROJECT_ID`, and falls back to `SITE_SETTINGS`. Our fetchers follow this same pattern but import statically (since the client is already used directly in `src/app/(site)/page.tsx:7`). The `getSiteSettings()` in the layout already works and will be moved to `fetchers.ts` for consistency.

**Important data normalization:** Sanity queries return nested objects that differ from what components expect:
- `slug` comes as `{ current: "the-slug" }` — flatten to `"the-slug"`
- `category` comes as `{ name: "Nhà gỗ 3 gian" }` — flatten to `"Nhà gỗ 3 gian"`
- `thumbnail` / `image` come as `{ asset: { url: "..." } }` — extract to URL string
- `images[]` comes as array of `{ asset: { url: "..." } }` — extract to URL strings

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/sanity/fetchers.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Sanity client
vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}))

// Mock the image builder — not used since we extract asset.url directly
vi.mock('@/sanity/lib/image', () => ({
  urlFor: vi.fn(),
}))

import { client } from '@/sanity/lib/client'
import {
  getHeroSlides,
  getHighlights,
  getFeaturedProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectCategories,
  getFeaturedTemplates,
  getAboutPage,
  getFaqItems,
  getSiteSettings,
} from '@/sanity/lib/fetchers'
import { HERO_SLIDES, HIGHLIGHTS, FEATURED_PROJECTS, HOUSE_TEMPLATES, SITE_SETTINGS } from '@/lib/data'

const mockFetch = vi.mocked(client.fetch)

describe('Sanity fetchers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHeroSlides', () => {
    it('returns normalized slides from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        {
          _id: '1',
          headline: 'Test Headline',
          subheadline: 'Sub',
          ctaLabel: 'Click',
          ctaLink: '/test',
          order: 1,
          image: { asset: { url: 'https://cdn.sanity.io/img.jpg', metadata: {} } },
        },
      ])

      const result = await getHeroSlides()
      expect(result).toHaveLength(1)
      expect(result[0].headline).toBe('Test Headline')
      expect(result[0].image).toBe('https://cdn.sanity.io/img.jpg')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      const result = await getHeroSlides()
      expect(result).toEqual(HERO_SLIDES)
    })
  })

  describe('getHighlights', () => {
    it('returns highlights from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        { _id: '1', icon: 'Award', title: 'Test', description: 'Desc', order: 1 },
      ])

      const result = await getHighlights()
      expect(result).toHaveLength(1)
      expect(result[0].icon).toBe('Award')
      expect(result[0].title).toBe('Test')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getHighlights()
      expect(result).toEqual(HIGHLIGHTS)
    })
  })

  describe('getFeaturedProjects', () => {
    it('returns normalized projects from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        {
          _id: '1',
          title: 'Test Project',
          slug: { current: 'test-project' },
          location: 'Hà Nội',
          completedYear: 2023,
          description: 'Desc',
          category: { name: 'Nhà gỗ 3 gian' },
          thumbnail: { asset: { url: 'https://cdn.sanity.io/thumb.jpg', metadata: {} } },
        },
      ])

      const result = await getFeaturedProjects()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('test-project')
      expect(result[0].category).toBe('Nhà gỗ 3 gian')
      expect(result[0].thumbnail).toBe('https://cdn.sanity.io/thumb.jpg')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getFeaturedProjects()
      expect(result).toEqual(FEATURED_PROJECTS)
    })
  })

  describe('getAllProjects', () => {
    it('returns all projects from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        {
          _id: '1',
          title: 'P1',
          slug: { current: 'p1' },
          location: 'HN',
          completedYear: 2023,
          description: 'D',
          category: { name: 'Cat', slug: { current: 'cat' } },
          thumbnail: { asset: { url: 'https://cdn.sanity.io/t.jpg', metadata: {} } },
        },
      ])

      const result = await getAllProjects()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('p1')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getAllProjects()
      expect(result).toEqual(FEATURED_PROJECTS)
    })
  })

  describe('getProjectBySlug', () => {
    it('returns normalized project from Sanity', async () => {
      mockFetch.mockResolvedValueOnce({
        _id: '1',
        title: 'Detail',
        slug: { current: 'detail' },
        location: 'HN',
        completedYear: 2023,
        description: 'D',
        category: { name: 'Cat' },
        thumbnail: { asset: { url: 'https://cdn.sanity.io/t.jpg', metadata: {} } },
        images: [
          { asset: { url: 'https://cdn.sanity.io/g1.jpg', metadata: {} } },
          { asset: { url: 'https://cdn.sanity.io/g2.jpg', metadata: {} } },
        ],
      })

      const result = await getProjectBySlug('detail')
      expect(result).not.toBeNull()
      expect(result!.title).toBe('Detail')
      expect(result!.images).toEqual([
        'https://cdn.sanity.io/g1.jpg',
        'https://cdn.sanity.io/g2.jpg',
      ])
    })

    it('returns null when not found', async () => {
      mockFetch.mockResolvedValueOnce(null)
      const result = await getProjectBySlug('non-existent')
      expect(result).toBeNull()
    })

    it('returns fallback match on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getProjectBySlug('nha-go-3-gian-ha-noi')
      expect(result).not.toBeNull()
      expect(result!.slug).toBe('nha-go-3-gian-ha-noi')
    })

    it('returns null on error when slug not in fallback', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getProjectBySlug('totally-unknown')
      expect(result).toBeNull()
    })
  })

  describe('getProjectCategories', () => {
    it('returns categories from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        { _id: '1', name: 'Nhà gỗ 3 gian', slug: { current: 'nha-go-3-gian' } },
      ])

      const result = await getProjectCategories()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Nhà gỗ 3 gian')
      expect(result[0].slug).toBe('nha-go-3-gian')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getProjectCategories()
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('getFeaturedTemplates', () => {
    it('returns normalized templates from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        {
          _id: '1',
          name: 'Template',
          description: 'Desc',
          specs: { area: '60m²', bays: 3, columns: 16 },
          thumbnail: { asset: { url: 'https://cdn.sanity.io/tpl.jpg', metadata: {} } },
        },
      ])

      const result = await getFeaturedTemplates()
      expect(result).toHaveLength(1)
      expect(result[0].thumbnail).toBe('https://cdn.sanity.io/tpl.jpg')
      expect(result[0].specs.bays).toBe(3)
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getFeaturedTemplates()
      expect(result).toEqual(HOUSE_TEMPLATES)
    })
  })

  describe('getAboutPage', () => {
    it('returns about page data from Sanity', async () => {
      mockFetch.mockResolvedValueOnce({
        story: [{ _type: 'block', children: [{ text: 'Story' }] }],
        teamDescription: 'Team',
        highlights: [{ number: '40+', label: 'Năm' }],
        heroImage: { asset: { url: 'https://cdn.sanity.io/hero.jpg', metadata: {} } },
      })

      const result = await getAboutPage()
      expect(result).not.toBeNull()
      expect(result!.heroImage).toBe('https://cdn.sanity.io/hero.jpg')
      expect(result!.highlights[0].number).toBe('40+')
    })

    it('returns null on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getAboutPage()
      expect(result).toBeNull()
    })
  })

  describe('getFaqItems', () => {
    it('returns FAQ items from Sanity', async () => {
      mockFetch.mockResolvedValueOnce([
        { _id: '1', question: 'Q?', answer: 'A.' },
      ])

      const result = await getFaqItems()
      expect(result).toHaveLength(1)
      expect(result[0].question).toBe('Q?')
    })

    it('returns empty array on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getFaqItems()
      expect(result).toEqual([])
    })
  })

  describe('getSiteSettings', () => {
    it('returns site settings from Sanity', async () => {
      mockFetch.mockResolvedValueOnce({
        companyName: 'Test Company',
        tagline: 'Tag',
        phone: '0123',
        email: 'test@test.com',
        address: 'Addr',
        workingHours: '8-17',
        facebookUrl: 'https://fb.com',
        tiktokUrl: 'https://tt.com',
      })

      const result = await getSiteSettings()
      expect(result.companyName).toBe('Test Company')
    })

    it('returns fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'))
      const result = await getSiteSettings()
      expect(result).toEqual(SITE_SETTINGS)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/sanity/fetchers.test.ts`
Expected: FAIL — cannot find module exports from `@/sanity/lib/fetchers`

- [ ] **Step 3: Write minimal implementation**

Create `src/sanity/lib/fetchers.ts`:

```typescript
import { client } from "./client"
import {
  siteSettingsQuery,
  heroSlidesQuery,
  highlightsQuery,
  featuredProjectsQuery,
  allProjectsQuery,
  projectBySlugQuery,
  projectCategoriesQuery,
  featuredTemplatesQuery,
  aboutPageQuery,
  faqItemsQuery,
} from "./queries"
import type {
  SanityHeroSlide,
  SanityHighlight,
  SanityProject,
  SanityProjectCategory,
  SanityHouseTemplate,
  SanityAboutPage,
  SanityFaqItem,
} from "./types"
import type { SiteSettingsData } from "@/components/layout/Header"
import {
  SITE_SETTINGS,
  HERO_SLIDES,
  HIGHLIGHTS,
  FEATURED_PROJECTS,
  HOUSE_TEMPLATES,
} from "@/lib/data"

// --- helpers ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function imageUrl(ref: any): string {
  return ref?.asset?.url ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProject(raw: any): SanityProject {
  return {
    title: raw.title,
    slug: typeof raw.slug === "string" ? raw.slug : raw.slug?.current ?? "",
    location: raw.location ?? "",
    category: typeof raw.category === "string" ? raw.category : raw.category?.name ?? "",
    completedYear: raw.completedYear ?? 0,
    description: raw.description ?? "",
    thumbnail: imageUrl(raw.thumbnail),
    images: raw.images?.map(imageUrl) ?? [],
    featured: raw.featured ?? false,
  }
}

// --- fetchers ---

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const data = await client.fetch(siteSettingsQuery)
    return data ? data : SITE_SETTINGS
  } catch {
    return SITE_SETTINGS
  }
}

export async function getHeroSlides(): Promise<SanityHeroSlide[]> {
  try {
    const data = await client.fetch(heroSlidesQuery)
    if (!data?.length) return HERO_SLIDES
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((s: any) => ({
      image: imageUrl(s.image),
      headline: s.headline,
      subheadline: s.subheadline ?? "",
      ctaLabel: s.ctaLabel ?? "",
      ctaLink: s.ctaLink ?? "",
      order: s.order ?? 0,
    }))
  } catch {
    return HERO_SLIDES
  }
}

export async function getHighlights(): Promise<SanityHighlight[]> {
  try {
    const data = await client.fetch(highlightsQuery)
    if (!data?.length) return HIGHLIGHTS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((h: any) => ({
      icon: h.icon,
      title: h.title,
      description: h.description ?? "",
      order: h.order ?? 0,
    }))
  } catch {
    return HIGHLIGHTS
  }
}

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  try {
    const data = await client.fetch(featuredProjectsQuery)
    if (!data?.length) return FEATURED_PROJECTS
    return data.map(normalizeProject)
  } catch {
    return FEATURED_PROJECTS
  }
}

export async function getAllProjects(): Promise<SanityProject[]> {
  try {
    const data = await client.fetch(allProjectsQuery)
    if (!data?.length) return FEATURED_PROJECTS
    return data.map(normalizeProject)
  } catch {
    return FEATURED_PROJECTS
  }
}

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  try {
    const data = await client.fetch(projectBySlugQuery, { slug })
    if (!data) return null
    return normalizeProject(data)
  } catch {
    const found = FEATURED_PROJECTS.find((p) => p.slug === slug)
    return found ? { ...found, images: [], featured: false } : null
  }
}

export async function getProjectCategories(): Promise<SanityProjectCategory[]> {
  try {
    const data = await client.fetch(projectCategoriesQuery)
    if (!data?.length) {
      return deriveCategories()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((c: any) => ({
      name: c.name,
      slug: typeof c.slug === "string" ? c.slug : c.slug?.current ?? "",
    }))
  } catch {
    return deriveCategories()
  }
}

function deriveCategories(): SanityProjectCategory[] {
  const unique = [...new Set(FEATURED_PROJECTS.map((p) => p.category))]
  return unique.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }))
}

export async function getFeaturedTemplates(): Promise<SanityHouseTemplate[]> {
  try {
    const data = await client.fetch(featuredTemplatesQuery)
    if (!data?.length) return HOUSE_TEMPLATES
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((t: any) => ({
      name: t.name,
      thumbnail: imageUrl(t.thumbnail),
      specs: t.specs ?? { area: "", bays: 0, columns: 0 },
      description: t.description ?? "",
      featured: t.featured ?? false,
    }))
  } catch {
    return HOUSE_TEMPLATES
  }
}

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  try {
    const data = await client.fetch(aboutPageQuery)
    if (!data) return null
    return {
      heroImage: imageUrl(data.heroImage),
      story: data.story ?? [],
      highlights: data.highlights ?? [],
      teamDescription: data.teamDescription ?? "",
    }
  } catch {
    return null
  }
}

export async function getFaqItems(): Promise<SanityFaqItem[]> {
  try {
    const data = await client.fetch(faqItemsQuery)
    return data ?? []
  } catch {
    return []
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/sanity/fetchers.test.ts`
Expected: PASS — all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/sanity/lib/fetchers.ts src/__tests__/sanity/fetchers.test.ts
git commit -m "feat(cms): add fetch helper functions with fallbacks"
```

---

### Task 3: Refactor HeroSlider to accept props

**Files:**
- Modify: `src/components/sections/HeroSlider.tsx`
- Modify: `src/__tests__/components/HeroSlider.test.tsx`

**Context:** Currently `HeroSlider` imports `HERO_SLIDES` from `data.ts` (line 7) and uses it directly. It needs to accept `slides` as a prop. The existing test at `src/__tests__/components/HeroSlider.test.tsx` renders `<HeroSlider />` without props — those tests need updating.

- [ ] **Step 1: Write the failing test**

Update `src/__tests__/components/HeroSlider.test.tsx` — add a new describe block for props-based rendering:

```typescript
// Add this import at the top alongside existing imports:
import type { SanityHeroSlide } from '@/sanity/lib/types'

// Add this new describe block after the existing describe block:
describe('US-01: HeroSlider accepts slides prop', () => {
  const testSlides: SanityHeroSlide[] = [
    {
      image: 'https://example.com/slide1.jpg',
      headline: 'CMS Headline',
      subheadline: 'CMS Sub',
      ctaLabel: 'CMS CTA',
      ctaLink: '/cms-link',
      order: 1,
    },
  ]

  it('renders headline from props', () => {
    render(<HeroSlider slides={testSlides} />)
    expect(screen.getByText('CMS Headline')).toBeTruthy()
  })

  it('renders subheadline from props', () => {
    render(<HeroSlider slides={testSlides} />)
    expect(screen.getByText('CMS Sub')).toBeTruthy()
  })

  it('renders CTA label from props', () => {
    render(<HeroSlider slides={testSlides} />)
    expect(screen.getByText('CMS CTA')).toBeTruthy()
  })

  it('renders CTA link from props', () => {
    render(<HeroSlider slides={testSlides} />)
    const link = screen.getByText('CMS CTA').closest('a')
    expect(link?.getAttribute('href')).toBe('/cms-link')
  })

  it('hides navigation dots when only one slide', () => {
    render(<HeroSlider slides={testSlides} />)
    const buttons = screen.getAllByRole('button')
    const dotBtns = buttons.filter(b => b.getAttribute('aria-label')?.match(/slide/i))
    expect(dotBtns.length).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/HeroSlider.test.tsx`
Expected: FAIL — `slides` prop doesn't exist, component still renders hardcoded data

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/sections/HeroSlider.tsx`:

1. Add the import for the type and remove the `HERO_SLIDES` import:

Replace:
```typescript
import { HERO_SLIDES } from "@/lib/data";
```
With:
```typescript
import type { SanityHeroSlide } from "@/sanity/lib/types";
import { HERO_SLIDES } from "@/lib/data";
```

2. Add props interface and update the component signature:

Replace the component declaration (the line that starts with `export default function HeroSlider`) to accept a `slides` prop with a default:

```typescript
export default function HeroSlider({ slides = HERO_SLIDES }: { slides?: SanityHeroSlide[] }) {
```

3. Replace all references to `HERO_SLIDES` inside the component body with `slides`.

4. Hide navigation dots when only one slide — wrap the dots container:

```typescript
{slides.length > 1 && (
  <div className="...dots container...">
    {slides.map((_, idx) => (
      // ...dot buttons...
    ))}
  </div>
)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/HeroSlider.test.tsx`
Expected: PASS — both old tests and new tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSlider.tsx src/__tests__/components/HeroSlider.test.tsx
git commit -m "refactor(cms): HeroSlider accepts slides prop with fallback"
```

---

### Task 4: Refactor Highlights to accept props

**Files:**
- Modify: `src/components/sections/Highlights.tsx`
- Test: `src/__tests__/components/Highlights.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Highlights.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Highlights from '@/components/sections/Highlights'
import type { SanityHighlight } from '@/sanity/lib/types'

describe('US-01: Highlights accepts highlights prop', () => {
  const testHighlights: SanityHighlight[] = [
    { icon: 'Award', title: 'CMS Title', description: 'CMS Desc', order: 1 },
    { icon: 'Shield', title: 'Second', description: 'Second Desc', order: 2 },
  ]

  it('renders title from props', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Title')).toBeTruthy()
  })

  it('renders description from props', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Desc')).toBeTruthy()
  })

  it('renders correct number of highlight items', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Title')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
  })

  it('renders nothing when empty array', () => {
    const { container } = render(<Highlights highlights={[]} />)
    // Section should be hidden or empty
    expect(container.querySelector('section')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/Highlights.test.tsx`
Expected: FAIL — `highlights` prop doesn't exist

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/sections/Highlights.tsx`:

1. Add import for the type:
```typescript
import type { SanityHighlight } from "@/sanity/lib/types";
```

2. Update component signature to accept `highlights` prop with default:
```typescript
export default function Highlights({ highlights = HIGHLIGHTS }: { highlights?: SanityHighlight[] }) {
```

3. Replace references to `HIGHLIGHTS` in the component body with `highlights`.

4. Guard against empty array — wrap the section:
```typescript
if (highlights.length === 0) return null;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/Highlights.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Highlights.tsx src/__tests__/components/Highlights.test.tsx
git commit -m "refactor(cms): Highlights accepts highlights prop with fallback"
```

---

### Task 5: Refactor ProjectsGrid to accept props

**Files:**
- Modify: `src/components/sections/ProjectsGrid.tsx`
- Test: `src/__tests__/components/ProjectsGrid.test.tsx`

**Context:** `ProjectsGrid` is used on the homepage to show featured projects. It imports `FEATURED_PROJECTS` from `data.ts`. `ProjectCard` expects `category: string` and `slug: string` (flat strings).

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/ProjectsGrid.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import type { SanityProject } from '@/sanity/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('US-01: ProjectsGrid accepts projects prop', () => {
  const testProjects: SanityProject[] = [
    {
      title: 'CMS Project',
      slug: 'cms-project',
      location: 'Hà Nội',
      category: 'Nhà gỗ 3 gian',
      completedYear: 2024,
      description: 'CMS Description',
      thumbnail: 'https://example.com/thumb.jpg',
      images: [],
      featured: true,
    },
  ]

  it('renders project title from props', () => {
    render(<ProjectsGrid projects={testProjects} />)
    expect(screen.getByText('CMS Project')).toBeTruthy()
  })

  it('renders project description from props', () => {
    render(<ProjectsGrid projects={testProjects} />)
    expect(screen.getByText('CMS Description')).toBeTruthy()
  })

  it('renders nothing when empty array', () => {
    const { container } = render(<ProjectsGrid projects={[]} />)
    expect(container.querySelector('section')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/ProjectsGrid.test.tsx`
Expected: FAIL — `projects` prop doesn't exist

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/sections/ProjectsGrid.tsx`:

1. Add import:
```typescript
import type { SanityProject } from "@/sanity/lib/types";
```

2. Update component signature:
```typescript
export default function ProjectsGrid({ projects = FEATURED_PROJECTS }: { projects?: SanityProject[] }) {
```

3. Replace `FEATURED_PROJECTS` in the body with `projects`.

4. Guard against empty:
```typescript
if (projects.length === 0) return null;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/ProjectsGrid.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProjectsGrid.tsx src/__tests__/components/ProjectsGrid.test.tsx
git commit -m "refactor(cms): ProjectsGrid accepts projects prop with fallback"
```

---

### Task 6: Refactor HouseTemplates to accept props

**Files:**
- Modify: `src/components/sections/HouseTemplates.tsx`
- Test: `src/__tests__/components/HouseTemplates.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/HouseTemplates.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HouseTemplates from '@/components/sections/HouseTemplates'
import type { SanityHouseTemplate } from '@/sanity/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('US-01: HouseTemplates accepts templates prop', () => {
  const testTemplates: SanityHouseTemplate[] = [
    {
      name: 'CMS Template',
      thumbnail: 'https://example.com/tpl.jpg',
      specs: { area: '80m²', bays: 3, columns: 16 },
      description: 'CMS Template Desc',
      featured: true,
    },
  ]

  it('renders template name from props', () => {
    render(<HouseTemplates templates={testTemplates} />)
    expect(screen.getByText('CMS Template')).toBeTruthy()
  })

  it('renders template specs from props', () => {
    render(<HouseTemplates templates={testTemplates} />)
    expect(screen.getByText('80m²')).toBeTruthy()
  })

  it('renders nothing when empty array', () => {
    const { container } = render(<HouseTemplates templates={[]} />)
    expect(container.querySelector('section')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/HouseTemplates.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/sections/HouseTemplates.tsx`:

1. Add import:
```typescript
import type { SanityHouseTemplate } from "@/sanity/lib/types";
```

2. Update component signature:
```typescript
export default function HouseTemplates({ templates = HOUSE_TEMPLATES }: { templates?: SanityHouseTemplate[] }) {
```

3. Replace `HOUSE_TEMPLATES` in the body with `templates`.

4. Guard against empty:
```typescript
if (templates.length === 0) return null;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/HouseTemplates.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HouseTemplates.tsx src/__tests__/components/HouseTemplates.test.tsx
git commit -m "refactor(cms): HouseTemplates accepts templates prop with fallback"
```

---

### Task 7: Refactor QuoteForm to accept houseTypes prop

**Files:**
- Modify: `src/components/sections/QuoteForm.tsx`
- Test: `src/__tests__/components/QuoteForm.test.tsx`

**Context:** `QuoteForm` imports both `HOUSE_TYPES` and `PROVINCES` from `data.ts`. Per the design spec, `HOUSE_TYPES` will be derived from CMS template names and passed as a prop. `PROVINCES` stays hardcoded.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/QuoteForm.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import QuoteForm from '@/components/sections/QuoteForm'

describe('US-01: QuoteForm accepts houseTypes prop', () => {
  const customTypes = ['CMS Type A', 'CMS Type B']

  it('renders custom house types in select', () => {
    render(<QuoteForm houseTypes={customTypes} />)
    expect(screen.getByText('CMS Type A')).toBeTruthy()
    expect(screen.getByText('CMS Type B')).toBeTruthy()
  })

  it('falls back to default HOUSE_TYPES when no prop given', () => {
    render(<QuoteForm />)
    expect(screen.getByText('Nhà gỗ 3 gian')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/QuoteForm.test.tsx`
Expected: FAIL — `houseTypes` prop doesn't exist

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/sections/QuoteForm.tsx`:

1. Update component signature to accept `houseTypes` prop:

```typescript
export default function QuoteForm({ houseTypes = HOUSE_TYPES }: { houseTypes?: string[] }) {
```

2. Replace the `HOUSE_TYPES` reference in the select dropdown mapping with `houseTypes`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/QuoteForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/QuoteForm.tsx src/__tests__/components/QuoteForm.test.tsx
git commit -m "refactor(cms): QuoteForm accepts houseTypes prop with fallback"
```

---

### Task 8: Wire Homepage to Sanity CMS

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Context:** The homepage is already an async Server Component (it fetches FAQ items). It needs to also fetch hero slides, highlights, featured projects, and house templates from Sanity, then pass them as props. The FAQ fetching should move to use the `getFaqItems()` helper for consistency.

- [ ] **Step 1: Update the homepage**

Modify `src/app/(site)/page.tsx`:

```typescript
import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import FaqSection from "@/components/sections/FaqSection";
import QuoteForm from "@/components/sections/QuoteForm";
import {
  getHeroSlides,
  getHighlights,
  getFeaturedProjects,
  getFeaturedTemplates,
  getFaqItems,
} from "@/sanity/lib/fetchers";

export default async function HomePage() {
  const [heroSlides, highlights, projects, templates, faqs] = await Promise.all([
    getHeroSlides(),
    getHighlights(),
    getFeaturedProjects(),
    getFeaturedTemplates(),
    getFaqItems(),
  ]);

  const houseTypes = templates.map((t) => t.name);

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <Highlights highlights={highlights} />
      <ProjectsGrid projects={projects} />
      <HouseTemplates templates={templates} />
      <FaqSection faqs={faqs} />
      <QuoteForm houseTypes={houseTypes} />
    </>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30` (or let dev server compile)
Expected: No TypeScript errors, page compiles

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/page.tsx
git commit -m "feat(cms): wire homepage to Sanity CMS data"
```

---

### Task 9: Wire About page to Sanity CMS

**Files:**
- Modify: `src/app/(site)/gioi-thieu/page.tsx`

**Context:** The about page has hardcoded `STATS` array, hardcoded story text, and hardcoded team section. With Sanity, the `aboutPage` document provides `highlights` (stats), `story` (PortableText), `heroImage`, and `teamDescription`. If Sanity returns null (no about page document), the page falls back to the current hardcoded content.

- [ ] **Step 1: Update the about page**

Modify `src/app/(site)/gioi-thieu/page.tsx`:

1. Add imports:
```typescript
import { getAboutPage } from "@/sanity/lib/fetchers";
```

2. Make the component async and fetch data:
```typescript
export default async function AboutPage() {
  const aboutPage = await getAboutPage();
```

3. Use CMS data with fallbacks:
- Stats: use `aboutPage?.highlights ?? STATS` (keep `STATS` as fallback)
- Hero image: use `aboutPage?.heroImage ?? "https://images.unsplash.com/..."` (current URL)
- Story: if `aboutPage?.story` exists and has blocks, render with PortableText; otherwise keep current hardcoded paragraphs
- Team description: use `aboutPage?.teamDescription` if available, otherwise keep hardcoded

4. For PortableText rendering, install if not present or use simple rendering:
```typescript
// Simple approach: if story exists, map blocks to paragraphs
{aboutPage?.story?.length ? (
  aboutPage.story.map((block: { _key?: string; children?: Array<{ text: string }> }, i: number) => (
    <p key={block._key ?? i}>
      {block.children?.map((c) => c.text).join("") ?? ""}
    </p>
  ))
) : (
  // existing hardcoded paragraphs
)}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/gioi-thieu/page.tsx
git commit -m "feat(cms): wire about page to Sanity CMS data"
```

---

### Task 10: Wire Projects listing page to Sanity CMS

**Files:**
- Modify: `src/app/(site)/cong-trinh/page.tsx`
- Create: `src/components/sections/ProjectsListing.tsx`

**Context:** The current projects page is a Server Component with hardcoded categories and static project data. The category filter buttons exist but don't work (no client-side filtering). We need to:
1. Fetch all projects and categories from Sanity
2. Create a Client Component (`ProjectsListing`) that handles category filtering with state
3. The page (Server Component) fetches data and passes it to `ProjectsListing`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/ProjectsListing.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectsListing from '@/components/sections/ProjectsListing'
import type { SanityProject, SanityProjectCategory } from '@/sanity/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const testProjects: SanityProject[] = [
  {
    title: 'Project A',
    slug: 'project-a',
    location: 'HN',
    category: 'Cat1',
    completedYear: 2023,
    description: 'A desc',
    thumbnail: 'https://example.com/a.jpg',
    images: [],
  },
  {
    title: 'Project B',
    slug: 'project-b',
    location: 'HP',
    category: 'Cat2',
    completedYear: 2024,
    description: 'B desc',
    thumbnail: 'https://example.com/b.jpg',
    images: [],
  },
]

const testCategories: SanityProjectCategory[] = [
  { name: 'Cat1', slug: 'cat1' },
  { name: 'Cat2', slug: 'cat2' },
]

describe('US-01: ProjectsListing with category filter', () => {
  it('renders all projects by default', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.getByText('Project B')).toBeTruthy()
  })

  it('shows "Tất cả" button', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    expect(screen.getByText('Tất cả')).toBeTruthy()
  })

  it('filters by category when clicked', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    fireEvent.click(screen.getByText('Cat1'))
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.queryByText('Project B')).toBeNull()
  })

  it('shows all again when "Tất cả" clicked', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    fireEvent.click(screen.getByText('Cat1'))
    fireEvent.click(screen.getByText('Tất cả'))
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.getByText('Project B')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/ProjectsListing.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Create ProjectsListing component**

Create `src/components/sections/ProjectsListing.tsx`:

```typescript
"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import type { SanityProject, SanityProjectCategory } from "@/sanity/lib/types";

interface Props {
  projects: SanityProject[];
  categories: SanityProjectCategory[];
}

export default function ProjectsListing({ projects, categories }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? projects.filter((p) => p.category === active)
    : projects;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => setActive(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            active === null
              ? "bg-wood-600 text-white border-wood-600"
              : "border-wood-300 dark:border-wood-500 text-wood-600 dark:text-wood-200 hover:bg-wood-600 hover:text-white hover:border-wood-600"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === cat.name
                ? "bg-wood-600 text-white border-wood-600"
                : "border-wood-300 dark:border-wood-500 text-wood-600 dark:text-wood-200 hover:bg-wood-600 hover:text-white hover:border-wood-600"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/ProjectsListing.test.tsx`
Expected: PASS

- [ ] **Step 5: Update the projects page**

Modify `src/app/(site)/cong-trinh/page.tsx`:

```typescript
import type { Metadata } from "next";
import Image from "next/image";
import ProjectsListing from "@/components/sections/ProjectsListing";
import { getAllProjects, getProjectCategories } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Công trình",
  description: "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getAllProjects(),
    getProjectCategories(),
  ]);

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
          <ProjectsListing projects={projects} categories={categories} />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ProjectsListing.tsx src/__tests__/components/ProjectsListing.test.tsx src/app/(site)/cong-trinh/page.tsx
git commit -m "feat(cms): wire projects listing to Sanity with category filter"
```

---

### Task 11: Wire Project detail page to Sanity CMS

**Files:**
- Modify: `src/app/(site)/cong-trinh/[slug]/page.tsx`

**Context:** The current detail page finds a project from `FEATURED_PROJECTS` by slug and uses hardcoded `DETAIL_IMAGES`. With Sanity, it uses `getProjectBySlug()` which returns images from the project document. The `generateStaticParams()` should fetch all project slugs from Sanity.

- [ ] **Step 1: Update the project detail page**

Modify `src/app/(site)/cong-trinh/[slug]/page.tsx`:

1. Replace data imports:
```typescript
// Remove:
import { FEATURED_PROJECTS } from "@/lib/data";
// Add:
import { getProjectBySlug, getAllProjects } from "@/sanity/lib/fetchers";
```

2. Update `generateMetadata`:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Không tìm thấy" };
  return {
    title: project.title,
    description: project.description,
  };
}
```

3. Update `generateStaticParams`:
```typescript
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}
```

4. Update the main component:
```typescript
export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Use project.images from CMS, or fall back to thumbnail as single image
  const galleryImages = project.images?.length
    ? project.images
    : [project.thumbnail];

  // ... render using project.title, project.category, project.location,
  // project.completedYear, project.description, project.thumbnail, galleryImages
}
```

5. Remove the hardcoded `DETAIL_IMAGES` array.

6. Update the gallery grid to use `galleryImages`:
```typescript
<div className="grid grid-cols-2 gap-3">
  {galleryImages.map((img, i) => (
    <div key={i} className="relative h-48 rounded-lg overflow-hidden">
      <Image src={img} alt={`${project.title} - ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
    </div>
  ))}
</div>
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/cong-trinh/[slug]/page.tsx
git commit -m "feat(cms): wire project detail page to Sanity CMS"
```

---

### Task 12: Wire Contact page to Sanity CMS

**Files:**
- Modify: `src/app/(site)/lien-he/page.tsx`

**Context:** The contact page imports `SITE_SETTINGS` from `data.ts` and uses its fields directly. It should fetch from Sanity via `getSiteSettings()`. The `QuoteForm` on this page should also receive `houseTypes` from CMS.

- [ ] **Step 1: Update the contact page**

Modify `src/app/(site)/lien-he/page.tsx`:

1. Replace imports:
```typescript
// Remove:
import { SITE_SETTINGS } from "@/lib/data";
// Add:
import { getSiteSettings, getFeaturedTemplates } from "@/sanity/lib/fetchers";
```

2. Make it async and fetch data:
```typescript
export default async function ContactPage() {
  const [siteSettings, templates] = await Promise.all([
    getSiteSettings(),
    getFeaturedTemplates(),
  ]);
  const houseTypes = templates.map((t) => t.name);
```

3. Replace all `SITE_SETTINGS.xxx` references with `siteSettings.xxx`.

4. Pass `houseTypes` to QuoteForm:
```typescript
<QuoteForm houseTypes={houseTypes} />
```

5. Handle optional `phoneRaw` — the Sanity `siteSettings` schema doesn't have `phoneRaw`, so derive it:
```typescript
const phoneRaw = siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, "");
```

Use `phoneRaw` in the `tel:` href.

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/lien-he/page.tsx
git commit -m "feat(cms): wire contact page to Sanity CMS data"
```

---

### Task 13: Update site layout to use shared fetcher

**Files:**
- Modify: `src/app/(site)/layout.tsx`

**Context:** The site layout has its own inline `getSiteSettings()` function. Now that we have a shared fetcher in `fetchers.ts`, the layout should use it instead to avoid duplication.

- [ ] **Step 1: Update the layout**

Modify `src/app/(site)/layout.tsx`:

```typescript
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { getSiteSettings } from "@/sanity/lib/fetchers";

export const revalidate = 3600;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

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

This removes the inline `getSiteSettings()` function and the `SITE_SETTINGS` import from `data.ts`.

- [ ] **Step 2: Verify existing tests still pass**

Run: `npx vitest run src/__tests__/components/SiteSettings.test.tsx`
Expected: PASS (this test verifies header/footer rendering, should still work)

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/layout.tsx
git commit -m "refactor(cms): use shared getSiteSettings fetcher in site layout"
```

---

### Task 14: Run all unit tests and fix regressions

**Files:**
- Potentially any modified file

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass. If any fail, investigate and fix.

- [ ] **Step 2: Fix any regressions**

Common issues to check:
- Tests that render `<HeroSlider />` without props should still work (defaults to `HERO_SLIDES`)
- Tests importing from `data.ts` should still work (file is retained)
- Mock setup for `next/image` and `next/link` in test files

- [ ] **Step 3: Commit fixes if any**

```bash
git add -A
git commit -m "fix(cms): resolve test regressions from CMS integration"
```

---

### Task 15: E2E tests for CMS integration

**Files:**
- Create: `tests/e2e/cms-integration.spec.ts`

**Context:** E2E tests verify that pages render correctly with data (whether from Sanity or fallback). These tests don't need to distinguish between CMS and static data — they just verify the pages work end-to-end.

- [ ] **Step 1: Create E2E test file**

Create `tests/e2e/cms-integration.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('TC-01: CMS Integration', () => {
  test('TC-01-01: Homepage displays content', async ({ page }) => {
    await page.goto('/')
    // Hero slider
    await expect(page.locator('h1').first()).toBeVisible()
    // Highlights section
    await expect(page.getByText('Năm Kinh Nghiệm').or(page.getByText('kinh nghiệm'))).toBeVisible()
    // Projects grid
    await expect(page.locator('[href^="/cong-trinh/"]').first()).toBeVisible()
    // FAQ section
    const faqSection = page.locator('text=Câu Hỏi Thường Gặp').or(page.locator('text=FAQ'))
    await expect(faqSection.or(page.locator('button').filter({ hasText: /\?/ }).first())).toBeVisible()
  })

  test('TC-01-02: About page displays content', async ({ page }) => {
    await page.goto('/gioi-thieu')
    await expect(page.locator('h1')).toContainText('Giới Thiệu')
    // Stats bar
    await expect(page.getByText('Năm kinh nghiệm').or(page.getByText('kinh nghiệm'))).toBeVisible()
    // Story section
    await expect(page.getByText('Tâm Huyết').or(page.getByText('truyền thống'))).toBeVisible()
  })

  test('TC-01-03: Projects page displays projects with filter', async ({ page }) => {
    await page.goto('/cong-trinh')
    await expect(page.locator('h1')).toContainText('Công Trình')
    // Category filter
    await expect(page.getByText('Tất cả')).toBeVisible()
    // Project cards
    await expect(page.locator('[href^="/cong-trinh/"]').first()).toBeVisible()
  })

  test('TC-01-04: Project detail page', async ({ page }) => {
    await page.goto('/cong-trinh')
    // Click first project
    const firstProject = page.locator('[href^="/cong-trinh/"]').first()
    await firstProject.click()
    // Should show project detail
    await expect(page.locator('h1')).toBeVisible()
    // Back link
    await expect(page.getByText('Tất cả công trình').or(page.locator('[href="/cong-trinh"]'))).toBeVisible()
  })

  test('TC-01-05: Contact page displays contact info', async ({ page }) => {
    await page.goto('/lien-he')
    await expect(page.locator('h1')).toContainText('Liên Hệ')
    // Contact details
    await expect(page.getByText('Điện thoại')).toBeVisible()
    await expect(page.getByText('Email')).toBeVisible()
    await expect(page.getByText('Địa chỉ')).toBeVisible()
  })

  test('TC-01-06: Header and footer display data', async ({ page }) => {
    await page.goto('/')
    // Header phone
    const header = page.locator('header')
    await expect(header).toBeVisible()
    // Footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByText('Facebook').or(footer.locator('a[href*="facebook"]'))).toBeVisible()
  })

  test('TC-01-10: Non-existent project slug shows 404', async ({ page }) => {
    const response = await page.goto('/cong-trinh/non-existent-project-slug-xyz')
    // Should be 404
    expect(response?.status()).toBe(404)
  })

  test('TC-01-03 filter: category filter works', async ({ page }) => {
    await page.goto('/cong-trinh')
    // Count all project cards
    const allCards = page.locator('[href^="/cong-trinh/"]')
    const totalCount = await allCards.count()

    if (totalCount > 1) {
      // Click a specific category button (not "Tất cả")
      const categoryButtons = page.locator('button').filter({ hasNotText: 'Tất cả' })
      const firstCategoryBtn = categoryButtons.first()
      if (await firstCategoryBtn.isVisible()) {
        await firstCategoryBtn.click()
        // Should show fewer or equal projects
        const filteredCount = await allCards.count()
        expect(filteredCount).toBeLessThanOrEqual(totalCount)

        // Click "Tất cả" to show all again
        await page.getByText('Tất cả').click()
        const resetCount = await allCards.count()
        expect(resetCount).toBe(totalCount)
      }
    }
  })
})
```

- [ ] **Step 2: Run E2E tests**

Run: `npx playwright test tests/e2e/cms-integration.spec.ts`
Expected: All tests pass

- [ ] **Step 3: Fix any failures and re-run**

If tests fail, fix the page components and re-run until all pass.

- [ ] **Step 4: Run all E2E tests to check for regressions**

Run: `npx playwright test`
Expected: All tests pass (including existing dark-mode, not-found, faq-section specs)

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/cms-integration.spec.ts
git commit -m "test(cms): add E2E tests for CMS integration (TC-01)"
```

---

### Task 16: Final verification

**Files:** None (verification only)

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Run all E2E tests**

Run: `npx playwright test`
Expected: All tests pass

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 5: Verify no regressions in test results**

Cross-reference with TC-01 test cases:
- TC-01-01 through TC-01-06: Covered by E2E tests
- TC-01-07: Manual QA (Sanity Studio editing)
- TC-01-08 through TC-01-12: Covered by unit tests (empty arrays, single slide, non-existent slug)
- TC-01-13, TC-01-14: Covered by unit test fallback behavior (fetcher error → static data)
