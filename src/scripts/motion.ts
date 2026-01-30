/**
 * Scroll reveal system using IntersectionObserver.
 * Respects prefers-reduced-motion and applies stagger animations.
 */

import { MOTION } from "../data/motion";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

/**
 * Initialize scroll reveal for elements with data-reveal attribute
 */
export function initReveal() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll("[data-reveal], [data-reveal-item], [data-animate], [data-animate-group]")
      .forEach((el) => {
        (el as HTMLElement).classList.add("is-revealed");
      });
    return;
  }
  if (prefersReducedMotion.matches) {
    // Skip animations for users who prefer reduced motion
    document
      .querySelectorAll("[data-reveal], [data-reveal-item]")
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;

          // Handle grouped reveals (with stagger)
          if (target.hasAttribute("data-reveal")) {
            const items = target.querySelectorAll(
              "[data-animate], [data-animate-group]",
            );
            if (items.length > 0) {
              items.forEach((item, index) => {
                const delay = index * MOTION.stagger.base;
                setTimeout(() => {
                  (item as HTMLElement).classList.add("is-revealed");
                }, delay);
              });
            }
            target.classList.add("is-revealed");
          }

          // Handle individual card reveals
          if (target.hasAttribute("data-reveal-item")) {
            target.classList.add("is-revealed");
          }

          revealObserver.unobserve(target);
        }
      });
    },
    {
      threshold: MOTION.threshold.immediate,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  // Observe all reveal targets
  document
    .querySelectorAll("[data-reveal], [data-reveal-item]")
    .forEach((el) => {
      revealObserver.observe(el);
    });
}

/**
 * Initialize parallax effect for elements with data-parallax attribute
 */
export function initParallax() {
  if (prefersReducedMotion.matches) {
    return;
  }

  const parallaxElements = Array.from(
    document.querySelectorAll("[data-parallax]"),
  );
  if (parallaxElements.length === 0) return;

  let rafId: number | null = null;

  const updateParallax = () => {
    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = elementCenter - viewportCenter;

      // Subtle parallax: only apply when element is near viewport
      if (Math.abs(distance) < window.innerHeight) {
        const speed = 0.05; // Very subtle
        const offset = distance * speed;
        (el as HTMLElement).style.transform = `translateY(${offset}px)`;
      }
    });
    rafId = null;
  };

  const onScroll = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateParallax);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateParallax(); // Initial call
}
