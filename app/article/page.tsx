import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  const { data: articles } = await supabase.from('articles').select('slug')
  return articles?.map(a => ({ slug: a.slug })) || []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase.from('articles').select('*').eq('slug', params.slug).single()
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} — Circuit Daily`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase.from('articles').select('*').eq('slug', params.slug).single()
  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('category_slug', article.category_slug)
    .neq('id', article.id)
    .limit(3)

  return (
    <>
      <div className="bg-cd-bg border-b border-cd-border py-10">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-cd-subtle mb-4">
            <Link href="/" className="text-primary font-semibold hover:underline">Home</Link>
            <span>/</span>
            <Link href={`/category/${article.category_slug}`} className="text-primary font-semibold hover:underline">{article.category}</Link>
            <span>/</span>
            <span>Article</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight max-w-3xl mb-5">{article.title}</h1>
          <p className="text-lg text-cd-muted max-w-2xl leading-relaxed mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {article.author_initials}
              </div>
              <div>
                <p className="font-bold text-sm">{article.author}</p>
                <p className="text-xs text-cd-subtle">Editor, Circuit Daily</p>
              </div>
            </div>
            <span className="text-sm text-cd-subtle">{article.date}</span>
            <span className="text-sm text-cd-subtle">{article.read_time} read</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <article className="max-w-3xl">
            {article.image_url && (
              <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-6xl mb-8 overflow-hidden">
                {article.emoji || '📰'}
              </div>
            )}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

            <div className="flex gap-2 mt-10 pt-6 border-t border-cd-border">
              <span className="px-4 py-1.5 bg-cd-bg rounded-full text-sm text-cd-muted hover:bg-primary-light hover:text-primary cursor-pointer transition">{article.category}</span>
              <span className="px-4 py-1.5 bg-cd-bg rounded-full text-sm text-cd-muted hover:bg-primary-light hover:text-primary cursor-pointer transition">Digital Marketing</span>
              <span className="px-4 py-1.5 bg-cd-bg rounded-full text-sm text-cd-muted hover:bg-primary-light hover:text-primary cursor-pointer transition">2026</span>
            </div>

            <div className="flex gap-5 mt-8 p-6 bg-cd-bg rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                {article.author_initials}
              </div>
              <div>
                <h4 className="font-bold mb-1">About {article.author}</h4>
                <p className="text-sm text-cd-muted leading-relaxed">{article.author} is a senior contributor at Circuit Daily, covering {article.category.toLowerCase()} and digital marketing strategy.</p>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="bg-white border border-cd-border rounded-lg p-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wide mb-4 pb-2 border-b-2 border-primary">Related Articles</h3>
              {related?.map((a) => (
                <Link key={a.id} href={`/article/${a.slug}`} className="flex gap-3 py-3 border-b border-cd-border last:border-0 group">
                  <span className="text-2xl shrink-0">{a.emoji || '📄'}</span>
                  <div>
                    <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition">{a.title}</h4>
                    <span className="text-xs text-cd-subtle">{a.read_time} read</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-primary text-white rounded-lg p-6 text-center">
              <h3 className="text-lg font-extrabold mb-2">Get More Like This</h3>
              <p className="text-sm opacity-90 mb-4">Weekly insights in your inbox.</p>
              <form className="space-y-3">
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-2.5 rounded text-cd-text text-sm" />
                <button className="w-full py-2.5 bg-white text-primary font-semibold rounded text-sm hover:bg-cd-bg transition">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}