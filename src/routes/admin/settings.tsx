import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth, useAdminRole } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { Settings, Users, Calendar, Building, CreditCard, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type SettingsTab = "clinic" | "services" | "payment-methods" | "users";

function SettingsPage() {
  const { state } = useAdminAuth();
  const role = useAdminRole();
  const [tab, setTab] = useState<SettingsTab>("clinic");
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("clinic_settings").select("*").eq("id", 1).maybeSingle();
    setClinicSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const tabs: Array<{ id: SettingsTab; label: string; icon: any }> = [
    { id: "clinic", label: "Clinic Info", icon: Building },
    { id: "services", label: "Services", icon: HardHat },
    { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
    { id: "users", label: "Staff & Users", icon: Users },
  ];

  const isOwner = role === "owner";

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Clinic configuration</p>
          </div>

          <div className="flex gap-1 mb-6">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant={tab === t.id ? "default" : "outline"}
                onClick={() => setTab(t.id)}
                disabled={t.id === "users" && !isOwner}
              >
                <t.icon className="mr-2 h-4 w-4" /> {t.label}
              </Button>
            ))}
          </div>

          {tab === "clinic" && (
            <Card>
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Clinic Name</Label>
                    <Input defaultValue={clinicSettings?.name ?? "Enamel Dental House"} disabled={!isOwner} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input defaultValue={clinicSettings?.whatsapp ?? ""} disabled={!isOwner} />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input defaultValue={clinicSettings?.timezone ?? "Africa/Cairo"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input defaultValue={clinicSettings?.currency ?? "EGP"} disabled />
                  </div>
                </div>
                {!isOwner && (
                  <p className="text-xs text-muted-foreground">Only the owner can modify clinic settings.</p>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Service management interface coming in next phase.
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "payment-methods" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Payment method configuration coming in next phase.
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage staff roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Staff management interface coming in next phase.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminShell>
    </RequireAuth>
  );
}