import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectsListing from '@/components/sections/ProjectsListing'
import type { SanityProject, SanityProjectCategory } from '@/sanity/lib/types'

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

const testProjects: SanityProject[] = [
  { title: 'Project A', slug: 'project-a', location: 'HN', category: 'Cat1', completedYear: 2023, description: 'A desc', thumbnail: 'https://example.com/a.jpg' },
  { title: 'Project B', slug: 'project-b', location: 'HP', category: 'Cat2', completedYear: 2024, description: 'B desc', thumbnail: 'https://example.com/b.jpg' },
]
const testCategories: SanityProjectCategory[] = [
  { name: 'Cat1', slug: 'cat1' },
  { name: 'Cat2', slug: 'cat2' },
]

describe('US-01: ProjectsListing with category filter', () => {
  it('renders all projects by default', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.getByText('Project B')).toBeTruthy()
  })

  it('shows "Tất cả" button', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    expect(screen.getByText('Tất cả')).toBeTruthy()
  })

  it('filters by category when clicked', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cat1' }))
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.queryByText('Project B')).toBeNull()
  })

  it('shows all again when "Tất cả" clicked', () => {
    render(<ProjectsListing projects={testProjects} categories={testCategories} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cat1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tất cả' }))
    expect(screen.getByText('Project A')).toBeTruthy()
    expect(screen.getByText('Project B')).toBeTruthy()
  })
})
