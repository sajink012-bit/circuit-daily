import NewsletterForm from '@/components/NewsletterForm'

export const metadata = {
  title: 'Subscribe — CircuitSJ',
  description: 'Get weekly marketing and technology insights from CircuitSJ, straight to your inbox.',
}

export default function SubscribePage() {
  return (
    <div className="bg-cd-bg py-20">
      <div className="max-w-md mx-auto px-6 text-center">
        <span className="text-4xl mb-4 block">📬</span>
        <h1 className="text-3xl font-black mb-3">Get Our Newsletter</h1>
        <p className="text-cd-muted leading-relaxed mb-8">
          Weekly marketing and technology insights, no fluff. Unsubscribe anytime.
        </p>
        <div className="bg-white border border-cd-border-light rounded-lg p-6">
          <NewsletterForm variant="page" />
        </div>
      </div>
    </div>
  )
}
