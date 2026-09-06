export const metadata = {
  title: 'Privacy Policy — CircuitSJ',
  description: 'How CircuitSJ collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-cd-bg py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
          <p className="text-lg text-cd-muted leading-relaxed">Last updated: July 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 font-body text-cd-muted leading-relaxed">
        <p className="mb-8">
          CircuitSJ (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates this website.
          This page explains what information we collect, how we use it, and the choices you
          have. By using this site, you agree to the practices described below.
        </p>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Information We Collect</h2>
        <p className="mb-4">We do not require you to create an account or provide personal information to read articles on this site. We may automatically collect limited technical information through cookies and similar technologies, including:</p>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>Browser type and device information</li>
          <li>Pages visited and time spent on the site</li>
          <li>General location (such as country or city, not precise GPS location)</li>
          <li>Referring website or search engine</li>
        </ul>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Cookies &amp; Advertising</h2>
        <p className="mb-4">
          This site may use Google AdSense and/or Google Analytics to display ads and understand
          site traffic. Google and its partners may use cookies to serve ads based on your prior
          visits to this or other websites.
        </p>
        <p className="mb-4">
          You can opt out of personalized advertising by visiting{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            Google&apos;s Ads Settings
          </a>
          . Third-party vendors, including Google, may also use cookies to serve ads based on a
          user&apos;s prior visits to this website or other websites.
        </p>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Third-Party Links</h2>
        <p className="mb-8">
          Our articles may link to other websites. We are not responsible for the privacy
          practices or content of those external sites. We encourage you to review the privacy
          policy of any site you visit.
        </p>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Children&apos;s Privacy</h2>
        <p className="mb-8">
          This site is not directed at children under 13, and we do not knowingly collect
          personal information from children.
        </p>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Changes to This Policy</h2>
        <p className="mb-8">
          We may update this Privacy Policy from time to time. Any changes will be posted on
          this page with an updated revision date.
        </p>

        <h2 className="text-2xl font-bold text-cd-text mb-4">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:circuitdaily1@gmail.com" className="text-primary underline">
            circuitdaily1@gmail.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
