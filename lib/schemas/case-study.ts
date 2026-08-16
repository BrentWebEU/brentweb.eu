import { z } from 'zod';
import { locales } from '@/i18n';
import { AUDIENCES } from '@/lib/audience';

export const caseStudyFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  audience: z.enum(AUDIENCES),
  locale: z.enum(locales),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  summary: z.string(),
  heroImage: z.string().optional(),
  draft: z.boolean().optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
