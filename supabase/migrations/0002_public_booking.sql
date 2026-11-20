-- Phase 2: public booking path.
-- Anonymous visitors may READ safe config (services, hours, holidays, clinic info)
-- and call two security-definer functions: get_day_slots() and book_appointment().
-- All writes to patients/appointments from the public go through book_appointment()
-- so validation, dedupe and conflict checks live in one place.

-- ============ ANON READ POLICIES (public marketing data only) ============
create policy services_public_read on public.services
  for select to anon, authenticated using (active);
create policy working_hours_public_read on public.working_hours
  for select to anon, authenticated using (true);
create policy holidays_public_read on public.holidays
  for select to anon, authenticated using (true);
create policy clinic_settings_public_read on public.clinic_settings
  for select to anon, authenticated using (true);
create policy dentists_public_read on public.dentists
  for select to anon, authenticated using (active);

-- ============ SLOT GENERATION ============
-- Returns available "HH:MM" slots (clinic local time, Africa/Cairo) for a date.
create or replace function public.get_day_slots(p_date date)
returns table (slot time)
language plpgsql stable security definer set search_path = public
as $$
declare
  v_wh public.working_hours%rowtype;
  v_closed boolean;
  v_open_min int;
  v_close_min int;
  v_slot_min int;
begin
  select slot_minutes into v_slot_min from public.clinic_settings where id = 1;
  if v_slot_min is null then return; end if;

  -- holidays close the day
  select exists(select 1 from public.holidays where date = p_date) into v_closed;
  if v_closed then return; end if;

  -- extract(dow): 0=Sun..6=Sat matches our weekday convention
  select * into v_wh from public.working_hours where weekday = extract(dow from p_date)::int;
  if not found or v_wh.is_closed then return; end if;

  v_open_min := extract(hour from v_wh.open_time)::int * 60 + extract(minute from v_wh.open_time)::int;
  v_close_min := extract(hour from v_wh.close_time)::int * 60 + extract(minute from v_wh.close_time)::int;

  return query
  with grid as (
    select generate_series(v_open_min, v_close_min - v_slot_min, v_slot_min) as m
  ),
  slots as (
    select
      (make_time(m / 60, m % 60, 0))::time as slot_start,
      ((make_time(m / 60, m % 60, 0) + make_interval(mins => v_slot_min)))::time as slot_end
    from grid
  )
  select s.slot_start
  from slots s
  where ((p_date + s.slot_start) at time zone 'Africa/Cairo') > now()
    and not exists (
      select 1 from public.appointments a
      where a.status not in ('cancelled', 'no_show')
        and a.starts_at < ((p_date + s.slot_end) at time zone 'Africa/Cairo')
        and a.ends_at   > ((p_date + s.slot_start) at time zone 'Africa/Cairo')
    )
  order by s.slot_start;
end;
$$;

-- ============ PUBLIC BOOKING ============
-- Validates input, finds-or-creates the patient by phone, verifies the slot is
-- still free, inserts the appointment. Returns jsonb result.
create or replace function public.book_appointment(
  p_name text,
  p_phone text,
  p_service_code text,
  p_date date,
  p_time time,
  p_notes text default null
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_phone text;
  v_patient_id uuid;
  v_service_id uuid;
  v_dentist_id uuid;
  v_appointment_id uuid;
  v_start timestamptz;
  v_end timestamptz;
  v_slot_min int;
begin
  -- Basic validation
  if p_name is null or length(trim(p_name)) < 2 then
    return jsonb_build_object('ok', false, 'error', 'invalid_name');
  end if;

  -- Normalize Egyptian phone: digits only -> 01xxxxxxxxx
  v_phone := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  v_phone := regexp_replace(v_phone, '^(0020|20)?', '0');
  if v_phone !~ '^01[0125][0-9]{8}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_phone');
  end if;

  if p_date is null or p_time is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_slot');
  end if;

  -- Service must exist and be active
  select id into v_service_id from public.services
   where code = p_service_code and active;
  if v_service_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_service');
  end if;

  -- Slot must be currently offered (open day, not past, no overlap)
  if not exists (select 1 from public.get_day_slots(p_date) s where s.slot = p_time) then
    return jsonb_build_object('ok', false, 'error', 'slot_unavailable');
  end if;

  select slot_minutes into v_slot_min from public.clinic_settings where id = 1;

  -- Convert clinic-local date+time (Africa/Cairo) to timestamptz
  v_start := (p_date + p_time) at time zone 'Africa/Cairo';
  v_end := v_start + make_interval(mins => v_slot_min);

  -- Default provider: first active dentist (single-dentist clinic for now)
  select id into v_dentist_id from public.dentists where active order by created_at limit 1;

  -- Find existing patient by normalized phone, else create
  select id into v_patient_id from public.patients where phone = v_phone limit 1;
  if v_patient_id is null then
    insert into public.patients (full_name, phone, phone_raw)
    values (trim(p_name), v_phone, left(trim(p_phone), 40))
    returning id into v_patient_id;
  end if;

  -- Insert appointment; the exclusion constraint is the final arbiter.
  begin
    insert into public.appointments
      (patient_id, service_id, dentist_id, starts_at, ends_at, status, source, notes)
    values
      (v_patient_id, v_service_id, v_dentist_id, v_start, v_end, 'booked', 'web',
       nullif(trim(coalesce(p_notes, '')), ''))
    returning id into v_appointment_id;
  exception
    when exclusion_violation then
      return jsonb_build_object('ok', false, 'error', 'slot_unavailable');
  end;

  return jsonb_build_object('ok', true, 'appointment_id', v_appointment_id);
end;
$$;
