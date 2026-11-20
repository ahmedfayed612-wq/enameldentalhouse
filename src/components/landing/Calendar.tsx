import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CLINIC, isOpenDay, isPastDay, ymd } from "@/lib/availability";

type Props = {
  value: Date | null;
  onChange: (d: Date) => void;
};

export function Calendar({ value, onChange }: Props) {
  const { t, lang, dir } = useI18n();
  const [view, setView] = useState(() => {
    const d = value ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const months = t("calMonths_long").split(",");
  const weekdays = t("calWeekdaysShort").split(",");

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startOffset = first.getDay(); // 0=Sun
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(view.getFullYear(), view.getMonth(), d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [view]);

  const goPrev = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const goNext = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));

  const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
  const Next = dir === "rtl" ? ChevronLeft : ChevronRight;

  const selectedKey = value ? ymd(value) : "";

  return (
    <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          aria-label={t("calPrev")}
          className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent"
        >
          <Prev className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold text-foreground">
          {months[view.getMonth()]} {view.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", { year: "numeric" })}
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label={t("calNext")}
          className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent"
        >
          <Next className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {weekdays.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-11" />;
          const past = isPastDay(d);
          const open = isOpenDay(d);
          const disabled = past || !open;
          const selected = ymd(d) === selectedKey;
          const isFri = CLINIC.closedWeekdays.includes(d.getDay());

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(d)}
              aria-label={d.toDateString()}
              className={[
                "relative h-11 rounded-xl text-sm font-medium transition-colors",
                selected
                  ? "bg-deep text-deep-foreground"
                  : disabled
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-foreground hover:bg-primary-soft",
              ].join(" ")}
            >
              {d.getDate()}
              {isFri && !selected && (
                <span className="absolute inset-x-1 bottom-0.5 text-[8px] uppercase text-muted-foreground/60">
                  {t("calFriClosed")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
