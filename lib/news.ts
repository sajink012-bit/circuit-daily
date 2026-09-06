export const NEWS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology' },
  { name: 'Android Authority', url: 'https://www.androidauthority.com/feed/', category: 'Mobile' },
  { name: '9to5Google', url: 'https://9to5google.com/feed/', category: 'Mobile' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'Cybersecurity' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'Cybersecurity' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'AI' },
]

function decode(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}
function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decode(m[1]) : ''
}
export async function fetchFeed(feed: typeof NEWS_FEEDS[number]) {
  const response = await fetch(feed.url, { cache: 'no-store', headers: { 'user-agent': 'CircuitSJ-NewsBot/1.0' } })
  if (!response.ok) throw new Error(`${feed.name}: HTTP ${response.status}`)
  const xml = await response.text()
  const items = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(item|entry)>/gi) || []
  return items.slice(0, 25).map(item => {
    const title = tag(item, 'title')
    const linkMatch = item.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)
    const url = linkMatch?.[1] || tag(item, 'link')
    const summary = tag(item, 'description') || tag(item, 'summary') || tag(item, 'content')
    const date = tag(item, 'pubDate') || tag(item, 'published') || tag(item, 'updated')
    return { title, url, summary: summary.slice(0, 500), published_at: date ? new Date(date).toISOString() : null, source_name: feed.name, category: feed.category }
  }).filter(x => x.title && x.url)
}

export function scoreStory(story: { title: string; summary: string; category: string }, sourceCount = 1) {
  const text = `${story.title} ${story.summary}`.toLowerCase()
  let score = 35 + Math.min(sourceCount * 8, 24)
  if (/launch|release|unveil|update|security|hack|breach|vulnerability|exploit|iphone|android|pixel|galaxy|ai|google|apple|microsoft|openai|nvidia|chip|windows/.test(text)) score += 20
  if (/new|major|breaking|first|largest|critical|official/.test(text)) score += 10
  if (story.category === 'Cybersecurity') score += 5
  return Math.min(100, score)
}
