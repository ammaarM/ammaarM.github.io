import { completeCommand, runCommand, type ShellData } from "./shell-commands";
import { goToSection } from "./navigate";

/**
 * Optional prompt in the hero terminal, enabled once the typewriter finishes.
 * It only offers shortcuts to content that is already visible on the page.
 */

const MAX_LOG_LINES = 120;

const isShellData = (value: unknown): value is ShellData =>
  typeof value === "object" &&
  value !== null &&
  "projects" in value &&
  Array.isArray(value.projects);

export function initShell() {
  const terminal = document.querySelector<HTMLElement>("[data-shell]");
  const form = terminal?.querySelector<HTMLFormElement>("[data-shell-form]");
  const input = terminal?.querySelector<HTMLInputElement>("[data-shell-input]");
  const log = terminal?.querySelector<HTMLElement>("[data-shell-log]");
  const idle = terminal?.querySelector<HTMLElement>("[data-shell-idle]");
  const raw = document.querySelector("[data-shell-data]")?.textContent;
  if (!terminal || !form || !input || !log || !raw) return;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }
  if (!isShellData(data)) return;
  const shell = data;

  const history: string[] = [];
  let cursor = 0;

  const print = (lines: string[], className = "terminal-out") => {
    for (const text of lines) {
      const line = document.createElement("p");
      line.className = className;
      line.textContent = text;
      log.append(line);
    }
    while (log.childElementCount > MAX_LOG_LINES)
      log.firstElementChild?.remove();
    log.scrollTop = log.scrollHeight;
  };

  const echo = (command: string) => {
    const line = document.createElement("p");
    line.className = "terminal-line";
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.setAttribute("aria-hidden", "true");
    prompt.textContent = "$";
    line.append(prompt, document.createTextNode(command));
    log.append(line);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value;
    input.value = "";
    if (command.trim()) history.push(command.trim());
    cursor = history.length;
    echo(command);
    const result = runCommand(command, shell);
    print(result.lines);
    const effect = result.effect;
    if (!effect) return;
    if (effect.type === "clear") {
      log.replaceChildren();
      terminal.classList.add("is-cleared");
    } else if (effect.type === "open") {
      window.open(effect.href, "_blank", "noopener");
    } else if (effect.type === "scroll") {
      goToSection(effect.id);
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && input.value.trim() && !event.shiftKey) {
      event.preventDefault();
      const { value, options } = completeCommand(input.value, shell);
      input.value = value;
      if (options.length > 1) {
        echo(input.value);
        print([options.join("  ")]);
      }
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      cursor = Math.max(0, cursor - 1);
      input.value = history[cursor] ?? "";
    } else if (event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] ?? "";
    } else if (event.key === "Escape") {
      input.blur();
    }
  });

  // Clicking anywhere in the terminal body puts the caret in the prompt,
  // unless the visitor is selecting text to copy.
  terminal.addEventListener("click", (event) => {
    if (window.getSelection()?.toString()) return;
    if (event.target instanceof HTMLElement && event.target.closest("a"))
      return;
    input.focus({ preventScroll: true });
  });

  if (idle) idle.hidden = true;
  form.hidden = false;
}
