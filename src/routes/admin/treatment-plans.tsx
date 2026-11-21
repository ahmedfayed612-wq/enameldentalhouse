import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { listTreatmentPlans } from "@/lib/admin/treatment.service";
import type { TreatmentPlan } from "@/lib/admin/treatment";
import { Stethoscope, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/treatment-plans")({
  component: TreatmentPlansPage,
});

const STATUS_BADGE: Record<string, string> = {
  planned: "bg-primary-soft text-deep",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-mint text-deep",
  cancelled: "bg-muted text-muted-foreground line-through",
};

function TreatmentPlansPage() {
  const { state } = useAdminAuth();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listTreatmentPlans({});
      setPlans(rows.filter((p) =>
        p.patients?.full_name.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase())
      ));
    } catch {
      toast.error("Failed to load treatment plans");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => { load(); }, [load]);

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Treatment Plans</h1>
              <p className="mt-1 text-sm text-muted-foreground">Patient treatment planning</p>
            </div>
            <Button asChild><Link to="/admin/patients">Create from patient</Link></Button>
          </div>

          <div className="card-soft mb-6">
            <div className="flex items-center gap-2 p-6">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient name or plan title..." value={search} onChange={(e) => { setSearch(e.target.value); load(); }} className="w-full" />
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">{p.plan_id}</TableCell>
                    <TableCell>{p.patients?.full_name ?? "—"}</TableCell>
                    <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("capitalize", STATUS_BADGE[p.status] || "")}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell />
                  </TableRow>
                ))}
                {plans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4">No treatment plans found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}