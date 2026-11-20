import { useI18n } from "@/lib/i18n";
import { GraduationCap, BadgeCheck, Award } from "lucide-react";
import drPhoto from "@/assets/dr-mohamed-ibrahim.jpeg.asset.json";

export function Doctor() {
  const { t } = useI18n();
  const creds = [
    { icon: GraduationCap, key: "doctorCred1" as const },
    { icon: BadgeCheck, key: "doctorCred2" as const },
    { icon: Award, key: "doctorCred3" as const },
  ];

  return (
    <section id="doctor" className="section-pad">
      <div className="container-page grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary-soft"
          />
          <div className="card-soft aspect-[4/5] overflow-hidden p-0">
            <img
              src={drPhoto.url}
              alt={t("doctorName")}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("doctorTitle")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("doctorName")}
          </h2>
          <p className="mt-1 text-sm font-medium text-primary">{t("doctorRole")}</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{t("doctorBio")}</p>

          <ul className="mt-8 space-y-3">
            {creds.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-deep">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
