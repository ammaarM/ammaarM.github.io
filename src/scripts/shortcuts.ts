import { windows } from "../data/sections";
import { goToSection } from "./navigate";
import { openPalette, togglePalette } from "./palette";
import { displayMessage } from "./display-message";

/**
 * lazygit-style keys: 0–4 jump to windows, `:` or `/` open the palette, `?`
 * lists keys. Single-key shortcuts can be switched off (WCAG 2.1.4) and never
 * fire while typing.
 */

const STORAGE_KEY = "shortcuts";

const readEnabled = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target.closest("input, textarea, select") !== null);

export function openHelp() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-help]");
  if (dialog && !dialog.open) dialog.showModal();
}

export function initShortcuts() {
  let enabled = readEnabled();

  const toggle = document.querySelector<HTMLInputElement>(
    "[data-shortcuts-toggle]",
  );
  if (toggle) {
    toggle.checked = enabled;
    toggle.addEventListener("change", () => {
      enabled = toggle.checked;
      try {
        localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
      } catch {
        /* preference just won't persist */
      }
      displayMessage(`single-key shortcuts ${enabled ? "on" : "off"}`);
    });
  }

  const help = document.querySelector<HTMLDialogElement>("[data-help]");
  help?.addEventListener("click", (event) => {
    if (event.target === help) help.close();
  });
  document
    .querySelectorAll<HTMLButtonElement>("[data-open-help]")
    .forEach((button) => button.addEventListener("click", openHelp));

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.isComposing) return;

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePalette();
      return;
    }

    if (document.querySelector("dialog[open]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!enabled || isTyping(event.target)) return;

    const win = windows.find(({ key }) => key === event.key);
    if (win) {
      event.preventDefault();
      goToSection(win.id);
      return;
    }
    if (event.key === ":" || event.key === "/") {
      event.preventDefault();
      openPalette();
    } else if (event.key === "?") {
      event.preventDefault();
      openHelp();
    }
  });
}
