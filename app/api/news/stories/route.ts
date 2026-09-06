import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('news_stories').select('*').order('score', { ascending: false }).order('created_at', { ascending: false }).limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stories: data || [] })
}

export async function PATCH(request: Request) {
  const { id, action } = await request.json()
  if (!id || !['generate', 'remove', 'restore'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  const status = action === 'generate' ? 'selected' : action === 'remove' ? 'removed' : 'discovered'
  const { data, error } = await supabase.from('news_stories').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ story: data, message: action === 'generate' ? 'Story selected for draft generation.' : action === 'remove' ? 'Story removed.' : 'Story restored.' })
}
