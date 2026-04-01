import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroSlider from '@/components/sections/HeroSlider'

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

describe('US-27: HeroSlider mobile responsiveness', () => {
  it('headline uses small mobile text size (text-3xl) for 375px screens', () => {
    render(<HeroSlider />)
    const heading = document.querySelector('h1')
    expect(heading).not.toBeNull()
    expect(heading?.className).toMatch(/text-3xl/)
  })

  it('previous arrow button has aria-label', () => {
    render(<HeroSlider />)
    const buttons = screen.getAllByRole('button')
    const prevBtn = buttons.find(b => b.getAttribute('aria-label')?.match(/trước|previous|prev/i))
    expect(prevBtn).toBeTruthy()
  })

  it('next arrow button has aria-label', () => {
    render(<HeroSlider />)
    const buttons = screen.getAllByRole('button')
    const nextBtn = buttons.find(b => b.getAttribute('aria-label')?.match(/tiếp|next/i))
    expect(nextBtn).toBeTruthy()
  })

  it('arrow buttons have minimum 44px tap target (min-w-[44px] and min-h-[44px])', () => {
    render(<HeroSlider />)
    const buttons = screen.getAllByRole('button')
    const arrowBtns = buttons.filter(b => b.getAttribute('aria-label')?.match(/trước|tiếp|previous|next/i))
    expect(arrowBtns.length).toBeGreaterThanOrEqual(2)
    arrowBtns.forEach(btn => {
      expect(btn.className).toMatch(/min-w-\[44px\]/)
      expect(btn.className).toMatch(/min-h-\[44px\]/)
    })
  })

  it('dot navigation buttons have aria-label', () => {
    render(<HeroSlider />)
    const buttons = screen.getAllByRole('button')
    const dotBtns = buttons.filter(b => b.getAttribute('aria-label')?.match(/slide/i))
    expect(dotBtns.length).toBeGreaterThan(0)
  })

  it('dot buttons have minimum 44px tap target size', () => {
    render(<HeroSlider />)
    const buttons = screen.getAllByRole('button')
    const dotBtns = buttons.filter(b => b.getAttribute('aria-label')?.match(/slide/i))
    expect(dotBtns.length).toBeGreaterThan(0)
    dotBtns.forEach(btn => {
      expect(btn.className).toMatch(/min-w-\[44px\]|min-h-\[44px\]/)
    })
  })
})
