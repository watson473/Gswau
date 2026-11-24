import { NEW_WINDOW_DAYS } from "@/lib/new-drop";
import { useT } from "@/i18n";

// Alux-style mark: a small amber rectangle and the word NEW in dark capitals.
// The word is the signal. Color repeats it.
export function NewRibbon({ hint }: { hint?: string }) {
  const { t } = useT();
  return (
    <span
      className="inline-flex shrink-0 items-center bg-[#F59E0B] px-1.5 py-[3px] font-sans text-[0.625rem] font-bold uppercase leading-none tracking-[0.12em] text-navy-deep"
      title={hint ?? t("badge.new.title", { days: NEW_WINDOW_DAYS })}
    >
      {t("badge.new")}
    </span>
  );
}
