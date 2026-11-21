-- Phase 6: Treatment Plans and Clinical History

-- ============ TREATMENT PLANS ============
create table public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null unique,
  patient_id uuid not null references public.patients (id) on delete restrict,
  title text not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index treatment_plans_patient_idx on public.treatment_plans (patient_id);
create index treatment_plans_status_idx on public.treatment_plans (status);

-- ============ TREATMENT PLAN ITEMS ============
create table public.treatment_plan_items (
  id uuid primary key default gen_random_uuid(),
  treatment_plan_id uuid not null references public.treatment_plans (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  description text not null,
  estimated_price numeric(12,2) check (estimated_price >= 0),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  associated_appointment_id uuid references public.appointments (id) on delete set null,
  completion_date timestamptz,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index treatment_plan_items_plan_idx on public.treatment_plan_items (treatment_plan_id);

-- ============ RLS POLICIES ============
alter table public.treatment_plans enable row level security;
alter table public.treatment_plan_items enable row level security;

create policy treatment_plans_read on public.treatment_plans
  for select to authenticated using (public.is_staff());
create policy treatment_plans_write_staff on public.treatment_plans
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy treatment_plan_items_read on public.treatment_plan_items
  for select to authenticated using (public.is_staff());
create policy treatment_plan_items_write_staff on public.treatment_plan_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============ TREATMENT PLAN ID GENERATION ============
create or replace function public.next_treatment_plan_id()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := 'TP';
  v_year text := to_char(now() at time zone 'Africa/Cairo', 'YYYY');
  v_seq int;
begin
  select coalesce(max(substring(plan_id from '[0-9]+$'))::int, 0) + 1
  into v_seq
  from public.treatment_plans
  where plan_id like v_prefix || v_year || '%';
  return v_prefix || v_year || lpad(v_seq::text, 6, '0');
end;
$$;