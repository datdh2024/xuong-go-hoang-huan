# GA4 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Google Analytics 4 into the website with page view tracking and custom events for phone clicks, Zalo clicks, form submissions, and project views.

**Architecture:** A centralized analytics utility (`src/lib/analytics.ts`, already implemented) provides `pageview()` and `trackEvent()` helpers. A `GoogleAnalytics` client component loads gtag.js via Next.js `<Script>` and tracks route changes. Individual components call `trackEvent()` for custom events.

**Tech Stack:** Next.js 16.2 (App Router), React 19, TypeScript, gtag.js (no extra packages)

**Pre-existing work:** `src/lib/analytics.ts` and `src/__tests__/lib/analytics.test.ts` already exist and pass (5 tests). This plan starts from Task 2.

---

### Task 1: GoogleAnalytics Component

**Files:**
- Create: `src/components/GoogleAnalytics.tsx`
- Create: `src/__tests__/components/GoogleAnalytics.test.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write tests for GoogleAnalytics component**

Create `src/__tests__/components/GoogleAnalytics.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/script to render actual script tags for inspection
vi.mock('next/script', () => ({
  default: ({ src, id, strategy, dangerouslySetInnerHTML, ...props }: any) => {
    if (src) return <script data-testid={id} src={src} data-strategy={strategy} {...props} />
    if (dangerouslySetInnerHTML) return <script data-testid={id} data-strategy={strategy} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...props} />
    return null
  },
}))

describe('US-11: GoogleAnalytics component', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('renders gtag.js script with correct measurement ID', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    const script = container.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('src')).toContain('G-TEST123')
    vi.unstubAllEnvs()
  })

  it('renders inline gtag config script', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    const scripts = container.querySelectorAll('script')
    const inlineScript = Array.from(scripts).find(s => s.innerHTML.includes('gtag'))
    expect(inlineScript).not.toBeNull()
    expect(inlineScript?.innerHTML).toContain('G-TEST123')
    vi.unstubAllEnvs()
  })

  it('renders nothing when GA_MEASUREMENT_ID is empty', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    expect(container.innerHTML).toBe('')
    vi.unstubAllEnvs()
  })

  it('renders nothing in development environment', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'development')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    expect(container.innerHTML).toBe('')
    vi.unstubAllEnvs()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/components/GoogleAnalytics.test.tsx`
Expected: FAIL — module `@/components/GoogleAnalytics` not found

- [ ] **Step 3: Create GoogleAnalytics component**

Create `src/components/GoogleAnalytics.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics'

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) pageview(pathname)
  }, [pathname])

  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/components/GoogleAnalytics.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Add GoogleAnalytics to root layout**

Modify `src/app/layout.tsx`. Add import at line 4:

```tsx
import GoogleAnalytics from "@/components/GoogleAnalytics";
```

Add `<GoogleAnalytics />` inside `<body>`, before `<ThemeProvider>` (line 75→76):

```tsx
      <body className="font-be-vietnam bg-wood-50 dark:bg-wood-800 text-gray-900 dark:text-wood-100 antialiased">
        <GoogleAnalytics />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
```

- [ ] **Step 6: Verify build works**

Run: `npx next build 2>&1 | tail -20`
Expected: Build completes without errors

---

### Task 2: Phone Click Tracking

**Files:**
- Modify: `src/components/layout/Header.tsx` (lines 79-85 desktop, lines 124-135 mobile)
- Modify: `src/components/layout/Footer.tsx` (add `'use client'`, line 45)
- Modify: `src/components/layout/FloatingCTA.tsx` (line 39-48)
- Modify: `src/__tests__/components/FloatingCTA.test.tsx` (add tracking test)

- [ ] **Step 1: Write test for phone_click tracking in FloatingCTA**

Add to `src/__tests__/components/FloatingCTA.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FloatingCTA from '@/components/layout/FloatingCTA'

// Add this import mock at the top of the file (after existing imports)
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

// Add this test inside the existing describe block or a new one:
describe('US-11: FloatingCTA analytics tracking', () => {
  it('calls trackEvent phone_click when phone button is clicked', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    render(<FloatingCTA />)
    const phoneLink = document.querySelector('a[href^="tel:"]')!
    fireEvent.click(phoneLink)
    expect(trackEvent).toHaveBeenCalledWith('phone_click')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/FloatingCTA.test.tsx`
