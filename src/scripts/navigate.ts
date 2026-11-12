const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

/** Scrolls to an in-page section and moves focus there, respecting reduced motion. */
export function goToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}

/** Anchor links marked `data-scroll` use `goToSection` instead of a jump. */
export function initScrollLinks() {
  document
    .querySelectorAll<HTMLAnchorElement>("a[data-scroll]")
    .forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("#")) return;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        goToSection(href.slice(1));
      });
    });
}
