'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

type StatusFilter = 'all' | 'published' | 'draft'

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setArticles(data as Article[])
    setLoading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleConfirmDelete() {
    if (confirmDeleteId == null) return
    const id = confirmDeleteId
    setConfirmDeleteId(null)
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      showToast('Error: ' + error.message)
      return
    }
    setArticles((prev) => prev.filter((a) => a.id !== id))
    showToast('Article deleted')
  }

  async function handleTogglePublished(article: Article) {
    const { error } = await supabase
      .from('articles')
      .update({ published: !article.published })
      .eq('id', article.id)
    if (error) {
      showToast('Error: ' + error.message)
      return
    }
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, published: !a.published } : a))
    )
    showToast(article.published ? 'Unpublished' : 'Published')
  }

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (statusFilter === 'published' && !a.published) return false
      if (statusFilter === 'draft' && a.published) return false
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [articles, search, statusFilter])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Articles</h1>
          <p className="text-gray-500 text-sm">{articles.length} total</p>
        </div>
        <Link
          href="/admin/new"
          className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          + New Article
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {(['all', 'published', 'draft'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition ${
                statusFilter === f ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No articles match.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((article) => (
              <div key={article.id} className="p-4 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                  {article.emoji}
                </div>
                <div className="flex-1 min-w-[160px]">
                  <p className="font-medium text-gray-900 truncate">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {article.category} · {article.date} · 👁 {article.views}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                    article.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {article.published ? 'Published' : 'Draft'}
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublished(article)}
                    className="text-xs border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition"
                  >
                    {article.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/admin/edit/${article.id}`}
                    className="text-xs border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmDeleteId(article.id)}
                    className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteId != null}
        title="Delete this article?"
        message="This cannot be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
      {toast && <Toast message={toast} />}
    </div>
  )
}
