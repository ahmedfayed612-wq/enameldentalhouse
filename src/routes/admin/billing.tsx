import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { listInvoices } from "@/lib/admin/billing.service";
import type { Invoice } from "@/lib/admin/billing";
import { DollarSign, Search, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/billing")({
  component: BillingPage,
});

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  issued: "bg-primary-soft text-deep",
  paid: "bg-mint text-deep",
  partially_paid: "bg-amber-100 text-amber-800",
  overdue: "bg-destructive/10 text-destructive",
  voided: "bg-muted text-muted-foreground line-through",
  refunded: "bg-primary-soft text-deep",
};

function BillingPage() {
  const { state } = useAdminAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { invoices: rows, count: total } = await listInvoices({
        page,
        pageSize: 20,
      });
      setInvoices(rows);
      setCount(total);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>
              <p className="mt-1 text-sm text-muted-foreground">Invoices and payments</p>
            </div>
            <Button onClick={() => navigate({ to: "/admin/billing/create" })}>
              <Plus className="mr-2 h-4 w-4" /> New Invoice
            </Button>
          </div>

          <div className="card-soft mb-6">
            <div className="flex items-center gap-2 p-6">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoice number or patient name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full"
              />
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium text-foreground">{inv.invoice_number}</TableCell>
                    <TableCell>{inv.patients?.full_name ?? "—"}</TableCell>
                    <TableCell>{new Date(inv.invoice_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-sm">${inv.total.toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-sm">${inv.amount_paid.toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-sm">${inv.balance_due.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("capitalize", STATUS_BADGE[inv.status] || "")}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={(`/admin/billing/${inv.id}` as any)}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </AdminShell>
    </RequireAuth>
  );
}