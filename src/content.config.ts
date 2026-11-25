import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    // YYYY-MM dates are formatted for each language in the templates.
    startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    endDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    keywords: z.array(z.string()),
    color: z.enum(['sage', 'clay', 'slate', 'ochre']),
    url: z.string().url().optional(),
  }),
});

export const collections = { projects };
