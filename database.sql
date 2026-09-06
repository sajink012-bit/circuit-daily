-- Circuit Daily Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable Row Level Security
alter table if exists articles enable row level security;

-- Create articles table
create table if not exists articles (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null,
  category_slug text not null,
  author text not null,
  author_initials text not null,
  date text not null,
  read_time text not null,
  views text default '0',
  emoji text default '📰',
  image_url text,
  featured boolean default false,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index on slug for fast lookups
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_category on articles(category_slug);
create index if not exists idx_articles_published on articles(published);

-- Insert sample articles
insert into articles (title, slug, excerpt, content, category, category_slug, author, author_initials, date, read_time, views, emoji, featured, published) values
(
  'SEO in 2026: The Complete Guide to What Actually Works',
  'seo-2026-complete-guide',
  'We analyzed 10,000 top-ranking pages and tested every major strategy. Here is the honest truth about ranking in 2026.',
  '<p>Let us be honest: most SEO advice on the internet is recycled garbage from 2019. We did something different. Over the past three months, our team analyzed 10,000 top-ranking pages across 50 competitive keywords.</p><h2>The Big Picture</h2><p>Despite all the algorithm updates, the fundamentals of SEO remain surprisingly consistent. Google still wants to show the best result for every query.</p><h2>What Actually Works</h2><h3>1. Search Intent Matching</h3><p>Stop counting keyword density. Start analyzing what the top 10 results actually deliver.</p><h3>2. First-Hand Experience</h3><p>Pages with original research consistently outrank rewritten content.</p><blockquote>The sites winning in 2026 are the ones that could not be replaced by AI.</blockquote><h2>What Does Not Work Anymore</h2><ul><li>Keyword stuffing</li><li>Generic guest posting</li><li>Thin AI content</li><li>Chasing algorithm updates</li></ul><h2>Your 90-Day Action Plan</h2><ol><li>Audit existing content</li><li>Fix technical issues</li><li>Map internal links</li><li>Update old content</li><li>Build one original asset</li></ol>',
  'SEO',
  'seo',
  'Alex Kim',
  'AK',
  'July 24, 2026',
  '18 min',
  '45.2K',
  '📈',
  true,
  true
),
(
  'How AI Is Changing Content Marketing Forever',
  'ai-changing-content-marketing',
  'From content creation to distribution, artificial intelligence is reshaping every aspect of content marketing.',
  '<p>Two years ago, using AI for content marketing meant running your blog post through Grammarly. Today, AI can research topics, generate outlines, write drafts, create images, and optimize for SEO.</p><h2>The New Content Workflow</h2><ol><li>Research with AI tools</li><li>AI-generated outlines</li><li>First drafts in minutes</li><li>Human editing and fact-checking</li><li>AI optimization</li><li>Personalized distribution</li></ol><h2>What AI Does Well</h2><p>Speed, data analysis, and personalization.</p><h2>What AI Does Poorly</h2><p>Original research, opinion, and emotional connection.</p><blockquote>The marketers winning with AI are the ones using it to amplify their humanity, not replace it.</blockquote>',
  'AI & Tech',
  'ai',
  'Sarah Chen',
  'SC',
  'July 22, 2026',
  '12 min',
  '28.7K',
  '🤖',
  false,
  true
),
(
  'The New Instagram Algorithm: What Creators Need to Know',
  'instagram-algorithm-2026',
  'Instagram 2026 algorithm update prioritizes original content and meaningful interactions.',
  '<p>Instagram algorithm has changed again. If you are still using 2024 tactics, you are leaving reach on the table.</p><h2>What Is New</h2><h3>1. Original Content Priority</h3><p>Instagram actively deprioritizes reposted content.</p><h3>2. Meaningful Interactions</h3><p>Likes matter less. Comments, shares, and saves matter more.</p><h3>3. Cross-Format Boost</h3><p>Creators using Reels, Stories, Carousels, and Live get distribution boost.</p><h2>What This Means</h2><ul><li>Stop reposting</li><li>Optimize for saves</li><li>Use all formats</li><li>Engage back quickly</li></ul>',
  'Social Media',
  'social',
  'Marcus Johnson',
  'MJ',
  'July 20, 2026',
  '9 min',
  '19.3K',
  '📱',
  false,
  true
),
(
  'Google Ads Costs Are Rising: 5 Strategies to Maintain ROI',
  'google-ads-costs-rising-strategies',
  'Cost-per-click has increased 34% year-over-year. Here is how smart advertisers are adapting.',
  '<p>If you have been running Google Ads lately, you have felt the squeeze. Average CPC across industries has risen 34% year-over-year.</p><h2>1. Shift to Value-Based Bidding</h2><p>Stop optimizing for clicks. Start optimizing for value.</p><h2>2. Use First-Party Data</h2><p>Upload customer lists as custom audiences. Lookalike audiences outperform interest targeting by 30-60%.</p><h2>3. Double Down on Long-Tail Keywords</h2><p>Accounts with 60%+ spend on 4+ word keywords had 28% lower CPA.</p><h2>4. Improve Quality Score</h2><p>Quality Score 8+ reduces CPC by 30-50%.</p><h2>5. Test Performance Max Carefully</h2><p>Use audience signals and conversion value rules.</p>',
  'PPC',
  'ppc',
  'Alex Kim',
  'AK',
  'July 18, 2026',
  '10 min',
  '15.8K',
  '💰',
  false,
  true
),
(
  'Google Analytics 4: The Complete Setup Guide for 2026',
  'google-analytics-4-setup-guide-2026',
  'GA4 is now the only option. Here is how to configure it properly.',
  '<p>Universal Analytics is dead. If you have not fully migrated to GA4, you are making decisions based on incomplete data.</p><h2>Step 1: Audit Your Setup</h2><ul><li>Is the tag firing on every page?</li><li>Are enhanced measurement events enabled?</li><li>Do you have custom events?</li><li>Are conversions configured?</li></ul><h2>Step 2: Configure Essential Events</h2><p>Use Google Tag Manager for form submissions, button clicks, e-commerce actions, video engagement, and file downloads.</p><h2>Step 3: Set Up Meaningful Conversions</h2><ul><li>Primary: Purchases, lead forms, demo requests</li><li>Secondary: Newsletter signups, downloads</li><li>Micro: Add to cart, scroll depth</li></ul><h2>Step 4: Build Custom Reports</h2><p>Traffic quality, content performance, e-commerce funnel, campaign ROI.</p><h2>Step 5: Connect to BigQuery</h2><p>Free daily export up to 1M events/day. Unsampled raw data.</p>',
  'Analytics',
  'analytics',
  'Marcus Johnson',
  'MJ',
  'July 12, 2026',
  '11 min',
  '17.5K',
  '📊',
  false,
  true
);

-- Set up RLS policies (allow read for all, write for authenticated)
create policy "Allow public read" on articles for select using (true);
create policy "Allow authenticated insert" on articles for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on articles for update using (auth.role() = 'authenticated');

-- Create function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger update_articles_updated_at
  before update on articles
  for each row
  execute function update_updated_at_column();