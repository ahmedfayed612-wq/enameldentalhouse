-- Enamel Dental House — Phase 3+ operational schema
-- Invoices, payments, expenses, treatment plans. Monetary values numeric(12,2), EGP.

-- ============ ENUMS ============
create type invoice_status as enum ('draft', 'sent', 'partial', 'paid', 'void');
create type payment_method as enum ('cash', 'card', 'wallet', 'insurance', 'other');
create type expense_category as enum (
  'supplies', 'lab', 'rent', 'utilities', 'salaries', 'equipment', 'marketing', 'other'
);
create type treatment_item_status as enum ('planned', 'in_progress', 'done', 'skipped');

-- ============ INVOICES ============
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no bigint generated always as identity unique,
  patient_id uuid not null references public.patients (id) on delete restrict,
  appointment_id uuid references public.appointments (id) on delete set null,
  status invoice_status not null default 'draft',
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  currency char(3) not null default 'EGP',
  issued_at timestamptz not null default now(),
  due_date date,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount <= subtotal)
);
create index invoices_patient_idx on public.invoices (patient_id);
create index invoices_status_idx on public.invoices (status);
create index invoices_issued_idx on public.invoices (issued_at desc);

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  qty numeric(10,2) not null default 1 check (qty > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) generated always as (qty * unit_price) stored,
  created_at timestamptz not null default now()
);
create index invoice_items_invoice_idx on public.invoice_items (invoice_id);

-- ============ PAYMENTS (append-only ledger) ============
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete restrict,
  patient_id uuid not null references public.patients (id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  method payment_method not null default 'cash',
  paid_at timestamptz not null default now(),
  reference text,
  notes text,
  received_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index payments_invoice_idx on public.payments (invoice_id);
create index payments_patient_idx on public.payments (patient_id);
create index payments_paid_idx on public.payments (paid_at desc);

-- Keep invoice.amount_paid / status in sync when payments are inserted.
create or replace function public.sync_invoice_payment()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  inv_total numeric(12,2);
  inv_paid numeric(12,2);
begin
  select total into inv_total from public.invoices where id = new.invoice_id;
  select coalesce(sum(amount), 0) into inv_paid from public.payments where invoice_id = new.invoice_id;
  update public.invoices
    set amount_paid = inv_paid,
        status = case
          when inv_paid >= inv_total then 'paid'::invoice_status
          when inv_paid > 0 then 'partial'::invoice_status
          else status
        end,
        updated_at = now()
    where id = new.invoice_id;
  return new;
end;
$$;

create trigger payments_sync_invoice
  after insert on public.payments
  for each row execute function public.sync_invoice_payment();

-- ============ EXPENSES ============
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  category expense_category not null default 'other',
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  spent_at date not null default current_date,
  supplier text,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index expenses_spent_idx on public.expenses (spent_at desc);
create index expenses_category_idx on public.expenses (category);

-- ============ TREATMENT PLANS ============
create table public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  title text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index treatment_plans_patient_idx on public.treatment_plans (patient_id);

create table public.treatment_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.treatment_plans (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  description text not null,
  tooth text,
  status treatment_item_status not null default 'planned',
  estimated_price numeric(12,2) check (estimated_price is null or estimated_price >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index treatment_plan_items_plan_idx on public.treatment_plan_items (plan_id);

-- ============ RLS ============
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.treatment_plans enable row level security;
alter table public.treatment_plan_items enable row level security;

-- Financial tables: owner + accountant manage; other staff read.
create or replace function public.can_manage_finance()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_role() in ('owner', 'accountant') $$;

create policy invoices_read on public.invoices
  for select to authenticated using (public.is_staff());
create policy invoices_write on public.invoices
  for all to authenticated using (public.can_manage_finance()) with check (public.can_manage_finance());

create policy invoice_items_read on public.invoice_items
  for select to authenticated using (public.is_staff());
create policy invoice_items_write on public.invoice_items
  for all to authenticated using (public.can_manage_finance()) with check (public.can_manage_finance());

create policy payments_read on public.payments
  for select to authenticated using (public.is_staff());
create policy payments_write on public.payments
  for insert to authenticated with check (public.can_manage_finance());
-- Payments are append-only: no update/delete policy.

create policy expenses_read on public.expenses
  for select to authenticated using (public.is_staff());
create policy expenses_write on public.expenses
  for all to authenticated using (public.can_manage_finance()) with check (public.can_manage_finance());

create policy treatment_plans_staff on public.treatment_plans
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy treatment_plan_items_staff on public.treatment_plan_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
