# Circuit Daily — Next.js Website

A production-ready digital marketing news website built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Homepage** with featured article hero, latest articles, and trending sidebar
- **Category Pages** with filtered article listings
- **Article Pages** with full content, author boxes, related articles, and tags
- **Search** with real-time database queries
- **About Page** with mission and values
- **SEO Optimized** with metadata, Open Graph, and static generation
- **Responsive Design** for mobile, tablet, and desktop
- **Newsletter Signup** forms throughout the site

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| ORM/Client | @supabase/supabase-js |
| Fonts | Inter (headings), Merriweather (body) |
| Hosting | Vercel (recommended) |

## Quick Start

### 1. Clone and Install

```bash
cd circuit-daily-nextjs
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Copy your Project URL and Anon Key from Settings > API
3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. In Supabase, go to the SQL Editor
2. Open `database.sql` from this project
3. Run the entire script
4. Your articles table is now ready with 5 sample articles

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Project Structure

```
app/
  page.tsx              # Homepage
  layout.tsx            # Root layout with fonts
  globals.css           # Global styles + Tailwind
  article/[slug]/       # Article detail pages
  category/[slug]/      # Category filter pages
  search/               # Search page
  about/                # About page
  api/articles/         # API route for articles
components/
  Navbar.tsx            # Top navigation with ticker
  Footer.tsx            # Site footer
  HeroSection.tsx       # Featured article hero
  ArticleList.tsx       # Article list layout
  ArticleCard.tsx       # Grid card component
  SectionHeader.tsx     # Section title component
  Sidebar.tsx           # Right sidebar
lib/
  supabase.ts           # Supabase client
public/                 # Static assets
```

## Adding Articles

### Method 1: Supabase Dashboard (Easiest)

1. Go to your Supabase project
2. Navigate to Table Editor > articles
3. Click "Insert Row"
4. Fill in the fields:
   - **title**: Article headline
   - **slug**: URL-friendly version (e.g., "my-article-title")
   - **excerpt**: 1-2 sentence summary
   - **content**: Full HTML content
   - **category**: Display name (e.g., "SEO")
   - **category_slug**: URL slug (e.g., "seo")
   - **author**: Full name
   - **author_initials**: 2 letters (e.g., "AK")
   - **date**: Publication date
   - **read_time**: "X min"
   - **emoji**: Any emoji for the card image
   - **featured**: true/false
   - **published**: true/false

### Method 2: Admin API

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Article",
    "slug": "my-new-article",
    "excerpt": "Short description...",
    "content": "<p>Full HTML content...</p>",
    "category": "SEO",
    "category_slug": "seo",
    "author": "Alex Kim",
    "author_initials": "AK",
    "date": "July 25, 2026",
    "read_time": "10 min",
    "emoji": "🚀",
    "published": true
  }'
```

### Content HTML Format

Use these HTML tags in your content:

```html
<p>Paragraph text</p>
<h2>Main heading</h2>
<h3>Sub heading</h3>
<ul>
  <li>Bullet point</li>
</ul>
<ol>
  <li>Numbered item</li>
</ol>
<blockquote>Quote text</blockquote>
<strong>Bold text</strong>
```

## Adding Images

### For Article Featured Images

1. Upload images to **Supabase Storage** or **Cloudinary**
2. Copy the image URL
3. Paste it in the `image_url` field of the article
4. The site will display the image instead of the emoji placeholder

### Image Best Practices

| Spec | Recommendation |
|------|---------------|
| Format | WebP or JPG |
| Size | Under 200KB |
| Dimensions | 1200×630px for social, 800×400px for cards |
| Alt text | Always include descriptive alt text |

## Customization

### Colors
Edit `tailwind.config.js`:

```js
colors: {
  primary: '#d93025',        // Change brand color
  'primary-dark': '#b71c1c',
  'primary-light': '#ffebee',
}
```

### Categories
Edit the `categoryInfo` object in `app/category/[slug]/page.tsx`:

```js
const categoryInfo = {
  seo: { title: 'SEO', desc: 'Your description...' },
  // Add new categories here
}
```

### Navigation
Edit `components/Navbar.tsx` to add/remove nav links.

## SEO Checklist

- [ ] Add your domain to `next.config.js`
- [ ] Set up Google Search Console
- [ ] Submit sitemap.xml
- [ ] Add Google Analytics 4 tracking ID
- [ ] Customize metadata in `app/layout.tsx`
- [ ] Add Open Graph images

## License

MIT — Built for Circuit Daily.
