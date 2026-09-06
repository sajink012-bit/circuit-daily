'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'

export default function CategoriesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) setArticles(data as Article[])
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; total: number; published: number }>()
    for (const a of articles) {
      const existing = map.get(a.category) || {
        name: a.category,
        slug: a.category_slug,
        total: 0,
        published: 0,
      }
      existing.total += 1
      if (a.published) existing.published += 1
      map.set(a.category, existing)
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [articles])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm">
          Categories are set per-article — add or rename one from the article editor.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-400">No categories yet — add an article to create one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                  /{c.slug}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{c.total} articles</span>
                <span>·</span>
                <span>{c.published} published</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
