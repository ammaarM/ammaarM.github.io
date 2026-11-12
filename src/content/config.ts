import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url().optional(),
      repo: z.string().url().optional(),
      tech: z.array(z.string()).default([]),
      /** Short form factor shown in the projects table, e.g. "web app" or "cli". */
      kind: z.enum(["web app", "desktop app", "pwa", "cli"]),
      image: image().optional(),
      /** Up to three short points for the projects detail, taken from the body text. */
      highlights: z.array(z.string().max(70)).max(3).default([]),
      /**
       * Shell session shown in place of a screenshot for CLI projects. Lines
       * starting with `#` render as comments; the rest get a `$` prompt.
       */
      terminal: z.array(z.string()).optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().default(0),
    }),
});

export const collections = {
  projects,
};
