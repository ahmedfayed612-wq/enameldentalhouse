import { useI18n } from "@/lib/i18n";
import case1Before from "@/assets/case1-before.jpeg.asset.json";
import case1After from "@/assets/case1-after.jpeg.asset.json";
import case2Before from "@/assets/case2-before.jpeg.asset.json";
import case2After from "@/assets/case2-after.jpeg.asset.json";

type Case = { before: string; after: string };

const CASES: Case[] = [
  { before: case1Before.url, after: case1After.url },
  { before: case2Before.url, after: case2After.url },
];

export function Gallery() {
  const { t } = useI18n();
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

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CASES.map((c, i) => (
            <figure key={i} className="card-soft overflow-hidden p-0">
              <div className="grid grid-cols-1">
                <div className="relative aspect-[4/3]">
                  <img
                    src={c.before}
                    alt={`${t("resultsBefore")} — Case ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-deep">
                    {t("resultsBefore")}
                  </span>
                </div>
                <div className="relative aspect-[4/3]">
                  <img
                    src={c.after}
                    alt={`${t("resultsAfter")} — Case ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    {t("resultsAfter")}
                  </span>
                </div>
              </div>
              <figcaption className="flex items-center justify-between p-3 text-xs text-deep/70">
                <span>Case #{i + 1}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
