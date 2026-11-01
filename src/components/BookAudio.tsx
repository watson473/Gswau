import { useRef, useState } from "react";
import { AudioPlayer } from "@/components/EpisodePlayer";
import { getAudiobookLink } from "@/lib/audiobook.functions";
import { useT } from "@/i18n";

// "Listen" (members and buyers) and "Download audio" (buyers only) for an audiobook. The files are
// private: the server checks access and returns a link that expires after 30 minutes; when one
// runs out mid-listen the player quietly gets a fresh one and carries on where it was.
export function BookAudio({
  productId,
  slug,
  title,
  cover,
  durationLabel,
  canDownload,
  compact = false,
}: {
  productId: string;
  slug: string;
  title: string;
  cover: string | null;
  durationLabel?: string | null;
  canDownload: boolean;
  compact?: boolean;
}) {
  const { t } = useT();
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const refreshing = useRef(false);

  const link = async (download: boolean) =>
    (await getAudiobookLink({ data: { productId, download } })).url;

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

  async function refresh() {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      setUrl(await link(false));
    } catch {
      setError(true);
    }
    refreshing.current = false;
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
    <div className="w-full" data-audio={slug}>
      {url ? (
        <AudioPlayer
          url={url}
          title={title}
          image={compact ? null : cover}
          durationLabel={durationLabel ?? null}
          large={!compact}
          autoPlay
          onSourceError={refresh}
        />
      ) : (
        <button onClick={listen} disabled={busy} className="btn-gold w-full sm:w-auto">
          {busy ? t("library.loadingAudio") : t("library.listen")}
        </button>
      )}
      {canDownload && (
        <button
          onClick={download}
          className={`btn-ghost w-full sm:w-auto ${url ? "mt-3" : compact ? "mt-2" : "mt-3 sm:ml-3 sm:mt-0"}`}
        >
          {t("library.downloadAudio")}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-crimson">
          {t("library.audioFailed")}
        </p>
      )}
    </div>
  );
}
