import { windows } from "../data/sections";

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

  const setWindow = (id: string) => {
    if (id === currentWindow) return;
    currentWindow = id;
    links.forEach((link, key) => {
      const active = key === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const setPane = (pane: HTMLElement | null) => {
    if (pane === currentPane) return;
    currentPane?.classList.remove("is-active");
    pane?.classList.add("is-active");
    currentPane = pane;
  };

  const update = () => {
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

    // Active pane: the one showing the most of itself around the middle of the viewport.
    const bandTop = window.innerHeight * 0.25;
    const bandBottom = window.innerHeight * 0.65;
    let best: HTMLElement | null = null;
    let bestArea = 0;
    for (const pane of panes) {
      const rect = pane.getBoundingClientRect();
      const visible =
        Math.max(
          0,
          Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop),
        ) * rect.width;
      if (visible > bestArea) {
        bestArea = visible;
        best = pane;
      }
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
