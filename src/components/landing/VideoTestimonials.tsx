import { useI18n } from "@/lib/i18n";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import testimonial1 from "@/assets/testimonial1.mp4.asset.json";
import testimonial1Poster from "@/assets/testimonial1-poster.jpg.asset.json";

/**
 * TODO: Drop more patient videos below. Keep short (15-45s) vertical clips.
 */
const SLOTS: Array<{ caption: string; src?: string; poster?: string }> = [
  { caption: "تجربتي مع تبييض الأسنان", src: testimonial1.url, poster: testimonial1Poster.url },
  { caption: "زراعة بدون ألم" },
  { caption: "تقويم شفاف في ٨ شهور" },
  { caption: "أول كشف بعد سنين" },
];

function VideoCard({ caption, src, poster }: { caption: string; src?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <article className="snap-start shrink-0 w-[260px] sm:w-[280px]">
      <div className="card-soft relative aspect-[9/16] overflow-hidden p-0">
        {src ? (
          <>
            <video
              ref={ref}
              src={src}
              poster={poster}
              playsInline
              controls={playing}
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover bg-deep"
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
            {!playing && (
              <button
                type="button"
                aria-label="Play video"
                onClick={play}
                className="absolute inset-0 grid place-items-center bg-black/10 text-deep-foreground"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-card/95 text-deep shadow-[var(--shadow-elevated)]">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              </button>
            )}
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in oklab, var(--color-primary) 30%, var(--color-deep)) 0%, color-mix(in oklab, var(--color-deep) 80%, transparent) 100%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center text-deep-foreground">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-card/95 text-deep shadow-[var(--shadow-elevated)]">
                <Play className="h-6 w-6 fill-current" />
              </span>
            </div>
          </>
        )}
        {!playing && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-deep-foreground">
            <p className="text-xs opacity-90">{caption}</p>
          </div>
        )}
      </div>
    </article>
  );
}

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
              <VideoCard key={i} caption={s.caption} src={s.src} poster={s.poster} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
