import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ArticleList from '@/components/ArticleList'
import Sidebar from '@/components/Sidebar'

const categoryInfo: Record<string, { title: string; desc: string }> = {
  seo: { title: 'SEO', desc: 'Search engine optimization strategies, algorithm updates, and ranking techniques.' },
  content: { title: 'Content Marketing', desc: 'Content strategy, creation, distribution, and optimization.' },
  ppc: { title: 'PPC & Paid Advertising', desc: 'Google Ads, social advertising, and paid media strategies.' },
  social: { title: 'Social Media Marketing', desc: 'Platform strategies and community building.' },
  ai: { title: 'AI & Technology', desc: 'Artificial intelligence and marketing technology.' },
  analytics: { title: 'Analytics & Data', desc: 'Measurement and data-driven decision making.' },
  news: { title: 'Industry News', desc: 'Breaking news and platform updates.' },
  all: { title: 'All Articles', desc: 'Browse our complete library.' },
}

export const revalidate = 60

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const info = categoryInfo[params.slug] || categoryInfo.all
  return { title: `${info.title} — CircuitSJ` }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const info = categoryInfo[params.slug] || categoryInfo.all

  let query = supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false })
  if (params.slug !== 'all') {
    query = query.eq('category_slug', params.slug)
  }

  const { data: articles } = await query
  if (!articles) notFound()

  return (
    <>
      <div className="bg-cd-bg border-b border-cd-border py-10 mb-8">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="text-3xl font-black mb-2">{info.title}</h1>
          <p className="text-cd-muted">{info.desc}</p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <ArticleList articles={articles} />
          <Sidebar />
        </div>
      </div>
    </>
  )
}