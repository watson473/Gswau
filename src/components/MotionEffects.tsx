import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Scroll motion for the whole site, added without touching each page's markup:
//  - reveal: blocks and cards below the fold fade in and glide up as they arrive
//  - parallax: elements marked data-parallax drift slightly as they scroll past
// Nothing runs when the device asks for reduced motion. Content that is already on screen when
// a page opens is never hidden, so there is no flash.

// React marks every element it has finished attaching to. Touching an element before that makes
// the page warn about a mismatch, so effects wait for it.
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

const REVEAL_SELECTOR = "main section > div > *, main article > *";
const STAGGER_MS = 90;

function revealTargets(root: ParentNode): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const el of root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)) {
    // Grids and carousels reveal as a group; a plain grid's children reveal one after another.
    if (el.matches(".grid") && !el.closest("[data-carousel]"))
      out.push(...(Array.from(el.children) as HTMLElement[]));
    else out.push(el);
  }
  return out.filter(
    (el) => !el.closest("[data-carousel] [data-slide]") && !el.hasAttribute("data-no-reveal"),
  );
}

export function MotionEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll reveal, re-run on every page change and whenever the page adds content.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("in");
          // Once it has arrived, drop the reveal styles so hover effects behave normally.
          const done = () => {
            el.classList.remove("reveal", "in");
            el.style.removeProperty("--reveal-delay");
          };
          el.addEventListener("transitionend", done, { once: true });
          setTimeout(done, 1800);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    let retry = 0;
    let retries = 0;
    const scan = () => {
      const fold = window.innerHeight;
      const fresh = revealTargets(document).filter((el) => !seen.has(el));
      let waiting = false;
      for (const el of fresh) {
        if (!isHydrated(el)) {
          waiting = true;
          continue;
        }
        seen.add(el);
        if (el.getBoundingClientRect().top < fold * 0.95) continue; // already in view: leave it
        // Neighbours in the same grid arrive one after another.
        const siblings = el.parentElement ? [...el.parentElement.children] : [];
        const index = el.parentElement?.matches(".grid") ? siblings.indexOf(el) : 0;
        el.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * STAGGER_MS}ms`);
        el.classList.add("reveal");
        io.observe(el);
      }
      // Parts of the page can finish loading a moment later; look again shortly.
      if (waiting && retries++ < 40) retry = window.setTimeout(scan, 150);
    };

    const frame = requestAnimationFrame(scan);
    let timer = 0;
    const main = document.querySelector("main");
    const mo = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 120);
    });
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.clearTimeout(retry);
      mo.disconnect();
      io.disconnect();
      for (const el of document.querySelectorAll(".reveal")) el.classList.remove("reveal", "in");
    };
  }, [pathname]);

  // Parallax: one scroll listener, only for elements currently on screen.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement);
          else visible.delete(e.target as HTMLElement);
        }
        update();
      },
      { rootMargin: "120px 0px" },
    );
    const watched = new WeakSet<Element>();
    const watch = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
        if (watched.has(el)) continue;
        watched.add(el);
        io.observe(el);
      }
    };

    let ticking = false;
    function update() {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of visible) {
        if (!isHydrated(el)) continue;
        const kind = el.dataset["parallax"];
        if (kind === "hero") {
          // The hero photo drifts down slower than the page; it is oversized to cover the gap.
          el.style.transform = `translate3d(0, ${Math.round(window.scrollY * 0.1)}px, 0)`;
        } else {
          // Book covers float a few pixels depending on where they sit in the window.
          const r = el.getBoundingClientRect();
          const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
          el.style.translate = `0 ${(p * 8).toFixed(1)}px`;
        }
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    watch();
    const mo = new MutationObserver(watch);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
