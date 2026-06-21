import { useEffect, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-store";
import { trackLead } from "@/lib/analytics";
import { SERVICE_OPTIONS } from "./Services";
import { CheckCircle2 } from "lucide-react";
import type { TKey } from "@/lib/translations";

type FieldError = Partial<Record<"name" | "phone" | "service" | "date" | "time", TKey>>;

// Egyptian mobile: 010/011/012/015 followed by 8 digits, optional +20 / 0020 prefix.
const EG_PHONE = /^(?:\+?20|0020)?0?1[0125][0-9]{8}$/;

export function BookingForm() {
  const { t, dir } = useI18n();
  const { preselectedService, clearService } = useBooking();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (preselectedService) setService(preselectedService);
  }, [preselectedService]);

  const today = new Date().toISOString().split("T")[0];

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
    try {
      const payload = {
        name: name.trim(),
        phone: phone.replace(/[\s-]/g, ""),
        service,
        date,
        time,
        notes: notes.trim(),
        submittedAt: new Date().toISOString(),
      };
      // Local persistence until Lovable Cloud is enabled in Phase 2.
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("enamel-bookings") || "[]");
        existing.unshift(payload);
        localStorage.setItem("enamel-bookings", JSON.stringify(existing));
      }
      trackLead({ service, value: 0, currency: "EGP" });
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
    setDate("");
    setTime("");
    setNotes("");
    setErrors({});
    setDone(false);
  }

  return (
    <section id="booking" className="section-pad">
      <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navBook")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("bookTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("bookSubtitle")}</p>

          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              {t("why4Body")}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              {t("why3Body")}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              {t("why2Body")}
            </li>
          </ul>
        </div>

        <div className="card-soft p-6 md:p-8">
          {done ? (
            <div className="grid place-items-center py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-deep">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {t("bookSuccessTitle")}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {t("bookSuccessBody")}
              </p>
              <button
                onClick={reset}
                className="mt-6 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                {t("bookSuccessAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
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

              <Field label={t("fieldService")} error={errors.service ? t(errors.service) : undefined}>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputCls}
                  dir={dir}
                >
                  <option value="">{t("fieldServicePh")}</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t(s.label)}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fieldDate")} error={errors.date ? t(errors.date) : undefined}>
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t("fieldTime")} error={errors.time ? t(errors.time) : undefined}>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputCls}
                    dir={dir}
                  >
                    <option value="">{t("fieldServicePh")}</option>
                    <option value="morning">{t("timeMorning")}</option>
                    <option value="afternoon">{t("timeAfternoon")}</option>
                    <option value="evening">{t("timeEvening")}</option>
                  </select>
                </Field>
              </div>

              <Field label={t("fieldNotes")}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("fieldNotesPh")}
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-deep px-6 py-3.5 text-sm font-medium text-deep-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {submitting ? t("bookSubmitting") : t("bookSubmit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

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
