import { test, expect } from '@playwright/test'

// NOTE: GA4 scripts only load in production mode (NODE_ENV=production).
// The dev server runs in development mode, so GoogleAnalytics component
// returns null and trackEvent() is a no-op. Tests verify UI elements
// exist and are interactive; full gtag event verification requires a
// production build.

test.describe('US-11: GA4 Integration', () => {
  test('TC-11-01: GA4 script loads on homepage @production', async ({ page }) => {
    // Skip in dev — GoogleAnalytics component returns null when NODE_ENV !== 'production'
    test.skip(process.env.NODE_ENV !== 'production', 'GA4 scripts only injected in production mode')

    await page.goto('/')
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]')
    await expect(gtagScript).toHaveCount(1)
    const src = await gtagScript.getAttribute('src')
    expect(src).toContain('G-')
  })

  test('TC-11-04: phone_click — header phone link exists and is clickable', async ({ page }) => {
    await page.goto('/')

    const phoneLink = page.locator('header a[href^="tel:"]').first()
    await expect(phoneLink).toBeVisible()
    await expect(phoneLink).toHaveAttribute('href', /^tel:/)

    // Click to verify no errors occur
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await phoneLink.click({ noWaitAfter: true })
    await page.waitForTimeout(300)
    expect(errors).toHaveLength(0)
  })

  test('TC-11-05: zalo_click — floating Zalo CTA exists and is clickable', async ({ page }) => {
    await page.goto('/')

    const zaloLink = page.locator('a[href*="zalo.me"]')
    await expect(zaloLink).toHaveCount(1)
    await expect(zaloLink).toHaveAttribute('href', /zalo\.me/)

    // Scroll to trigger FloatingCTA visibility (requires scrollY > 200)
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(500)

    // Force visibility in case CSS transition hasn't completed
    await zaloLink.evaluate((el) => {
      const parent = el.closest('[class*="fixed"]') as HTMLElement | null
      if (parent) {
        parent.style.opacity = '1'
        parent.style.transform = 'none'
        parent.style.pointerEvents = 'auto'
      }
      el.removeAttribute('target')
    })

    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await zaloLink.click({ noWaitAfter: true })
    await page.waitForTimeout(300)
    expect(errors).toHaveLength(0)
  })

  test('TC-11-13: site works without GA errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await page.waitForTimeout(1000)

    const gtagErrors = errors.filter((e) => e.includes('gtag'))
    expect(gtagErrors).toHaveLength(0)
  })
})
