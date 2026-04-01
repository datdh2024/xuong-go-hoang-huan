import { test, expect, Browser, BrowserContext } from '@playwright/test'

// Helper to get a fresh page with cleared localStorage
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('theme'))
})

test.describe('US-17: Dark mode', () => {
  test('dark mode toggle button is visible in the header', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    await expect(toggle).toBeVisible()
  })

  test('clicking toggle applies dark class to <html>', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)

    await page.getByRole('button', { name: /dark mode|toggle|chế độ/i }).click()

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  })

  test('clicking toggle twice returns to light mode', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /dark mode|toggle|chế độ/i })

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  })

  test('dark preference is saved to localStorage', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /dark mode|toggle|chế độ/i }).click()

    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })

  test('light preference is saved to localStorage after toggling back', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    await toggle.click()
    await toggle.click()

    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('light')
  })

  test('dark mode persists after page reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /dark mode|toggle|chế độ/i }).click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await page.reload()

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  })

  test('light mode persists after page reload', async ({ page }) => {
    // Pre-set dark so we can toggle to light and verify it sticks
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
    await page.goto('/')
    await page.getByRole('button', { name: /dark mode|toggle|chế độ/i }).click()
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)

    await page.reload()

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  })

  test('respects system dark mode preference on first visit (no localStorage)', async ({ browser }) => {
    const context: BrowserContext = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.addInitScript(() => localStorage.removeItem('theme'))

    await page.goto('/')

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await context.close()
  })

  test('respects system light mode preference on first visit (no localStorage)', async ({ browser }) => {
    const context: BrowserContext = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    await page.addInitScript(() => localStorage.removeItem('theme'))

    await page.goto('/')

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
    await context.close()
  })

  test('localStorage overrides system dark preference (user chose light)', async ({ browser }) => {
    const context: BrowserContext = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    await page.goto('/')

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
    await context.close()
  })

  test('localStorage overrides system light preference (user chose dark)', async ({ browser }) => {
    const context: BrowserContext = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))

    await page.goto('/')

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await context.close()
  })

  test('no FOUC: dark class is applied before first paint when dark stored', async ({ page }) => {
    // Inject dark theme before navigation — simulates returning user with saved preference
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))

    // Intercept the HTML response and confirm the inline FOUC-prevention script is present
    let htmlContent = ''
    page.on('response', async (response) => {
      if (response.url().endsWith('/') && response.request().resourceType() === 'document') {
        htmlContent = await response.text()
      }
    })

    await page.goto('/')

    // The FOUC-prevention script must exist in <head> (before any stylesheets)
    expect(htmlContent).toMatch(/<script[\s\S]*?localStorage[\s\S]*?dark[\s\S]*?<\/script>/)

    // And the dark class must be present immediately (no flash)
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  })

  test('dark mode toggle icon changes between sun and moon', async ({ page }) => {
    await page.goto('/')

    // In light mode the toggle should show moon (hint: switch to dark)
    const toggleLight = page.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    await expect(toggleLight).toBeVisible()
    const ariaLabelLight = await toggleLight.getAttribute('aria-label')
    expect(ariaLabelLight).toBeTruthy()

    await toggleLight.click()

    // In dark mode the toggle should show sun (hint: switch to light)
    const toggleDark = page.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    const ariaLabelDark = await toggleDark.getAttribute('aria-label')
    expect(ariaLabelDark).toBeTruthy()

    // The label should change to reflect the new state
    expect(ariaLabelDark).not.toBe(ariaLabelLight)
  })
})
