'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'

export default function MediaLibraryPage() {
  const [images, setImages] = useState<{ url: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          const seen = new Set<string>()
          const list: { url: string; title: string }[] = []
          for (const a of data as Article[]) {
            if (a.image_url && !seen.has(a.image_url)) {
              seen.add(a.image_url)
              list.push({ url: a.image_url, title: a.title })
            }
          }
          setImages(list)
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-500 text-sm">
          Images currently used across your articles. Add a cover image URL when creating or
          editing an article to add one here.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-400">No images added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div key={img.url} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <img src={img.url} alt={img.title} className="w-full h-32 object-cover" />
              <p className="text-xs text-gray-500 p-2 truncate">{img.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
