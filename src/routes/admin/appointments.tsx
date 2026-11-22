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
  fmtSlot12,
  todayYmd,
  type AppointmentStatus,
} from "@/lib/admin/appointments";
import {
  APPOINTMENT_SELECT,
  AppointmentItem,
  StatusPill,
  type AppointmentRow,
} from "@/components/admin/AppointmentBits";
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

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

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

  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [cursor, setCursor] = useState(todayYmd());
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AppointmentRow | null>(null);
  const [dentistId, setDentistId] = useState<string | null>(null);
  const [dentists, setDentists] = useState<{ id: string; name: string }[]>([]);
  const [filterDentist, setFilterDentist] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [filterQ, setFilterQ] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  const days = useMemo(() => {
    if (view === "day") return [cursor];
    if (view === "week") return Array.from({ length: 7 }, (_, i) => addDaysYmd(cursor, i));
    return [];
  }, [view, cursor]);

  // Month grid: all ymd strings in cursor's month
  const monthDays = useMemo(() => {
    if (view !== "month") return [];
    const [y, m] = cursor.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1));
    const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const startDow = first.getUTCDay(); // 0=Sun
    const cells: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) {
      cells.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return cells;
  }, [view, cursor]);

  const range = useMemo(() => {
    if (view === "day") return { from: addDaysYmd(cursor, -1), to: addDaysYmd(cursor, 2) };
    if (view === "week") return { from: addDaysYmd(days[0], -1), to: addDaysYmd(days[6], 2) };
    const [y, m] = cursor.split("-").map(Number);
    const first = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastD = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return {
      from: addDaysYmd(`${y}-${String(m).padStart(2, "0")}-${String(lastD).padStart(2, "0")}`, -45),
      to: addDaysYmd(first, 45),
    };
  }, [view, cursor, days]);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let q = supabase
      .from("appointments")
      .select(APPOINTMENT_SELECT)
      .gte("starts_at", `${range.from}T00:00:00Z`)
      .lt("starts_at", `${range.to}T00:00:00Z`)
      .order("starts_at");
    if (filterDentist !== "all") q = q.eq("dentist_id", filterDentist);
    const { data, error } = await q;
    setLoading(false);
    if (error) {
      toast.error("Failed to load appointments");
      return;
    }
    setRows((data as unknown as AppointmentRow[]) ?? []);
  }, [range, filterDentist]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("dentists")
      .select("id, name")
      .eq("active", true)
      .order("created_at")
      .then(({ data }) => {
        const list = (data as { id: string; name: string }[]) ?? [];
        setDentists(list);
        if (list[0] && !dentistId) setDentistId(list[0].id);
      });
    supabase
      .from("services")
      .select("id, code, name_en, name_ar")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setServices((data as Service[]) ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  function shift(n: number) {
    if (view === "month") {
      const [y, m] = cursor.split("-").map(Number);
      const d = new Date(Date.UTC(y, m - 1 + n, 1));
      setCursor(d.toISOString().slice(0, 10));
    } else {
      setCursor((c) => addDaysYmd(c, view === "day" ? n : n * 7));
    }
  }

  const filtered = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    return rows.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterService !== "all" && r.service_id !== filterService) return false;
      if (q) {
        const hay = `${r.patients?.full_name ?? ""} ${r.patients?.phone ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filterStatus, filterService, filterQ]);

  const byDay = useMemo(() => {
    const wanted = view === "month" ? monthDays.filter(Boolean) : days;
    const map = new Map<string, AppointmentRow[]>();
    for (const d of wanted as string[]) map.set(d, []);
    for (const r of filtered) {
      const key = cairoParts(r.starts_at).ymd;
      map.get(key)?.push(r);
    }
    for (const list of map.values()) list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return map;
  }, [filtered, days, monthDays, view]);

  const subtitle =
    view === "day"
      ? cursor
      : view === "week"
        ? `${days[0]} → ${days[6]}`
        : new Date(`${cursor}T12:00:00Z`).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card p-1">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
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
          <Button variant="outline" size="icon" onClick={() => shift(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(todayYmd())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => shift(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="bg-deep text-deep-foreground">
            <Plus className="me-1 h-4 w-4" /> New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            placeholder="Search patient…"
            className="w-48 ps-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_META) as AppointmentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name_ar ?? s.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {dentists.length > 1 && (
          <Select value={filterDentist} onValueChange={setFilterDentist}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dentist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dentists</SelectItem>
              {dentists.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : view === "month" ? (
        <div className="card-soft mt-6 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-2 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((d, i) => {
              if (!d)
                return (
                  <div
                    key={`e${i}`}
                    className="min-h-20 border-b border-e border-border bg-muted/20"
                  />
                );
              const list = byDay.get(d) ?? [];
              const isToday = d === todayYmd();
              return (
                <button
                  key={d}
                  onClick={() => {
                    setCursor(d);
                    setView("day");
                  }}
                  className={`min-h-20 border-b border-e border-border p-1.5 text-start transition-colors hover:bg-secondary/50 ${
                    isToday ? "bg-primary-soft/60" : ""
                  }`}
                >
                  <span
                    className={`inline-grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                      isToday ? "bg-deep text-deep-foreground" : "text-foreground"
                    }`}
                  >
                    {Number(d.slice(8))}
                  </span>
                  {list.length > 0 && (
                    <span className="mt-1 block truncate text-[10px] font-medium text-muted-foreground">
                      {list.length} appt{list.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
                      <AppointmentItem
                        key={a.id}
                        a={a}
                        onStatus={setStatus}
                        onEdit={setEditTarget}
                      />
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
      {editTarget && (
        <EditAppointmentDialog
          appointment={editTarget}
          dentistId={dentistId}
          onClose={() => setEditTarget(null)}
          onSaved={load}
        />
      )}
    </div>
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

    const slotRes = await getDaySlots({ data: { date } });
    if (!slotRes.ok || !slotRes.slots.includes(time)) {
      setError("That slot is no longer available — pick another time.");
      setSaving(false);
      return;
    }

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
                      {fmtSlot12(s)}
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

/** Edit/reschedule an existing appointment — preserves id, patient, and status history. */
function EditAppointmentDialog({
  appointment,
  dentistId,
  onClose,
  onSaved,
}: {
  appointment: AppointmentRow;
  dentistId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState(appointment.service_id ?? "");
  const [date, setDate] = useState(() => cairoParts(appointment.starts_at).ymd);
  const [time, setTime] = useState(() => cairoParts(appointment.starts_at).time);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotMinutes, setSlotMinutes] = useState(45);
  const [notes, setNotes] = useState(appointment.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
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
  }, []);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    getDaySlots({ data: { date } }).then((r) => {
      const list = r.ok ? r.slots : [];
      // Keep the current slot selectable even if the RPC doesn't list it
      // (e.g. it's the appointment's own slot — get_day_slots excludes it anyway
      // because this appointment still occupies it).
      setSlots(list);
    });
  }, [date]);

  async function submit() {
    if (!supabase) return;
    setError(null);
    setSaving(true);

    const start = cairoToUtc(date, time);
    const end = new Date(start.getTime() + slotMinutes * 60000).toISOString();

    const { error: aErr } = await supabase
      .from("appointments")
      .update({
        service_id: serviceId || null,
        starts_at: start.toISOString(),
        ends_at: end,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointment.id);
    setSaving(false);
    if (aErr) {
      setError(
        aErr.code === "23P01"
          ? "That time overlaps an existing appointment."
          : "Could not update appointment.",
      );
      return;
    }
    toast.success("Appointment updated");
    onClose();
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <p className="text-sm font-medium text-foreground">
              {appointment.patients?.full_name ?? "Unknown patient"}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {appointment.patients?.phone}
            </p>
            <p className="mt-1">
              <StatusPill status={appointment.status} />
            </p>
          </div>

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
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {/* Always include current time so it stays selectable */}
                  {!slots.includes(time) && time && (
                    <SelectItem value={time}>{time} (current)</SelectItem>
                  )}
                  {slots.map((s) => (
                    <SelectItem key={s} value={s}>
                      {fmtSlot12(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Convert a clinic-local (Africa/Cairo) date+HH:MM to a UTC Date. */
function cairoToUtc(date: string, time: string): Date {
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
