import { createFileRoute } from '@tanstack/react-router';
import { appName } from '@/lib/shared';
import { ogCardHtml, renderOgCard } from '@/lib/og-card';
import { source } from '@/lib/source';

/**
 * OG images for docs pages. `getPageImage()` points each page at
 * `/og/docs/<slugs>/image.png`, so this catch-all strips the trailing
 * `image.png` segment and renders a card from the matched page.
 */
export const Route = createFileRoute('/og/docs/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = params._splat ?? '';
        if (!/(^|\/)image\.png$/.test(splat)) {
          return new Response('Not found', { status: 404 });
        }

        const slugPath = splat.replace(/\/?image\.png$/, '');
        const slugs = slugPath ? slugPath.split('/') : [];
        const page = source.getPage(slugs);
        if (!page) return new Response('Not found', { status: 404 });

        const data = page.data as { title: string; description?: string };

        const { html, glyphText } = ogCardHtml({
          eyebrow: 'Docs',
          title: data.title,
          meta: data.description ?? `${appName} documentation`,
        });

        return renderOgCard(html, glyphText);
      },
    },
  },
});
