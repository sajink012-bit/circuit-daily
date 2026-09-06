export const metadata = {
  title: 'About — CircuitSJ',
  description: 'We make digital marketing and technology simple, honest, and actionable.',
}

export default function AboutPage() {
  return (
    <>
      <div className="bg-cd-bg py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-black mb-4">About CircuitSJ</h1>
          <p className="text-lg text-cd-muted leading-relaxed">We make digital marketing and technology simple, honest, and actionable. No fluff. No hype. Just what works.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="font-body text-cd-muted leading-relaxed mb-5">The digital marketing world is noisy. Every day, a new "game-changing" tool launches. Every week, a new algorithm update breaks the internet. We cut through the noise.</p>
        <p className="font-body text-cd-muted leading-relaxed mb-10">CircuitSJ exists to give marketers, business owners, and technologists the clarity they need to make smart decisions. We test claims before we publish them. We explain complex topics in plain English.</p>

        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {[
            { emoji: '✅', title: 'Accuracy First', desc: 'We verify every claim and correct every mistake.' },
            { emoji: '💡', title: 'Clarity Over Cleverness', desc: "If a 12-year-old can't understand it, we rewrite it." },
            { emoji: '📈', title: 'Data-Driven', desc: 'We back recommendations with real data and testing.' },
            { emoji: '🤝', title: 'Reader-First', desc: 'No clickbait. No affiliate-driven recommendations.' },
          ].map(v => (
            <div key={v.title} className="bg-cd-bg p-6 rounded-lg border border-cd-border-light">
              <span className="text-3xl mb-3 block">{v.emoji}</span>
              <h3 className="font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-cd-muted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Join Us</h2>
        <p className="font-body text-cd-muted leading-relaxed">Whether you're a seasoned marketing professional or just getting started, CircuitSJ is your resource for staying ahead.</p>
        <p className="font-body text-cd-muted leading-relaxed mt-4">Have a story tip? Want to write for us? Reach out at <strong className="text-cd-text">circuitdaily1@gmail.com</strong></p>
      </div>
    </>
  )
}