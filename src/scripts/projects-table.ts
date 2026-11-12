/**
 * `kubectl get projects` master/detail. Desktop: rows select which detail the
 * side pane shows. Mobile: each detail moves under its row as an accordion.
 * Without JS every detail is simply rendered, stacked, in the side pane.
 */

const MOBILE = window.matchMedia("(max-width: 767px)");
const HOVER = window.matchMedia("(hover: hover) and (pointer: fine)");
const HOVER_INTENT_MS = 140;

let selectFn: ((slug: string, focusRow?: boolean) => void) | null = null;

/** Selects a project from elsewhere (e.g. the command palette) and brings it into view. */
export function showProject(slug: string) {
  selectFn?.(slug, true);
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

  let selected: string | null =
    rows.find((row) => row.getAttribute("aria-expanded") === "true")?.dataset
      .projectRow ?? (rows[0] ? slugOf(rows[0]) : null);

  const render = () => {
    rows.forEach((row) => {
      const slug = slugOf(row);
      const isSelected = slug === selected;
      row.setAttribute("aria-expanded", String(isSelected));
      row.classList.toggle("is-selected", isSelected);
      const detail = details.get(slug);
      if (detail) detail.hidden = !isSelected;
    });
    if (title && selected) title.textContent = `describe ${selected}`;
  };

  // Mobile: detail lives directly after its row. Desktop: back in the side pane.
  const layout = () => {
    root.classList.toggle("is-inline", MOBILE.matches);
    rows.forEach((row) => {
      const detail = details.get(slugOf(row));
      if (!detail) return;
      if (MOBILE.matches) row.after(detail);
      else container.append(detail);
    });
    if (!MOBILE.matches && !selected && rows[0]) selected = slugOf(rows[0]);
    render();
  };

  const select = (slug: string, focusRow = false) => {
    selected = slug;
    render();
    if (!focusRow) return;
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

  let hoverTimer = 0;
  rows.forEach((row, index) => {
    const slug = slugOf(row);
    row.addEventListener("click", () => {
      if (MOBILE.matches && selected === slug) {
        selected = null;
        render();
        return;
      }
      select(slug);
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
