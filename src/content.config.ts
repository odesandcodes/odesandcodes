import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    caption: z.string(), // This is your monospace caption
    date: z.date().optional(), // Optional: for sorting later
  }),
});

export const collections = { posts };