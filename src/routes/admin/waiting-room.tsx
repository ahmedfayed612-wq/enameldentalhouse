import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import {
  APPOINTMENT_SELECT,
  AppointmentItem,
  type AppointmentRow,
} from "@/components/admin/AppointmentBits";
import {
  STATUS_META,
  cairoParts,
  todayYmd,
  type AppointmentStatus,
} from "@/lib/admin/appointments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/waiting-room")({
  component: WaitingRoomPage,
});

const COLUMNS: { key: string; label: string; statuses: AppointmentStatus[] }[] = [
  { key: "expected", label: "Expected", statuses: ["booked", "confirmed"] },
  { key: "arrived", label: "Arrived", statuses: ["arrived"] },
  { key: "waiting", label: "Waiting", statuses: ["waiting"] },
  { key: "treatment", label: "In treatment", statuses: ["in_treatment"] },
  { key: "done", label: "Done today", statuses: ["completed", "no_show"] },
];

function WaitingRoomPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <WaitingRoomInner />
      </AdminShell>
    </RequireAuth>
  );
}

function WaitingRoomInner() {
  const { state } = useAdminAuth();
  const actorId = state.status === "signed_in" ? state.session.user.id : null;
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const today = todayYmd();

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select(APPOINTMENT_SELECT)
      .gte("starts_at", `${today}T00:00:00+02:00`)
      .lt("starts_at", `${today}T23:59:59+03:00`)
      .order("starts_at");
    setLoading(false);
    if (error) {
      toast.error("Failed to load waiting room");
      return;
    }
    const list = ((data as unknown as AppointmentRow[]) ?? []).filter(
      (r) => cairoParts(r.starts_at).ymd === today,
    );
    list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    setRows(list);
  }, [today]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

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

  const byStatus = useMemo(() => {
    const map = new Map<string, AppointmentRow[]>();
    for (const c of COLUMNS) map.set(c.key, []);
    for (const r of rows) {
      if (r.status === "cancelled") continue;
      const col = COLUMNS.find((c) => c.statuses.includes(r.status));
      if (col) map.get(col.key)?.push(r);
    }
    return map;
  }, [rows]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Waiting room</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(`${today}T12:00:00Z`).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {" · "}auto-refreshes every 30s
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {loading && rows.length === 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {COLUMNS.map((col) => {
            const list = byStatus.get(col.key) ?? [];
            return (
              <section key={col.key} className="card-soft flex min-h-40 flex-col overflow-hidden">
                <header className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-deep">
                    {list.length}
                  </span>
                </header>
                {list.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground">—</p>
                ) : (
                  <ul className="flex-1 divide-y divide-border">
                    {list.map((a) => (
                      <AppointmentItem key={a.id} a={a} onStatus={setStatus} compact />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
