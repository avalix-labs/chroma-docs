import { createFileRoute } from '@tanstack/react-router';
import { ogCardHtml, renderOgCard } from '@/lib/og-card';
import { blog } from '@/lib/source';

export const Route = createFileRoute('/og/blog/')({
  server: {
    handlers: {
      GET: async () => {
        const count = blog.getPages().length;
        const { html, glyphText } = ogCardHtml({
          eyebrow: 'Blog',
          title: 'Notes from the test runner.',
          meta: `${count} posts · releases, deep-dives and guides`,
        });

        return renderOgCard(html, glyphText);
      },
    },
  },
});
