export const metadata = {
  title: 'Contact Us — CircuitSJ',
  description: 'Get in touch with the CircuitSJ team.',
}

export default function ContactPage() {
  return (
    <>
      <div className="bg-cd-bg py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-black mb-4">Contact Us</h1>
          <p className="text-lg text-cd-muted leading-relaxed">
            Have a question, a story tip, or a business inquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-cd-bg p-8 rounded-lg border border-cd-border-light text-center mb-10">
          <span className="text-3xl mb-3 block">✉️</span>
          <h2 className="text-xl font-bold mb-2">Email Us</h2>
          <p className="text-cd-muted mb-4">
            The best way to reach the CircuitSJ team is by email. We aim to respond within
            2-3 business days.
          </p>
          <a
            href="mailto:circuitdaily1@gmail.com"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            circuitdaily1@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { emoji: '📰', title: 'Story Tips', desc: 'Seen a trend we should cover? Let us know.' },
            { emoji: '✍️', title: 'Write for Us', desc: 'Interested in contributing? Reach out with your idea.' },
            { emoji: '🤝', title: 'Business Inquiries', desc: 'Partnerships and advertising, email us directly.' },
          ].map((v) => (
            <div key={v.title} className="bg-cd-bg p-6 rounded-lg border border-cd-border-light text-center">
              <span className="text-3xl mb-3 block">{v.emoji}</span>
              <h3 className="font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-cd-muted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
