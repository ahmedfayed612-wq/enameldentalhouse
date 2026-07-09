/**
 * ============================================================
 *  CLINIC AVAILABILITY — single source of truth
 * ============================================================
 *  Edit the values below to change hours, closed days, slot
 *  length, or to manually mark slots as already booked.
 *  No other file needs to change.
 *
 *  Defaults: Open every day except Friday, 12:00 PM – 10:00 PM.
 * ============================================================
 */

export const CLINIC = {
  // JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  closedWeekdays: [5] as number[],

  openHour: 12, // 12:00
  closeHour: 22, // 22:00 (10 PM)
  slotMinutes: 45,

  /**
   * Manually mark slots as booked, e.g.:
   *   "2025-03-14": ["13:30", "18:00"]
   * Keys are local YYYY-MM-DD, values are "HH:MM" 24h.
   */
  bookedSlots: {} as Record<string, string[]>,

  whatsapp: "201000268550",
};

export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isOpenDay(date: Date): boolean {
  return !CLINIC.closedWeekdays.includes(date.getDay());
}

export function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export function generateSlots(): string[] {
  const out: string[] = [];
  const total = (CLINIC.closeHour - CLINIC.openHour) * 60;
  for (let m = 0; m + CLINIC.slotMinutes <= total; m += CLINIC.slotMinutes) {
    const minutes = CLINIC.openHour * 60 + m;
    const h = Math.floor(minutes / 60);
    const min = minutes % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return out;
}

export function isSlotBooked(date: Date, time: string): boolean {
  const key = ymd(date);
  return (CLINIC.bookedSlots[key] || []).includes(time);
}

export function formatSlotLabel(time: string, lang: "ar" | "en"): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (lang === "ar") {
    const period = h < 12 ? "ص" : "م";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mm = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
    // Arabic-Indic digits
    const toAr = (s: string) =>
      s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
    return toAr(`${h12}${mm}`) + " " + period;
  }
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDateLabel(date: Date, lang: "ar" | "en"): string {
  return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
