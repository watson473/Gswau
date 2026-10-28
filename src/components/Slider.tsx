import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useT } from "@/i18n";

// A sideways carousel: swipe or drag, glides on its own every few seconds, dots underneath.
// It pauses while the pointer is over it, while it is being touched, while the page is hidden or
// the carousel is off screen, and never moves by itself when the device asks for reduced motion.
// `slideClass` sets each slide's width (e.g. "basis-1/2 md:basis-1/4").
export function Slider({
  children,
  slideClass,
  label,
  intervalMs = 5000,
}: {
  children: ReactNode[];
  slideClass: string;
  label: string;
  intervalMs?: number;
}) {
  const { t } = useT();
  const [viewport, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: "auto",
    duration: 32,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (!embla) return;
    const sync = () => {
      setSnaps(embla.scrollSnapList());
      setSelected(embla.selectedScrollSnap());
    };
    sync();
    embla.on("select", sync).on("reInit", sync);
    return () => {
      embla.off("select", sync).off("reInit", sync);
    };
  }, [embla]);

  // Glide on its own.
  useEffect(() => {
    if (!embla) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = !!e?.isIntersecting), {
      threshold: 0.3,
    });
    if (root.current) io.observe(root.current);
    const id = window.setInterval(() => {
      if (!paused.current && onScreen && document.visibilityState === "visible") embla.scrollNext();
    }, intervalMs);
    // Touching or dragging pauses it until the pointer leaves.
    const hold = () => (paused.current = true);
    embla.on("pointerDown", hold);
    return () => {
      window.clearInterval(id);
      io.disconnect();
      embla.off("pointerDown", hold);
    };
  }, [embla, intervalMs]);

  const pause = useCallback(() => (paused.current = true), []);
  const resume = useCallback(() => (paused.current = false), []);

  return (
    <div
      ref={root}
      data-carousel
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchEnd={() => window.setTimeout(resume, 4000)}
    >
      {/* The padding gives hover lifts and shadows room inside the clipped area. */}
      <div ref={viewport} className="-my-6 overflow-hidden py-6">
        <div className="-ml-5 flex touch-pan-y sm:-ml-6">
          {children.map((child, i) => (
            <div
              key={i}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${children.length}`}
              className={`min-w-0 shrink-0 grow-0 pl-5 sm:pl-6 ${slideClass}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {snaps.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={t("slider.goTo", { n: i + 1 })}
              aria-current={i === selected}
              onClick={() => embla?.scrollTo(i)}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  i === selected ? "w-6 bg-gold" : "w-2 bg-current opacity-30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
