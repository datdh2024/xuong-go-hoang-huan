import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HouseTemplates from '@/components/sections/HouseTemplates'
import type { SanityHouseTemplate } from '@/sanity/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
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
