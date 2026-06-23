import { useI18n } from "@/lib/i18n";
import { Play } from "lucide-react";

/**
 * TODO: Drop real patient videos into the `src` field of each slot below.
 * Each card is vertical (9:16). Keep videos short (15-45s) for mobile feed feel.
 */
const SLOTS: Array<{ name: string; caption: string; src?: string; poster?: string }> = [
  { name: "منى", caption: "تجربتي مع تبييض الأسنان" },
  { name: "أحمد", caption: "زراعة بدون ألم" },
  { name: "سارة", caption: "تقويم شفاف في ٨ شهور" },
  { name: "كريم", caption: "أول كشف بعد سنين" },
];

export function VideoTestimonials() {
  const { t } = useI18n();
  return (
    <section id="video-testimonials" className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navReviews")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("videoTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("videoSubtitle")}</p>
        </div>

        <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 snap-x snap-mandatory">
            {SLOTS.map((s, i) => (
              <article
                key={i}
                className="snap-start shrink-0 w-[260px] sm:w-[280px]"
              >
                <div className="card-soft relative aspect-[9/16] overflow-hidden p-0">
                  {/* TODO: replace placeholder with <video src={s.src} poster={s.poster} controls playsInline /> */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, color-mix(in oklab, var(--color-primary) 30%, var(--color-deep)) 0%, color-mix(in oklab, var(--color-deep) 80%, transparent) 100%)",
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Play video"
                    className="absolute inset-0 grid place-items-center text-deep-foreground"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-card/95 text-deep shadow-[var(--shadow-elevated)]">
                      <Play className="h-6 w-6 fill-current" />
                    </span>
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-deep-foreground">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs opacity-90">{s.caption}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
