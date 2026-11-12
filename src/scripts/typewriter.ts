/**
 * Types out terminal commands inside `[data-typewriter]`. The full text is
 * server-rendered, so with JS disabled or reduced motion the terminal just
 * shows the finished session.
 */

const CHAR_DELAY_MS = 55;
const STEP_PAUSE_MS = 420;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function play(terminal: HTMLElement) {
  const steps = Array.from(
    terminal.querySelectorAll<HTMLElement>(".terminal-step"),
  );
  const commands = steps.map((step) => {
    const cmd = step.querySelector<HTMLElement>("[data-type]");
    const text = cmd?.textContent ?? "";
    if (cmd) cmd.textContent = "";
    step.classList.add("is-pending");
    return { step, cmd, text };
  });
  terminal.classList.add("is-typing");

  for (const { step, cmd, text } of commands) {
    step.classList.remove("is-pending");
    step.classList.add("is-active");
    for (const char of text) {
      if (cmd) cmd.textContent += char;
      await wait(CHAR_DELAY_MS);
    }
    await wait(STEP_PAUSE_MS / 2);
    step.classList.remove("is-active");
    step.classList.add("is-done");
    await wait(STEP_PAUSE_MS);
  }
  terminal.classList.remove("is-typing");
}

/** Resolves once every terminal has finished typing (immediately under reduced motion). */
export async function initTypewriter(): Promise<void> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  await Promise.all(
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-typewriter]"),
      (terminal) => play(terminal),
    ),
  );
}
