import { windows } from "../data/sections";
import { SECTION_NAVIGATE_EVENT } from "./navigate";

/**
 * Status-bar behaviour: scroll-spy over the numbered windows, tmux's
 * "active pane" highlight, and the London clock.
 */
export function initStatusBar() {
  const links = new Map(
    Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-window]"),
    ).map((link) => [link.dataset.window ?? "", link]),
  );
  const targets = windows
    .map(({ id }) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  const panes = Array.from(
    document.querySelectorAll<HTMLElement>(".session [data-pane]"),
  );

  let currentWindow = "";
  let currentPane: HTMLElement | null = null;
  /**
   * Section the visitor explicitly jumped to. Short sections near the end of
   * the page can't scroll to the top, so plain scroll-spy would mark the last
   * window instead; the jump target stays active until the visitor scrolls.
   */
  let pinned: HTMLElement | null = null;

  const setWindow = (id: string) => {
    if (id === currentWindow) return;
    currentWindow = id;
    links.forEach((link, key) => {
      const active = key === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    // On phones the window list scrolls sideways: keep the active one in view.
    const link = links.get(id);
    const strip = link?.closest<HTMLElement>(".sb-nav");
    if (link && strip && strip.scrollWidth > strip.clientWidth) {
      const left = link.offsetLeft;
      const right = left + link.offsetWidth;
      if (left < strip.scrollLeft) strip.scrollLeft = left;
      else if (right > strip.scrollLeft + strip.clientWidth) {
        strip.scrollLeft = right - strip.clientWidth;
      }
    }
  };

  const setPane = (pane: HTMLElement | null) => {
    if (pane === currentPane) return;
    currentPane?.classList.remove("is-active");
    pane?.classList.add("is-active");
    currentPane = pane;
  };

  const update = () => {
    if (pinned) {
      setWindow(pinned.id);
      setPane(pinned.querySelector<HTMLElement>("[data-pane]"));
      return;
    }
    const line = window.innerHeight * 0.3;
    let active = targets[0];
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= line) active = target;
    }
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) active = targets[targets.length - 1];
    if (active) setWindow(active.id);

    // Active pane (exactly one): the first pane crossing 40% of the viewport
    // height, or the last pane once the page can't scroll further.
    const probe = window.innerHeight * 0.4;
    let best: HTMLElement | null = atBottom ? (panes.at(-1) ?? null) : null;
    if (!best) {
      best =
        panes.find((pane) => {
          const rect = pane.getBoundingClientRect();
          return rect.top <= probe && rect.bottom >= probe;
        }) ?? null;
    }
    setPane(best);
  };

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };
  window.addEventListener("scroll", schedule, { passive: true });

  window.addEventListener(SECTION_NAVIGATE_EVENT, (event) => {
    if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
      return;
    }
    pinned = document.getElementById(event.detail);
    schedule();
  });
  const SCROLL_KEYS = new Set([
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
  ]);
  const unpin = () => {
    if (!pinned) return;
    pinned = null;
    schedule();
  };
  window.addEventListener("wheel", unpin, { passive: true });
  window.addEventListener("touchmove", unpin, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (SCROLL_KEYS.has(event.key)) unpin();
  });

  const strip = document.querySelector<HTMLElement>(".sb-nav");
  if (strip) {
    const markOverflow = () =>
      strip.classList.toggle(
        "has-more",
        strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 2,
      );
    strip.addEventListener("scroll", markOverflow, { passive: true });
    window.addEventListener("resize", markOverflow);
    markOverflow();
  }
  window.addEventListener("resize", schedule);
  update();

  initClock();
  initModKey();
}

function initClock() {
  const clock = document.querySelector<HTMLTimeElement>("[data-clock]");
  if (!clock) return;
  const format = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
  });
  const tick = () => {
    clock.textContent = format.format(new Date());
  };
  tick();
  // Re-align to the minute boundary, then tick every minute.
  window.setTimeout(
    () => {
      tick();
      window.setInterval(tick, 60_000);
    },
    60_000 - (Date.now() % 60_000),
  );
}

function initModKey() {
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  if (!isMac) return;
  document.querySelectorAll<HTMLElement>("[data-mod-key]").forEach((el) => {
    el.textContent = "⌘";
  });
}
