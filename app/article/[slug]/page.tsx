import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleList from '@/components/ArticleList'
import Sidebar from '@/components/Sidebar'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single()

  if (!article) return { title: 'Article Not Found — CircuitSJ' }

  return {
    title: `${article.title} — CircuitSJ`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('category_slug', article.category_slug)
    .eq('published', true)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      <div className="bg-cd-bg border-b border-cd-border py-10">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href={`/category/${article.category_slug}`}
            className="text-xs font-bold text-primary uppercase tracking-wide"
          >
            {article.category}
          </Link>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mt-3 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-cd-subtle">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                {article.author_initials}
              </div>
              <span className="font-medium text-cd-text">{article.author}</span>
            </div>
            <span>&#8226;</span>
            <span>{article.date}</span>
            <span>&#8226;</span>
            <span>{article.read_time} read</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div>
            {article.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-72 object-cover rounded-lg mb-8"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-7xl mb-8">
                {article.emoji || '📄'}
              </div>
            )}

            <article
              className="font-body text-cd-text leading-relaxed max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-cd-muted"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {related && related.length > 0 && (
              <div className="mt-14">
                <h2 className="text-xl font-bold mb-5">More in {article.category}</h2>
                <ArticleList articles={related} />
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  )
}
