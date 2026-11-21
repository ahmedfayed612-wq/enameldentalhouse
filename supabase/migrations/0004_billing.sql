-- Phase 4: Billing, Invoices, Payments, Receipts
-- All monetary values use numeric(12,2) to avoid floating-point drift.

-- ============ PAYMENT METHODS ============
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.payment_methods (name, name_ar, sort_order) values
  ('cash', 'كاش', 1),
  ('bank_card', 'بطاقة ائتمان / خصم', 2),
  ('instapay', 'إنستاباي', 3),
  ('bank_transfer', 'تحويل بنكي', 4),
  ('other', 'أخرى', 5);

-- ============ INVOICES ============
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  patient_id uuid not null references public.patients (id) on delete restrict,
  appointment_id uuid references public.appointments (id) on delete set null,
  invoice_date timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'partially_paid', 'overdue', 'voided', 'refunded')),
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  tax numeric(12,2) not null default 0 check (tax >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance_due numeric(12,2) not null default 0 check (balance_due >= 0),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid <= total)
);

create index invoices_patient_idx on public.invoices (patient_id);
create index invoices_appointment_idx on public.invoices (appointment_id);
create index invoices_status_idx on public.invoices (status);
create index invoices_date_idx on public.invoices (invoice_date);

-- ============ INVOICE ITEMS ============
create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  description text not null,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index invoice_items_invoice_idx on public.invoice_items (invoice_id);

-- ============ PAYMENTS ============
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_number text not null unique,
  patient_id uuid not null references public.patients (id) on delete restrict,
  invoice_id uuid references public.invoices (id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  payment_method uuid references public.payment_methods (id) on delete set null,
  payment_date timestamptz not null default now(),
  recorded_by uuid references public.profiles (id) on delete set null,
  reference_number text,
  receipt_number text,
  notes text,
  created_at timestamptz not null default now()
);

create index payments_patient_idx on public.payments (patient_id);
create index payments_invoice_idx on public.payments (invoice_id);
create index payments_date_idx on public.payments (payment_date);
create index payments_method_idx on public.payments (payment_method);

-- ============ RECEIPTS ============
create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  payment_id uuid not null references public.payments (id) on delete restrict,
  patient_id uuid not null references public.patients (id) on delete restrict,
  receipt_date timestamptz not null default now(),
  amount numeric(12,2) not null check (amount > 0),
  payment_method text,
  invoice_id uuid references public.invoices (id) on delete set null,
  outstanding_balance numeric(12,2) not null default 0 check (outstanding_balance >= 0),
  issued_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index receipts_payment_idx on public.receipts (payment_id);
create index receipts_patient_idx on public.receipts (patient_id);
create index receipts_number_idx on public.receipts (receipt_number);

-- ============ RLS POLICIES ============
alter table public.payment_methods enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.receipts enable row level security;

-- Payment methods: readable by all staff, writable by owner
create policy payment_methods_read on public.payment_methods
  for select to authenticated using (public.is_staff());
create policy payment_methods_write_owner on public.payment_methods
  for all to authenticated using (public.current_role() = 'owner')
  with check (public.current_role() = 'owner');

-- Invoices: readable by all staff, writable by staff
create policy invoices_read on public.invoices
  for select to authenticated using (public.is_staff());
create policy invoices_write_staff on public.invoices
  for insert to authenticated with check (public.is_staff());
create policy invoices_update_staff on public.invoices
  for update to authenticated using (public.is_staff())
  with check (public.is_staff());

-- Invoice items: readable by all staff, writable by staff
create policy invoice_items_read on public.invoice_items
  for select to authenticated using (public.is_staff());
create policy invoice_items_write_staff on public.invoice_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Payments: readable by all staff, writable by staff
create policy payments_read on public.payments
  for select to authenticated using (public.is_staff());
create policy payments_write_staff on public.payments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Receipts: readable by all staff, writable by staff
create policy receipts_read on public.receipts
  for select to authenticated using (public.is_staff());
create policy receipts_write_staff on public.receipts
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============ NUMBER GENERATION HELPERS ============
create or replace function public.next_invoice_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := 'INV';
  v_year text := to_char(now() at time zone 'Africa/Cairo', 'YYYY');
  v_seq int;
begin
  select coalesce(max(substring(invoice_number from '[0-9]+$'))::int, 0) + 1
  into v_seq
  from public.invoices
  where invoice_number like v_prefix || v_year || '%';
  return v_prefix || v_year || lpad(v_seq::text, 6, '0');
end;
$$;

create or replace function public.next_payment_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := 'PAY';
  v_year text := to_char(now() at time zone 'Africa/Cairo', 'YYYY');
  v_seq int;
begin
  select coalesce(max(substring(payment_number from '[0-9]+$'))::int, 0) + 1
  into v_seq
  from public.payments
  where payment_number like v_prefix || v_year || '%';
  return v_prefix || v_year || lpad(v_seq::text, 6, '0');
end;
$$;

create or replace function public.next_receipt_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := 'RCT';
  v_year text := to_char(now() at time zone 'Africa/Cairo', 'YYYY');
  v_seq int;
begin
  select coalesce(max(substring(receipt_number from '[0-9]+$'))::int, 0) + 1
  into v_seq
  from public.receipts
  where receipt_number like v_prefix || v_year || '%';
  return v_prefix || v_year || lpad(v_seq::text, 6, '0');
end;
$$;