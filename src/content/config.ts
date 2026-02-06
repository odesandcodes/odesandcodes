import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // <-- This is the new magic

const blog = defineCollection({
  // In v5, we use a loader instead of type: 'content'
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(), // 'coerce' helps turn text dates into real dates
    image: z.string().optional(),
  }),
});

export const collections = { blog };