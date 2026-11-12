/**
 * Page sections, presented as numbered tmux windows. The number doubles as the
 * keyboard shortcut. `name` is the status-bar label (plain words, so visitors
 * who don't use tmux can follow it); `label` is used for screen readers and the
 * command palette; `alias` holds extra palette search terms;
 * `short` is the status-bar label on phones.
 */
export const windows = [
  {
    key: "0",
    id: "hero",
    name: "home",
    short: "home",
    label: "Intro",
    alias: "whoami",
  },
  {
    key: "1",
    id: "about",
    name: "experience",
    short: "exp",
    label: "Experience",
    alias: "log about",
  },
  {
    key: "2",
    id: "projects",
    name: "projects",
    short: "proj",
    label: "Projects",
    alias: "ship kubectl",
  },
  {
    key: "3",
    id: "skills",
    name: "stack",
    short: "stack",
    label: "Stack",
    alias: "skills tree",
  },
  {
    key: "4",
    id: "contact",
    name: "contact",
    short: "contact",
    label: "Contact",
    alias: "ping email",
  },
] as const;

export type TmuxWindow = (typeof windows)[number];
