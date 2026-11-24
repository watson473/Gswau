import { NEW_WINDOW_DAYS } from "@/lib/new-drop";
import { useT } from "@/i18n";

// Small gold pill. The word is the signal; the color only repeats it.
export function NewBadge() {
  const { t } = useT();
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full bg-gold-gradient px-2 py-0.5 font-sans text-[0.65rem] font-bold uppercase leading-none tracking-[0.14em] text-navy-deep"
      title={t("badge.new.title", { days: NEW_WINDOW_DAYS })}
    >
      {t("badge.new")}
    </span>
  );
}
