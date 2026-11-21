import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { getPatient } from "@/lib/admin/patient.service";
import type { Patient } from "@/lib/admin/patients";
import { User, Clock, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/patients/$patientId")({
  component: PatientDetailPage,
});

function PatientDetailPage() {
  const { state } = useAdminAuth();
  // $FlowFixMe - TanStack Router v1 useParams
  const { patientId = "" } = useParams() || {};
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    getPatient(patientId).then((p) => {
      setPatient(p);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load patient");
      setLoading(false);
    });
  }, [patientId, toast]);

  if (loading || !patient) {
    return (
      <RequireAuth>
        <AdminShell>
          <div className="flex min-h-screen items-center justify-center bg-muted/40">
            <div className="h-10 w-10 animate-pulse rounded-full bg-primary/30" />
          </div>
        </AdminShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{patient.full_name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Patient ID: #{patient.patient_no}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin/patients">← Back</Link></Button>
            </div>
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}