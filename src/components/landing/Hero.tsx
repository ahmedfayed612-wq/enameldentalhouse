import { useI18n } from "@/lib/i18n";
import { ArrowRight, MessageCircle } from "lucide-react";
import { GoogleBadge } from "./GoogleBadge";
import { LiveAvailabilityCard } from "./LiveAvailabilityCard";
import { CLINIC } from "@/lib/availability";

const WA_LINK = `https://wa.me/${CLINIC.whatsapp}`;

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
      <div className="container-page section-pad grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("heroEyebrow")}
          </span>

          <div className="mt-4">
            <GoogleBadge />
          </div>

          <h1 className="mt-5 text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-deep px-6 py-3.5 text-sm font-medium text-deep-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
            >
              {t("heroCta")}
              {Arrow && <Arrow className="h-4 w-4" />}
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              {t("heroSecondary")}
            </a>
          </div>

          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6 sm:gap-6">
            <Stat value="10+" label={t("trustYears")} />
            <Stat value="5,000+" label={t("trustPatients")} />
            <Stat value="4.9★" label={t("trustRating")} />
          </dl>
        </div>

        <LiveAvailabilityCard />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">{value}</dt>
      <dd className="mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">{label}</dd>
    </div>
  );
}
