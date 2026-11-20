import { useMemo } from "react";
<<<<<<< HEAD
import { useI18n } from "@/lib/i18n";
import { CLINIC, generateSlots, isOpenDay, isSlotBooked, formatSlotLabel } from "@/lib/availability";
=======
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getDaySlots } from "@/lib/booking.functions";
import { ymd, isOpenDay, formatSlotLabel } from "@/lib/availability";
>>>>>>> 66f548b (Initial commit: Enamel Dental House Clinic Management System)

export function LiveAvailabilityCard() {
  const { t, lang } = useI18n();
  const today = useMemo(() => new Date(), []);
  const open = isOpenDay(today);

<<<<<<< HEAD
  const slots = useMemo(() => {
    const all = generateSlots();
    const now = new Date();
    const upcoming = all.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      const d = new Date(today);
      d.setHours(h, m, 0, 0);
      return d.getTime() > now.getTime();
    });
    return upcoming.slice(0, 4);
  }, [today]);

  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary/15" />
      <div className="card-soft relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">إنامل · العبور</p>
=======
  const { data: slotData } = useQuery({
    queryKey: ["day-slots", ymd(today)],
    queryFn: () => getDaySlots({ data: { date: ymd(today) } }),
    enabled: isSupabaseConfigured,
    staleTime: 60_000,
  });

  // Real available slots (already excludes past times server-side).
  // Fallback: empty list -> show closed/booked-out state.
  const slots = useMemo(() => {
    if (slotData?.ok) return slotData.slots.slice(0, 4);
    return [];
  }, [slotData]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary/15"
      />
      <div className="card-soft relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              إنامل · العبور
            </p>
>>>>>>> 66f548b (Initial commit: Enamel Dental House Clinic Management System)
            <p className="truncate text-sm font-semibold text-foreground">{t("liveAvailToday")}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-deep">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {t("slotAvailable")}
          </span>
        </div>

        {!open || slots.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-background/60 p-5 text-center text-sm text-muted-foreground">
<<<<<<< HEAD
            {t("clinicClosedToday")}
          </div>
        ) : (
          <div className="mt-6 space-y-2.5">
            {slots.map((s, i) => {
              const booked = isSlotBooked(today, s);
              return (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground" dir="ltr">
                    {formatSlotLabel(s, lang)}
                  </span>
                  <span className={`text-xs ${booked ? "text-muted-foreground line-through" : "text-primary"}`}>
                    {booked ? t("slotBooked") : i === 1 ? t("slotOneLeft") : t("slotAvailable")}
                  </span>
                </div>
              );
            })}
=======
            {open ? t("bookedOutToday") : t("clinicClosedToday")}
          </div>
        ) : (
          <div className="mt-6 space-y-2.5">
            {slots.map((s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground" dir="ltr">
                  {formatSlotLabel(s, lang)}
                </span>
                <span className="text-xs text-primary">{t("slotAvailable")}</span>
              </div>
            ))}
>>>>>>> 66f548b (Initial commit: Enamel Dental House Clinic Management System)
          </div>
        )}

        <a
          href="#booking"
          className="mt-6 block min-h-12 w-full rounded-xl bg-deep py-3.5 text-center text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-90"
        >
          {t("ctaReserveSlot")}
        </a>
      </div>
    </div>
  );
}
