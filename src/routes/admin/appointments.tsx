import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { getDaySlots } from "@/lib/booking.functions";
import {
  NEXT_STATUS,
  STATUS_META,
  addDaysYmd,
  cairoParts,
  fmtTime,
  todayYmd,
  type AppointmentStatus,
} from "@/lib/admin/appointments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/appointments")({
  component: AppointmentsPage,
});

type Patient = { id: string; full_name: string; phone: string | null };
type Service = { id: string; code: string; name_en: string; name_ar: string | null };
type AppointmentRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  source: string;
  notes: string | null;
  patients: { full_name: string; phone: string | null } | null;
  services: { code: string; name_en: string; name_ar: string | null } | null;
};

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function StatusPill({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

function AppointmentsPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <AppointmentsInner />
      </AdminShell>
    </RequireAuth>
  );
}

function AppointmentsInner() {
  const { state } = useAdminAuth();
  const actorId = state.status === "signed_in" ? state.session.user.id : null;

  const [view, setView] = useState<"day" | "week">("day");
  const [cursor, setCursor] = useState(todayYmd());
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [dentistId, setDentistId] = useState<string | null>(null);

  const days = useMemo(
    () => (view === "day" ? [cursor] : Array.from({ length: 7 }, (_, i) => addDaysYmd(cursor, i))),
    [view, cursor],
  );

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const from = addDaysYmd(days[0], -2);
    const to = addDaysYmd(days[days.length - 1], 3);
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "id, starts_at, ends_at, status, source, notes, patients(full_name, phone), services(code, name_en, name_ar)",
      )
      .gte("starts_at", `${from}T00:00:00Z`)
      .lt("starts_at", `${to}T00:00:00Z`)
      .order("starts_at");
    setLoading(false);
    if (error) {
      toast.error("Failed to load appointments");
      return;
    }
    const wanted = new Set(days);
    setRows(
      ((data ?? []) as unknown as AppointmentRow[]).filter((r) =>
        wanted.has(cairoParts(r.starts_at).ymd),
      ),
    );
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!supabase || dentistId) return;
    supabase
      .from("dentists")
      .select("id")
      .eq("active", true)
      .order("created_at")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setDentistId(data?.id ?? null));
  }, [dentistId]);

  async function setStatus(a: AppointmentRow, to: AppointmentStatus) {
    if (!supabase || !actorId) return;
    const { error } = await supabase
      .from("appointments")
      .update({
        status: to,
        ...(to === "confirmed" ? { confirmed_at: new Date().toISOString() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", a.id);
    if (error) {
      toast.error("Update failed");
      return;
    }
    await supabase.from("appointment_status_log").insert({
      appointment_id: a.id,
      from_status: a.status,
      to_status: to,
      actor: actorId,
    });
    load();
  }

  function shift(daysCount: number) {
    setCursor((c) => addDaysYmd(c, daysCount));
  }

  const byDay = useMemo(() => {
    const map = new Map<string, AppointmentRow[]>();
    for (const d of days) map.set(d, []);
    for (const r of rows) {
      const key = cairoParts(r.starts_at).ymd;
      map.get(key)?.push(r);
    }
    for (const list of map.values()) list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return map;
  }, [rows, days]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {view === "day" ? cursor : `${days[0]} → ${days[6]}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card p-1">
            {(["day", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  if (v === "week" && cursor !== todayYmd()) setCursor(cursor);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  view === v
                    ? "bg-deep text-deep-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => shift(view === "day" ? -1 : -7)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(todayYmd())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => shift(view === "day" ? 1 : 7)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="bg-deep text-deep-foreground">
            <Plus className="me-1 h-4 w-4" /> New
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div
          className={
            view === "week" ? "mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3" : "mt-6 space-y-6"
          }
        >
          {days.map((d) => {
            const list = byDay.get(d) ?? [];
            return (
              <section key={d} className="card-soft overflow-hidden">
                <header className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    {new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {d === todayYmd() && (
                      <span className="ms-2 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-deep">
                        today
                      </span>
                    )}
                  </h2>
                  <span className="text-xs text-muted-foreground">{list.length} booked</span>
                </header>
                {list.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No appointments
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {list.map((a) => (
                      <AppointmentItem key={a.id} a={a} onStatus={setStatus} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <CreateAppointmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        dentistId={dentistId}
        defaultDate={cursor}
        onCreated={load}
      />
    </div>
  );
}

function AppointmentItem({
  a,
  onStatus,
}: {
  a: AppointmentRow;
  onStatus: (a: AppointmentRow, to: AppointmentStatus) => void;
}) {
  const next = NEXT_STATUS[a.status];
  const canNoShow = a.status === "arrived" || a.status === "waiting";
  const canCancel = !["completed", "cancelled", "no_show"].includes(a.status);

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
      <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-foreground" dir="ltr">
        {fmtTime(a.starts_at)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {a.patients?.full_name ?? "Unknown patient"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {a.services ? (a.services.name_ar ?? a.services.name_en) : "Service"}
          {a.patients?.phone ? ` · ${a.patients.phone}` : ""}
          {a.source === "web" && " · web"}
        </p>
        {a.notes && (
          <p className="mt-0.5 truncate text-xs italic text-muted-foreground">{a.notes}</p>
        )}
      </div>
      <StatusPill status={a.status} />
      <div className="flex items-center gap-1.5">
        {next && (
          <Button size="sm" variant="secondary" onClick={() => onStatus(a, next)}>
            → {STATUS_META[next].label}
          </Button>
        )}
        {canNoShow && (
          <Button size="sm" variant="outline" onClick={() => onStatus(a, "no_show")}>
            No-show
          </Button>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (window.confirm("Cancel this appointment?")) onStatus(a, "cancelled");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </li>
  );
}

function CreateAppointmentDialog({
  open,
  onOpenChange,
  dentistId,
  defaultDate,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dentistId: string | null;
  defaultDate: string;
  onCreated: () => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotMinutes, setSlotMinutes] = useState(45);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !supabase) return;
    supabase
      .from("services")
      .select("id, code, name_en, name_ar")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setServices((data as Service[]) ?? []));
    supabase
      .from("clinic_settings")
      .select("slot_minutes")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.slot_minutes) setSlotMinutes(data.slot_minutes);
      });
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPatient(null);
      setPatientQuery("");
      setPatientResults([]);
      setNewName("");
      setNewPhone("");
      setServiceId("");
      setDate(defaultDate);
      setTime("");
      setNotes("");
      setError(null);
    }
  }, [open, defaultDate]);

  useEffect(() => {
    setTime("");
    if (!date || !open) {
      setSlots([]);
      return;
    }
    getDaySlots({ data: { date } }).then((r) => setSlots(r.ok ? r.slots : []));
  }, [date, open]);

  useEffect(() => {
    if (!patientQuery.trim() || patient || !supabase) {
      setPatientResults([]);
      return;
    }
    const q = patientQuery.trim();
    const sb = supabase;
    const timer = setTimeout(async () => {
      const { data } = await sb
        .from("patients")
        .select("id, full_name, phone")
        .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(8);
      setPatientResults((data as Patient[]) ?? []);
    }, 250);
    return () => clearTimeout(timer);
  }, [patientQuery, patient]);

  async function submit() {
    if (!supabase) return;
    setError(null);
    setSaving(true);

    let patientId = patient?.id ?? null;
    if (isNewPatient || !patientId) {
      if (newName.trim().length < 2) {
        setError("Enter the patient's full name.");
        setSaving(false);
        return;
      }
      const phone = newPhone.replace(/\s/g, "");
      const { data: existing } = await supabase
        .from("patients")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();
      if (existing) {
        patientId = existing.id;
      } else {
        const { data: created, error: pErr } = await supabase
          .from("patients")
          .insert({ full_name: newName.trim(), phone: phone || null })
          .select("id")
          .single();
        if (pErr || !created) {
          setError("Could not create patient.");
          setSaving(false);
          return;
        }
        patientId = created.id;
      }
    }

    const service = services.find((s) => s.id === serviceId);
    const slotRes = await getDaySlots({ data: { date } });
    if (!slotRes.ok || !slotRes.slots.includes(time)) {
      setError("That slot is no longer available — pick another time.");
      setSaving(false);
      return;
    }

    // Clinic-local (Africa/Cairo) date+time -> timestamptz
    const start = cairoToUtc(date, time);
    const end = new Date(start.getTime() + slotMinutes * 60000).toISOString();

    const { error: aErr } = await supabase.from("appointments").insert({
      patient_id: patientId,
      service_id: serviceId || null,
      dentist_id: dentistId,
      starts_at: start.toISOString(),
      ends_at: end,
      status: "booked",
      source: "admin",
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (aErr) {
      setError(
        aErr.code === "23P01"
          ? "That time overlaps an existing appointment."
          : "Could not create appointment.",
      );
      return;
    }
    toast.success("Appointment created");
    onOpenChange(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient */}
          <div>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsNewPatient(true)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${isNewPatient ? "bg-deep text-deep-foreground" : "bg-muted text-muted-foreground"}`}
              >
                New patient
              </button>
              <button
                type="button"
                onClick={() => setIsNewPatient(false)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${!isNewPatient ? "bg-deep text-deep-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Existing patient
              </button>
            </div>

            {isNewPatient ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-xs">Full name</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Phone</Label>
                  <Input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className={inputCls}
                    dir="ltr"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
            ) : patient ? (
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{patient.full_name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {patient.phone}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPatient(null)}>
                  Change
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={patientQuery}
                  onChange={(e) => setPatientQuery(e.target.value)}
                  placeholder="Search by name or phone…"
                  className={`${inputCls} ps-9`}
                />
                {patientResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                    {patientResults.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between px-3 py-2 text-start text-sm hover:bg-muted"
                          onClick={() => {
                            setPatient(p);
                            setPatientResults([]);
                          }}
                        >
                          <span className="font-medium text-foreground">{p.full_name}</span>
                          <span className="text-xs text-muted-foreground" dir="ltr">
                            {p.phone}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Service */}
          <div>
            <Label className="mb-1 block text-xs">Service</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className={inputCls}>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name_ar ?? s.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date + time */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Available slots" />
                </SelectTrigger>
                <SelectContent>
                  {slots.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {date && slots.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">No available slots this day.</p>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-xs">Notes (internal)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
          )}

          <Button
            onClick={submit}
            disabled={saving}
            className="w-full bg-deep text-deep-foreground"
          >
            {saving ? "Saving…" : "Create appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Convert a clinic-local (Africa/Cairo) date+HH:MM to a UTC Date. */
function cairoToUtc(date: string, time: string): Date {
  // Africa/Cairo is UTC+2 (winter) / UTC+3 (summer DST). Determine offset by
  // probing the zone: format a UTC guess in Cairo and compare.
  const guess = new Date(`${date}T${time}:00Z`);
  const cairo = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(guess);
  const get = (t: string) => cairo.find((p) => p.type === t)?.value ?? "0";
  const asIfUtc = Date.UTC(
    +get("year"),
    +get("month") - 1,
    +get("day"),
    +get("hour") % 24,
    +get("minute"),
    +get("second"),
  );
  const offsetMs = asIfUtc - guess.getTime();
  return new Date(guess.getTime() - offsetMs);
}
