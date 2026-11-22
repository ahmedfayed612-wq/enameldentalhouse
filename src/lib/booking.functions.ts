import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Server functions run on the host's runtime: prefer process.env (injected at
// runtime by Vercel/Nitro), fall back to import.meta.env (inlined at build).
const url =
  process.env.VITE_SUPABASE_URL ?? (import.meta.env.VITE_SUPABASE_URL as string | undefined);
const anonKey =
  process.env.VITE_SUPABASE_ANON_KEY ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

function db() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export type DaySlotsResult = { ok: boolean; slots: string[]; error?: string };

/** Public: available "HH:MM" clinic-local slots for a YYYY-MM-DD date. */
export const getDaySlots = createServerFn({ method: "GET" })
  .validator((input: { date: string }) => input)
  .handler(async ({ data }): Promise<DaySlotsResult> => {
    const client = db();
    if (!client) return { ok: false, slots: [], error: "unconfigured" };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      return { ok: false, slots: [], error: "bad_date" };
    }
    const { data: rows, error } = await client.rpc("get_day_slots", { p_date: data.date });
    if (error) {
      console.error("get_day_slots failed", error);
      return { ok: false, slots: [], error: "fetch_failed" };
    }
    const slots = ((rows ?? []) as Array<{ slot?: string }>)
      .map((r) => String(r.slot ?? "").slice(0, 5))
      .filter(Boolean);
    return { ok: true, slots };
  });

export type BookingPayload = {
  name: string;
  phone: string;
  service: string; // service code, e.g. 'checkup'
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
};

export type BookingResult = { ok: boolean; error?: string; appointmentId?: string };

/** Public: create a web booking. All validation/conflict checks are in the DB function. */
export const submitBooking = createServerFn({ method: "POST" })
  .validator((input: BookingPayload) => input)
  .handler(async ({ data }): Promise<BookingResult> => {
    const client = db();
    if (!client) return { ok: false, error: "unconfigured" };

    const { data: res, error } = await client.rpc("book_appointment", {
      p_name: data.name,
      p_phone: data.phone,
      p_service_code: data.service,
      p_date: data.date,
      p_time: data.time,
      p_notes: data.notes ?? null,
    });
    if (error) {
      console.error("book_appointment failed", error);
      return { ok: false, error: "server_error" };
    }
    const r = res as { ok?: boolean; error?: string; appointment_id?: string } | null;
    if (!r?.ok) return { ok: false, error: r?.error ?? "unknown" };
    return { ok: true, appointmentId: r.appointment_id };
  });
