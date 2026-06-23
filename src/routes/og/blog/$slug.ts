import { createFileRoute } from '@tanstack/react-router';
import { CATEGORY_LABEL, categorize } from '@/lib/blog-categories';
import { ogCardHtml, renderOgCard } from '@/lib/og-card';
import { blog } from '@/lib/source';

/** Accent colour per ecosystem bucket, mirroring the blog's category chips. */
const ACCENT: Record<string, string> = {
  ethereum: '#7c8cff',
  polkadot: '#ff5fa2',
  solana: '#46e0b8',
  testing: '#f5c451',
};

export const Route = createFileRoute('/og/blog/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const page = blog.getPage([params.slug]);
        if (!page) return new Response('Not found', { status: 404 });

        const data = page.data as { title: string; author?: string; date?: string | Date };
        const author = data.author ?? 'Chroma Team';
        const category = categorize(params.slug);
        const dateLabel = data.date
          ? new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '';

        const { html, glyphText } = ogCardHtml({
          eyebrow: CATEGORY_LABEL[category],
          title: data.title,
          meta: dateLabel ? `${author}  ·  ${dateLabel}` : author,
          accent: ACCENT[category],
        });

        return renderOgCard(html, glyphText);
      },
    },
  },
});
