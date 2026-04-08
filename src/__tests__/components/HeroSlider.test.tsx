import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroSlider, { type HeroSlide } from '@/components/sections/HeroSlider'

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

const mockSlides: HeroSlide[] = [
  {
    _id: 'slide-1',
    headline: 'Headline One',
    subheadline: 'Subheadline One',
    ctaLabel: 'CTA One',
    ctaLink: '/link-1',
    image: { asset: { url: 'https://example.com/slide1.jpg' } },
  },
  {
    _id: 'slide-2',
    headline: 'Headline Two',
    subheadline: 'Subheadline Two',
    ctaLabel: 'CTA Two',
    ctaLink: '/link-2',
    image: { asset: { url: 'https://example.com/slide2.jpg' } },
  },
  {
    _id: 'slide-3',
    headline: 'Headline Three',
    subheadline: 'Subheadline Three',
    ctaLabel: 'CTA Three',
    ctaLink: '/link-3',
    image: { asset: { url: 'https://example.com/slide3.jpg' } },
  },
]

describe('TC-01 to TC-04: HeroSlider CMS props', () => {
  it('TC-01: renders all headline texts from slides prop in the DOM', () => {
    render(<HeroSlider slides={mockSlides} />)
    expect(document.body.innerHTML).toContain('Headline One')
    expect(document.body.innerHTML).toContain('Headline Two')
    expect(document.body.innerHTML).toContain('Headline Three')
  })

  it('TC-01: slide count indicator reflects 3 slides (3 dot buttons)', () => {
    render(<HeroSlider slides={mockSlides} />)
    const dotBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-label')?.match(/chuyển đến slide \d+/i)
    )
    expect(dotBtns).toHaveLength(3)
  })

  it('TC-02: first slide headline is in the DOM by default', () => {
    render(<HeroSlider slides={mockSlides} />)
    expect(document.body.innerHTML).toContain('Headline One')
  })

  it('TC-02: dot navigation has correct count', () => {
    render(<HeroSlider slides={mockSlides} />)
    const dotBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-label')?.match(/chuyển đến slide \d+/i)
    )
    expect(dotBtns).toHaveLength(3)
  })

  it('TC-03: renders with a single slide without crashing', () => {
    expect(() => render(<HeroSlider slides={[mockSlides[0]]} />)).not.toThrow()
    expect(document.body.innerHTML).toContain('Headline One')
  })

  it('TC-04: renders with empty slides array without crashing', () => {
    expect(() => render(<HeroSlider slides={[]} />)).not.toThrow()
  })

  it('TC-04: renders with null slides without crashing', () => {
    expect(() => render(<HeroSlider slides={null} />)).not.toThrow()
  })
})

describe('US-27: HeroSlider mobile responsiveness', () => {
  it('headline uses small mobile text size (text-3xl) for 375px screens', () => {
    render(<HeroSlider slides={mockSlides} />)
    const heading = document.querySelector('h1')
    expect(heading).not.toBeNull()
    expect(heading?.className).toMatch(/text-3xl/)
  })

  it('previous arrow button has aria-label', () => {
    render(<HeroSlider slides={mockSlides} />)
    const buttons = screen.getAllByRole('button')
    const prevBtn = buttons.find((b) => b.getAttribute('aria-label')?.match(/trước|previous|prev/i))
    expect(prevBtn).toBeTruthy()
  })

  it('next arrow button has aria-label', () => {
    render(<HeroSlider slides={mockSlides} />)
    const buttons = screen.getAllByRole('button')
    const nextBtn = buttons.find((b) => b.getAttribute('aria-label')?.match(/tiếp|next/i))
    expect(nextBtn).toBeTruthy()
  })

  it('arrow buttons have minimum 44px tap target (min-w-[44px] and min-h-[44px])', () => {
    render(<HeroSlider slides={mockSlides} />)
    const buttons = screen.getAllByRole('button')
    const arrowBtns = buttons.filter((b) =>
      b.getAttribute('aria-label')?.match(/trước|tiếp|previous|next/i)
    )
    expect(arrowBtns.length).toBeGreaterThanOrEqual(2)
    arrowBtns.forEach((btn) => {
      expect(btn.className).toMatch(/min-w-\[44px\]/)
      expect(btn.className).toMatch(/min-h-\[44px\]/)
    })
  })

  it('dot navigation buttons have aria-label', () => {
    render(<HeroSlider slides={mockSlides} />)
    const buttons = screen.getAllByRole('button')
    const dotBtns = buttons.filter((b) => b.getAttribute('aria-label')?.match(/slide/i))
    expect(dotBtns.length).toBeGreaterThan(0)
  })

  it('dot buttons have minimum 44px tap target size', () => {
    render(<HeroSlider slides={mockSlides} />)
    const buttons = screen.getAllByRole('button')
    const dotBtns = buttons.filter((b) => b.getAttribute('aria-label')?.match(/slide/i))
    expect(dotBtns.length).toBeGreaterThan(0)
    dotBtns.forEach((btn) => {
      expect(btn.className).toMatch(/min-w-\[44px\]|min-h-\[44px\]/)
    })
  })
})
