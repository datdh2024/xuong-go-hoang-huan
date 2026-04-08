import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Highlights, { type HighlightItem } from '@/components/sections/Highlights'

vi.mock('@/components/ui/SectionHeading', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

const mockHighlights: HighlightItem[] = [
  { _id: 'h1', icon: 'Award', title: 'Năm Kinh Nghiệm', description: 'Mô tả 1' },
  { _id: 'h2', icon: 'Warehouse', title: 'Xưởng Lớn', description: 'Mô tả 2' },
  { _id: 'h3', icon: 'TreePine', title: 'Gỗ Chọn Lọc', description: 'Mô tả 3' },
  { _id: 'h4', icon: 'PenTool', title: 'Tư Vấn Miễn Phí', description: 'Mô tả 4' },
  { _id: 'h5', icon: 'Shield', title: 'Bảo Hành Dài Hạn', description: 'Mô tả 5' },
  { _id: 'h6', icon: 'MapPin', title: 'Toàn Quốc', description: 'Mô tả 6' },
]

describe('TC-05 to TC-06: Highlights CMS props', () => {
  it('TC-05: renders all 6 highlight titles from CMS props', () => {
    render(<Highlights highlights={mockHighlights} />)
    mockHighlights.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    })
  })

  it('TC-05: renders all 6 highlight descriptions', () => {
    render(<Highlights highlights={mockHighlights} />)
    mockHighlights.forEach((item) => {
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it('TC-06: renders gracefully with empty highlights array', () => {
    expect(() => render(<Highlights highlights={[]} />)).not.toThrow()
    // No highlight cards rendered
    mockHighlights.forEach((item) => {
      expect(screen.queryByText(item.title)).toBeNull()
    })
  })

  it('TC-06: renders gracefully with null highlights', () => {
    expect(() => render(<Highlights highlights={null} />)).not.toThrow()
  })
})
