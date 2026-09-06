import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-cd-text text-white py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-3 no-underline mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">
                CS
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-tight">CircuitSJ</span>
                <span className="text-[0.6rem] font-semibold text-white/50 uppercase tracking-widest">Marketing & Technology</span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">Clear, honest, and actionable digital marketing insights. No fluff, no hype — just what works.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4 text-white/80">Categories</h4>
            <ul className="space-y-2.5">
              {['SEO', 'Content', 'PPC', 'Social Media'].map(cat => (
                <li key={cat}>
                  <Link href={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-white/50 hover:text-white transition">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4 text-white/80">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Write for Us', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <Link
                    href={
                      item === 'About Us'
                        ? '/about'
                        : item === 'Contact'
                        ? '/contact'
                        : item === 'Privacy Policy'
                        ? '/privacy'
                        : '#'
                    }
                    className="text-sm text-white/50 hover:text-white transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4 text-white/80">Connect</h4>
            <ul className="space-y-2.5">
              {['Newsletter', 'Twitter / X', 'LinkedIn', 'YouTube'].map(item => (
                <li key={item}>
                  {item === 'Newsletter' ? (
                    <Link href="/subscribe" className="text-sm text-white/50 hover:text-white transition">
                      {item}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/50 cursor-default">{item}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>© 2026 CircuitSJ. All rights reserved.</span>
          <span>Made with clarity and purpose.</span>
        </div>
      </div>
    </footer>
  )
}