import { useI18n } from "@/lib/i18n";
import { Globe, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const { t, lang, setLang } = useI18n();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-deep font-bold">
              E
            </span>
            <span className="font-semibold tracking-tight">{t("brand")}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footerTagline")}</p>
        </div>

        <FCol title={t("footerQuick")}>
          <FLink href="#why">{t("navWhy")}</FLink>
          <FLink href="#services">{t("navServices")}</FLink>
          <FLink href="#doctor">{t("navDoctor")}</FLink>
          <FLink href="#faq">{t("navFaq")}</FLink>
        </FCol>

        <FCol title={t("footerContact")}>
          <p className="text-sm text-muted-foreground">{t("locAddress")}</p>
          <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
            {t("locPhone")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("locHours")}</p>
        </FCol>

        <FCol title={t("footerFollow")}>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:bg-accent"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:bg-accent"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("langToggle")}
          </button>
        </FCol>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} {t("brand")}. {t("footerRights")}
          </span>
          <span>Obour City · Cairo</span>
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block text-sm text-muted-foreground hover:text-foreground">
      {children}
    </a>
  );
}
