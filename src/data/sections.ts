/**
 * Page sections, presented as numbered tmux windows. The number doubles as the
 * keyboard shortcut. `name` is the status-bar label (plain words, so visitors
 * who don't use tmux can follow it); `label` is used for screen readers and the
 * command palette; `alias` holds extra palette search terms.
 */
export const windows = [
  { key: "0", id: "hero", name: "home", label: "Intro", alias: "whoami" },
  { key: "1", id: "about", name: "experience", label: "Experience", alias: "log about" },
  { key: "2", id: "skills", name: "stack", label: "Stack", alias: "skills tree" },
  { key: "3", id: "projects", name: "projects", label: "Projects", alias: "ship kubectl" },
  { key: "4", id: "contact", name: "contact", label: "Contact", alias: "ping email" },
] as const;

export type TmuxWindow = (typeof windows)[number];
