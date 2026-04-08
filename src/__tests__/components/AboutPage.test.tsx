import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AboutPage from '@/components/sections/AboutPage'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}))

vi.mock('@/components/ui/SectionHeading', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

const mockHighlights = [
  { number: '40+', label: 'Năm kinh nghiệm' },
  { number: '500+', label: 'Công trình hoàn thành' },
  { number: '30+', label: 'Tỉnh thành' },
  { number: '1.000m²', label: 'Diện tích xưởng' },
]

describe('TC-11 to TC-14: AboutPage CMS props', () => {
  it('TC-11: renders all stat numbers from highlights prop', () => {
    render(
      <AboutPage
        highlights={mockHighlights}
        story="Câu chuyện công ty"
        heroImageUrl="https://example.com/hero.jpg"
      />
    )
    mockHighlights.forEach((h) => {
      expect(screen.getByText(h.number)).toBeInTheDocument()
    })
  })

  it('TC-11: renders all stat labels from highlights prop', () => {
    render(
      <AboutPage
        highlights={mockHighlights}
        story="Câu chuyện công ty"
        heroImageUrl="https://example.com/hero.jpg"
      />
    )
    mockHighlights.forEach((h) => {
      expect(screen.getByText(h.label)).toBeInTheDocument()
    })
  })

  it('TC-12: renders story text from story prop', () => {
    render(
      <AboutPage
        highlights={mockHighlights}
        story="Đây là câu chuyện về xưởng gỗ của chúng tôi"
        heroImageUrl="https://example.com/hero.jpg"
      />
    )
    expect(screen.getByText('Đây là câu chuyện về xưởng gỗ của chúng tôi')).toBeInTheDocument()
  })

  it('TC-13: renders hero image with the provided heroImageUrl', () => {
    const testUrl = 'https://cdn.sanity.io/hero-test.jpg'
    render(
      <AboutPage
        highlights={mockHighlights}
        story="Story"
        heroImageUrl={testUrl}
      />
    )
    const images = document.querySelectorAll('img')
    const heroImg = images[0]
    expect(heroImg.getAttribute('src')).toBe(testUrl)
  })

  it('TC-14: renders without crashing when all CMS props are null', () => {
    expect(() =>
      render(<AboutPage highlights={null} story={null} heroImageUrl={null} />)
    ).not.toThrow()
  })

  it('TC-14: team section is still visible when CMS data is null', () => {
    render(<AboutPage highlights={null} story={null} heroImageUrl={null} />)
    // Team section heading is always hardcoded
    expect(screen.getByText('Những Người Thợ Tâm Huyết')).toBeInTheDocument()
  })
})
