import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90) }
function categorySlug(s: string) { return slugify(s) }

export async function POST(request: Request) {
  const { id } = await request.json()
  const { data: story, error: storyError } = await supabase.from('news_stories').select('*').eq('id', id).single()
  if (storyError || !story) return NextResponse.json({ error: 'Story not found.' }, { status: 404 })
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables. The story remains selected.' }, { status: 503 })

  const prompt = `You are the senior technology editor for CircuitSJ. Create an original, factual news draft from the supplied source metadata. Do not copy sentences from the source. Do not invent facts. Clearly distinguish reported facts from uncertainty. Return JSON only with: title, excerpt, content, seo_title, meta_description, keywords, read_time. Content must be clean HTML suitable for a rich-text editor, with short paragraphs and 2-4 useful headings. Source: ${story.source_name}\nURL: ${story.url}\nPublished: ${story.published_at || 'unknown'}\nCategory: ${story.category}\nHeadline: ${story.title}\nSummary: ${story.summary}`

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.3 } })
  })
  if (!response.ok) return NextResponse.json({ error: `Gemini request failed (${response.status}).` }, { status: 502 })
  const result = await response.json()
  const raw = result?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!raw) return NextResponse.json({ error: 'Gemini returned no draft.' }, { status: 502 })
  let draft: any
  try { draft = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Gemini returned invalid JSON.' }, { status: 502 }) }

  let slug = slugify(draft.title || story.title)
  const existing = await supabase.from('articles').select('id').eq('slug', slug).maybeSingle()
  if (existing.data) slug = `${slug}-${Date.now().toString().slice(-6)}`
  const article = {
    title: draft.title || story.title, slug, excerpt: draft.excerpt || story.summary || story.title,
    content: draft.content || `<p>${story.summary || story.title}</p>`, category: story.category,
    category_slug: categorySlug(story.category), author: 'CircuitSJ', author_initials: 'CS',
    read_time: draft.read_time || '4 min read', date: story.published_at ? new Date(story.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    views: '0', emoji: story.category === 'Cybersecurity' ? '🔐' : story.category === 'Mobile' ? '📱' : story.category === 'AI' ? '🤖' : '⚡',
    image_url: null, featured: false, published: false
  }
  const { data: created, error } = await supabase.from('articles').insert([article]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('news_stories').update({ status: 'generated', updated_at: new Date().toISOString() }).eq('id', id)
  return NextResponse.json({ article: created, seo_title: draft.seo_title, meta_description: draft.meta_description, keywords: draft.keywords, message: 'Draft created in Articles. Review it before publishing.' }, { status: 201 })
}
