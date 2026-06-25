import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getGoogleReviews, type GoogleReviewsPayload } from "@/lib/google-reviews.functions";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const { t } = useI18n();
  const [data, setData] = useState<GoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getGoogleReviews()
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setData({ rating: null, total: null, reviews: [], url: null, error: "fetch_failed" });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const reviews = data?.reviews ?? [];
  const hasError = !loading && (data?.error || reviews.length === 0);

  return (
    <section id="reviews" className="section-pad bg-mint/30">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("navReviews")}
            </p>
            <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
              {t("reviewsTitle")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">{t("reviewsSubtitle")}</p>
          </div>

          {data?.rating != null && (
            <div className="flex items-center gap-3 rounded-xl bg-background/80 px-4 py-3 shadow-sm">
              <div className="text-2xl font-semibold text-foreground">{data.rating.toFixed(1)}</div>
              <div>
                <Stars rating={data.rating} />
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.total ?? 0} · {t("reviewsRatingSuffix")}
                </p>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="card-soft mt-10 grid min-h-[200px] place-items-center p-10 text-sm text-muted-foreground">
            {t("reviewsPlaceholder")}
          </div>
        )}

        {hasError && !loading && (
          <div className="card-soft mt-10 grid min-h-[160px] place-items-center p-10 text-sm text-muted-foreground">
            {t("reviewsError")}
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <>
            <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <article
                  key={i}
                  className="card-soft flex w-[85%] shrink-0 snap-start flex-col gap-3 p-5 md:w-auto"
                >
                  <div className="flex items-center gap-3">
                    {r.authorPhoto ? (
                      <img
                        src={r.authorPhoto}
                        alt=""
                        loading="lazy"
                        className="h-10 w-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {r.author.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{r.author}</p>
                      <p className="text-xs text-muted-foreground">{r.relativeTime}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">
                    {r.text}
                  </p>
                </article>
              ))}
            </div>

            {data?.url && (
              <div className="mt-6 text-center">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {t("reviewsViewAll")} →
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
