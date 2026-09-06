'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null
  let id = localStorage.getItem('csj_vid')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('csj_vid', id)
  }
  return id
}

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Don't track your own admin visits — keeps visitor counts accurate
    if (pathname.startsWith('/admin')) return

    const visitorId = getVisitorId()
    if (!visitorId) return

    supabase.from('page_views').insert([{ path: pathname, visitor_id: visitorId }])
  }, [pathname])

  return null
}
