-- Core schema for Work Migration as a Service (MaaS)
-- 1) Reference data: countries
create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  region text,
  is_schengen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.countries enable row level security;

-- RLS: anyone can view, users cannot insert/update/delete (managed by service/imports)
create policy if not exists "Anyone can view countries"
  on public.countries for select
  using (true);

create policy if not exists "No direct insert countries"
  on public.countries for insert
  with check (false);

create policy if not exists "No direct update countries"
  on public.countries for update
  using (false);

create policy if not exists "No direct delete countries"
  on public.countries for delete
  using (false);

-- 2) Visa categories per country (read-only to clients)
create table if not exists public.visa_categories (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references public.countries(code) on delete cascade,
  name text not null,
  category_code text,
  description text,
  requirements jsonb,
  fees text,
  processing_time text,
  documents jsonb,
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.visa_categories enable row level security;

create policy if not exists "Anyone can view visa categories"
  on public.visa_categories for select
  using (true);

create policy if not exists "No direct insert visa categories"
  on public.visa_categories for insert
  with check (false);

create policy if not exists "No direct update visa categories"
  on public.visa_categories for update
  using (false);

create policy if not exists "No direct delete visa categories"
  on public.visa_categories for delete
  using (false);

-- 3) Migration pathways per country (read-only to clients)
create table if not exists public.migration_pathways (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references public.countries(code) on delete cascade,
  title text not null,
  summary text,
  links jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.migration_pathways enable row level security;

create policy if not exists "Anyone can view migration pathways"
  on public.migration_pathways for select
  using (true);

create policy if not exists "No direct insert migration pathways"
  on public.migration_pathways for insert
  with check (false);

create policy if not exists "No direct update migration pathways"
  on public.migration_pathways for update
  using (false);

create policy if not exists "No direct delete migration pathways"
  on public.migration_pathways for delete
  using (false);

-- 4) Per-user preferences (origin, destination, locale)
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  origin_country_code text,
  destination_country_code text,
  locale text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_preferences enable row level security;

create policy if not exists "Users can view their preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy if not exists "Users can set their preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their preferences"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- 5) Documents metadata (files live in storage bucket "documents")
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null default 'documents',
  path text not null,
  doc_type text,
  status text not null default 'pending',
  country_code text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy if not exists "Users can view their documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- 6) Notifications per user (for realtime)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy if not exists "Users can view their notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- 7) Updated-at triggers for mutable tables
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists update_countries_updated_at
  before update on public.countries
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_visa_categories_updated_at
  before update on public.visa_categories
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_migration_pathways_updated_at
  before update on public.migration_pathways
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at_column();

-- 8) Storage buckets and policies
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Avatars: public read, users manage their own folder (first segment = uid)
create policy if not exists "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy if not exists "Users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Documents: private bucket, users can only manage their own files
create policy if not exists "Users read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users update own documents"
  on storage.objects for update
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 9) Realtime for notifications + key tables
alter table if exists public.notifications replica identity full;
alter table if exists public.job_applications replica identity full;
alter table if exists public.saved_jobs replica identity full;

-- add to supabase_realtime publication (if not present, this will error; using IF EXISTS guards not supported here)
-- it's okay if the rows already exist; duplicates are ignored
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.job_applications;
alter publication supabase_realtime add table public.saved_jobs;
