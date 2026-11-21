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
import { Plus, Receipt, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/billing")({
  component: BillingPage,
});

type Patient = { id: string; full_name: string; phone: string | null };
type Service = { id: string; name_en: string; name_ar: string | null; price: number | null };
type Invoice = {
  id: string;
  patient_id: string;
  invoice_no: number;
  status: "draft" | "sent" | "partial" | "paid" | "void";
  subtotal: number;
  discount: number;
  total: number;
  amount_paid: number;
  issued_at: string;
  due_date: string | null;
  patients: { full_name: string; phone: string | null } | null;
};
type InvoiceItem = {
  id: string;
  description: string;
  qty: number;
  unit_price: number;
  line_total: number;
};
type Payment = {
  id: string;
  amount: number;
  method: string;
  paid_at: string;
  reference: string | null;
};

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const STATUS_CLS: Record<Invoice["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-secondary text-deep",
  partial: "bg-amber-100 text-amber-800",
  paid: "bg-mint text-deep",
  void: "bg-destructive/10 text-destructive line-through",
};

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  wallet: "Wallet",
  insurance: "Insurance",
  other: "Other",
};

function fmtMoney(n: number) {
  return `EGP ${Number(n).toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function BillingPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <BillingInner />
      </AdminShell>
    </RequireAuth>
  );
}

function BillingInner() {
  const { state } = useAdminAuth();
  const role: StaffRole | null =
    state.status === "signed_in" ? (state.profile?.role ?? null) : null;
  const canManage = role === "owner" || role === "accountant";
  const actorId = state.status === "signed_in" ? state.session.user.id : null;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payOpen, setPayOpen] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let query = supabase
      .from("invoices")
      .select(
        "id, patient_id, invoice_no, status, subtotal, discount, total, amount_paid, issued_at, due_date, patients(full_name, phone)",
      )
      .order("issued_at", { ascending: false })
      .limit(300);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data, error } = await query;
    setLoading(false);
    if (error) {
      toast.error("Failed to load invoices");
      return;
    }
    let list = (data as unknown as Invoice[]) ?? [];
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter((i) =>
        `${i.patients?.full_name ?? ""} ${i.patients?.phone ?? ""} ${i.invoice_no}`
          .toLowerCase()
          .includes(term),
      );
    }
    setInvoices(list);
  }, [q, statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const loadDetail = useCallback(async (inv: Invoice) => {
    if (!supabase) return;
    const [itemsRes, paysRes] = await Promise.all([
      supabase
        .from("invoice_items")
        .select("id, description, qty, unit_price, line_total")
        .eq("invoice_id", inv.id),
      supabase
        .from("payments")
        .select("id, amount, method, paid_at, reference")
        .eq("invoice_id", inv.id)
        .order("paid_at", { ascending: false }),
    ]);
    setItems((itemsRes.data as InvoiceItem[]) ?? []);
    setPayments((paysRes.data as Payment[]) ?? []);
  }, []);

  useEffect(() => {
    if (selected) loadDetail(selected);
    else {
      setItems([]);
      setPayments([]);
    }
  }, [selected, loadDetail]);

  const totals = useMemo(() => {
    const paid = invoices
      .filter((i) => i.status !== "void")
      .reduce((s, i) => s + Number(i.total), 0);
    const collected = invoices
      .filter((i) => i.status !== "void")
      .reduce((s, i) => s + Number(i.amount_paid), 0);
    return { billed: paid, collected, outstanding: paid - collected };
  }, [invoices]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Invoices, payments and receipts.</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)} className="bg-deep text-deep-foreground">
            <Plus className="me-1 h-4 w-4" /> New invoice
          </Button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Billed", value: fmtMoney(totals.billed) },
          { label: "Collected", value: fmtMoney(totals.collected) },
          { label: "Outstanding", value: fmtMoney(totals.outstanding) },
        ].map((s) => (
          <div key={s.label} className="card-soft p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patient or invoice #…"
            className="w-64 ps-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(["draft", "sent", "partial", "paid", "void"] as const).map((s) => (
              <SelectItem key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="card-soft mt-4 overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <button
                  onClick={() => setSelected(inv)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-start transition-colors hover:bg-secondary/50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-deep">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      #{String(inv.invoice_no).padStart(4, "0")}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {inv.patients?.full_name ?? "Unknown"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {new Date(inv.issued_at).toLocaleDateString("en-GB")}
                      {inv.due_date ? ` · due ${inv.due_date}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLS[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                  <div className="text-end">
                    <p className="text-sm font-semibold text-foreground">{fmtMoney(inv.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      paid {fmtMoney(inv.amount_paid)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Invoice detail */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Invoice #{selected ? String(selected.invoice_no).padStart(4, "0") : ""}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selected.patients?.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {selected.patients?.phone}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLS[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>

              <ul className="divide-y divide-border rounded-xl border border-border">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-foreground">
                      {it.description}{" "}
                      <span className="text-xs text-muted-foreground">×{it.qty}</span>
                    </span>
                    <span className="font-medium text-foreground">{fmtMoney(it.line_total)}</span>
                  </li>
                ))}
                <li className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{fmtMoney(selected.subtotal)}</span>
                </li>
                {Number(selected.discount) > 0 && (
                  <li className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-{fmtMoney(selected.discount)}</span>
                  </li>
                )}
                <li className="flex justify-between px-3 py-2 text-sm font-semibold">
                  <span>Total</span>
                  <span>{fmtMoney(selected.total)}</span>
                </li>
                <li className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span>{fmtMoney(selected.amount_paid)}</span>
                </li>
              </ul>

              {payments.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Payments</h3>
                  <ul className="space-y-1.5">
                    {payments.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                      >
                        <span className="text-foreground">
                          {METHOD_LABELS[p.method] ?? p.method}
                          {p.reference ? ` · ${p.reference}` : ""}
                        </span>
                        <span className="font-medium text-foreground">{fmtMoney(p.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {canManage && selected.status !== "void" && selected.status !== "paid" && (
                <Button
                  onClick={() => setPayOpen(true)}
                  className="w-full bg-deep text-deep-foreground"
                >
                  Record payment
                </Button>
              )}
              {canManage && selected.status !== "void" && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    if (!supabase || !window.confirm("Void this invoice?")) return;
                    const { error } = await supabase
                      .from("invoices")
                      .update({ status: "void", updated_at: new Date().toISOString() })
                      .eq("id", selected.id);
                    if (error) {
                      toast.error("Could not void invoice");
                      return;
                    }
                    toast.success("Invoice voided");
                    setSelected(null);
                    load();
                  }}
                >
                  Void invoice
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateInvoiceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        actorId={actorId}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />

      {selected && (
        <RecordPaymentDialog
          invoice={selected}
          actorId={actorId}
          open={payOpen}
          onOpenChange={setPayOpen}
          onSaved={() => {
            setPayOpen(false);
            loadDetail(selected);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateInvoiceDialog({
  open,
  onOpenChange,
  actorId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  actorId: string | null;
  onCreated: () => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [lines, setLines] = useState<{ description: string; qty: number; unit_price: number }[]>([
    { description: "", qty: 1, unit_price: 0 },
  ]);
  const [discount, setDiscount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !supabase) return;
    supabase
      .from("patients")
      .select("id, full_name, phone")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => setPatients((data as Patient[]) ?? []));
    supabase
      .from("services")
      .select("id, name_en, name_ar, price")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setServices((data as Service[]) ?? []));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPatient(null);
      setPatientQuery("");
      setPatientResults([]);
      setLines([{ description: "", qty: 1, unit_price: 0 }]);
      setDiscount("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!patientQuery.trim() || patient || !supabase) {
      setPatientResults([]);
      return;
    }
    const q = patientQuery.trim();
    const sb = supabase;
    const t = setTimeout(async () => {
      const { data } = await sb
        .from("patients")
        .select("id, full_name, phone")
        .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(8);
      setPatientResults((data as Patient[]) ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [patientQuery, patient]);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unit_price) || 0), 0),
    [lines],
  );
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  function setLine(i: number, patch: Partial<(typeof lines)[number]>) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }

  function pickService(i: number, serviceId: string) {
    const s = services.find((x) => x.id === serviceId);
    if (s) setLine(i, { description: s.name_ar ?? s.name_en, unit_price: Number(s.price ?? 0) });
  }

  async function submit() {
    if (!supabase || !patient) {
      setError("Select a patient.");
      return;
    }
    const valid = lines.filter((l) => l.description.trim() && l.unit_price > 0);
    if (valid.length === 0) {
      setError("Add at least one line item with a price.");
      return;
    }
    setSaving(true);
    const { data: inv, error: iErr } = await supabase
      .from("invoices")
      .insert({
        patient_id: patient.id,
        status: "sent",
        subtotal,
        discount: Number(discount) || 0,
        total,
        created_by: actorId,
      })
      .select("id")
      .single();
    if (iErr || !inv) {
      setSaving(false);
      setError("Could not create invoice.");
      return;
    }
    const { error: itErr } = await supabase.from("invoice_items").insert(
      valid.map((l) => ({
        invoice_id: inv.id,
        description: l.description.trim(),
        qty: l.qty || 1,
        unit_price: l.unit_price,
      })),
    );
    setSaving(false);
    if (itErr) {
      setError("Invoice created but line items failed — edit it in the database.");
      return;
    }
    toast.success("Invoice created");
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Patient */}
          <div>
            <Label className="mb-1 block text-xs">Patient</Label>
            {patient ? (
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
                  list="billing-patients"
                />
                <datalist id="billing-patients">
                  {patients.slice(0, 100).map((p) => (
                    <option key={p.id} value={p.full_name} />
                  ))}
                </datalist>
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

          {/* Line items */}
          <div className="space-y-2">
            <Label className="block text-xs">Items</Label>
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_64px_96px_32px] items-end gap-2">
                <div>
                  {i === 0 && (
                    <span className="mb-1 block text-[10px] text-muted-foreground">
                      Description / service
                    </span>
                  )}
                  <Input
                    value={l.description}
                    onChange={(e) => setLine(i, { description: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Teeth whitening"
                  />
                </div>
                <div>
                  {i === 0 && (
                    <span className="mb-1 block text-[10px] text-muted-foreground">Qty</span>
                  )}
                  <Input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => setLine(i, { qty: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
                <div>
                  {i === 0 && (
                    <span className="mb-1 block text-[10px] text-muted-foreground">
                      Price (EGP)
                    </span>
                  )}
                  <Input
                    type="number"
                    min={0}
                    value={l.unit_price}
                    onChange={(e) => setLine(i, { unit_price: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={lines.length === 1}
                  onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
                >
                  ×
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLines((ls) => [...ls, { description: "", qty: 1, unit_price: 0 }])
                }
              >
                + Add line
              </Button>
              <Select
                onValueChange={(v) => {
                  const empty = lines.findIndex((l) => !l.description.trim());
                  pickService(empty >= 0 ? empty : lines.length - 1, v);
                }}
              >
                <SelectTrigger className="h-8 w-48 text-xs">
                  <SelectValue placeholder="Pick from services…" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter((s) => s.price != null)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name_ar ?? s.name_en} — {fmtMoney(s.price!)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-xs">Discount (EGP)</Label>
              <Input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex items-end justify-between rounded-xl bg-muted/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-semibold text-foreground">{fmtMoney(total)}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
          )}

          <Button
            onClick={submit}
            disabled={saving}
            className="w-full bg-deep text-deep-foreground"
          >
            {saving ? "Saving…" : "Create invoice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RecordPaymentDialog({
  invoice,
  actorId,
  open,
  onOpenChange,
  onSaved,
}: {
  invoice: Invoice;
  actorId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(0, Number(invoice.total) - Number(invoice.amount_paid));

  useEffect(() => {
    if (open) {
      setAmount(String(remaining));
      setMethod("cash");
      setReference("");
      setError(null);
    }
  }, [open, remaining]);

  async function submit() {
    if (!supabase) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSaving(true);
    const { error: pErr } = await supabase.from("payments").insert({
      invoice_id: invoice.id,
      patient_id: invoice.patient_id,
      amount: amt,
      method,
      reference: reference.trim() || null,
      received_by: actorId,
    });
    setSaving(false);
    if (pErr) {
      setError("Could not record payment.");
      return;
    }
    toast.success("Payment recorded");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Remaining: <span className="font-semibold text-foreground">{fmtMoney(remaining)}</span>
          </p>
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
            <Label className="mb-1 block text-xs">Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className={inputCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(METHOD_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Reference (optional)</Label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
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
            {saving ? "Saving…" : "Record payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
