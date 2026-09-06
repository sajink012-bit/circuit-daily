'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type PageView = { path: string; visitor_id: string; created_at: string }

export default function AnalyticsPage() {
  const [rows, setRows] = useState<PageView[]>([])
  const [totalAllTime, setTotalAllTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data } = await supabase
      .from('page_views')
      .select('path, visitor_id, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(20000)

    if (data) setRows(data as PageView[])

    const { count } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    setTotalAllTime(count ?? 0)
    setLoading(false)
  }

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString()
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const todayRows = rows.filter((r) => new Date(r.created_at).toDateString() === todayStr)
    const weekRows = rows.filter((r) => new Date(r.created_at) >= weekAgo)

    return {
      viewsToday: todayRows.length,
      uniqueToday: new Set(todayRows.map((r) => r.visitor_id)).size,
      viewsWeek: weekRows.length,
      uniqueWeek: new Set(weekRows.map((r) => r.visitor_id)).size,
    }
  }, [rows])

  const dailyChart = useMemo(() => {
    const days: { label: string; views: number; visitors: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayRows = rows.filter((r) => new Date(r.created_at).toDateString() === d.toDateString())
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        views: dayRows.length,
        visitors: new Set(dayRows.map((r) => r.visitor_id)).size,
      })
    }
    return days
  }, [rows])

  const topPages = useMemo(() => {
    const counts = new Map<string, number>()
    for (const r of rows) counts.set(r.path, (counts.get(r.path) || 0) + 1)
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [rows])

  const maxDayViews = Math.max(1, ...dailyChart.map((d) => d.views))

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-sm">Loading analytics...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm">
          Real visits tracked directly on your site. No estimates, no demo data — this reflects
          exactly what&apos;s been recorded since tracking went live.
        </p>
      </div>

      {totalAllTime === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800">
          No visits recorded yet. This page only ever shows real tracked data — once this update
          is live and people start visiting your site, numbers will appear here automatically.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Visitors Today" value={stats.uniqueToday} icon="🧑" />
            <StatCard label="Page Views Today" value={stats.viewsToday} icon="👁️" />
            <StatCard label="Visitors This Week" value={stats.uniqueWeek} icon="📅" />
            <StatCard label="All-Time Page Views" value={totalAllTime ?? 0} icon="📈" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-6">Last 7 Days</h2>
            <div className="flex items-end justify-between gap-3 h-40">
              {dailyChart.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-full max-w-[36px] bg-indigo-500 rounded-t-md transition-all"
                      style={{
                        height: `${(d.views / maxDayViews) * 100}%`,
                        minHeight: d.views > 0 ? '6px' : '2px',
                      }}
                      title={`${d.views} views, ${d.visitors} visitors`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Top Pages (Last 30 Days)</h2>
            </div>
            {topPages.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No page views recorded in the last 30 days.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {topPages.map(([path, count]) => (
                  <div key={path} className="px-6 py-3 flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-700 truncate">{path}</span>
                    <span className="text-sm text-gray-500 shrink-0 ml-4">{count} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <span className="text-lg">{icon}</span>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
