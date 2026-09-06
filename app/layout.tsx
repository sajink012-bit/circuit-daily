import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageViewTracker from '@/components/PageViewTracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-merriweather' })

export const metadata: Metadata = {
  title: 'CircuitSJ — Digital Marketing & Technology News',
  description: 'Clear, honest, and actionable digital marketing insights. No fluff, no hype — just what works.',
  keywords: ['SEO', 'digital marketing', 'AI', 'content marketing', 'PPC', 'social media'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8208370664394349" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8208370664394349"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} ${merriweather.variable} font-sans`}>
        <PageViewTracker />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
