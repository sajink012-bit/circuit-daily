import { supabase } from '@/lib/supabase'
import HeroSection from '@/components/HeroSection'
import ArticleList from '@/components/ArticleList'
import Sidebar from '@/components/Sidebar'
import SectionHeader from '@/components/SectionHeader'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 60

export default async function HomePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const featured = articles?.find(a => a.featured) || articles?.[0]
  const latest = articles?.filter(a => a.id !== featured?.id).slice(0, 6) || []
  const seoArticles = articles?.filter(a => ['seo', 'content'].includes(a.category_slug)).slice(0, 4) || []

  return (
    <>
      <HeroSection featured={featured} sideArticles={latest.slice(0, 3)} />

      <div className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div>
            <SectionHeader title="Latest Articles" href="/category/all" />
            <ArticleList articles={latest} />

            <div className="mt-10">
              <SectionHeader title="Trending in SEO & Content" href="/category/seo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {seoArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  )
}