import 'server-only';
import type { ReactElement } from 'react';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { getMessages, type Locale } from '@/i18n';
import type { Audience } from '@/lib/audience';
import { caseStudyFrontmatterSchema, type CaseStudyFrontmatter } from '@/lib/schemas/case-study';
import { mdxComponents } from '@/components/work/mdx-components';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'case-studies');

export interface CaseStudy {
  frontmatter: CaseStudyFrontmatter;
  content: ReactElement;
}

/**
 * Returns null when no MDX write-up exists yet for this project — callers
 * fall back to the summary already in messages/*.json rather than 404ing a
 * project that's real but just doesn't have a deep-dive yet. Malformed
 * frontmatter throws at build/request time, matching this repo's existing
 * build-time-guard philosophy (scripts/check-messages.mjs).
 */
export async function getCaseStudy(audience: Audience, slug: string, locale: Locale): Promise<CaseStudy | null> {
  const filePath = path.join(CONTENT_ROOT, audience, slug, `${locale}.mdx`);

  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { content, frontmatter } = await compileMDX<CaseStudyFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      // Content is first-party and checked into the repo, not user input —
      // safe to allow JSX attribute expressions (e.g. <MetricGrid metrics={[...]} />),
      // which next-mdx-remote's blockJS default (true) would otherwise strip.
      // blockDangerousJS stays on as a defense-in-depth backstop regardless.
      blockJS: false,
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
      },
    },
  });

  const parsed = caseStudyFrontmatterSchema.safeParse(frontmatter);
  if (!parsed.success) {
    throw new Error(`Invalid case-study frontmatter in ${filePath}: ${parsed.error.message}`);
  }

  return { frontmatter: parsed.data, content };
}

/** Walks messages.projects.items — the single source of truth for known project slugs. */
export function getProjectSlugs(): string[] {
  return getMessages('en').projects.items.map((item) => item.slug);
}
