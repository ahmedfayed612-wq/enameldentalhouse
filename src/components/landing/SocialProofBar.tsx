import { useI18n } from "@/lib/i18n";
import { Star, Users, Award } from "lucide-react";

export function SocialProofBar() {
  const { t } = useI18n();
  return (
    <section aria-label="social-proof" className="border-y border-border bg-primary-soft/40">
      <div className="container-page grid grid-cols-3 gap-3 py-5 md:py-6">
        <Item icon={<Star className="h-4 w-4 fill-primary text-primary" />} value="4.9★" label={t("trustRating")} />
        <Item icon={<Users className="h-4 w-4 text-primary" />} value="6,000+" label={t("trustPatients")} />
        <Item icon={<Award className="h-4 w-4 text-primary" />} value="12+" label={t("trustYears")} />
      </div>
    </section>
  );
}

function Item({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-base font-semibold text-foreground sm:text-lg">{value}</span>
      </div>
      <span className="text-[10px] leading-tight text-muted-foreground sm:text-xs">{label}</span>
    </div>
  );
}
