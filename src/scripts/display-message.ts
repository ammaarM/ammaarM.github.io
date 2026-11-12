/**
 * tmux `display-message`: a short note shown in the status bar, then cleared.
 * The element is a polite live region, so screen readers hear it too.
 */
let timer: number | undefined;

export function displayMessage(text: string, ms = 2400) {
  const target = document.querySelector<HTMLElement>("[data-sb-msg]");
  if (!target) return;
  window.clearTimeout(timer);
  target.textContent = text;
  target.classList.add("is-visible");
  timer = window.setTimeout(() => {
    target.classList.remove("is-visible");
    target.textContent = "";
  }, ms);
}
