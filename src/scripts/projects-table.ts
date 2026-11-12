/**
 * `kubectl get projects` master/detail.
 * - Desktop: rows choose which detail the side pane shows. Every detail stays
 *   laid out in one grid cell, so the pane keeps the height of the tallest one
 *   and nothing below it moves while browsing.
 * - Mobile: each detail moves under its row as an accordion, all collapsed at
 *   first; the tapped row stays where the finger was.
 * - Without JS every detail is rendered, stacked, in the side pane.
 */

const MOBILE = window.matchMedia("(max-width: 767px)");
const HOVER = window.matchMedia("(hover: hover) and (pointer: fine)");
const HOVER_INTENT_MS = 140;

type SelectOptions = { reveal?: boolean };
let selectFn: ((slug: string, options?: SelectOptions) => void) | null = null;

/**
 * Selects a project from elsewhere. With `reveal`, scrolls it into view and
 * focuses its row (command palette); without, just updates the table (shell).
 */
export function showProject(slug: string, options: SelectOptions = {}) {
  selectFn?.(slug, options);
}

export function initProjectsTable() {
  const root = document.querySelector<HTMLElement>("[data-projects]");
  const container = root?.querySelector<HTMLElement>("[data-project-details]");
  if (!root || !container) return;

  const rows = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-project-row]"),
  );
  const details = new Map(
    Array.from(root.querySelectorAll<HTMLElement>("[data-project-detail]")).map(
      (el) => [el.dataset.projectDetail ?? "", el],
    ),
  );
  const title = root.querySelector<HTMLElement>("[data-project-title]");
  const slugOf = (row: HTMLButtonElement) => row.dataset.projectRow ?? "";
  const firstSlug = rows[0] ? slugOf(rows[0]) : null;

  let selected: string | null = MOBILE.matches
    ? null
    : (rows.find((row) => row.getAttribute("aria-expanded") === "true")?.dataset
        .projectRow ?? firstSlug);

  const render = () => {
    const inline = MOBILE.matches;
    rows.forEach((row) => {
      const slug = slugOf(row);
      const isSelected = slug === selected;
      row.setAttribute("aria-expanded", String(isSelected));
      const detail = details.get(slug);
      if (!detail) return;
      detail.classList.toggle("is-current", isSelected);
      // Mobile collapses with `hidden`; desktop keeps every detail laid out
      // and hides the others with `inert` + CSS visibility.
      detail.hidden = inline && !isSelected;
      detail.inert = !inline && !isSelected;
    });
    if (title && selected) title.textContent = `describe ${selected}`;
  };

  const layout = () => {
    const inline = MOBILE.matches;
    root.classList.toggle("is-inline", inline);
    root.classList.toggle("is-stacked", !inline);
    rows.forEach((row) => {
      const detail = details.get(slugOf(row));
      if (!detail) return;
      if (inline) row.after(detail);
      else container.append(detail);
    });
    if (!inline && !selected) selected = firstSlug;
    render();
  };

  const select = (slug: string, { reveal = false }: SelectOptions = {}) => {
    selected = slug;
    render();
    if (!reveal) return;
    const row = rows.find((r) => slugOf(r) === slug);
    const target = MOBILE.matches ? row : root;
    target?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    row?.focus({ preventScroll: true });
  };
  selectFn = select;

  /** Mobile accordion toggle that keeps the tapped row fixed on screen. */
  const toggleInline = (row: HTMLButtonElement) => {
    const before = row.getBoundingClientRect().top;
    const slug = slugOf(row);
    selected = selected === slug ? null : slug;
    render();
    const shift = row.getBoundingClientRect().top - before;
    if (shift !== 0) window.scrollBy({ top: shift, behavior: "instant" });
  };

  let hoverTimer = 0;
  rows.forEach((row, index) => {
    const slug = slugOf(row);
    row.addEventListener("click", () => {
      if (MOBILE.matches) toggleInline(row);
      else select(slug);
    });
    row.addEventListener("focus", () => {
      if (!MOBILE.matches) select(slug);
    });
    row.addEventListener("pointerenter", () => {
      if (MOBILE.matches || !HOVER.matches) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => select(slug), HOVER_INTENT_MS);
    });
    row.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));
    row.addEventListener("keydown", (event) => {
      const last = rows.length - 1;
      const next =
        event.key === "ArrowDown"
          ? Math.min(index + 1, last)
          : event.key === "ArrowUp"
            ? Math.max(index - 1, 0)
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? last
                : -1;
      if (next === -1) return;
      event.preventDefault();
      rows[next].focus();
    });
  });

  MOBILE.addEventListener("change", layout);
  layout();
}
