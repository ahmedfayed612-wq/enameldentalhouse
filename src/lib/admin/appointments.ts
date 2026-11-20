export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "arrived"
  | "waiting"
  | "in_treatment"
  | "completed"
  | "cancelled"
  | "no_show";

/** Forward transitions allowed from each status (plus cancelled/no_show handled separately). */
export const NEXT_STATUS: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  booked: "confirmed",
  confirmed: "arrived",
  arrived: "waiting",
  waiting: "in_treatment",
  in_treatment: "completed",
};

export const STATUS_META: Record<AppointmentStatus, { label: string; cls: string }> = {
  booked: { label: "Booked", cls: "bg-secondary text-deep" },
  confirmed: { label: "Confirmed", cls: "bg-primary-soft text-deep" },
  arrived: { label: "Arrived", cls: "bg-primary/20 text-deep" },
  waiting: { label: "Waiting", cls: "bg-amber-100 text-amber-800" },
  in_treatment: { label: "In treatment", cls: "bg-deep text-deep-foreground" },
  completed: { label: "Completed", cls: "bg-mint text-deep" },
  cancelled: { label: "Cancelled", cls: "bg-muted text-muted-foreground line-through" },
  no_show: { label: "No-show", cls: "bg-destructive/10 text-destructive" },
};

const TZ = "Africa/Cairo";

export function cairoParts(iso: string) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`,
    weekday: get("weekday"),
  };
}

export function fmtTime(iso: string) {
  return cairoParts(iso).time;
}

export function addDaysYmd(ymdStr: string, days: number) {
  const d = new Date(`${ymdStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayYmd() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}
