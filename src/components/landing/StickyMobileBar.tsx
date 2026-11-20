import { useI18n } from "@/lib/i18n";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/availability";

const WA_LINK = `https://wa.me/${CLINIC.whatsapp}`;

export function StickyMobileBar() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <a
          href="#booking"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          <CalendarCheck className="h-4 w-4" />
          {t("mobileBook")}
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-primary-soft px-4 py-3 text-sm font-semibold text-deep"
        >
          <MessageCircle className="h-4 w-4" />
          {t("mobileWa")}
        </a>
      </div>
    </div>
  );
}
