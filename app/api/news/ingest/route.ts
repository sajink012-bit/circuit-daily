import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NEWS_FEEDS, fetchFeed, scoreStory } from '@/lib/news'

export async function POST() {
  let count = 0
  const errors: string[] = []
  for (const feed of NEWS_FEEDS) {
    try {
      const items = await fetchFeed(feed)
      for (const item of items) {
        const score = scoreStory(item)
        const { error } = await supabase.from('news_stories').upsert({ ...item, score, status: 'discovered', updated_at: new Date().toISOString() }, { onConflict: 'url', ignoreDuplicates: true })
        if (!error) count++
      }
    } catch (e: any) { errors.push(e.message || feed.name) }
  }
  return NextResponse.json({ ok: true, count, errors, message: `News collection finished. ${count} new stories processed.` })
}
