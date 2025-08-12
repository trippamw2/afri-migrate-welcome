-- Retry migration without IF NOT EXISTS and with idempotent drops

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

-- RLS policies (drop then create for idempotency)
drop policy if exists "Anyone can view countries" on public.countries;
create policy "Anyone can view countries"
  on public.countries for select
  using (true);

drop policy if exists "No direct insert countries" on public.countries;
create policy "No direct insert countries"
  on public.countries for insert
  with check (false);

drop policy if exists "No direct update countries" on public.countries;
create policy "No direct update countries"
  on public.countries for update
  using (false);

drop policy if exists "No direct delete countries" on public.countries;
create policy "No direct delete countries"
  on public.countries for delete
  using (false);

-- 2) Visa categories per country
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

drop policy if exists "Anyone can view visa categories" on public.visa_categories;
create policy "Anyone can view visa categories"
  on public.visa_categories for select
  using (true);

drop policy if exists "No direct insert visa categories" on public.visa_categories;
create policy "No direct insert visa categories"
  on public.visa_categories for insert
  with check (false);

drop policy if exists "No direct update visa categories" on public.visa_categories;
create policy "No direct update visa categories"
  on public.visa_categories for update
  using (false);

drop policy if exists "No direct delete visa categories" on public.visa_categories;
create policy "No direct delete visa categories"
  on public.visa_categories for delete
  using (false);

-- 3) Migration pathways per country
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

drop policy if exists "Anyone can view migration pathways" on public.migration_pathways;
create policy "Anyone can view migration pathways"
  on public.migration_pathways for select
  using (true);

drop policy if exists "No direct insert migration pathways" on public.migration_pathways;
create policy "No direct insert migration pathways"
  on public.migration_pathways for insert
  with check (false);

drop policy if exists "No direct update migration pathways" on public.migration_pathways;
create policy "No direct update migration pathways"
  on public.migration_pathways for update
  using (false);

drop policy if exists "No direct delete migration pathways" on public.migration_pathways;
create policy "No direct delete migration pathways"
  on public.migration_pathways for delete
  using (false);

-- 4) Per-user preferences
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

drop policy if exists "Users can view their preferences" on public.user_preferences;
create policy "Users can view their preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can set their preferences" on public.user_preferences;
create policy "Users can set their preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their preferences" on public.user_preferences;
create policy "Users can update their preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their preferences" on public.user_preferences;
create policy "Users can delete their preferences"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- 5) Documents metadata
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

drop policy if exists "Users can view their documents" on public.documents;
create policy "Users can view their documents"
  on public.documents for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their documents" on public.documents;
create policy "Users can insert their documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their documents" on public.documents;
create policy "Users can update their documents"
  on public.documents for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their documents" on public.documents;
create policy "Users can delete their documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- 6) Notifications per user
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

drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their notifications" on public.notifications;
create policy "Users can insert their notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their notifications" on public.notifications;
create policy "Users can update their notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their notifications" on public.notifications;
create policy "Users can delete their notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- 7) Updated-at triggers
-- Function already exists in this project, but keep it in sync
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop then create triggers for idempotency
 drop trigger if exists update_countries_updated_at on public.countries;
create trigger update_countries_updated_at
  before update on public.countries
  for each row execute function public.update_updated_at_column();

 drop trigger if exists update_visa_categories_updated_at on public.visa_categories;
create trigger update_visa_categories_updated_at
  before update on public.visa_categories
  for each row execute function public.update_updated_at_column();

 drop trigger if exists update_migration_pathways_updated_at on public.migration_pathways;
create trigger update_migration_pathways_updated_at
  before update on public.migration_pathways
  for each row execute function public.update_updated_at_column();

 drop trigger if exists update_user_preferences_updated_at on public.user_preferences;
create trigger update_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at_column();

 drop trigger if exists update_documents_updated_at on public.documents;
create trigger update_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at_column();

-- 8) Storage buckets and policies
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Avatars policies
 drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

 drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

 drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

 drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Documents policies
 drop policy if exists "Users read own documents" on storage.objects;
create policy "Users read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

 drop policy if exists "Users upload documents" on storage.objects;
create policy "Users upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

 drop policy if exists "Users update own documents" on storage.objects;
create policy "Users update own documents"
  on storage.objects for update
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

 drop policy if exists "Users delete own documents" on storage.objects;
create policy "Users delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 9) Realtime: set replica identity and add to publication
alter table if exists public.notifications replica identity full;
alter table if exists public.job_applications replica identity full;
alter table if exists public.saved_jobs replica identity full;

-- Wrap publication additions to ignore duplicates
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_jobs;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
