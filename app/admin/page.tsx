'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

function parseViews(views: string | null | undefined): number {
  if (!views) return 0
  const clean = views.replace(/,/g, '').trim().toUpperCase()
  if (clean.endsWith('K')) return Math.round(parseFloat(clean) * 1000)
  if (clean.endsWith('M')) return Math.round(parseFloat(clean) * 1000000)
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

function formatViews(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
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
      showToast('Error deleting: ' + error.message)
      return
    }
    setArticles((prev) => prev.filter((a) => a.id !== id))
    showToast('Article deleted')
  }

  const stats = useMemo(() => {
    const published = articles.filter((a) => a.published).length
    const drafts = articles.length - published
    const categories = new Set(articles.map((a) => a.category)).size
    const totalViews = articles.reduce((sum, a) => sum + parseViews(a.views), 0)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const thisWeek = articles.filter((a) => a.created_at && new Date(a.created_at) >= weekAgo).length

    return { total: articles.length, published, drafts, categories, totalViews, thisWeek }
  }, [articles])

  const weeklyChart = useMemo(() => {
    const days: { label: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('en-US', { weekday: 'short' })
      const count = articles.filter((a) => {
        if (!a.created_at) return false
        const ad = new Date(a.created_at)
        return ad.toDateString() === d.toDateString()
      }).length
      days.push({ label, count })
    }
    return days
  }, [articles])

  const maxDayCount = Math.max(1, ...weeklyChart.map((d) => d.count))

  const topArticles = useMemo(() => {
    return [...articles]
      .filter((a) => a.published)
      .sort((a, b) => parseViews(b.views) - parseViews(a.views))
      .slice(0, 5)
  }, [articles])

  const recentArticles = articles.slice(0, 6)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening with your site.</p>
        </div>
        <Link
          href="/admin/new"
          className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          + New Article
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Articles" value={stats.total} icon="📰" color="bg-indigo-50 text-indigo-600" />
        <StatCard label="Published" value={stats.published} icon="✅" color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Drafts" value={stats.drafts} icon="📝" color="bg-amber-50 text-amber-600" />
        <StatCard label="Categories" value={stats.categories} icon="🏷️" color="bg-purple-50 text-purple-600" />
        <StatCard label="Total Views" value={formatViews(stats.totalViews)} icon="👁️" color="bg-pink-50 text-pink-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Articles Published — Last 7 Days</h2>
            <span className="text-xs text-gray-400">{stats.thisWeek} this week</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-40">
            {weeklyChart.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div
                    className="w-full max-w-[36px] bg-indigo-500 rounded-t-md transition-all"
                    style={{ height: `${(d.count / maxDayCount) * 100}%`, minHeight: d.count > 0 ? '6px' : '2px' }}
                    title={`${d.count} articles`}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top articles */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Articles</h2>
          {topArticles.length === 0 ? (
            <p className="text-sm text-gray-400">No published articles yet.</p>
          ) : (
            <div className="space-y-3">
              {topArticles.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0">
                    {a.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.category}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">👁 {a.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent articles table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-indigo-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-gray-400">Loading...</p>
          ) : recentArticles.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">No articles yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase">
                  <th className="px-6 py-2 font-medium">Title</th>
                  <th className="px-6 py-2 font-medium">Author</th>
                  <th className="px-6 py-2 font-medium">Status</th>
                  <th className="px-6 py-2 font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/edit/${a.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{a.author}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          a.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {a.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{a.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/admin/new" icon="➕" label="Add Article" />
            <QuickAction href="/admin/categories" icon="🏷️" label="Categories" />
            <QuickAction href="/admin/media" icon="🖼️" label="Media Library" />
            <QuickAction href="/" icon="🌐" label="View Website" external />
          </div>
        </div>
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

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: string
  label: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="border border-gray-200 rounded-lg p-4 flex flex-col items-center gap-2 text-center hover:border-indigo-300 hover:bg-indigo-50/40 transition"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </Link>
  )
}
