import { scoreCommand } from "./fuzzy";
import { goToSection } from "./navigate";
import { showProject } from "./projects-table";
import { copyText } from "./clipboard";
import { displayMessage } from "./display-message";

/**
 * ⌘K command palette on a native <dialog>: the dialog provides the focus
 * trap, Esc and focus return; this adds filtering and combobox navigation.
 */

let openFn: (() => void) | null = null;

export function openPalette() {
  openFn?.();
}

export function togglePalette() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-palette]");
  if (dialog?.open) dialog.close();
  else openPalette();
}

type HelpOpener = () => void;

export function initPalette(openHelp: HelpOpener) {
  const dialog = document.querySelector<HTMLDialogElement>("[data-palette]");
  const input = dialog?.querySelector<HTMLInputElement>("[data-palette-input]");
  const empty = dialog?.querySelector<HTMLElement>("[data-palette-empty]");
  if (!dialog || !input || !empty) return;

  const items = Array.from(
    dialog.querySelectorAll<HTMLElement>("[data-palette-item]"),
  );
  const groups = Array.from(
    dialog.querySelectorAll<HTMLElement>("[data-palette-group]"),
  );
  let visible: HTMLElement[] = items;
  let active = 0;

  const setActive = (index: number) => {
    if (visible.length === 0) {
      input.removeAttribute("aria-activedescendant");
      return;
    }
    active = (index + visible.length) % visible.length;
    items.forEach((item) => item.setAttribute("aria-selected", "false"));
    const item = visible[active];
    item.setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", item.id);
    item.scrollIntoView({ block: "nearest" });
  };

  const filter = () => {
    const query = input.value;
    const scores = new Map(
      items.map((item) => [
        item,
        scoreCommand(query, item.dataset.label ?? "", item.dataset.keywords),
      ]),
    );
    visible = items.filter((item) => (scores.get(item) ?? 0) > 0);
    items.forEach((item) => {
      item.hidden = !visible.includes(item);
    });
    groups.forEach((group) => {
      const name = group.dataset.paletteGroup;
      group.hidden = !visible.some((item) => item.dataset.group === name);
    });
    empty.hidden = visible.length > 0;
    // Groups keep their order; the best match starts highlighted.
    let best = 0;
    visible.forEach((item, index) => {
      if ((scores.get(item) ?? 0) > (scores.get(visible[best]) ?? 0)) {
        best = index;
      }
    });
    setActive(best);
  };

  const run = async (item: HTMLElement) => {
    const { action, target, href, value } = item.dataset;
    dialog.close();
    switch (action) {
      case "go":
        if (target) goToSection(target);
        break;
      case "project":
        if (target) showProject(target, { reveal: true });
        break;
      case "link":
        if (!href) break;
        if (item.hasAttribute("data-external")) {
          window.open(href, "_blank", "noopener");
        } else {
          window.location.href = href;
        }
        break;
      case "copy":
        if (!value) break;
        displayMessage(
          (await copyText(value))
            ? `copied ${value}`
            : `couldn't copy: ${value}`,
        );
        break;
      case "theme": {
        document.querySelector<HTMLButtonElement>(".theme-toggle")?.click();
        const theme = document.documentElement.dataset.theme ?? "dark";
        displayMessage(`theme: ${theme}`);
        break;
      }
      case "help":
        openHelp();
        break;
    }
  };

  openFn = () => {
    if (dialog.open) return;
    input.value = "";
    filter();
    dialog.showModal();
    input.focus();
  };

  input.addEventListener("input", filter);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
      event.preventDefault();
      setActive(active + 1);
    } else if (
      event.key === "ArrowUp" ||
      (event.ctrlKey && event.key === "p")
    ) {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = visible[active];
      if (item) void run(item);
    }
  });
  items.forEach((item) => {
    item.addEventListener("click", () => void run(item));
    item.addEventListener("pointermove", () => {
      const index = visible.indexOf(item);
      if (index !== active) setActive(index);
    });
  });
  // Clicking the backdrop (the dialog element itself, outside the pane) closes it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document
    .querySelectorAll<HTMLButtonElement>("[data-open-palette]")
    .forEach((button) => button.addEventListener("click", openPalette));
}
