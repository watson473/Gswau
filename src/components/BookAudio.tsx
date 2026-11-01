import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AudioPlayer } from "@/components/EpisodePlayer";
import { useT } from "@/i18n";

// "Listen" and "Download audio" for an audiobook the visitor has access to. The file is private;
// each button asks for a short-lived link, which storage only gives to people with access.
export function BookAudio({
  slug,
  title,
  cover,
  audioPath,
  durationLabel,
  compact = false,
}: {
  slug: string;
  title: string;
  cover: string | null;
  audioPath: string;
  durationLabel?: string | null;
  compact?: boolean;
}) {
  const { t } = useT();
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function link(download: boolean) {
    const { data, error: e } = await supabase.storage
      .from("product-files")
      .createSignedUrl(
        audioPath,
        download ? 300 : 6 * 3600,
        download ? { download: `${slug}.mp3` } : undefined,
      );
    if (e || !data) throw e ?? new Error("no link");
    return data.signedUrl;
  }

  async function listen() {
    setError(false);
    setBusy(true);
    try {
      setUrl(await link(false));
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  async function download() {
    setError(false);
    try {
      window.location.href = await link(true);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="w-full">
      {url ? (
        <AudioPlayer
          url={url}
          title={title}
          image={compact ? null : cover}
          durationLabel={durationLabel ?? null}
          large={!compact}
          autoPlay
        />
      ) : (
        <button onClick={listen} disabled={busy} className="btn-gold w-full sm:w-auto">
          {busy ? t("library.loadingAudio") : t("library.listen")}
        </button>
      )}
      <button
        onClick={download}
        className={`btn-ghost w-full sm:w-auto ${url ? "mt-3" : compact ? "mt-2" : "mt-3 sm:ml-3 sm:mt-0"}`}
      >
        {t("library.downloadAudio")}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-crimson">
          {t("library.audioFailed")}
        </p>
      )}
    </div>
  );
}
