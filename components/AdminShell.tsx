'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/new', label: 'New Article', icon: '✍️' },
  { href: '/admin/news', label: 'News Intelligence', icon: '📰' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'
  const [checking, setChecking] = useState(!isLoginPage)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (isLoginPage) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      setEmail(session.user.email || '')
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/admin/login')
    })
    return () => listener.subscription.unsubscribe()
  }, [isLoginPage, router])

  async function handleLogout() { await supabase.auth.signOut(); router.push('/admin/login') }
  if (isLoginPage) return <>{children}</>
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">Checking login...</div>
  const initials = email ? email.slice(0, 2).toUpperCase() : 'AD'

  return <div className="min-h-screen bg-gray-50 flex text-gray-900">
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-gray-100"><div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg">⚡</div><div><p className="font-bold leading-tight">CircuitSJ</p><p className="text-xs text-gray-400 leading-tight">Admin Panel</p></div></div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Main</p>
        {NAV_ITEMS.map((item) => { const active = pathname === item.href || (item.href === '/admin/news' && pathname.startsWith('/admin/news')); return <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><span>{item.icon}</span>{item.label}</Link> })}
        <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-1">More (coming soon)</p>
        {['Advertisement', 'Site Settings'].map(label => <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-300 cursor-not-allowed" title="Not set up yet"><span>{label}</span><span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">soon</span></div>)}
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3 py-2 mt-5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"><span>🌐</span>View Site</a>
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold shrink-0">{initials}</div><div className="min-w-0 flex-1"><p className="text-xs font-medium truncate">{email}</p><button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition">Log out</button></div></div>
    </aside>
    <main className="flex-1 overflow-y-auto">{children}</main>
  </div>
}
