-- Enamel Dental House — Phase 1 foundation schema
-- Postgres (Supabase). All monetary values numeric(12,2). Times stored as timestamptz (UTC);
-- clinic timezone is Africa/Cairo and is applied at the application layer.

-- ============ ENUMS ============
create type staff_role as enum ('owner', 'manager', 'receptionist', 'dentist', 'accountant');
create type appointment_status as enum (
  'booked', 'confirmed', 'arrived', 'waiting', 'in_treatment', 'completed', 'cancelled', 'no_show'
);
create type appointment_source as enum ('web', 'admin', 'import', 'whatsapp');

-- ============ PROFILES (extends auth.users) ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'receptionist',
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Staff'),
    coalesce((new.raw_user_meta_data ->> 'role')::staff_role, 'receptionist')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ CLINIC SETTINGS (single row) ============
create table public.clinic_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null default 'Enamel Dental House',
  name_ar text,
  phone text,
  whatsapp text not null default '201000268550',
  address text,
  maps_url text,
  timezone text not null default 'Africa/Cairo',
  currency char(3) not null default 'EGP',
  slot_minutes int not null default 45 check (slot_minutes > 0),
  open_hour smallint not null default 12 check (open_hour between 0 and 23),
  close_hour smallint not null default 22 check (close_hour between 1 and 24),
  updated_at timestamptz not null default now()
);
insert into public.clinic_settings (id) values (1);

create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null unique check (weekday between 0 and 6), -- JS getDay: 0=Sun..6=Sat
  is_closed boolean not null default false,
  open_time time,
  close_time time
);
insert into public.working_hours (weekday, is_closed, open_time, close_time) values
  (0, false, '12:00', '22:00'),
  (1, false, '12:00', '22:00'),
  (2, false, '12:00', '22:00'),
  (3, false, '12:00', '22:00'),
  (4, false, '12:00', '22:00'),
  (5, true,  null,    null),     -- Friday closed (matches availability.ts)
  (6, false, '12:00', '22:00');

create table public.holidays (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

-- ============ SERVICES (seeded from SERVICE_OPTIONS) ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,               -- 'checkup', 'whitening', ...
  name_en text not null,
  name_ar text,
  description_en text,
  description_ar text,
  price numeric(12,2) check (price is null or price >= 0),
  duration_min int not null default 45 check (duration_min > 0),
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.services (code, name_en, name_ar, sort_order) values
  ('checkup',    'Check-up & Consultation', 'كشف واستشارة', 1),
  ('whitening',  'Teeth Whitening',          'تبييض الأسنان', 2),
  ('braces',     'Braces & Orthodontics',    'تقويم الأسنان', 3),
  ('implants',   'Dental Implants',          'زراعة الأسنان', 4),
  ('cosmetic',   'Cosmetic Dentistry',       'طب الأسنان التجميلي', 5),
  ('emergency',  'Emergency Dental Care',    'طوارئ الأسنان', 6);

-- ============ PROVIDERS / ROOMS (single-dentist config for now) ============
create table public.dentists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  color text,                              -- calendar display color
  active boolean not null default true,
  profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
insert into public.dentists (name, title) values ('Dr. Mohamed Ibrahim', 'Dentist');

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true
);
insert into public.rooms (name) values ('Treatment Room 1');

-- ============ PATIENTS ============
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_no bigint generated always as identity unique,
  full_name text not null,
  phone text,                              -- normalized digits, e.g. 2010xxxxxxxx
  phone_raw text,
  email text,
  dob date,
  gender text check (gender in ('male', 'female', 'other') or gender is null),
  address text,
  notes text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index patients_phone_idx on public.patients (phone) where phone is not null;
create index patients_name_idx on public.patients using gin (to_tsvector('simple', full_name));

-- ============ APPOINTMENTS (single source of truth) ============
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete restrict,
  service_id uuid references public.services (id) on delete set null,
  dentist_id uuid references public.dentists (id) on delete set null,
  room_id uuid references public.rooms (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appointment_status not null default 'booked',
  source appointment_source not null default 'admin',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index appointments_dentist_time_idx on public.appointments (dentist_id, starts_at);
create index appointments_patient_idx on public.appointments (patient_id);
create index appointments_status_time_idx on public.appointments (status, starts_at);

-- Prevent double-booking per dentist (and per room when assigned).
-- Uses a GiST exclusion constraint; requires btree_gist extension.
create extension if not exists btree_gist;

alter table public.appointments
  add constraint appointments_no_dentist_overlap
  exclude using gist (
    dentist_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status not in ('cancelled', 'no_show') and dentist_id is not null);

alter table public.appointments
  add constraint appointments_no_room_overlap
  exclude using gist (
    room_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status not in ('cancelled', 'no_show') and room_id is not null);

create table public.appointment_status_log (
  id bigint generated always as identity primary key,
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  from_status appointment_status,
  to_status appointment_status not null,
  actor uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index appointment_status_log_idx on public.appointment_status_log (appointment_id, created_at);

-- ============ AUDIT LOG ============
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_created_idx on public.audit_log (created_at desc);

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.working_hours enable row level security;
alter table public.holidays enable row level security;
alter table public.services enable row level security;
alter table public.dentists enable row level security;
alter table public.rooms enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_log enable row level security;
alter table public.audit_log enable row level security;

-- Helper: current user's role
create or replace function public.current_role()
returns staff_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and active) $$;

-- Profiles: users see/edit own row; owner sees all.
create policy profiles_select_own_or_owner on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.current_role() = 'owner');
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = public.current_role());

-- Public-ish config readable by any authenticated staff; owner writes.
create policy clinic_settings_read on public.clinic_settings
  for select to authenticated using (public.is_staff());
create policy clinic_settings_write_owner on public.clinic_settings
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

create policy working_hours_read on public.working_hours
  for select to authenticated using (public.is_staff());
create policy working_hours_write_owner on public.working_hours
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

create policy holidays_read on public.holidays
  for select to authenticated using (public.is_staff());
create policy holidays_write_owner on public.holidays
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

create policy services_read on public.services
  for select to authenticated using (public.is_staff());
create policy services_write_owner on public.services
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

create policy dentists_read on public.dentists
  for select to authenticated using (public.is_staff());
create policy dentists_write_owner on public.dentists
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

create policy rooms_read on public.rooms
  for select to authenticated using (public.is_staff());
create policy rooms_write_owner on public.rooms
  for all to authenticated using (public.current_role() = 'owner') with check (public.current_role() = 'owner');

-- Patients & appointments: all staff roles may read/write in Phase 1;
-- finer-grained clinical/financial policies arrive with their modules.
create policy patients_staff on public.patients
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy appointments_staff on public.appointments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy status_log_staff on public.appointment_status_log
  for select to authenticated using (public.is_staff());
create policy status_log_insert on public.appointment_status_log
  for insert to authenticated with check (public.is_staff());

create policy audit_log_read_owner on public.audit_log
  for select to authenticated using (public.current_role() = 'owner');
create policy audit_log_insert_staff on public.audit_log
  for insert to authenticated with check (public.is_staff());
