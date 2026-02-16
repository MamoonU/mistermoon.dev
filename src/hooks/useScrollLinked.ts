import { useRef, useEffect, type RefObject } from "react";

const DESKTOP_BP = 900; // matches MUI theme "md"

/**
 * Keeps an SVG panel visually fixed within its parent section while the user
 * scrolls through that section, then lets it scroll away naturally once the
 * section ends.
 *
 * Uses optimized rendering with requestAnimationFrame and CSS transform
 * for smooth, jitter-free scrolling.
 *
 * @param sectionRef  ref on the containing section element
 * @param panelRef    ref on the inner panel that receives translateY
 */
export function useScrollLinked(
  sectionRef: RefObject<HTMLDivElement | null>,
  panelRef:   RefObject<HTMLDivElement | null>,
) {
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const panel   = panelRef.current;
      if (!section || !panel) return;

      // Mobile: clear any stale transform and let CSS sticky take over
      if (window.innerWidth < DESKTOP_BP) {
        panel.style.transform = "";
        panel.style.willChange = "";
        return;
      }

      const vh       = window.innerHeight;
      const sTop     = section.offsetTop;
      const sHeight  = section.offsetHeight;
      const idealTop = window.scrollY - sTop;
      const maxTop   = Math.max(0, sHeight - vh);
      const clamped  = Math.max(0, Math.min(idealTop, maxTop));

      // Use transform3d for hardware acceleration and smoother rendering
      panel.style.transform = `translate3d(0, ${clamped}px, 0)`;
      panel.style.willChange = "transform";
      
      lastScrollY.current = window.scrollY;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update(); // set correct position before first scroll

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // refs are stable, no deps needed
}