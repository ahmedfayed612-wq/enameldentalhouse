import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-store";
import { trackLead } from "@/lib/analytics";
import { SERVICE_OPTIONS } from "./Services";
import { Calendar } from "./Calendar";
import { CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { TKey } from "@/lib/translations";
import { getDaySlots, submitBooking } from "@/lib/booking.functions";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  CLINIC,
  formatDateLabel,
  formatSlotLabel,
  generateSlots,
  isSlotBooked,
  ymd,
} from "@/lib/availability";

type FieldError = Partial<Record<"name" | "phone" | "service" | "date" | "time", TKey>>;

const EG_PHONE = /^(?:\+?20|0020)?0?1[0125][0-9]{8}$/;
const WA_LINK = `https://wa.me/${CLINIC.whatsapp}`;

export function BookingForm() {
  const { t, lang } = useI18n();
  const { preselectedService, clearService } = useBooking();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldError>({});
  const [submitError, setSubmitError] = useState<TKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (preselectedService) setService(preselectedService);
  }, [preselectedService]);

  const slots = useMemo(() => generateSlots(), []);

  // Real availability from the database (falls back to static grid when
  // Supabase isn't configured or the request fails).
  const dateKey = date ? ymd(date) : null;
  const { data: slotData, refetch: refetchSlots } = useQuery({
    queryKey: ["day-slots", dateKey],
    queryFn: () => getDaySlots({ data: { date: dateKey! } }),
    enabled: !!dateKey && isSupabaseConfigured,
    staleTime: 30_000,
  });
  const availableSlots: Set<string> | null = slotData?.ok === true ? new Set(slotData.slots) : null;

  function validate(): FieldError {
    const e: FieldError = {};
    if (name.trim().length < 2) e.name = "errName";
    const cleaned = phone.replace(/[\s-]/g, "");
    if (!EG_PHONE.test(cleaned)) e.phone = "errPhone";
    if (!service) e.service = "errService";
    if (!date) e.date = "errDate";
    if (!time) e.time = "errTime";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.replace(/[\s-]/g, ""),
        service,
        date: date ? ymd(date) : "",
        time,
        notes: notes.trim(),
        submittedAt: new Date().toISOString(),
      };

      // Persist to the database when configured; the DB function validates,
      // dedupes the patient by phone and rejects taken slots atomically.
      if (isSupabaseConfigured) {
        const res = await submitBooking({ data: payload });
        if (!res.ok) {
          if (res.error === "slot_unavailable") {
            setSubmitError("errSlotTaken");
            setTime("");
            refetchSlots();
          } else {
            setSubmitError("errBooking");
          }
          return;
        }
      }

      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("enamel-bookings") || "[]");
        existing.unshift(payload);
        localStorage.setItem("enamel-bookings", JSON.stringify(existing));
      }
      trackLead({ service, value: 0, currency: "EGP" });

      // Build WhatsApp confirmation message (auto-opens for the patient).
      // TODO Phase 2: replace with WhatsApp Business API auto-send via Cloud function.
      const dateLabel = date ? formatDateLabel(date, lang) : "";
      const timeLabel = formatSlotLabel(time, lang);
      const svcLabel = t(
        (SERVICE_OPTIONS.find((s) => s.id === service)?.label as TKey) || "navBook",
      );
      const msg =
        lang === "ar"
          ? `تأكيد حجزك في إنامل دنتال هاوس\nالاسم: ${payload.name}\nالخدمة: ${svcLabel}\nالتاريخ: ${dateLabel}\nالساعة: ${timeLabel}\nهيوصلك تذكير قبل الموعد بيوم.`
          : `Enamel Dental House — appointment confirmation\nName: ${payload.name}\nService: ${svcLabel}\nDate: ${dateLabel}\nTime: ${timeLabel}\nWe'll send a reminder the day before.`;
      const url = `${WA_LINK}?text=${encodeURIComponent(msg)}`;
      setWaUrl(url);
      if (typeof window !== "undefined") {
        // Open the confirmation immediately — same gesture as form submit.
        window.open(url, "_blank", "noopener");
      }
      setDone(true);
      clearService();
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName("");
    setPhone("");
    setService("");
    setDate(null);
    setTime("");
    setNotes("");
    setErrors({});
    setSubmitError(null);
    setDone(false);
    setWaUrl("");
  }

  return (
    <section id="booking" className="section-pad bg-mint/30">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navBook")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("bookTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("bookSubtitle")}</p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-deep">
            <Sparkles className="h-3.5 w-3.5" />
            {t("bookScarcity")}
          </div>

          <div className="card-soft overflow-hidden p-5 sm:p-7">
            {done ? (
              <div className="grid place-items-center py-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-deep">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {t("bookSuccessTitle")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {t("bookSuccessBody")}
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-deep px-5 py-3 text-sm font-semibold text-deep-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("bookOpenWhatsapp")}
                </a>
                <button
                  onClick={reset}
                  className="mt-3 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {t("bookSuccessAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                {/* Step 1 — Date */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{t("bookStep1")}</h3>
                  <Calendar
                    value={date}
                    onChange={(d) => {
                      setDate(d);
                      setTime("");
                      setErrors((e) => ({ ...e, date: undefined }));
                    }}
                  />
                  {errors.date && <p className="mt-2 text-xs text-destructive">{t(errors.date)}</p>}
                </div>

                {/* Step 2 — Time */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{t("bookStep2")}</h3>
                  {!date ? (
                    <p className="rounded-xl border border-dashed border-border bg-background/50 p-4 text-center text-xs text-muted-foreground">
                      {t("bookStep2Hint")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((s) => {
                        const booked = date
                          ? availableSlots
                            ? !availableSlots.has(s)
                            : isSlotBooked(date, s)
                          : false;
                        const selected = time === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              setTime(s);
                              setErrors((e) => ({ ...e, time: undefined }));
                            }}
                            className={[
                              "relative min-h-12 rounded-xl border px-2 py-2 text-sm font-medium transition-colors",
                              selected
                                ? "border-deep bg-deep text-deep-foreground"
                                : booked
                                  ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through"
                                  : "border-border bg-background text-foreground hover:border-primary hover:bg-primary-soft",
                            ].join(" ")}
                          >
                            <span dir="ltr">{formatSlotLabel(s, lang)}</span>
                            {selected && (
                              <CheckCircle2 className="absolute end-1 top-1 h-3.5 w-3.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.time && <p className="mt-2 text-xs text-destructive">{t(errors.time)}</p>}
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-2 hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t("noTimeWhatsapp")}
                  </a>
                </div>

                {/* Step 3 — Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{t("bookYourDetails")}</h3>

                  <Field label={t("fieldName")} error={errors.name ? t(errors.name) : undefined}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("fieldNamePh")}
                      className={inputCls}
                      autoComplete="name"
                    />
                  </Field>

                  <Field label={t("fieldPhone")} error={errors.phone ? t(errors.phone) : undefined}>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("fieldPhonePh")}
                      className={inputCls}
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                    />
                  </Field>

                  <Field
                    label={t("fieldService")}
                    error={errors.service ? t(errors.service) : undefined}
                  >
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">{t("fieldServicePh")}</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {t(s.label)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t("fieldNotes")}>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("fieldNotesPh")}
                      rows={2}
                      className={inputCls + " resize-none"}
                    />
                  </Field>
                </div>

                {submitError && (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                    {t(submitError)}
                  </p>
                )}

                <p className="flex items-start gap-2 rounded-xl bg-primary-soft/60 p-3 text-xs text-deep">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  {t("bookReassurance")}
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-deep px-6 py-3.5 text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? t("bookSubmitting") : t("bookSubmit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full min-h-12 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
