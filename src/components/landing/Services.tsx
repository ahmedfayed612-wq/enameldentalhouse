import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-store";
import { Stethoscope, Sparkles, Smile, Anchor, Wand2, Siren, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TKey } from "@/lib/translations";

export const SERVICE_OPTIONS: Array<{
  id: string;
  label: TKey;
  desc: TKey;
  icon: LucideIcon;
}> = [
  { id: "checkup", label: "svcCheckup", desc: "svcCheckupDesc", icon: Stethoscope },
  { id: "whitening", label: "svcWhitening", desc: "svcWhiteningDesc", icon: Sparkles },
  { id: "braces", label: "svcBraces", desc: "svcBracesDesc", icon: Smile },
  { id: "implants", label: "svcImplants", desc: "svcImplantsDesc", icon: Anchor },
  { id: "cosmetic", label: "svcCosmetic", desc: "svcCosmeticDesc", icon: Wand2 },
  { id: "emergency", label: "svcEmergency", desc: "svcEmergencyDesc", icon: Siren },
];

export function Services() {
  const { t } = useI18n();
  const { selectService } = useBooking();

  return (
    <section id="services" className="section-pad bg-mint/30">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navServices")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("servicesTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("servicesSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_OPTIONS.map(({ id, label, desc, icon: Icon }) => (
            <button
              key={id}
              onClick={() => selectService(id)}
              className="card-soft group flex h-full flex-col p-6 text-start transition-all hover:-translate-y-0.5 hover:border-primary/60"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-deep">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{t(label)}</h3>
              <p className="mt-2 grow text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {t("svcBook")}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
