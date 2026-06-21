import { useI18n } from "@/lib/i18n";

export function Gallery() {
  const { t } = useI18n();
  const slots = [0, 1, 2, 3, 4, 5];
  return (
    <section id="results" className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navResults")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("resultsTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("resultsSubtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {slots.map((i) => (
            <figure
              key={i}
              className="card-soft group relative aspect-[4/5] overflow-hidden p-0"
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 14%, var(--color-card)) 0%, color-mix(in oklab, var(--color-mint) 60%, var(--color-card)) 100%)",
                }}
              />
              <div className="relative flex h-full flex-col justify-between p-5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-deep/70">
                  <span>{t("resultsBefore")}</span>
                  <span className="rounded-full bg-card px-2 py-0.5">{t("resultsAfter")}</span>
                </div>
                <div className="text-xs text-deep/60">Case #{i + 1}</div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
