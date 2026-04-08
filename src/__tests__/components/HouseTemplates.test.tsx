import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HouseTemplates, { type HouseTemplate } from '@/components/sections/HouseTemplates'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('@/components/ui/SectionHeading', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

const mockTemplates: HouseTemplate[] = [
  {
    _id: 't1',
    name: 'Mẫu Nhà 3 Gian Test',
    description: 'Mô tả mẫu 1',
    specs: { area: '60-80m²', bays: 3, columns: 16 },
    thumbnail: { asset: { url: 'https://example.com/t1.jpg' } },
  },
  {
    _id: 't2',
    name: 'Mẫu Nhà 5 Gian Test',
    description: 'Mô tả mẫu 2',
    specs: { area: '120-150m²', bays: 5, columns: 32 },
    thumbnail: { asset: { url: 'https://example.com/t2.jpg' } },
  },
  {
    _id: 't3',
    name: 'Mẫu Nhà Thờ Họ Test',
    description: 'Mô tả mẫu 3',
    specs: { area: '50-70m²', bays: 3, columns: 16 },
    thumbnail: { asset: { url: 'https://example.com/t3.jpg' } },
  },
  {
    _id: 't4',
    name: 'Mẫu Sân Vườn Test',
    description: 'Mô tả mẫu 4',
    specs: { area: '40-60m²', bays: 3, columns: 12 },
    thumbnail: { asset: { url: 'https://example.com/t4.jpg' } },
  },
]

describe('TC-09 to TC-10: HouseTemplates CMS props', () => {
  it('TC-09: renders all template names from CMS props', () => {
    render(<HouseTemplates templates={mockTemplates} />)
    mockTemplates.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument()
    })
  })

  it('TC-09: renders specs.area for each template', () => {
    render(<HouseTemplates templates={mockTemplates} />)
    mockTemplates.forEach((t) => {
      expect(document.body.innerHTML).toContain(t.specs.area)
    })
  })

  it('TC-09: renders specs.bays for each template', () => {
    render(<HouseTemplates templates={mockTemplates} />)
    mockTemplates.forEach((t) => {
      expect(document.body.innerHTML).toContain(`${t.specs.bays} gian`)
    })
  })

  it('TC-10: renders gracefully with empty templates array', () => {
    expect(() => render(<HouseTemplates templates={[]} />)).not.toThrow()
    mockTemplates.forEach((t) => {
      expect(screen.queryByText(t.name)).toBeNull()
    })
  })

  it('TC-10: renders gracefully with null templates', () => {
    expect(() => render(<HouseTemplates templates={null} />)).not.toThrow()
  })
})
