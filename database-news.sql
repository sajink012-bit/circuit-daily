-- CircuitSJ News Intelligence
create table if not exists news_stories (
  id bigint generated always as identity primary key,
  title text not null,
  url text not null unique,
  source_name text not null,
  category text not null default 'Technology',
  summary text default '',
  published_at timestamptz,
  score integer not null default 0,
  status text not null default 'discovered' check (status in ('discovered','selected','generated','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists news_stories_score_idx on news_stories(score desc, created_at desc);
create index if not exists news_stories_status_idx on news_stories(status);
create index if not exists news_stories_category_idx on news_stories(category);

alter table news_stories enable row level security;
create policy "authenticated users can read news stories" on news_stories for select to authenticated using (true);
create policy "authenticated users can insert news stories" on news_stories for insert to authenticated with check (true);
create policy "authenticated users can update news stories" on news_stories for update to authenticated using (true) with check (true);

-- Optional: if your project uses service-role access for server routes, the policies above are not required for those routes.
