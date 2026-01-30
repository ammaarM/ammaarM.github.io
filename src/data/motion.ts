/**
 * Motion system constants for consistent animation across the site.
 * All animations respect prefers-reduced-motion.
 */

export const MOTION = {
  // Durations (ms)
  duration: {
    fast: 200,
    base: 400,
    slow: 600,
  },

  // Easing curves (matching CSS custom properties where possible)
  easing: {
    spring: "cubic-bezier(0.22, 1, 0.36, 1)",
    soft: "cubic-bezier(0.19, 1, 0.22, 1)",
    ease: "ease-out",
  },

  // Stagger timing for sequential reveals (ms)
  stagger: {
    tight: 60,
    base: 100,
    loose: 150,
  },

  // IntersectionObserver thresholds
  threshold: {
    immediate: 0.1,
    half: 0.5,
  },
} as const;

export type Motion = typeof MOTION;
