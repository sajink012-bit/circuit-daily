'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'
import RichTextEditor from '@/components/RichTextEditor'
import Toast from '@/components/Toast'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const EMOJI_OPTIONS = ['📰', '🤖', '📈', '💰', '📱', '🏆', '🎓', '🌍', '⚽', '🎬', '🏥', '🚀']

type ArticleFormProps = {
  initialData?: Partial<Article>
  mode: 'create' | 'edit'
}

export default function ArticleForm({ initialData, mode }: ArticleFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    category_slug: initialData?.category_slug || '',
    author: initialData?.author || '',
    author_initials: initialData?.author_initials || '',
    date:
      initialData?.date ||
      new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    read_time: initialData?.read_time || '5 min',
    emoji: initialData?.emoji || '📰',
    image_url: initialData?.image_url || '',
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
  })
  const [slugEdited, setSlugEdited] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }))
  }

  function handleCategoryChange(value: string) {
    setForm((prev) => ({
      ...prev,
      category: value,
      category_slug: slugify(value),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.slug || !form.content || !form.category) {
      setError('Please fill in Title, Slug, Category, and Content.')
      return
    }

    setSaving(true)

    if (mode === 'create') {
      const { error } = await supabase.from('articles').insert([form])
      setSaving(false)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { error } = await supabase.from('articles').update(form).eq('id', initialData?.id)
      setSaving(false)
      if (error) {
        setError(error.message)
        return
      }
    }

    setToast(mode === 'create' ? 'Article created' : 'Changes saved')
    setTimeout(() => router.push('/admin'), 600)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mode === 'create' ? 'New Article' : 'Edit Article'}</h1>
          <p className="text-gray-500 text-sm">
            {mode === 'create' ? 'Write and publish a new article' : 'Update this article'}
          </p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          type="button"
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← Back to dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Main details card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="A compelling headline"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              URL Slug <span className="text-gray-400">— yourdomain.com/article/{form.slug || '...'}</span>
            </label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true)
                update('slug', slugify(e.target.value))
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Excerpt <span className="text-gray-400">— shown on the homepage</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={2}
            />
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label className="block text-xs font-medium text-gray-500 mb-2">Article Content</label>
          <RichTextEditor value={form.content} onChange={(html) => update('content', html)} />
        </div>

        {/* Categorization card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categorization</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <input
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Technology"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category Slug</label>
              <input
                value={form.category_slug}
                onChange={(e) => update('category_slug', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                placeholder="technology"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => update('emoji', e)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition ${
                    form.emoji === e
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Author & meta card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Author &amp; Meta</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Author</label>
              <input
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Author Initials</label>
              <input
                value={form.author_initials}
                onChange={(e) => update('author_initials', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Date</label>
              <input
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Read Time</label>
              <input
                value={form.read_time}
                onChange={(e) => update('read_time', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Cover Image URL (optional)</label>
            <input
              value={form.image_url}
              onChange={(e) => update('image_url', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://..."
            />
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt="Cover preview"
                className="mt-3 w-full max-h-48 object-cover rounded-lg border border-gray-200"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            )}
          </div>
        </div>

        {/* Publish options + sticky save bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update('published', e.target.checked)}
              />
              Published
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Publish Article' : 'Save Changes'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast} />}
    </div>
  )
}
