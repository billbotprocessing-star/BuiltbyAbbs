-- BuiltbyAbbs Macro Tracker: Supabase schema
-- Run in the Supabase SQL Editor (or apply as a migration).
-- Auth is handled by Supabase Auth (auth.users), so no custom users table is needed.

-- ---------- Tables ----------

create table if not exists public.user_goals (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  protein    numeric not null default 150,
  carbs      numeric not null default 200,
  fats       numeric not null default 65,
  calories   numeric not null default 2000,
  updated_at timestamptz not null default now()
);

create table if not exists public.food_entries (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null,
  protein    numeric not null default 0,
  carbs      numeric not null default 0,
  fats       numeric not null default 0,
  calories   numeric not null default 0,
  entry_date date not null,          -- local calendar day, e.g. 2026-09-19
  entry_time text,                   -- display string, e.g. "02:15 PM"
  entry_grams numeric,               -- amount eaten in grams, when known (lets "log again" rescale the portion)
  created_at timestamptz not null default now()
);

create index if not exists food_entries_user_date_idx
  on public.food_entries (user_id, entry_date desc);

-- Migration for an existing database that already has food_entries without entry_grams:
-- alter table public.food_entries add column if not exists entry_grams numeric;

create table if not exists public.chat_messages (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_user_idx
  on public.chat_messages (user_id, id desc);

-- ---------- Row Level Security ----------
-- Each user can only see and modify their own rows.

alter table public.user_goals    enable row level security;
alter table public.food_entries  enable row level security;
alter table public.chat_messages enable row level security;

create policy "own goals"
  on public.user_goals for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own food entries"
  on public.food_entries for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own chat messages"
  on public.chat_messages for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
