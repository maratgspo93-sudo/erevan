-- Run this in the Supabase SQL editor (or any Postgres instance)
-- to create a production-ready listings table.

create table if not exists listings (
  id bigint generated always as identity primary key,
  title text not null,
  district text not null,
  rooms int not null default 1,
  area numeric,
  floor text,
  price_amd bigint not null,
  img text,
  source_name text,
  source_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_listings_district on listings (district);
create index if not exists idx_listings_price on listings (price_amd);
create index if not exists idx_listings_rooms on listings (rooms);

-- Row Level Security: public read, authenticated insert only
alter table listings enable row level security;

create policy "Public listings are viewable by everyone"
  on listings for select
  using (true);

create policy "Authenticated users can add listings"
  on listings for insert
  with check (auth.role() = 'authenticated');

-- Optional: favorites table, tied to Supabase auth users
create table if not exists favorites (
  user_id uuid references auth.users(id) on delete cascade,
  listing_id bigint references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table favorites enable row level security;

create policy "Users manage their own favorites"
  on favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
