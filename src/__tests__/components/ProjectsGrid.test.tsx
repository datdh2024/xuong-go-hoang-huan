import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import type { SanityProject } from '@/sanity/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('US-01: ProjectsGrid accepts projects prop', () => {
  const testProjects: SanityProject[] = [
    {
      title: 'CMS Project',
      slug: 'cms-project',
      location: 'Hà Nội',
      category: 'Nhà gỗ 3 gian',
      completedYear: 2024,
      description: 'CMS Description',
      thumbnail: 'https://example.com/thumb.jpg',
    },
  ]

  it('renders project title from props', () => {
    render(<ProjectsGrid projects={testProjects} />)
    expect(screen.getByText('CMS Project')).toBeTruthy()
  })

  it('renders project description from props', () => {
    render(<ProjectsGrid projects={testProjects} />)
    expect(screen.getByText('CMS Description')).toBeTruthy()
  })

  it('renders nothing when empty array', () => {
    const { container } = render(<ProjectsGrid projects={[]} />)
    expect(container.querySelector('section')).toBeNull()
  })
})
