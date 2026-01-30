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
      image: image(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().default(0),
    }),
});

export const collections = {
  projects,
};
