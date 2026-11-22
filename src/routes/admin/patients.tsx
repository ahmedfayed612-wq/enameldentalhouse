import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { STATUS_META, fmtTime12, type AppointmentStatus } from "@/lib/admin/appointments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/patients")({
  component: PatientsPage,
});

type Patient = {
  id: string;
  patient_no: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
};

type ApptRow = {
  id: string;
  starts_at: string;
  status: AppointmentStatus;
  services: { name_en: string; name_ar: string | null } | null;
};

type TreatmentPlan = {
  id: string;
  title: string;
  status: "active" | "completed" | "archived";
  notes: string | null;
  created_at: string;
};

type PlanItem = {
  id: string;
  plan_id: string;
  description: string;
  tooth: string | null;
  status: "planned" | "in_progress" | "done" | "skipped";
  estimated_price: number | null;
  sort_order: number;
};

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function PatientsPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <PatientsInner />
      </AdminShell>
    </RequireAuth>
  );
}

function PatientsInner() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [detail, setDetail] = useState<ApptRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let query = supabase
      .from("patients")
      .select("id, patient_no, full_name, phone, email, created_at")
      .order("created_at", { ascending: false })
      .limit(300);
    if (q.trim()) {
      const term = q.trim().replace(/[%_]/g, "");
      query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
    }
    const { data, error } = await query;
    setLoading(false);
    if (error) {
      toast.error("Failed to load patients");
      return;
    }
    setPatients((data as Patient[]) ?? []);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  useEffect(() => {
    if (!supabase || !selected) {
      setDetail([]);
      return;
    }
    supabase
      .from("appointments")
      .select("id, starts_at, status, services(name_en, name_ar)")
      .eq("patient_id", selected.id)
      .order("starts_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setDetail((data as unknown as ApptRow[]) ?? []));
  }, [selected]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Patients</h1>
          <p className="mt-1 text-sm text-muted-foreground">{patients.length} records</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-deep text-deep-foreground">
          <UserPlus className="me-1 h-4 w-4" /> New patient
        </Button>
      </div>

      <div className="relative mt-4 max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone or email…"
          className="ps-9"
        />
      </div>

      <div className="card-soft mt-4 overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No patients found.</p>
        ) : (
          <ul className="divide-y divide-border">
            {patients.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-start transition-colors hover:bg-secondary/50"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-deep">
                    {p.full_name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.full_name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {p.phone ?? "—"}
                      {p.email ? ` · ${p.email}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    #{String(p.patient_no).padStart(4, "0")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.full_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium" dir="ltr">
                    {selected.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selected.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient no.</p>
                  <p className="font-medium">#{String(selected.patient_no).padStart(4, "0")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">
                    {new Date(selected.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <TreatmentPlans patientId={selected.id} />

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Recent appointments</h3>
                {detail.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No appointments yet.</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border">
                    {detail.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <span className="text-foreground">
                          {a.services ? (a.services.name_ar ?? a.services.name_en) : "Appointment"}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {fmtTime12(a.starts_at)}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[a.status].cls}`}
                          >
                            {STATUS_META[a.status].label}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreatePatientDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </div>
  );
}

function CreatePatientDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setPhone("");
      setEmail("");
      setError(null);
    }
  }, [open]);

  async function submit() {
    if (!supabase) return;
    if (name.trim().length < 2) {
      setError("Enter the patient's full name.");
      return;
    }
    setSaving(true);
    const { error: pErr } = await supabase.from("patients").insert({
      full_name: name.trim(),
      phone: phone.replace(/\s/g, "") || null,
      email: email.trim() || null,
    });
    setSaving(false);
    if (pErr) {
      setError("Could not create patient.");
      return;
    }
    toast.success("Patient created");
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-1 block text-xs">Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              dir="ltr"
              placeholder="01xxxxxxxxx"
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Email (optional)</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              dir="ltr"
              type="email"
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
            {saving ? "Saving…" : "Create patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ITEM_STATUS_CLS: Record<PlanItem["status"], string> = {
  planned: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/20 text-deep",
  done: "bg-mint text-deep",
  skipped: "bg-destructive/10 text-destructive",
};

function TreatmentPlans({ patientId }: { patientId: string }) {
  const [plans, setPlans] = useState<(TreatmentPlan & { items: PlanItem[] })[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [itemDraft, setItemDraft] = useState<
    Record<string, { desc: string; tooth: string; price: string }>
  >({});

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: planRows } = await supabase
      .from("treatment_plans")
      .select("id, title, status, notes, created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    const list = (planRows as TreatmentPlan[]) ?? [];
    if (list.length === 0) {
      setPlans([]);
      return;
    }
    const { data: itemRows } = await supabase
      .from("treatment_plan_items")
      .select("id, plan_id, description, tooth, status, estimated_price, sort_order")
      .in(
        "plan_id",
        list.map((p) => p.id),
      )
      .order("sort_order");
    const items = (itemRows as PlanItem[]) ?? [];
    setPlans(list.map((p) => ({ ...p, items: items.filter((i) => i.plan_id === p.id) })));
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function createPlan() {
    if (!supabase || newTitle.trim().length < 2) return;
    const { error } = await supabase
      .from("treatment_plans")
      .insert({ patient_id: patientId, title: newTitle.trim(), status: "active" });
    if (error) {
      toast.error("Could not create plan");
      return;
    }
    setNewTitle("");
    setAdding(false);
    load();
  }

  async function addItem(planId: string) {
    if (!supabase) return;
    const d = itemDraft[planId] ?? { desc: "", tooth: "", price: "" };
    if (d.desc.trim().length < 2) return;
    const { error } = await supabase.from("treatment_plan_items").insert({
      plan_id: planId,
      description: d.desc.trim(),
      tooth: d.tooth.trim() || null,
      estimated_price: d.price ? Number(d.price) : null,
      sort_order: 999,
    });
    if (error) {
      toast.error("Could not add item");
      return;
    }
    setItemDraft((m) => ({ ...m, [planId]: { desc: "", tooth: "", price: "" } }));
    load();
  }

  async function setItemStatus(item: PlanItem, status: PlanItem["status"]) {
    if (!supabase) return;
    await supabase.from("treatment_plan_items").update({ status }).eq("id", item.id);
    load();
  }

  async function setPlanStatus(plan: TreatmentPlan, status: TreatmentPlan["status"]) {
    if (!supabase) return;
    await supabase.from("treatment_plans").update({ status }).eq("id", plan.id);
    load();
  }

  const fmtEgp = (n: number | null) =>
    n == null ? "" : `EGP ${Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Treatment plans</h3>
        {!adding && (
          <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
            + Plan
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-3 flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Plan title, e.g. Full mouth rehab"
            className={inputCls}
          />
          <Button size="sm" onClick={createPlan} className="bg-deep text-deep-foreground">
            Add
          </Button>
        </div>
      )}

      {plans.length === 0 && !adding && (
        <p className="text-xs text-muted-foreground">No treatment plans yet.</p>
      )}

      <div className="space-y-3">
        {plans.map((p) => {
          const draft = itemDraft[p.id] ?? { desc: "", tooth: "", price: "" };
          return (
            <div key={p.id} className="rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <select
                  value={p.status}
                  onChange={(e) => setPlanStatus(p, e.target.value as TreatmentPlan["status"])}
                  className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <ul className="divide-y divide-border">
                {p.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{it.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {it.tooth ? `Tooth ${it.tooth}` : ""}
                        {it.estimated_price != null ? ` · ${fmtEgp(it.estimated_price)}` : ""}
                      </p>
                    </div>
                    <select
                      value={it.status}
                      onChange={(e) => setItemStatus(it, e.target.value as PlanItem["status"])}
                      className={`rounded-full border-0 px-2 py-1 text-[10px] font-semibold ${ITEM_STATUS_CLS[it.status]}`}
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                      <option value="skipped">Skipped</option>
                    </select>
                  </li>
                ))}
                {p.items.length === 0 && (
                  <li className="px-3 py-2 text-xs text-muted-foreground">No items yet.</li>
                )}
              </ul>
              <div className="flex gap-2 border-t border-border p-2">
                <Input
                  value={draft.desc}
                  onChange={(e) =>
                    setItemDraft((m) => ({
                      ...m,
                      [p.id]: { ...draft, desc: e.target.value },
                    }))
                  }
                  placeholder="Add item…"
                  className="h-9 flex-1 text-xs"
                />
                <Input
                  value={draft.tooth}
                  onChange={(e) =>
                    setItemDraft((m) => ({ ...m, [p.id]: { ...draft, tooth: e.target.value } }))
                  }
                  placeholder="Tooth #"
                  className="h-9 w-16 text-xs"
                  dir="ltr"
                />
                <Input
                  value={draft.price}
                  onChange={(e) =>
                    setItemDraft((m) => ({ ...m, [p.id]: { ...draft, price: e.target.value } }))
                  }
                  placeholder="EGP"
                  type="number"
                  min={0}
                  className="h-9 w-20 text-xs"
                  dir="ltr"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => addItem(p.id)}
                  disabled={draft.desc.trim().length < 2}
                >
                  Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
