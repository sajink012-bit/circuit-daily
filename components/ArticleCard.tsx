import Link from 'next/link'

interface Article {
  id: number
  title: string
  category: string
  author: string
  read_time: string
  emoji?: string
  slug: string
  image_url?: string | null
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="bg-white border border-cd-border-light rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer block">
      {article.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.image_url} alt={article.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-5xl">
          {article.emoji || '📄'}
        </div>
      )}
      <div className="p-4">
        <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">{article.category}</div>
        <h3 className="text-sm font-bold leading-snug mb-2">{article.title}</h3>
        <div className="text-xs text-cd-subtle">{article.author} &#8226; {article.read_time}</div>
      </div>
    </Link>
  )
}