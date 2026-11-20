import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { CalendarDays, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-deep">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function AdminOverview() {
  const [counts, setCounts] = useState<{
    today: number | null;
    patients: number | null;
  }>({ today: null, patients: null });

  useEffect(() => {
    if (!supabase) return;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("starts_at", startOfToday.toISOString())
        .lt("starts_at", endOfToday.toISOString()),
      supabase.from("patients").select("id", { count: "exact", head: true }),
    ]).then(([a, p]) => {
      setCounts({ today: a.count ?? 0, patients: p.count ?? 0 });
    });
  }, []);

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Today's operations at a glance.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Appointments today"
              value={counts.today === null ? "—" : String(counts.today)}
              icon={CalendarDays}
            />
            <StatCard
              label="Patients"
              value={counts.patients === null ? "—" : String(counts.patients)}
              icon={Users}
            />
            <StatCard label="Collected today" value="—" icon={Wallet} />
          </div>

          <div className="card-soft mt-6 p-6">
            <h2 className="text-base font-semibold text-foreground">Coming next</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Appointment calendar, patient CRM and billing modules are built in the next phases.
              The database foundation (patients, appointments, staff roles) is already in place.
            </p>
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}
