-- Phase 3: Patient CSV Import Logging

-- ============ IMPORT LOGS ============
create table public.import_logs (
  id uuid primary key default gen_random_uuid(),
  import_date timestamptz not null default now(),
  user_id uuid references public.profiles (id) on delete set null,
  file_name text not null,
  valid_records int not null default 0,
  imported_records int not null default 0,
  skipped_records int not null default 0,
  failed_records int not null default 0,
  duplicate_records int not null default 0,
  import_report jsonb,
  created_at timestamptz not null default now()
);

create index import_logs_user_idx on public.import_logs (user_id);
create index import_logs_date_idx on public.import_logs (import_date);

-- ============ RLS POLICIES ============
alter table public.import_logs enable row level security;

create policy import_logs_read on public.import_logs
  for select to authenticated using (public.is_staff());
create policy import_logs_write_staff on public.import_logs
  for insert to authenticated with check (public.is_staff());