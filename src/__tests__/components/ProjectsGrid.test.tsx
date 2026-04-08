import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectsGrid, { type SanityProject } from '@/components/sections/ProjectsGrid'

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

vi.mock('@/components/ui/SectionHeading', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

const mockProjects: SanityProject[] = [
  {
    _id: 'p1',
    title: 'Nhà Gỗ 3 Gian Test',
    slug: { current: 'nha-go-3-gian-test' },
    location: 'Hà Nội',
    completedYear: 2023,
    description: 'Mô tả dự án 1',
    category: { name: 'Nhà gỗ 3 gian' },
    thumbnail: { asset: { url: 'https://example.com/p1.jpg' } },
  },
  {
    _id: 'p2',
    title: 'Nhà Thờ Họ Test',
    slug: { current: 'nha-tho-ho-test' },
    location: 'Bắc Ninh',
    completedYear: 2022,
    description: 'Mô tả dự án 2',
    category: { name: 'Nhà thờ họ' },
    thumbnail: { asset: { url: 'https://example.com/p2.jpg' } },
  },
  {
    _id: 'p3',
    title: 'Nhà Gỗ 5 Gian Test',
    slug: { current: 'nha-go-5-gian-test' },
    location: 'Hưng Yên',
    completedYear: 2023,
    description: 'Mô tả dự án 3',
    category: { name: 'Nhà gỗ 5 gian' },
    thumbnail: { asset: { url: 'https://example.com/p3.jpg' } },
  },
  {
    _id: 'p4',
    title: 'Nhà Sân Vườn Test',
    slug: { current: 'nha-san-vuon-test' },
    location: 'Hải Phòng',
    completedYear: 2023,
    description: 'Mô tả dự án 4',
    category: { name: 'Nhà sân vườn' },
    thumbnail: { asset: { url: 'https://example.com/p4.jpg' } },
  },
  {
    _id: 'p5',
    title: 'Dự Án 5 Test',
    slug: { current: 'du-an-5-test' },
    location: 'Nghệ An',
    completedYear: 2022,
    description: 'Mô tả dự án 5',
    category: { name: 'Nhà gỗ 3 gian' },
    thumbnail: { asset: { url: 'https://example.com/p5.jpg' } },
  },
  {
    _id: 'p6',
    title: 'Dự Án 6 Test',
    slug: { current: 'du-an-6-test' },
    location: 'Thanh Hóa',
    completedYear: 2022,
    description: 'Mô tả dự án 6',
    category: { name: 'Nhà thờ họ' },
    thumbnail: { asset: { url: 'https://example.com/p6.jpg' } },
  },
]

describe('TC-07 to TC-08: ProjectsGrid CMS props', () => {
  it('TC-07: renders all 6 project titles from CMS props', () => {
    render(<ProjectsGrid projects={mockProjects} />)
    mockProjects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    })
  })

  it('TC-07: each project links to /cong-trinh/[slug]', () => {
    render(<ProjectsGrid projects={mockProjects} />)
    const links = screen.getAllByRole('link')
    mockProjects.forEach((p) => {
      const matchingLink = links.find((l) =>
        l.getAttribute('href')?.includes(p.slug.current)
      )
      expect(matchingLink).toBeTruthy()
    })
  })

  it('TC-08: renders gracefully with empty projects array', () => {
    expect(() => render(<ProjectsGrid projects={[]} />)).not.toThrow()
    mockProjects.forEach((p) => {
      expect(screen.queryByText(p.title)).toBeNull()
    })
  })

  it('TC-08: renders gracefully with null projects', () => {
    expect(() => render(<ProjectsGrid projects={null} />)).not.toThrow()
  })
})
