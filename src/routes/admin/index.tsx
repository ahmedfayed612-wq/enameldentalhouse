import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { todayYmd } from "@/lib/admin/appointments";
import { CalendarDays, Hourglass, Receipt, Users, Wallet } from "lucide-react";

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
    waiting: number | null;
    collectedToday: number | null;
  }>({ today: null, patients: null, waiting: null, collectedToday: null });

  useEffect(() => {
    if (!supabase) return;
    const today = todayYmd();

    Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("starts_at", `${today}T00:00:00+02:00`)
        .lt("starts_at", `${today}T23:59:59+03:00`),
      supabase.from("patients").select("id", { count: "exact", head: true }),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .in("status", ["arrived", "waiting", "in_treatment"])
        .gte("starts_at", `${today}T00:00:00+02:00`)
        .lt("starts_at", `${today}T23:59:59+03:00`),
      supabase
        .from("payments")
        .select("amount")
        .gte("paid_at", `${today}T00:00:00+02:00`)
        .lt("paid_at", `${today}T23:59:59+03:00`),
    ]).then(([a, p, w, pay]) => {
      const collected = (pay.data as { amount: number }[] | null)?.reduce(
        (s, r) => s + Number(r.amount),
        0,
      );
      setCounts({
        today: a.count ?? 0,
        patients: p.count ?? 0,
        waiting: w.count ?? 0,
        collectedToday: collected ?? 0,
      });
    });
  }, []);

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Today's operations at a glance.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Appointments today"
              value={counts.today === null ? "—" : String(counts.today)}
              icon={CalendarDays}
            />
            <StatCard
              label="In the clinic now"
              value={counts.waiting === null ? "—" : String(counts.waiting)}
              icon={Hourglass}
            />
            <StatCard
              label="Patients"
              value={counts.patients === null ? "—" : String(counts.patients)}
              icon={Users}
            />
            <StatCard
              label="Collected today"
              value={
                counts.collectedToday === null
                  ? "—"
                  : `EGP ${counts.collectedToday.toLocaleString("en-EG", { maximumFractionDigits: 0 })}`
              }
              icon={Wallet}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                to: "/admin/waiting-room",
                label: "Waiting room",
                desc: "Live patient flow board",
                icon: Hourglass,
              },
              {
                to: "/admin/appointments",
                label: "Appointments",
                desc: "Day, week and month calendar",
                icon: CalendarDays,
              },
              {
                to: "/admin/billing",
                label: "Billing",
                desc: "Invoices and payments",
                icon: Receipt,
              },
            ].map(({ to, label, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="card-soft group flex items-center gap-4 p-5 transition-shadow hover:shadow-elevated"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-deep transition-colors group-hover:bg-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}
