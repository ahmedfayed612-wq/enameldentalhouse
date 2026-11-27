import { Button } from "@/components/ui/button";
import {
  NEXT_STATUS,
  STATUS_META,
  fmtTime12,
  type AppointmentStatus,
} from "@/lib/admin/appointments";

export type AppointmentRow = {
  id: string;
  patient_id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  source: string;
  notes: string | null;
  dentist_id?: string | null;
  service_id?: string | null;
  patients: { full_name: string; phone: string | null } | null;
  services: { code: string; name_en: string; name_ar: string | null } | null;
};

export const APPOINTMENT_SELECT =
  "patient_id, id, starts_at, ends_at, status, source, notes, dentist_id, service_id, patients(full_name, phone), services(code, name_en, name_ar)";

export function StatusPill({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

export function AppointmentItem({
  a,
  onStatus,
  onEdit,
  compact,
}: {
  a: AppointmentRow;
  onStatus: (a: AppointmentRow, to: AppointmentStatus) => void;
  onEdit?: (a: AppointmentRow) => void;
  compact?: boolean;
}) {
  const next = NEXT_STATUS[a.status];
  const canNoShow = a.status === "arrived" || a.status === "waiting";
  const canCancel = !["completed", "cancelled", "no_show"].includes(a.status);

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
      <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-foreground" dir="ltr">
        {fmtTime12(a.starts_at)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {a.patients?.full_name ?? "Unknown patient"}
        </p>
        {!compact && (
          <p className="truncate text-xs text-muted-foreground">
            {a.services ? (a.services.name_ar ?? a.services.name_en) : "Service"}
            {a.patients?.phone ? ` · ${a.patients.phone}` : ""}
            {a.source === "web" && " · web"}
          </p>
        )}
        {a.notes && (
          <p className="mt-0.5 truncate text-xs italic text-muted-foreground">{a.notes}</p>
        )}
      </div>
      <StatusPill status={a.status} />
      <div className="flex items-center gap-1.5">
        {next && (
          <Button size="sm" variant="secondary" onClick={() => onStatus(a, next)}>
            → {STATUS_META[next].label}
          </Button>
        )}
        {canNoShow && (
          <Button size="sm" variant="outline" onClick={() => onStatus(a, "no_show")}>
            No-show
          </Button>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (window.confirm("Cancel this appointment?")) onStatus(a, "cancelled");
            }}
          >
            Cancel
          </Button>
        )}
        {onEdit && !["completed", "cancelled", "no_show"].includes(a.status) && (
          <Button size="sm" variant="ghost" onClick={() => onEdit(a)}>
            Edit
          </Button>
        )}
      </div>
    </li>
  );
}
