import { useI18n } from "@/lib/i18n";
import { Stethoscope, Sparkles, BadgeDollarSign, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TKey } from "@/lib/translations";

const items: Array<{ icon: LucideIcon; title: TKey; body: TKey }> = [
  { icon: Stethoscope, title: "why1Title", body: "why1Body" },
  { icon: Sparkles, title: "why2Title", body: "why2Body" },
  { icon: BadgeDollarSign, title: "why3Title", body: "why3Body" },
  { icon: Clock, title: "why4Title", body: "why4Body" },
];

export function WhyEnamel() {
  const { t } = useI18n();
  return (
    <section id="why" className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navWhy")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("whyTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("whySubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="card-soft group p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-deep transition-colors group-hover:bg-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{t(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
