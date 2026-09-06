'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type NewsletterFormProps = {
  variant?: 'sidebar' | 'page'
}

export default function NewsletterForm({ variant = 'sidebar' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    const { error } = await supabase.from('subscribers').insert([{ email }])

    if (error) {
      if (error.code === '23505') {
        setStatus('duplicate')
      } else {
        setStatus('error')
      }
      return
    }

    setStatus('success')
    setEmail('')
  }

  const isSidebar = variant === 'sidebar'

  if (status === 'success') {
    return (
      <div className={isSidebar ? 'text-center' : 'text-center py-4'}>
        <p className="font-semibold">You&apos;re subscribed! 🎉</p>
        <p className={isSidebar ? 'text-sm opacity-90 mt-1' : 'text-sm text-cd-muted mt-1'}>
          Watch your inbox for our next update.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={
          isSidebar
            ? 'w-full px-4 py-2.5 rounded text-cd-text text-sm focus:outline-none focus:ring-2 focus:ring-white/30'
            : 'w-full px-4 py-3 rounded-lg border border-cd-border text-cd-text focus:outline-none focus:ring-2 focus:ring-primary'
        }
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={
          isSidebar
            ? 'w-full py-2.5 bg-white text-primary font-semibold rounded text-sm hover:bg-cd-bg transition disabled:opacity-60'
            : 'w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-60'
        }
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'duplicate' && (
        <p className={isSidebar ? 'text-xs opacity-90' : 'text-sm text-cd-muted'}>
          You&apos;re already subscribed with that email.
        </p>
      )}
      {status === 'error' && (
        <p className={isSidebar ? 'text-xs opacity-90' : 'text-sm text-red-600'}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
