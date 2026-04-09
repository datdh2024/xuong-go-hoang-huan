'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function TrackProjectView({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('project_view', { slug })
  }, [slug])

  return null
}
