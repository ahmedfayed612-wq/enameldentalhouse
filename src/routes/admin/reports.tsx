import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { ClipboardList, TrendingUp, CreditCard, Wallet, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInvoiceStats } from "@/lib/admin/billing.service";
import type { InvoiceStats } from "@/lib/admin/billing";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { state } = useAdminAuth();
  const [stats, setStats] = useState<InvoiceStats>({
    total_invoiced: 0, total_collected: 0, total_outstanding: 0,
    invoice_count: 0, paid_count: 0, partially_paid_count: 0, overdue_count: 0, voided_count: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const s = await getInvoiceStats({});
      setStats(s);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const statCards = [
    { title: "Total Invoiced", value: `$${stats.total_invoiced.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
    { title: "Total Collected", value: `$${stats.total_collected.toFixed(2)}`, icon: CreditCard, color: "text-deep" },
    { title: "Outstanding", value: `$${stats.total_outstanding.toFixed(2)}`, icon: Wallet, color: "text-destructive" },
    { title: "Invoices", value: stats.invoice_count.toString(), icon: ClipboardList, color: "text-primary" },
  ];

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Financial Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">Clinic financial insights</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            {statCards.map((c) => (
              <Card key={c.title}>
                <CardHeader>
                  <CardTitle className="text-xs font-medium text-muted-foreground">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold {c.color}">{c.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Breakdown</CardTitle>
                <CardDescription>Distribution of invoice statuses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <Badge variant="secondary">{stats.paid_count}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Partially Paid</span>
                  <Badge variant="secondary">{stats.partially_paid_count}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <Badge variant="destructive">{stats.overdue_count}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Voided</span>
                  <Badge variant="secondary">{stats.voided_count}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Detailed activity feed coming in next phase.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}