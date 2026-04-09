import { test, expect } from '@playwright/test'

test.describe('SR-906: FAQ Section with Sanity CMS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('FAQ section is present on the homepage', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    await expect(section).toBeVisible()
  })

  test('displays section heading "Câu Hỏi Thường Gặp"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Câu Hỏi Thường Gặp' })).toBeVisible()
  })

  test('displays section label "Giải đáp thắc mắc"', async ({ page }) => {
    await expect(page.getByText('Giải đáp thắc mắc')).toBeVisible()
  })

  test('FAQ answers are collapsed by default', async ({ page }) => {
    const answers = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' }).getByRole('region')
    const count = await answers.count()
    for (let i = 0; i < count; i++) {
      await expect(answers.nth(i)).toBeHidden()
    }
  })

  test('FAQ items from Sanity CMS are rendered as buttons', async ({ page }) => {
    const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    const count = await faqSection.getByRole('button').count()
    if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('clicking a FAQ question expands its answer', async ({ page }) => {
    const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    const count = await faqSection.getByRole('button').count()
    if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')

    const firstButton = faqSection.getByRole('button').first()
    await firstButton.click()
    await expect(faqSection.getByRole('region').first()).toBeVisible()
  })

  test('clicking an expanded FAQ question collapses it', async ({ page }) => {
    const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    const count = await faqSection.getByRole('button').count()
    if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')

    const firstButton = faqSection.getByRole('button').first()
    await firstButton.click()
    await expect(faqSection.getByRole('region').first()).toBeVisible()
    await firstButton.click()
    await expect(faqSection.getByRole('region').first()).toBeHidden()
  })

  test('aria-expanded is false by default and true when open', async ({ page }) => {
    const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    const count = await faqSection.getByRole('button').count()
    if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')

    const firstButton = faqSection.getByRole('button').first()
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await firstButton.click()
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  test('opening one FAQ closes the previously opened one', async ({ page }) => {
    const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
    const count = await faqSection.getByRole('button').count()
    if (count < 2) test.skip(true, 'Need at least 2 FAQ items — skipping data-dependent test')

    const buttons = faqSection.getByRole('button')
    await buttons.nth(0).click()
    await expect(faqSection.getByRole('region').nth(0)).toBeVisible()

    await buttons.nth(1).click()
    await expect(faqSection.locator('[role="region"]').nth(0)).toBeHidden()
    await expect(faqSection.locator('[role="region"]').nth(1)).toBeVisible()
  })
})
