import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { ROLE_LABELS, type StaffRole } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type ClinicSettings = {
  name: string;
  name_ar: string | null;
  phone: string | null;
  whatsapp: string;
  address: string | null;
  maps_url: string | null;
  slot_minutes: number;
  open_hour: number;
  close_hour: number;
};

type WorkingHour = {
  id: string;
  weekday: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const inputCls =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function SettingsPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <SettingsInner />
      </AdminShell>
    </RequireAuth>
  );
}

function SettingsInner() {
  const { state } = useAdminAuth();
  const role: StaffRole | null =
    state.status === "signed_in" ? (state.profile?.role ?? null) : null;
  const canEdit = role === "owner";

  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [hours, setHours] = useState<WorkingHour[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    const [sRes, hRes] = await Promise.all([
      supabase.from("clinic_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("working_hours")
        .select("id, weekday, is_closed, open_time, close_time")
        .order("weekday"),
    ]);
    if (sRes.data) {
      const s = sRes.data as ClinicSettings & { id: number };
      setSettings({
        name: s.name,
        name_ar: s.name_ar,
        phone: s.phone,
        whatsapp: s.whatsapp,
        address: s.address,
        maps_url: s.maps_url,
        slot_minutes: s.slot_minutes,
        open_hour: s.open_hour,
        close_hour: s.close_hour,
      });
    }
    setHours((hRes.data as WorkingHour[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveAll() {
    if (!supabase || !settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("clinic_settings")
      .update({
        name: settings.name,
        name_ar: settings.name_ar || null,
        phone: settings.phone || null,
        whatsapp: settings.whatsapp,
        address: settings.address || null,
        maps_url: settings.maps_url || null,
        slot_minutes: settings.slot_minutes,
        open_hour: settings.open_hour,
        close_hour: settings.close_hour,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) {
      setSaving(false);
      toast.error("Could not save settings");
      return;
    }
    for (const h of hours) {
      const { error: hErr } = await supabase
        .from("working_hours")
        .update({
          is_closed: h.is_closed,
          open_time: h.is_closed ? null : (h.open_time ?? "12:00"),
          close_time: h.is_closed ? null : (h.close_time ?? "22:00"),
        })
        .eq("id", h.id);
      if (hErr) {
        setSaving(false);
        toast.error("Clinic settings saved, but working hours failed");
        return;
      }
    }
    setSaving(false);
    toast.success("Settings saved");
  }

  if (loading || !settings) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  const set = <K extends keyof ClinicSettings>(k: K, v: ClinicSettings[K]) =>
    setSettings((s) => (s ? { ...s, [k]: v } : s));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Clinic profile, booking rules and working hours.
        {!canEdit && ` (read-only — ${ROLE_LABELS[role ?? "receptionist"]} role)`}
      </p>

      <section className="card-soft mt-6 space-y-4 p-6">
        <h2 className="text-base font-semibold text-foreground">Clinic profile</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="mb-1 block text-xs">Name (English)</Label>
            <Input
              value={settings.name}
              onChange={(e) => set("name", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Name (Arabic)</Label>
            <Input
              value={settings.name_ar ?? ""}
              onChange={(e) => set("name_ar", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
              dir="rtl"
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Phone</Label>
            <Input
              value={settings.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">WhatsApp (digits with country code)</Label>
            <Input
              value={settings.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block text-xs">Address</Label>
            <Input
              value={settings.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block text-xs">Google Maps URL</Label>
            <Input
              value={settings.maps_url ?? ""}
              onChange={(e) => set("maps_url", e.target.value)}
              disabled={!canEdit}
              className={inputCls}
              dir="ltr"
              placeholder="https://maps.google.com/…"
            />
          </div>
        </div>
      </section>

      <section className="card-soft mt-6 space-y-4 p-6">
        <h2 className="text-base font-semibold text-foreground">Booking rules</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="mb-1 block text-xs">Slot length (minutes)</Label>
            <Input
              type="number"
              min={15}
              max={120}
              value={settings.slot_minutes}
              onChange={(e) => set("slot_minutes", Number(e.target.value))}
              disabled={!canEdit}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Opens at (hour)</Label>
            <Input
              type="number"
              min={0}
              max={23}
              value={settings.open_hour}
              onChange={(e) => set("open_hour", Number(e.target.value))}
              disabled={!canEdit}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Closes at (hour)</Label>
            <Input
              type="number"
              min={1}
              max={24}
              value={settings.close_hour}
              onChange={(e) => set("close_hour", Number(e.target.value))}
              disabled={!canEdit}
              className={inputCls}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Note: public availability uses per-weekday working hours below; open/close hour is the
          fallback window.
        </p>
      </section>

      <section className="card-soft mt-6 space-y-3 p-6">
        <h2 className="text-base font-semibold text-foreground">Working hours</h2>
        <ul className="divide-y divide-border">
          {hours.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center gap-3 py-2.5">
              <span className="w-24 text-sm font-medium text-foreground">
                {WEEKDAYS[h.weekday]}
              </span>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={h.is_closed}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setHours((hs) =>
                      hs.map((x) => (x.id === h.id ? { ...x, is_closed: e.target.checked } : x)),
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />
                Closed
              </label>
              {!h.is_closed && (
                <div className="flex items-center gap-2" dir="ltr">
                  <Input
                    type="time"
                    value={(h.open_time ?? "12:00").slice(0, 5)}
                    disabled={!canEdit}
                    onChange={(e) =>
                      setHours((hs) =>
                        hs.map((x) => (x.id === h.id ? { ...x, open_time: e.target.value } : x)),
                      )
                    }
                    className="w-28"
                  />
                  <span className="text-xs text-muted-foreground">→</span>
                  <Input
                    type="time"
                    value={(h.close_time ?? "22:00").slice(0, 5)}
                    disabled={!canEdit}
                    onChange={(e) =>
                      setHours((hs) =>
                        hs.map((x) => (x.id === h.id ? { ...x, close_time: e.target.value } : x)),
                      )
                    }
                    className="w-28"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {canEdit && (
        <div className="mt-6 flex gap-3">
          <Button onClick={saveAll} disabled={saving} className="bg-deep text-deep-foreground">
            <Save className="me-1 h-4 w-4" />
            {saving ? "Saving…" : "Save all"}
          </Button>
        </div>
      )}
    </div>
  );
}
