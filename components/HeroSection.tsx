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

export default function HeroSection({ featured, sideArticles }: { featured?: Article; sideArticles: Article[] }) {
  if (!featured) return null

  return (
    <section className="max-w-[1320px] mx-auto px-6 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Main Hero */}
        <Link href={`/article/${featured.slug}`} className="relative rounded-lg overflow-hidden group cursor-pointer block">
          {featured.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featured.image_url}
              alt={featured.title}
              className="w-full h-[420px] object-cover relative"
            />
          ) : (
            <div className="w-full h-[420px] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-7xl relative">
              {featured.emoji || '📰'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wide rounded mb-3">
              Featured
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">
              {featured.title}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-xl">{featured.excerpt}</p>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                  {featured.author_initials}
                </div>
                <span>{featured.author}</span>
              </div>
              <span>&#8226;</span>
              <span>{featured.date}</span>
              <span>&#8226;</span>
              <span>{featured.read_time} read</span>
            </div>
          </div>
        </Link>

        {/* Side Cards */}
        <div className="flex flex-col gap-4">
          {sideArticles.map(article => (
            <Link key={article.id} href={`/article/${article.slug}`} className="flex gap-4 p-4 bg-cd-bg border border-cd-border-light rounded-lg hover:bg-white hover:border-cd-border hover:shadow-md transition cursor-pointer">
              {article.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-24 h-20 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="w-24 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex items-center justify-center text-3xl shrink-0">
                  {article.emoji || '📄'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1.5">{article.category}</div>
                <h4 className="text-sm font-bold leading-snug mb-2 line-clamp-2">{article.title}</h4>
                <div className="text-xs text-cd-subtle">{article.author} &#8226; {article.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}