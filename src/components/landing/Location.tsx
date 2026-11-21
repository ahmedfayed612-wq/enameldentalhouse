import { useI18n } from "@/lib/i18n";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/201000268550";

export function Location() {
  const { t } = useI18n();
  return (
    <section id="contact" className="section-pad bg-mint/30">
      <div className="container-page grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navContact")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("locTitle")}
          </h2>

          <dl className="mt-8 space-y-5 text-sm">
            <Row icon={MapPin} label={t("locAddressLabel")} value={t("locAddress")} />
            <Row icon={Clock} label={t("locHoursLabel")} value={t("locHours")} />
            <Row icon={Phone} label={t("locPhoneLabel")} value={t("locPhone")} ltr />
          </dl>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3 text-sm font-medium text-deep-foreground hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            {t("locWhatsapp")}
          </a>
        </div>

        <div id="google-map-embed" className="card-soft min-h-[280px] overflow-hidden p-0">
          <iframe
            title="Enamel Dental House location"
            src="https://www.google.com/maps?q=place_id:ChIJoTgIQEAbWBQR_1Vma-gl1kA&hl=ar&z=16&output=embed"
            className="h-full min-h-[280px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-deep">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-base font-medium text-foreground" dir={ltr ? "ltr" : undefined}>
          {value}
        </dd>
      </div>
    </div>
  );
}
