import { useI18n } from "@/lib/i18n";
import { ArrowRight, MessageCircle, Star } from "lucide-react";

const WA_LINK = "https://wa.me/201000000000";

export function Hero() {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? null : ArrowRight;

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 60%), radial-gradient(40% 30% at 0% 100%, color-mix(in oklab, var(--color-mint) 60%, transparent), transparent 70%)",
        }}
      />
      <div className="container-page section-pad grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("heroEyebrow")}
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3.5 text-sm font-medium text-deep-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
            >
              {t("heroCta")}
              {Arrow && <Arrow className="h-4 w-4" />}
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              {t("heroSecondary")}
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            <Stat value="10+" label={t("trustYears")} />
            <Stat value="5,000+" label={t("trustPatients")} />
            <Stat
              value={
                <span className="inline-flex items-center gap-1">
                  4.9
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </span>
              }
              label={t("trustRating")}
            />
          </dl>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="text-2xl font-semibold text-foreground md:text-3xl">{value}</dt>
      <dd className="mt-1 text-xs leading-tight text-muted-foreground">{label}</dd>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary/15"
      />
      <div className="card-soft relative overflow-hidden rounded-[2rem] p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-deep">
              <ToothIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Enamel · Obour</p>
              <p className="text-sm font-semibold text-foreground">Today's availability</p>
            </div>
          </div>
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-deep">
            Live
          </span>
        </div>

        <div className="mt-7 space-y-3">
          {[
            { t: "10:30 AM", v: "Open" },
            { t: "1:00 PM", v: "1 slot" },
            { t: "4:30 PM", v: "Open" },
            { t: "7:00 PM", v: "Open" },
          ].map((s) => (
            <div
              key={s.t}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">{s.t}</span>
              <span className="text-xs text-primary">{s.v}</span>
            </div>
          ))}
        </div>

        <a
          href="#booking"
          className="mt-6 block w-full rounded-xl bg-deep py-3 text-center text-sm font-medium text-deep-foreground transition-opacity hover:opacity-90"
        >
          Reserve a slot
        </a>
      </div>
    </div>
  );
}

function ToothIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 3c-2.5 0-4 2-4 5 0 3 1 4 1.5 7 .3 1.8.5 6 2.5 6 1.5 0 1.7-3 3-3s1.5 3 3 3c2 0 2.2-4.2 2.5-6 .5-3 1.5-4 1.5-7 0-3-1.5-5-4-5-1.5 0-2.5 1-3 1s-1.5-1-3-1z" strokeLinejoin="round" />
    </svg>
  );
}