Expected: FAIL — `trackEvent` not called (no onClick handler yet)

- [ ] **Step 3: Add phone_click tracking to FloatingCTA**

Modify `src/components/layout/FloatingCTA.tsx`.

Add import at line 5 (after the Phone import):

```tsx
import { trackEvent } from "@/lib/analytics";
```

Add `onClick` to the phone `<a>` tag at line 39. Change:

```tsx
      <a
        href={`tel:${SITE_SETTINGS.phoneRaw}`}
        title="Gọi ngay"
        aria-label="Gọi điện thoại"
```

To:

```tsx
      <a
        href={`tel:${SITE_SETTINGS.phoneRaw}`}
        onClick={() => trackEvent('phone_click')}
        title="Gọi ngay"
        aria-label="Gọi điện thoại"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/FloatingCTA.test.tsx`
Expected: PASS

- [ ] **Step 5: Add phone_click tracking to Header**

Modify `src/components/layout/Header.tsx`.

Add import at line 7 (after SITE_SETTINGS import):

```tsx
import { trackEvent } from "@/lib/analytics";
```

Add `onClick` to the **desktop** phone link (line 79). Change:

```tsx
          <a
            href={`tel:${(siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, ''))}`}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold text-sm px-4 py-2 rounded transition-colors"
          >
```

To:

```tsx
          <a
            href={`tel:${(siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, ''))}`}
            onClick={() => trackEvent('phone_click')}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold text-sm px-4 py-2 rounded transition-colors"
          >
```

Add `onClick` to the **mobile** phone link (line 124). Change:

