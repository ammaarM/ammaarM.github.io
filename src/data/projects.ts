import type { CollectionEntry } from "astro:content";

type ProjectData = CollectionEntry<"projects">["data"];

export type ProjectStatus = "live" | "repo";

/** Featured first, then by `sortOrder`, then by id for a stable order. */
export function compareProjects(
  a: Pick<CollectionEntry<"projects">, "id" | "data">,
  b: Pick<CollectionEntry<"projects">, "id" | "data">,
): number {
  if (a.data.featured !== b.data.featured) {
    return Number(b.data.featured) - Number(a.data.featured);
  }
  if (a.data.sortOrder !== b.data.sortOrder) {
    return a.data.sortOrder - b.data.sortOrder;
  }
  return a.id.localeCompare(b.id);
}

/** `Birth Your Way` → `birth-your-way`: the NAME column in `kubectl get projects`. */
export function projectSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A deployed URL means it's live; otherwise the project ships as source. */
export function projectStatus(data: Pick<ProjectData, "url">): ProjectStatus {
  return data.url ? "live" : "repo";
}

/** First sentence of a description, used as the one-line tagline in the table. */
export function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

/** STACK cell: the first `count` technologies plus how many more there are. */
export function stackSummary(
  tech: readonly string[],
  count = 2,
): { shown: string[]; more: number } {
  return {
    shown: tech.slice(0, count),
    more: Math.max(0, tech.length - count),
  };
}
