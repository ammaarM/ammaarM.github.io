import { initReveal } from "./motion";
import { initTypewriter } from "./typewriter";
import { initScrollLinks } from "./navigate";
import { initStatusBar } from "./statusbar";
import { initProjectsTable } from "./projects-table";
import { initPalette } from "./palette";
import { initShortcuts, openHelp } from "./shortcuts";
import { initShell } from "./shell";
import { copyText } from "./clipboard";
import { displayMessage } from "./display-message";

function initAvatars() {
  document.querySelectorAll<HTMLElement>("[data-avatar]").forEach((avatar) => {
    const img = avatar.querySelector<HTMLImageElement>("img");
    const fallback = avatar.querySelector<HTMLElement>(".avatar-fallback");
    const initials = avatar.dataset.initials || "AM";
    if (fallback) {
      fallback.textContent = initials;
    }
    const showFallback = () => {
      avatar.classList.add("is-fallback");
      fallback?.removeAttribute("aria-hidden");
      if (img) {
        img.hidden = true;
        img.setAttribute("aria-hidden", "true");
      }
    };
    const swapToFallbackGraphic = () => {
      const fallbackSrc = img?.dataset.fallback;
      if (!img || !fallbackSrc) return false;
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
    const handleLoad = () => img.classList.add("is-loaded");
    const handleError = () => {
      if (swapToFallbackGraphic()) {
        img.addEventListener("error", showFallback, { once: true });
        return;
      }
      showFallback();
    };
    img.addEventListener("load", handleLoad, { once: true });
    img.addEventListener("error", handleError, { once: true });
    if (img.complete && img.naturalWidth > 0) {
      handleLoad();
    } else if (img.complete && img.naturalWidth === 0) {
      handleError();
    }
  });
}

function initCopyButtons() {
  document
    .querySelectorAll<HTMLButtonElement>("button[data-copy]")
    .forEach((button) => {
      let timer = 0;
      button.addEventListener("click", async () => {
        const value = button.dataset.copy ?? "";
        const ok = await copyText(value);
        displayMessage(ok ? `copied ${value}` : `couldn't copy: ${value}`);
        if (!ok) return;
        // Swap the copy icon for a tick briefly; the status bar announces it.
        button.classList.add("is-copied");
        window.clearTimeout(timer);
        timer = window.setTimeout(
          () => button.classList.remove("is-copied"),
          1800,
        );
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");
  // Controls that only work with JS ship hidden so the no-JS page stays honest.
  document
    .querySelectorAll<HTMLElement>("[data-js-only]")
    .forEach((el) => (el.hidden = false));

  initReveal();
  initAvatars();
  initScrollLinks();
  initStatusBar();
  initProjectsTable();
  initPalette(openHelp);
  initShortcuts();
  initCopyButtons();
  void initTypewriter().then(initShell);

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }
});
