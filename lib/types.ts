export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  category_slug: string
  author: string
  author_initials: string
  date: string
  read_time: string
  views: string
  emoji: string
  image_url: string | null
  featured: boolean
  published: boolean
  created_at?: string
  updated_at?: string
}
