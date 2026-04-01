import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useDarkMode } from '@/hooks/useDarkMode'

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefersDark && query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  describe('initial state', () => {
    it('defaults to light when system has no dark preference and no localStorage', () => {
      mockMatchMedia(false)
      const { result } = renderHook(() => useDarkMode())
      expect(result.current.isDark).toBe(false)
    })

    it('defaults to dark when system prefers dark and no localStorage override', () => {
      mockMatchMedia(true)
      const { result } = renderHook(() => useDarkMode())
      expect(result.current.isDark).toBe(true)
    })

    it('reads "dark" from localStorage, overriding light system preference', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useDarkMode())
      expect(result.current.isDark).toBe(true)
    })

    it('reads "light" from localStorage, overriding dark system preference', () => {
      mockMatchMedia(true)
      localStorage.setItem('theme', 'light')
      const { result } = renderHook(() => useDarkMode())
      expect(result.current.isDark).toBe(false)
    })
  })

  describe('html class management', () => {
    it('adds dark class to <html> when dark mode is active', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      renderHook(() => useDarkMode())
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('does not add dark class to <html> when light mode is active', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'light')
      renderHook(() => useDarkMode())
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('removes dark class from <html> when switching to light', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')

      const { result } = renderHook(() => useDarkMode())
      act(() => result.current.toggle())

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('toggle', () => {
    it('switches from light to dark', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'light')
      const { result } = renderHook(() => useDarkMode())

      act(() => result.current.toggle())

      expect(result.current.isDark).toBe(true)
    })

    it('switches from dark to light', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useDarkMode())

      act(() => result.current.toggle())

      expect(result.current.isDark).toBe(false)
    })

    it('persists "dark" to localStorage after toggling to dark', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'light')
      const { result } = renderHook(() => useDarkMode())

      act(() => result.current.toggle())

      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('persists "light" to localStorage after toggling to light', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useDarkMode())

      act(() => result.current.toggle())

      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('updates <html> class when toggling to dark', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'light')
      const { result } = renderHook(() => useDarkMode())

      expect(document.documentElement.classList.contains('dark')).toBe(false)
      act(() => result.current.toggle())
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('updates <html> class when toggling to light', () => {
      mockMatchMedia(false)
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useDarkMode())

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      act(() => result.current.toggle())
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})
