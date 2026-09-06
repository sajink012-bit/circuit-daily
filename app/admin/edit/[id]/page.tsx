'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ArticleForm from '@/components/ArticleForm'
import type { Article } from '@/lib/types'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      router.push('/admin')
      return
    }

    setArticle(data as Article)
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center text-slate-500 text-sm">Loading article...</div>
  if (!article) return null

  return <ArticleForm mode="edit" initialData={article} />
}
