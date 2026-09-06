'use client'

import { useEffect, useState } from 'react'

type Story = {
  id: number
  title: string
  url: string
  source_name: string
  category: string
  summary: string
  published_at: string | null
  score: number
  status: string
}

export default function NewsIntelligencePage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/news/stories')
      const j = await r.json()
      setStories(j.stories || [])
    } catch { setMessage('Could not load news.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function refresh() {
    setBusy(true); setMessage('Collecting latest stories…')
    try {
      const r = await fetch('/api/news/ingest', { method: 'POST' })
      const j = await r.json()
      setMessage(j.message || `Collected ${j.count || 0} stories.`)
      await load()
    } catch { setMessage('News collection failed.') }
    finally { setBusy(false) }
  }

  async function action(id: number, actionName: string) {
    setBusy(true); setMessage(actionName === 'generate' ? 'Generating draft…' : '')
    try {
      const r = await fetch('/api/news/stories', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: actionName }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Action failed')
      setMessage(j.message || 'Done.')
      await load()
    } catch (e: any) { setMessage(e.message || 'Action failed.') }
    finally { setBusy(false) }
  }

  const visible = stories.filter(s => filter === 'all' || s.category.toLowerCase() === filter || s.status === filter)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold">News Intelligence</h1><p className="text-sm text-gray-500 mt-1">Discover, rank and turn tech news into CircuitSJ drafts.</p></div>
        <button onClick={refresh} disabled={busy} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50">{busy ? 'Working…' : '↻ Collect Latest News'}</button>
      </div>
      {message && <div className="mb-5 rounded-lg border bg-white px-4 py-3 text-sm text-gray-600">{message}</div>}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all','Technology','Mobile','AI','Cybersecurity','selected','removed'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600'}`}>{f}</button>)}
      </div>
      {loading ? <div className="py-20 text-center text-gray-400">Loading stories…</div> : visible.length === 0 ? <div className="bg-white border rounded-xl p-12 text-center"><div className="text-4xl mb-3">📰</div><h2 className="font-semibold">No stories yet</h2><p className="text-sm text-gray-500 mt-1">Click Collect Latest News to fetch the first batch.</p></div> :
        <div className="space-y-4">{visible.map(s => <article key={s.id} className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
            <div className="min-w-0 flex-1"><div className="flex gap-2 items-center flex-wrap mb-2"><span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-600">{s.category}</span><span className="text-xs text-gray-400">{s.source_name}</span><span className="text-xs font-bold text-gray-500">Score {s.score}</span></div><h2 className="text-lg font-bold leading-snug">{s.title}</h2><p className="text-sm text-gray-500 mt-2">{s.summary}</p><a className="text-xs text-indigo-600 mt-3 inline-block" href={s.url} target="_blank" rel="noreferrer">View source ↗</a></div>
            <div className="flex lg:flex-col gap-2 shrink-0"><button disabled={busy || s.status === 'removed'} onClick={() => action(s.id, 'generate')} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-40">Generate Draft</button><button disabled={busy} onClick={() => action(s.id, s.status === 'removed' ? 'restore' : 'remove')} className="px-3 py-2 rounded-lg border text-xs font-semibold">{s.status === 'removed' ? 'Restore' : 'Remove'}</button></div>
          </div>
        </article>)}</div>}
    </div>
  )
}
