import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { listExpenses } from "@/lib/admin/expense.service";
import type { Expense } from "@/lib/admin/expenses";
import { Wallet, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { state } = useAdminAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { expenses: rows, count: total } = await listExpenses({ page, pageSize: 20 });
      setExpenses(rows);
      setCount(total);
    } catch {
      toast.error("Failed to load expenses");
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
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Expenses</h1>
              <p className="mt-1 text-sm text-muted-foreground">Operating expense tracking</p>
            </div>
            <Button><Plus className="mr-2 h-4 w-4" /> New Expense</Button>
          </div>

          <div className="card-soft mb-6">
            <div className="flex items-center gap-2 p-6">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-foreground">{e.expense_id}</TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.expense_categories?.name ?? "Uncategorized"}</TableCell>
                    <TableCell className="font-mono text-sm">${e.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(e.expense_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{e.payment_status}</Badge>
                    </TableCell>
                    <TableCell>{e.profiles?.full_name ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-4">No expenses found</TableCell>
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