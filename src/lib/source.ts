import { blog as blogCollection, docs } from 'collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { docsImageRoute, docsRoute } from './shared';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogCollection, []),
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];
  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') out.pop();
  return out;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push('index.md');
  } else {
    segments[segments.length - 1] += '.md';
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
