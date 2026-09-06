import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import NewsletterForm from '@/components/NewsletterForm'

function parseViews(views: string | null | undefined): number {
  if (!views) return 0
  const clean = views.replace(/,/g, '').trim().toUpperCase()
  if (clean.endsWith('K')) return Math.round(parseFloat(clean) * 1000)
  if (clean.endsWith('M')) return Math.round(parseFloat(clean) * 1000000)
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

export default async function Sidebar() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, views, category, category_slug')
    .eq('published', true)

  const trending = (articles || [])
    .slice()
    .sort((a, b) => parseViews(b.views) - parseViews(a.views))
    .slice(0, 5)

  const categoryMap = new Map<string, string>()
  for (const a of articles || []) {
    if (!categoryMap.has(a.category)) categoryMap.set(a.category, a.category_slug)
  }
  const categories = Array.from(categoryMap.entries()).slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Newsletter */}
      <div className="bg-primary text-white rounded-lg p-6 text-center">
        <h3 className="text-lg font-extrabold mb-2">Get Our Newsletter</h3>
        <p className="text-sm opacity-90 mb-4">Weekly marketing insights, no fluff.</p>
        <NewsletterForm variant="sidebar" />
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="bg-white border border-cd-border rounded-lg p-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wide mb-4 pb-2 border-b-2 border-primary">
            Trending Now
          </h3>
          {trending.map((article, i) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="flex gap-3 py-3 border-b border-cd-border-light last:border-0 group"
            >
              <span className="text-2xl font-black text-primary leading-none">{i + 1}</span>
              <div>
                <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition">
                  {article.title}
                </h4>
                <span className="text-xs text-cd-subtle">{article.views} views</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Topics */}
      {categories.length > 0 && (
        <div className="bg-white border border-cd-border rounded-lg p-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wide mb-4 pb-2 border-b-2 border-primary">
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(([category, categorySlug]) => (
              <Link
                key={category}
                href={`/category/${categorySlug}`}
                className="px-4 py-1.5 bg-cd-bg rounded-full text-sm font-medium text-cd-muted hover:bg-primary hover:text-white transition"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
