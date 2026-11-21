import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { ROLE_LABELS, type StaffRole } from "@/lib/admin/types";
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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/expenses")({
  component: ExpensesPage,
});

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  spent_at: string;
  supplier: string | null;
};

const CATEGORIES: Record<string, string> = {
  supplies: "Supplies",
  lab: "Lab",
  rent: "Rent",
  utilities: "Utilities",
  salaries: "Salaries",
  equipment: "Equipment",
  marketing: "Marketing",
  other: "Other",
};

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function fmtMoney(n: number) {
  return `EGP ${Number(n).toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ExpensesPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <ExpensesInner />
      </AdminShell>
    </RequireAuth>
  );
}

function ExpensesInner() {
  const { state } = useAdminAuth();
  const role: StaffRole | null =
    state.status === "signed_in" ? (state.profile?.role ?? null) : null;
  const canManage = role === "owner" || role === "accountant";
  const actorId = state.status === "signed_in" ? state.session.user.id : null;

  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("id, category, description, amount, spent_at, supplier")
      .gte("spent_at", `${month}-01`)
      .lt("spent_at", `${month}-32`)
      .order("spent_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Failed to load expenses");
      return;
    }
    setRows((data as Expense[]) ?? []);
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const total = useMemo(() => rows.reduce((s, r) => s + Number(r.amount), 0), [rows]);
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.category, (m.get(r.category) ?? 0) + Number(r.amount));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(`${month}-15T12:00:00Z`).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {fmtMoney(total)} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
          {canManage && (
            <Button onClick={() => setCreateOpen(true)} className="bg-deep text-deep-foreground">
              <Plus className="me-1 h-4 w-4" /> Add expense
            </Button>
          )}
        </div>
      </div>

      {byCategory.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {byCategory.map(([cat, amt]) => (
            <span
              key={cat}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-deep"
            >
              {CATEGORIES[cat] ?? cat}: {fmtMoney(amt)}
            </span>
          ))}
        </div>
      )}

      <div className="card-soft mt-4 overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No expenses this month.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((e) => (
              <li key={e.id} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORIES[e.category] ?? e.category}
                    {e.supplier ? ` · ${e.supplier}` : ""} ·{" "}
                    {new Date(`${e.spent_at}T12:00:00Z`).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">{fmtMoney(e.amount)}</span>
                {canManage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={async () => {
                      if (!supabase || !window.confirm("Delete this expense?")) return;
                      const { error } = await supabase.from("expenses").delete().eq("id", e.id);
                      if (error) {
                        toast.error("Delete failed");
                        return;
                      }
                      load();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateExpenseDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        actorId={actorId}
        defaultDate={month}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </div>
  );
}

function CreateExpenseDialog({
  open,
  onOpenChange,
  actorId,
  defaultDate,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  actorId: string | null;
  defaultDate: string;
  onCreated: () => void;
}) {
  const [category, setCategory] = useState("supplies");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [spentAt, setSpentAt] = useState(`${defaultDate}-15`);
  const [supplier, setSupplier] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSpentAt(`${defaultDate}-15`);
      setError(null);
    }
  }, [open, defaultDate]);

  async function submit() {
    if (!supabase) return;
    const amt = Number(amount);
    if (!description.trim() || !amt || amt <= 0) {
      setError("Enter a description and a valid amount.");
      return;
    }
    setSaving(true);
    const { error: eErr } = await supabase.from("expenses").insert({
      category,
      description: description.trim(),
      amount: amt,
      spent_at: spentAt || null,
      supplier: supplier.trim() || null,
      created_by: actorId,
    });
    setSaving(false);
    if (eErr) {
      setError("Could not save expense.");
      return;
    }
    toast.success("Expense added");
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-1 block text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={inputCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORIES).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls}
              placeholder="e.g. Gloves & masks restock"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-xs">Amount (EGP)</Label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs">Date</Label>
              <Input
                type="date"
                value={spentAt}
                onChange={(e) => setSpentAt(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Supplier (optional)</Label>
            <Input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
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
            {saving ? "Saving…" : "Add expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
