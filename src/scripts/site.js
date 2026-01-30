const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.classList.add("is-ready");

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(
    document.querySelectorAll("section[data-section]"),
  );
  const avatars = Array.from(document.querySelectorAll("[data-avatar]"));

  const initAvatars = () => {
    avatars.forEach((avatar) => {
      const img = avatar.querySelector("img");
      const fallback = avatar.querySelector(".avatar-fallback");
      const initials = avatar.dataset.initials || "AM";
      if (fallback) {
        fallback.textContent = initials;
      }
      const showFallback = () => {
        avatar.classList.add("is-fallback");
        if (fallback) {
          fallback.removeAttribute("aria-hidden");
        }
        if (img) {
          img.hidden = true;
          img.setAttribute("aria-hidden", "true");
        }
      };
      const swapToFallbackGraphic = () => {
        if (!img) return false;
        const fallbackSrc = img.dataset.fallback;
        if (!fallbackSrc) return false;
        img.src = fallbackSrc;
        img.removeAttribute("data-fallback");
        img.hidden = false;
        img.removeAttribute("aria-hidden");
        return true;
      };
      if (!img) {
        showFallback();
        return;
      }
      const handleError = () => {
        if (swapToFallbackGraphic()) {
          img.addEventListener("error", showFallback, { once: true });
          return;
        }
        showFallback();
      };
      img.addEventListener("error", handleError, { once: true });
      if (img.complete && img.naturalWidth === 0) {
        handleError();
      }
    });
  };

  initAvatars();

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("open", !expanded);
  });

  const closeMobileNav = () => {
    navToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("open");
  };

  const highlightSection = (target) => {
    if (!target) return;
    target.classList.add("is-anchor-target");
    window.setTimeout(() => target.classList.remove("is-anchor-target"), 1400);
  };

  const updateActiveNav = (id) => {
    navLinks.forEach((link) => {
      const targetId = (link.getAttribute("href") || "").replace("#", "");
      const isActive = targetId === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveNav(entry.target.id);
          }
        });
      },
      { threshold: 0.45, rootMargin: "-35% 0px -45% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }

  const scrollLinks = Array.from(document.querySelectorAll("[data-scroll]"));
  scrollLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (link.classList.contains("nav-link")) {
        closeMobileNav();
      }
      const behavior = prefersReducedMotion.matches ? "auto" : "smooth";
      target.scrollIntoView({ behavior, block: "start" });
      window.setTimeout(
        () => highlightSection(target),
        prefersReducedMotion.matches ? 0 : 900,
      );
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    });
  });

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }
});
