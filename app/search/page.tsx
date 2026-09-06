'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import ArticleList from '@/components/ArticleList'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  async function handleSearch(value: string) {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${value}%,excerpt.ilike.%${value}%,content.ilike.%${value}%`)

    setResults(data || [])
    setSearched(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-black mb-2">Search CircuitSJ</h1>
      <p className="text-cd-muted mb-8">Find articles, guides, and news across our library.</p>

      <div className="relative max-w-xl mx-auto mb-10">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cd-subtle text-lg">&#128269;</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search SEO, AI, marketing, tools..."
          className="w-full pl-12 pr-4 py-4 border-2 border-cd-border rounded-lg text-base focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
        />
      </div>

      {searched && (
        <div className="text-left">
          <p className="text-cd-muted mb-5">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          {results.length > 0 ? <ArticleList articles={results} /> : (
            <div className="text-center py-16 text-cd-muted">
              <div className="text-5xl mb-4">&#128269;</div>
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p>Try different keywords or browse categories.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}