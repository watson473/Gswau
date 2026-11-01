import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getBookDownload, getBookPages } from "@/lib/book.functions";

// Full-screen flip book: opens on the cover; turn pages by clicking or dragging a corner,
// swiping on phones, the arrow buttons or the keyboard. Pages are images behind short-lived
// links (no download option, no right-click), so there is no file to save. Buyers also get a
// Download button.
export function FlipBook({
  productId,
  title,
  onClose,
}: {
  productId: string;
  title: string;
  onClose: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const flip = useRef<import("page-flip/dist/js/page-flip.module.js").PageFlip | null>(null);
  const [pages, setPages] = useState<string[] | null>(null);
  const [canDownload, setCanDownload] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Load the page links.
  useEffect(() => {
    getBookPages({ data: { productId } })
      .then((r) => {
        setPages(r.pages);
        setCanDownload(r.canDownload);
      })
      .catch(() => setError("This book couldn't be opened. Please try again."));
  }, [productId]);

  // Build the flip book once the pages are known.
  useEffect(() => {
    if (!pages || !stage.current) return;
    let book: import("page-flip/dist/js/page-flip.module.js").PageFlip | null = null;
    let cancelled = false;
    // The library removes its element when destroyed, so it gets its own inner one.
    const host = document.createElement("div");
    stage.current.appendChild(host);
    void import("page-flip/dist/js/page-flip.module.js").then(({ PageFlip }) => {
      if (cancelled) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      book = new PageFlip(host, {
        width: 864,
        height: 1296,
        size: "stretch",
        minWidth: 320, // narrower than two of these: one page at a time (phones)
        maxWidth: 864,
        minHeight: 300,
        maxHeight: 1296,
        showCover: true,
        usePortrait: true,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: reduce ? 250 : 800,
        mobileScrollSupport: false,
        swipeDistance: 30,
        showPageCorners: true,
      });
      book.on("flip", (e) => setPage(Number(e.data)));
      // Each page is an image in its own element (sharp on high-resolution screens).
      const els = pages.map((url, i) => {
        const el = document.createElement("div");
        el.className = "flip-page";
        if (i === 0 || i === pages.length - 1) el.dataset["density"] = "hard";
        const img = document.createElement("img");
        img.src = url;
        img.alt = "";
        img.draggable = false;
        el.appendChild(img);
        host.appendChild(el);
        return el;
      });
      book.loadFromHTML(els);
      flip.current = book;
    });
    return () => {
      cancelled = true;
      if (book) book.destroy();
      else host.remove();
      flip.current = null;
    };
  }, [pages]);

  // Keyboard, and no page scrolling behind the reader.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") flip.current?.flipNext();
      if (e.key === "ArrowLeft") flip.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  async function download() {
    setBusy(true);
    try {
      window.location.href = (await getBookDownload({ data: { productId } })).url;
    } catch {
      setError("The download couldn't start. Please try again.");
    }
    setBusy(false);
  }

  const total = pages?.length ?? 0;
  // Rendered at the end of <body>, so page animations can't trap or shift the full-screen reader.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-navy-deep text-primary-foreground"
    >
      <div className="flex items-center justify-between gap-3 border-b border-gold/20 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="truncate font-display text-lg">{title}</div>
          {total > 0 && (
            <div className="text-xs text-primary-foreground/60">
              Page {Math.min(page + 1, total)} of {total}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canDownload && (
            <button onClick={download} disabled={busy} className="btn-ghost !px-4 !py-2">
              {busy ? "Preparing…" : "Download"}
            </button>
          )}
          <button onClick={onClose} className="btn-gold !px-4 !py-2" aria-label="Close the book">
            Close
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 py-4 sm:px-14">
        {error ? (
          <p className="text-center text-sm">{error}</p>
        ) : !pages ? (
          <p className="text-sm text-primary-foreground/70">Opening the book…</p>
        ) : null}
        <div
          ref={stage}
          onContextMenu={(e) => e.preventDefault()}
          className="flipbook-stage"
          style={{ display: pages && !error ? undefined : "none" }}
        />
        {pages && !error && (
          <>
            <button
              onClick={() => flip.current?.flipPrev()}
              aria-label="Previous page"
              className="absolute left-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl hover:bg-gold hover:text-navy-deep sm:grid"
            >
              ‹
            </button>
            <button
              onClick={() => flip.current?.flipNext()}
              aria-label="Next page"
              className="absolute right-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl hover:bg-gold hover:text-navy-deep sm:grid"
            >
              ›
            </button>
          </>
        )}
      </div>
      <p className="pb-3 text-center text-xs text-primary-foreground/50 sm:hidden">
        Swipe or tap the page edges to turn
      </p>
    </div>,
    document.body,
  );
}
