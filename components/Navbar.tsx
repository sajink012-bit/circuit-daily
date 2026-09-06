'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'SEO', href: '/category/seo', id: 'seo' },
  { label: 'Content', href: '/category/content', id: 'content' },
  { label: 'PPC', href: '/category/ppc', id: 'ppc' },
  { label: 'Social', href: '/category/social', id: 'social' },
  { label: 'AI & Tech', href: '/category/ai', id: 'ai' },
  { label: 'Analytics', href: '/category/analytics', id: 'analytics' },
  { label: 'News', href: '/category/news', id: 'news' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 bg-white border-b border-cd-border transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-1.5 overflow-hidden whitespace-nowrap">
        <div className="ticker-wrap inline-flex gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8">
              <span className="flex items-center gap-2 cursor-pointer hover:underline">
                <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" /> 
                <strong>BREAKING:</strong> Google Announces Major Search Algorithm Update
              </span>
              <span className="cursor-pointer hover:underline"><strong>NEWS:</strong> OpenAI Releases GPT-5</span>
              <span className="cursor-pointer hover:underline"><strong>UPDATE:</strong> Meta's New AI Search Feature</span>
              <span className="cursor-pointer hover:underline"><strong>TREND:</strong> AI Content Detection Up 300%</span>
              <span className="cursor-pointer hover:underline"><strong>ANALYSIS:</strong> SEO in 2026: What Works Now</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-[1320px] mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">
            CS
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-cd-text leading-tight tracking-tight">CircuitSJ</span>
            <span className="text-[0.6rem] font-semibold text-cd-subtle uppercase tracking-widest">Marketing & Technology</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/search" className="p-2 text-cd-muted hover:text-cd-text hover:bg-cd-bg rounded transition">
            &#128269;
          </Link>
          <Link href="/about" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-dark transition">
            About
          </Link>
          <Link href="/subscribe" className="px-4 py-2 border-2 border-primary text-primary text-sm font-semibold rounded hover:bg-primary-light transition">
            Subscribe
          </Link>
        </div>
      </div>

      {/* Category Nav */}
      <div className="max-w-[1320px] mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-hide">
        {navLinks.map(link => (
          <Link
            key={link.id}
            href={link.href}
            className="px-4 py-3 text-sm font-semibold text-cd-muted whitespace-nowrap border-b-[3px] border-transparent hover:text-primary hover:border-primary transition"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}