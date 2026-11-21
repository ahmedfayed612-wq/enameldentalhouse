import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { cairoParts, todayYmd } from "@/lib/admin/appointments";
import { STATUS_META, type AppointmentStatus } from "@/lib/admin/appointments";
import { CalendarDays, Receipt, TrendingUp, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

type ApptLite = { starts_at: string; status: AppointmentStatus };
type InvoiceLite = { total: number; amount_paid: number; status: string; issued_at: string };
type ExpenseLite = { amount: number; spent_at: string; category: string };

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
  hint?: string;
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
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ReportsPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <ReportsInner />
      </AdminShell>
    </RequireAuth>
  );
}

function ReportsInner() {
  const [appts, setAppts] = useState<ApptLite[]>([]);
  const [invoices, setInvoices] = useState<InvoiceLite[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLite[]>([]);
  const [newPatients, setNewPatients] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    const today = todayYmd();
    const monthStart = `${today.slice(0, 7)}-01`;
    const twoWeeksAgo = new Date(`${today}T12:00:00Z`);
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 14);
    const from = twoWeeksAgo.toISOString().slice(0, 10);

    Promise.all([
      supabase
        .from("appointments")
        .select("starts_at, status")
        .gte("starts_at", `${from}T00:00:00Z`)
        .lt("starts_at", `${today}T23:59:59Z`),
      supabase
        .from("invoices")
        .select("total, amount_paid, status, issued_at")
        .gte("issued_at", `${monthStart}T00:00:00Z`),
      supabase.from("expenses").select("amount, spent_at, category").gte("spent_at", monthStart),
      supabase
        .from("patients")
        .select("id", { count: "exact", head: true })
        .gte("created_at", `${monthStart}T00:00:00Z`),
    ]).then(([a, i, e, p]) => {
      setAppts((a.data as ApptLite[]) ?? []);
      setInvoices((i.data as InvoiceLite[]) ?? []);
      setExpenses((e.data as ExpenseLite[]) ?? []);
      setNewPatients(p.count ?? 0);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const active = appts.filter((a) => !["cancelled", "no_show"].includes(a.status));
    const completed = appts.filter((a) => a.status === "completed").length;
    const revenue = invoices
      .filter((i) => i.status !== "void")
      .reduce((s, i) => s + Number(i.amount_paid), 0);
    const billed = invoices
      .filter((i) => i.status !== "void")
      .reduce((s, i) => s + Number(i.total), 0);
    const spent = expenses.reduce((s, e) => s + Number(e.amount), 0);
    return { appts: active.length, completed, revenue, billed, spent, net: revenue - spent };
  }, [appts, invoices, expenses]);

  // Appointments per day for last 14 days
  const daily = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const a of appts) {
      const d = cairoParts(a.starts_at).ymd;
      const cur = map.get(d) ?? { total: 0, done: 0 };
      if (!["cancelled", "no_show"].includes(a.status)) {
        cur.total++;
        if (a.status === "completed") cur.done++;
      }
      map.set(d, cur);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [appts]);
  const maxDaily = Math.max(1, ...daily.map(([, v]) => v.total));

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const m = new Map<AppointmentStatus, number>();
    for (const a of appts) m.set(a.status, (m.get(a.status) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [appts]);

  // Expense by category this month
  const expByCat = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of expenses) m.set(e.category, (m.get(e.category) ?? 0) + Number(e.amount));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [expenses]);
  const maxExp = Math.max(1, ...expByCat.map(([, v]) => v));

  const fmt = (n: number) => `EGP ${n.toLocaleString("en-EG", { maximumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Last 14 days operations · this month's finances
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Appointments (14d)"
          value={String(stats.appts)}
          icon={CalendarDays}
          hint={`${stats.completed} completed`}
        />
        <StatCard label="New patients (month)" value={String(newPatients ?? 0)} icon={Users} />
        <StatCard
          label="Revenue collected (month)"
          value={fmt(stats.revenue)}
          icon={TrendingUp}
          hint={`of ${fmt(stats.billed)} billed`}
        />
        <StatCard
          label="Net (revenue − expenses)"
          value={fmt(stats.net)}
          icon={Wallet}
          hint={`${fmt(stats.spent)} spent`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Daily appointments bar chart */}
        <section className="card-soft p-5">
          <h2 className="text-base font-semibold text-foreground">Appointments per day</h2>
          <div className="mt-4 flex h-40 items-end gap-1.5">
            {daily.map(([d, v]) => (
              <div key={d} className="group flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary/70 transition-colors group-hover:bg-primary"
                  style={{ height: `${Math.max(4, (v.total / maxDaily) * 100)}%` }}
                  title={`${d}: ${v.total} (${v.done} done)`}
                />
                <span className="text-[9px] text-muted-foreground">{d.slice(8)}</span>
              </div>
            ))}
            {daily.length === 0 && (
              <p className="w-full text-center text-sm text-muted-foreground">No data yet.</p>
            )}
          </div>
        </section>

        {/* Appointment status breakdown */}
        <section className="card-soft p-5">
          <h2 className="text-base font-semibold text-foreground">Status breakdown</h2>
          <ul className="mt-4 space-y-2">
            {statusBreakdown.map(([s, n]) => (
              <li key={s} className="flex items-center justify-between text-sm">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[s].cls}`}
                >
                  {STATUS_META[s].label}
                </span>
                <span className="font-medium text-foreground">{n}</span>
              </li>
            ))}
            {statusBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground">No appointments in range.</p>
            )}
          </ul>
        </section>

        {/* Expenses by category */}
        <section className="card-soft p-5">
          <h2 className="text-base font-semibold text-foreground">Expenses by category</h2>
          <ul className="mt-4 space-y-2.5">
            {expByCat.map(([cat, amt]) => (
              <li key={cat}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-foreground">{cat}</span>
                  <span className="font-medium text-foreground">{fmt(amt)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-deep/70"
                    style={{ width: `${(amt / maxExp) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {expByCat.length === 0 && (
              <p className="text-sm text-muted-foreground">
                <Receipt className="me-1 inline h-4 w-4" />
                No expenses recorded this month.
              </p>
            )}
          </ul>
        </section>

        {/* Outstanding */}
        <section className="card-soft p-5">
          <h2 className="text-base font-semibold text-foreground">Receivables</h2>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {fmt(stats.billed - stats.revenue)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Outstanding balance across this month's invoices.
          </p>
        </section>
      </div>
    </div>
  );
}
