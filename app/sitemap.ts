import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { blog, source } from '@/lib/source';

function lastModifiedFromBlog(data: { date?: string | Date }): Date | undefined {
  const { date } = data;
  if (!date) return undefined;
  if (date instanceof Date) return date;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  for (const page of source.getPages()) {
    entries.push({
      url: new URL(page.url, SITE_URL).href,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const page of blog.getPages()) {
    entries.push({
      url: new URL(page.url, SITE_URL).href,
      lastModified: lastModifiedFromBlog(page.data as { date?: string | Date }),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
