import Link from 'next/link'

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  author_initials: string
  date: string
  read_time: string
  emoji?: string
  slug: string
  image_url?: string | null
}

export default function ArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-cd-muted">
        <div className="text-5xl mb-4">&#128218;</div>
        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
        <p>We're working on content for this category.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {articles.map(article => (
        <Link key={article.id} href={`/article/${article.slug}`} className="flex flex-col md:flex-row gap-5 pb-5 border-b border-cd-border-light last:border-0 group cursor-pointer">
          {article.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full md:w-60 h-40 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-full md:w-60 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-5xl shrink-0 overflow-hidden">
              {article.emoji || '📄'}
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">{article.category}</div>
            <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition">{article.title}</h3>
            <p className="text-sm text-cd-muted leading-relaxed mb-3 line-clamp-2 font-body">{article.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-cd-subtle">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[0.6rem]">
                  {article.author_initials}
                </div>
                <span>{article.author}</span>
              </div>
              <span>&#8226;</span>
              <span>{article.date}</span>
              <span>&#8226;</span>
              <span>{article.read_time} read</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}