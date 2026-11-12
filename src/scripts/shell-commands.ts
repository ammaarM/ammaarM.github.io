/**
 * Pure command logic for the optional prompt in the hero terminal. Every
 * command mirrors something already on the page; nothing here is required to
 * navigate the site.
 */

export interface ShellData {
  whoami: string;
  certs: string[];
  shipped: string[];
  cvUrl: string;
  email: string;
  links: { github: string; linkedin: string };
  projects: { slug: string; href: string }[];
}

export type ShellEffect =
  | { type: "clear" }
  | { type: "open"; href: string; project?: string }
  | { type: "scroll"; id: string };

export interface ShellResult {
  lines: string[];
  effect?: ShellEffect;
}

const HELP: [string, string][] = [
  ["help", "list commands"],
  ["whoami", "role and location"],
  ["cat certs.txt", "certifications"],
  ["ls ~/shipped", "things I've shipped"],
  ["open <project>", "open a project (tab completes)"],
  ["cv", "open my CV (PDF)"],
  ["contact", "email and links"],
  ["clear", "clear the screen"],
];

/** Commands offered by Tab completion, before project names are added. */
export const BASE_COMMANDS = [
  "help",
  "whoami",
  "cat certs.txt",
  "ls -1 ~/shipped",
  "open ",
  "cv",
  "contact",
  "clear",
];

export function runCommand(raw: string, data: ShellData): ShellResult {
  const input = raw.trim().replace(/\s+/g, " ");
  if (!input) return { lines: [] };
  const [name, ...args] = input.split(" ");
  const arg = args.join(" ");

  switch (name) {
    case "help":
      return {
        lines: HELP.map(([cmd, what]) => `${cmd.padEnd(16)}${what}`),
      };
    case "whoami":
      return { lines: [data.whoami] };
    case "cat":
      if (arg === "certs.txt") return { lines: data.certs };
      return { lines: [`cat: ${arg || "missing file"}: try cat certs.txt`] };
    case "ls": {
      // Flags like -1 / -la are accepted and ignored: output is always one entry per line.
      const path = args.filter((part) => !part.startsWith("-")).join(" ");
      if (path === "~/shipped" || path === "shipped" || path === "") {
        return {
          lines: path === "" ? ["certs.txt", "shipped/"] : data.shipped,
        };
      }
      return { lines: [`ls: ${path}: no such directory`] };
    }
    case "open": {
      const project = data.projects.find((p) => p.slug === arg);
      if (!project || !project.href) {
        const names = data.projects.map((p) => p.slug).join("  ");
        return { lines: [`usage: open <project>`, names] };
      }
      return {
        lines: [`opening ${project.href}`],
        effect: { type: "open", href: project.href, project: project.slug },
      };
    }
    case "cv":
      return {
        lines: [`opening ${data.cvUrl}`],
        effect: { type: "open", href: data.cvUrl },
      };
    case "contact":
      return {
        lines: [
          `email     ${data.email}`,
          `linkedin  ${data.links.linkedin}`,
          `github    ${data.links.github}`,
        ],
        effect: { type: "scroll", id: "contact" },
      };
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "sudo":
      return { lines: ["nice try."] };
    default:
      return { lines: [`command not found: ${name}. try help`] };
  }
}

/**
 * Tab completion: returns the input extended to the longest prefix shared by
 * every candidate, plus the candidates themselves when there is more than one.
 */
export function completeCommand(
  input: string,
  data: ShellData,
): { value: string; options: string[] } {
  const candidates = [
    ...BASE_COMMANDS,
    ...data.projects.map((p) => `open ${p.slug}`),
  ];
  const matches = candidates.filter((c) => c.startsWith(input) && c !== input);
  if (matches.length === 0) return { value: input, options: [] };
  if (matches.length === 1) return { value: matches[0], options: [] };

  let prefix = matches[0];
  for (const match of matches) {
    while (!match.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  const value = prefix.length > input.length ? prefix : input;
  const start = value.lastIndexOf(" ") + 1;
  return {
    value,
    options: matches.map((m) => m.slice(start)).filter(Boolean),
  };
}
