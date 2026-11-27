-- Enamel Dental House — Patient note history
-- When an appointment is booked or edited from the admin dashboard with notes,
-- the note is mirrored here together with the appointment date, per patient.
-- This builds a visit-by-visit history on the patient's profile.

create table public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete set null,
  note text not null check (length(trim(note)) > 0),
  note_date date not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index patient_notes_patient_idx on public.patient_notes (patient_id, note_date desc, created_at desc);

alter table public.patient_notes enable row level security;

create policy patient_notes_staff on public.patient_notes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
