import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}))

vi.mock('@/sanity/lib/fetchers', () => ({
  getAboutPage: vi.fn().mockResolvedValue(null),
}))

describe('US-24: About page hero image', () => {
  it('does not use the broken Unsplash photo ID', async () => {
    const { default: AboutPage } = await import('@/app/(site)/gioi-thieu/page')
    const jsx = await AboutPage()
    render(jsx)
    const images = document.querySelectorAll('img')
    const heroImage = images[0]
    expect(heroImage.getAttribute('src')).not.toContain('photo-1565793979732-8ae1cc8a5e55')
  })

  it('hero image src is a valid non-empty URL', async () => {
    const { default: AboutPage } = await import('@/app/(site)/gioi-thieu/page')
    const jsx = await AboutPage()
    render(jsx)
    const images = document.querySelectorAll('img')
    const heroImage = images[0]
    const src = heroImage.getAttribute('src') ?? ''
    expect(src).toMatch(/^https?:\/\//)
  })

  it('hero image has a descriptive alt text (not just company name)', async () => {
    const { default: AboutPage } = await import('@/app/(site)/gioi-thieu/page')
    const jsx = await AboutPage()
    render(jsx)
    const images = document.querySelectorAll('img')
    const heroImage = images[0]
    const alt = heroImage.getAttribute('alt') ?? ''
    // Should include more than just the bare company name for context
    expect(alt.length).toBeGreaterThan('Xưởng Gỗ Hoàng Huân'.length)
  })
})