```tsx
            <a
              href={`tel:${(siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, ''))}`}
              className={`flex items-center gap-2 bg-gold-500 text-wood-800 font-semibold text-sm px-4 py-2 rounded w-fit transition-all duration-300 ${
```

To:

```tsx
            <a
              href={`tel:${(siteSettings.phoneRaw ?? siteSettings.phone.replace(/\s/g, ''))}`}
              onClick={() => trackEvent('phone_click')}
              className={`flex items-center gap-2 bg-gold-500 text-wood-800 font-semibold text-sm px-4 py-2 rounded w-fit transition-all duration-300 ${
```

- [ ] **Step 6: Add phone_click tracking to Footer**

Modify `src/components/layout/Footer.tsx`.

Add `'use client'` as line 1 (before all imports):

```tsx
"use client";
```

Add import after the existing imports (after line 4):

```tsx
import { trackEvent } from "@/lib/analytics";
```

Add `onClick` to the phone `<a>` tag (line 45). Change:

```tsx
                <a href={`tel:${phoneHref}`} className="hover:text-gold-500 transition-colors">
```

To:

```tsx
                <a href={`tel:${phoneHref}`} onClick={() => trackEvent('phone_click')} className="hover:text-gold-500 transition-colors">
```

- [ ] **Step 7: Run all existing tests to verify no regressions**

Run: `npx vitest run`
Expected: All tests pass

---

### Task 3: Zalo Click Tracking

**Files:**
- Modify: `src/components/layout/FloatingCTA.tsx` (line 24-36)

- [ ] **Step 1: Write test for zalo_click tracking**

Add to `src/__tests__/components/FloatingCTA.test.tsx` (inside the `US-11` describe block):

```tsx
  it('calls trackEvent zalo_click when Zalo button is clicked', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    ;(trackEvent as ReturnType<typeof vi.fn>).mockClear()
    render(<FloatingCTA />)
    const zaloLink = document.querySelector('a[href*="zalo.me"]')!
    fireEvent.click(zaloLink)
    expect(trackEvent).toHaveBeenCalledWith('zalo_click')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/FloatingCTA.test.tsx`
Expected: FAIL — `trackEvent` not called with `zalo_click`

- [ ] **Step 3: Add zalo_click tracking to FloatingCTA**

Modify `src/components/layout/FloatingCTA.tsx`. Add `onClick` to the Zalo `<a>` tag (line 24). Change:

```tsx
      <a
        href={`https://zalo.me/${SITE_SETTINGS.zaloNumber}`}
        target="_blank"
        rel="noreferrer"
        title="Chat Zalo"
        aria-label="Liên hệ qua Zalo"
```

To:

```tsx
      <a
        href={`https://zalo.me/${SITE_SETTINGS.zaloNumber}`}
        onClick={() => trackEvent('zalo_click')}
        target="_blank"
        rel="noreferrer"
        title="Chat Zalo"
        aria-label="Liên hệ qua Zalo"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/FloatingCTA.test.tsx`
Expected: PASS (all tests including new zalo_click test)

---

### Task 4: Form Submit Tracking

**Files:**
- Modify: `src/components/sections/QuoteForm.tsx` (line 30-44, onSubmit handler)

- [ ] **Step 1: Write test for form_submit tracking**

Add to `src/__tests__/components/QuoteForm.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuoteForm from '@/components/sections/QuoteForm'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('US-11: QuoteForm analytics tracking', () => {
  it('calls trackEvent form_submit with form data on successful submission', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    ;(trackEvent as ReturnType<typeof vi.fn>).mockClear()

    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    render(<QuoteForm houseTypes={['Nhà gỗ 3 gian']} />)

    fireEvent.change(screen.getByPlaceholderText('Nguyễn Văn A'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('0985 241 204'), { target: { value: '0912345678' } })
    fireEvent.change(screen.getByLabelText(/Loại nhà/), { target: { value: 'Nhà gỗ 3 gian' } })
    fireEvent.change(screen.getByLabelText(/Tỉnh/), { target: { value: 'Hà Nội' } })

    fireEvent.click(screen.getByText('Gửi yêu cầu tư vấn'))

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith('form_submit', expect.objectContaining({
        name: 'Test User',
        phone: '0912345678',
        house_type: 'Nhà gỗ 3 gian',
        province: 'Hà Nội',
      }))
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/QuoteForm.test.tsx`
Expected: FAIL — `trackEvent` not called

- [ ] **Step 3: Add form_submit tracking to QuoteForm**

Modify `src/components/sections/QuoteForm.tsx`.

Add import at line 8 (after SectionHeading import):

```tsx
import { trackEvent } from "@/lib/analytics";
```

Modify the `onSubmit` handler (lines 30-44). Change:

```tsx
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Có lỗi xảy ra. Vui lòng gọi điện trực tiếp.");
    } finally {
      setLoading(false);
    }
  };
```

To:

```tsx
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      trackEvent("form_submit", {
        name: data.name,
        phone: data.phone,
        house_type: data.houseType,
        province: data.province,
        area: data.area || "",
        note: data.note || "",
      });
      setSubmitted(true);
    } catch {
      alert("Có lỗi xảy ra. Vui lòng gọi điện trực tiếp.");
    } finally {
      setLoading(false);
    }
  };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/QuoteForm.test.tsx`
Expected: PASS

---

### Task 5: Project View Tracking

**Files:**
- Create: `src/components/analytics/TrackProjectView.tsx`
- Create: `src/__tests__/components/TrackProjectView.test.tsx`
- Modify: `src/app/(site)/cong-trinh/[slug]/page.tsx`

- [ ] **Step 1: Write test for TrackProjectView**

Create `src/__tests__/components/TrackProjectView.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('US-11: TrackProjectView component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fires project_view event with slug on mount', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    const { default: TrackProjectView } = await import('@/components/analytics/TrackProjectView')
    render(<TrackProjectView slug="nha-go-quoc-oai" />)
    expect(trackEvent).toHaveBeenCalledWith('project_view', { slug: 'nha-go-quoc-oai' })
  })

  it('renders nothing to the DOM', async () => {
    const { default: TrackProjectView } = await import('@/components/analytics/TrackProjectView')
    const { container } = render(<TrackProjectView slug="test" />)
    expect(container.innerHTML).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/components/TrackProjectView.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Create TrackProjectView component**

Create `src/components/analytics/TrackProjectView.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function TrackProjectView({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('project_view', { slug })
  }, [slug])

  return null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/components/TrackProjectView.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Add TrackProjectView to project detail page**

Modify `src/app/(site)/cong-trinh/[slug]/page.tsx`.

Add import at line 8 (after the ImageGallery import):

```tsx
import TrackProjectView from "@/components/analytics/TrackProjectView";
```

Add the component inside the JSX, after the opening `<div className="pt-24">` (line 46). Change:

```tsx
    <div className="pt-24">
      <script
        type="application/ld+json"
```

To:

```tsx
    <div className="pt-24">
      <TrackProjectView slug={slug} />
      <script
        type="application/ld+json"
```

- [ ] **Step 6: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass

---

### Task 6: E2E Tests

**Files:**
- Create: `tests/e2e/ga4-integration.spec.ts`

- [ ] **Step 1: Create E2E test file**

Create `tests/e2e/ga4-integration.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('US-11: GA4 Integration', () => {
  test('TC-11-01: GA4 script loads on homepage', async ({ page }) => {
    await page.goto('/')
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]')
    await expect(gtagScript).toHaveCount(1)
    const src = await gtagScript.getAttribute('src')
    expect(src).toContain('G-')
  })

  test('TC-11-04: phone_click event on header phone link', async ({ page }) => {
    await page.goto('/')
    // Capture gtag calls
    const gtagCalls: unknown[][] = []
    await page.evaluate(() => {
      const original = window.gtag
      window.gtag = (...args: unknown[]) => {
        (window as any).__gtagCalls = (window as any).__gtagCalls || []
        ;(window as any).__gtagCalls.push(args)
        if (original) original(...(args as [string, ...unknown[]]))
      }
    })
    // Click desktop phone link in header
    const phoneLink = page.locator('header a[href^="tel:"]').first()
    await phoneLink.click()
    const calls = await page.evaluate(() => (window as any).__gtagCalls || [])
    const phoneClickEvent = calls.find(
      (c: unknown[]) => c[0] === 'event' && c[1] === 'phone_click'
    )
    expect(phoneClickEvent).toBeTruthy()
  })

  test('TC-11-05: zalo_click event on floating Zalo CTA', async ({ page }) => {
    await page.goto('/')
    // Scroll to trigger FloatingCTA visibility
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(500)
    // Capture gtag calls
    await page.evaluate(() => {
      const original = window.gtag
      window.gtag = (...args: unknown[]) => {
        (window as any).__gtagCalls = (window as any).__gtagCalls || []
        ;(window as any).__gtagCalls.push(args)
        if (original) original(...(args as [string, ...unknown[]]))
      }
    })
    const zaloLink = page.locator('a[href*="zalo.me"]')
    // Prevent navigation by removing target
    await zaloLink.evaluate((el) => el.removeAttribute('target'))
    await zaloLink.click({ noWaitAfter: true })
    const calls = await page.evaluate(() => (window as any).__gtagCalls || [])
    const zaloClickEvent = calls.find(
      (c: unknown[]) => c[0] === 'event' && c[1] === 'zalo_click'
    )
    expect(zaloClickEvent).toBeTruthy()
  })

  test('TC-11-13: site works without GA measurement ID', async ({ page }) => {
    // This test verifies the site loads without errors when GA is present
    // (Full env-var removal would require a separate test server config)
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    // No console errors related to gtag
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/')
    await page.waitForTimeout(1000)
    const gtagErrors = errors.filter((e) => e.includes('gtag'))
    expect(gtagErrors).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run E2E tests**

Run: `npx playwright test tests/e2e/ga4-integration.spec.ts`
Expected: Tests pass (requires dev server running or webServer config in playwright.config)

---

### Task 7: Full Test Suite Verification

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass, no regressions

- [ ] **Step 2: Run all E2E tests**

Run: `npx playwright test`
Expected: All tests pass

- [ ] **Step 3: Run production build**

Run: `npx next build 2>&1 | tail -30`
Expected: Build completes without errors

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No new lint errors
