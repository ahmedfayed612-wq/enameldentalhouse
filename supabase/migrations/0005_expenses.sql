-- Phase 5: Expense Management

-- ============ EXPENSE CATEGORIES ============
create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_ar text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.expense_categories (name, name_ar, sort_order) values
  ('salaries', 'رواتب', 1),
  ('rent', 'إيجار', 2),
  ('dental_supplies', 'مواد طبية أسنان', 3),
  ('equipment', 'معدات', 4),
  ('utilities', 'مرافق', 5),
  ('marketing', 'تسويق', 6),
  ('maintenance', 'صيانة', 7),
  ('software_subscriptions', 'اشتراكات برمجيات', 8),
  ('other', 'أخرى', 9);

-- ============ EXPENSES ============
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_id text not null unique,
  name text not null,
  description text,
  category uuid references public.expense_categories (id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  expense_date timestamptz not null default now(),
  payment_method text,
  supplier text,
  attachment_url text,
  recorded_by uuid references public.profiles (id) on delete set null,
  payment_status text not null default 'paid' check (payment_status in ('paid', 'pending', 'partial')),
  recurrence_info jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index expenses_category_idx on public.expenses (category);
create index expenses_date_idx on public.expenses (expense_date);
create index expenses_recorded_by_idx on public.expenses (recorded_by);

-- ============ RLS POLICIES ============
alter table public.expense_categories enable row level security;
alter table public.expenses enable row level security;

create policy expense_categories_read on public.expense_categories
  for select to authenticated using (public.is_staff());
create policy expense_categories_write_owner on public.expense_categories
  for all to authenticated using (public.current_role() = 'owner')
  with check (public.current_role() = 'owner');

create policy expenses_read on public.expenses
  for select to authenticated using (public.is_staff());
create policy expenses_write_staff on public.expenses
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============ EXPENSE ID GENERATION ============
create or replace function public.next_expense_id()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := 'EXP';
  v_year text := to_char(now() at time zone 'Africa/Cairo', 'YYYY');
  v_seq int;
begin
  select coalesce(max(substring(expense_id from '[0-9]+$'))::int, 0) + 1
  into v_seq
  from public.expenses
  where expense_id like v_prefix || v_year || '%';
  return v_prefix || v_year || lpad(v_seq::text, 6, '0');
end;
$$;