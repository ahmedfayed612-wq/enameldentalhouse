import { useI18n } from "@/lib/i18n";

export function Reviews() {
  const { t } = useI18n();
  return (
    <section id="reviews" className="section-pad bg-mint/30">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("navReviews")}
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-foreground md:text-4xl">
            {t("reviewsTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("reviewsSubtitle")}</p>
        </div>

        {/* SLOT: replace this block with the Google Reviews widget embed code. */}
        <div
          id="google-reviews-embed"
          className="card-soft mt-10 grid min-h-[260px] place-items-center p-10 text-sm text-muted-foreground"
        >
          {t("reviewsPlaceholder")}
        </div>
      </div>
    </section>
  );
}
