import { createFileRoute } from '@tanstack/react-router';
import { SITE_URL } from '@/lib/site';
import { blog, source } from '@/lib/source';

function lastModifiedFromBlog(data: { date?: string | Date }): string | undefined {
  const { date } = data;
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET() {
        const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [
          { loc: SITE_URL, changefreq: 'weekly', priority: 1 },
          { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: 0.8 },
        ];

        for (const page of source.getPages()) {
          urls.push({
            loc: new URL(page.url, SITE_URL).href,
            changefreq: 'monthly',
            priority: 0.7,
          });
        }

        for (const page of blog.getPages()) {
          urls.push({
            loc: new URL(page.url, SITE_URL).href,
            lastmod: lastModifiedFromBlog(page.data as { date?: string | Date }),
            changefreq: 'monthly',
            priority: 0.6,
          });
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    const parts = [`  <url>`, `    <loc>${entry.loc}</loc>`];
    if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    if (entry.priority !== undefined) parts.push(`    <priority>${entry.priority}</priority>`);
    parts.push(`  </url>`);
    return parts.join('\n');
  })
  .join('\n')}
</urlset>`;

        return new Response(body, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
