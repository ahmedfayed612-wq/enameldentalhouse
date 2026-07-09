import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Globe, Menu, X } from "lucide-react";

const WA_LINK = "https://wa.me/201000268550";

const navLinks: Array<{ key: "navWhy" | "navServices" | "navResults" | "navDoctor" | "navFaq" | "navContact"; href: string }> = [
  { key: "navWhy", href: "#why" },
  { key: "navServices", href: "#services" },
  { key: "navResults", href: "#results" },
  { key: "navDoctor", href: "#doctor" },
  { key: "navFaq", href: "#faq" },
  { key: "navContact", href: "#contact" },
];

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-deep">
            <span className="text-base font-bold">E</span>
          </span>
          <span className="hidden sm:inline">{t("brand")}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("langToggle")}
          </button>
          <a
            href="#booking"
            className="hidden rounded-full bg-deep px-4 py-2 text-sm font-medium text-deep-foreground transition-transform hover:scale-[1.02] md:inline-flex"
          >
            {t("navBook")}
          </a>
          <button
            className="rounded-md p-2 text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-3">
            {navLinks.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground"
              >
                {t(l.key)}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-deep px-4 py-2 text-center text-sm font-medium text-deep-foreground"
            >
              {t("navBook")}
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-foreground"
            >
              {t("heroSecondary")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
