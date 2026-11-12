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
      image: image().optional(),
      /** Shell commands shown in place of a screenshot for CLI projects. */
      terminal: z.array(z.string()).optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().default(0),
    }),
});

export const collections = {
  projects,
};
