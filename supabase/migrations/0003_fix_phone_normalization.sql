-- Fix phone normalization in book_appointment.
-- Previous regexp_replace('^(0020|20)?','0') matched the empty string and
-- prepended '0' to already-local numbers, rejecting them as invalid_phone.

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
  if p_name is null or length(trim(p_name)) < 2 then
    return jsonb_build_object('ok', false, 'error', 'invalid_name');
  end if;

  -- Normalize Egyptian phone to 01xxxxxxxxx:
  --   01012345678 / 201012345678 / 00201012345678 / +201012345678 (digits only)
  v_phone := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if v_phone like '00%' then
    v_phone := substr(v_phone, 3);          -- 0020... -> 20...
  end if;
  if v_phone like '20%' and length(v_phone) = 12 then
    v_phone := '0' || substr(v_phone, 3);  -- 2010xxxxxxxx -> 010xxxxxxxxx
  end if;
  if v_phone !~ '^01[0125][0-9]{8}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_phone');
  end if;

  if p_date is null or p_time is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_slot');
  end if;

  select id into v_service_id from public.services
   where code = p_service_code and active;
  if v_service_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_service');
  end if;

  if not exists (select 1 from public.get_day_slots(p_date) s where s.slot = p_time) then
    return jsonb_build_object('ok', false, 'error', 'slot_unavailable');
  end if;

  select slot_minutes into v_slot_min from public.clinic_settings where id = 1;

  v_start := (p_date + p_time) at time zone 'Africa/Cairo';
  v_end := v_start + make_interval(mins => v_slot_min);

  select id into v_dentist_id from public.dentists where active order by created_at limit 1;

  select id into v_patient_id from public.patients where phone = v_phone limit 1;
  if v_patient_id is null then
    insert into public.patients (full_name, phone, phone_raw)
    values (trim(p_name), v_phone, left(trim(p_phone), 40))
    returning id into v_patient_id;
  end if;

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
