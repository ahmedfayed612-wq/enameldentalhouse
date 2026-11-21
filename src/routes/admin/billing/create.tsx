import { useState, useCallback, useEffect, type FormEvent as ReactFormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { supabase } from "@/lib/supabase";
import { createInvoice } from "@/lib/admin/billing.service";
import type { CreateInvoiceInput } from "@/lib/admin/billing";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/billing/create")({
  component: CreateInvoicePage,
});

function CreateInvoicePage() {
  const { state } = useAdminAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Array<{ id: string; full_name: string; phone: string | null }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name_en: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [items, setItems] = useState<Array<{
    service_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    discount: number;
    line_total: number;
  }>>([{ service_id: null, description: "", quantity: 1, unit_price: 0, discount: 0, line_total: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.from("patients").select("id, full_name, phone").limit(100).then(({ data }) => {
      setPatients((data ?? []) as Array<{ id: string; full_name: string; phone: string | null }>);
    });
    supabase.from("services").select("id, name_en").eq("active", true).then(({ data }) => {
      setServices((data ?? []) as Array<{ id: string; name_en: string }>);
    });
  }, []);

  const recalc = () => {
    const sub = items.reduce((acc, it) => acc + it.line_total, 0);
    setSubtotal(sub);
  };

  const addItem = () => {
    setItems([...items, { service_id: null, description: "", quantity: 1, unit_price: 0, discount: 0, line_total: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: ReactFormEvent) => {
    e.preventDefault();
    if (!selectedPatient) { toast.error("Please select a patient"); return; }
    setSaving(true);
    try {
      const input: CreateInvoiceInput = {
        patient_id: selectedPatient,
        status: "draft",
        subtotal,
        discount,
        tax,
        notes: notes || null,
        items: items.filter((it) => it.description.trim()),
      };
      const inv = await createInvoice(input);
      navigate({ to: `/admin/billing/${inv.id}` });
    } catch { toast.error("Failed to create invoice"); }
    finally { setSaving(false); }
  };

  const total = subtotal - discount + tax;

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Invoice</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create a new invoice for a patient</p>
          </div>

          <form onSubmit={handleSubmit} className="card-soft p-6">
            <div className="mb-6">
              <Label className="mb-2 block text-sm font-medium">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name} ({p.phone})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <Label className="mb-2 block text-sm font-medium">Line Items</Label>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Select value={it.service_id} onValueChange={(v: any) => {
                      // $FlowFixMe-next-line
                      // $FlowFixMe-useParams
                      const id = v ?? "";
                      const s = services.find((x) => x.id === id);
                      const next = [...items];
                      next[idx] = { ...next[idx], service_id: id !== "" ? id : null, description: s?.name_en ?? "", line_total: 0 };
                      setItems(next);
                    }}>
                      <SelectTrigger className="w-[40%]">
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id ?? ""}>{s.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/*
                    <Input
                      value={it.description}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setItems(next);
                      }}
                      placeholder="Description"
                      className="flex-1"
                    />
                    */}
                    <Input value={it.description} onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], description: e.target.value };
                      setItems(next);
                    }} placeholder="Description" className="flex-1" />
                    <Input type="number" value={it.quantity} onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], quantity: Math.max(1, parseInt(e.target.value) || 1), line_total: 0 };
                      setItems(next);
                    }} className="w-20" min="1" />
                    <Input type="number" value={it.unit_price} step="0.01" onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], unit_price: parseFloat(e.target.value) || 0, line_total: 0 };
                      setItems(next);
                    }} className="w-32" placeholder="0.00" />
                    <Input type="number" value={it.discount} step="0.01" onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], discount: parseFloat(e.target.value) || 0, line_total: 0 };
                      setItems(next);
                    }} className="w-28" placeholder="0.00" />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeItem(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add item
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div>
                <Label className="mb-1 block text-xs font-medium">Subtotal</Label>
                <Input type="number" value={subtotal} step="0.01" onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)} className="w-full" />
              </div>
              <div>
                <Label className="mb-1 block text-xs font-medium">Discount</Label>
                <Input type="number" value={discount} step="0.01" onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-full" />
              </div>
              <div>
                <Label className="mb-1 block text-xs font-medium">Tax</Label>
                <Input type="number" value={tax} step="0.01" onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-full" />
              </div>
            </div>

            <div className="mb-6">
              <Label className="mb-1 block text-xs font-medium">Notes</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full input input-bordered" />
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-border">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold text-foreground">${total.toFixed(2)}</div>
              </div>
              <Button type="submit" disabled={saving} className="bg-deep text-deep-foreground">
                {saving ? "Creating…" : "Create Invoice"}
              </Button>
            </div>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            <Button variant="outline" asChild><Link to="/admin/billing">← Back to invoices</Link></Button>
          </p>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}