import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { blog } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;
  const data = page.data as { title: string; description?: string; author?: string; date?: string | Date };

  return (
    <main className="flex-1 w-full min-h-0">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm text-fd-muted-foreground hover:text-fd-foreground"
        >
          ← Back to Blog
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
            {page.data.title}
          </h1>
          {data.description && (
            <p className="mt-3 text-lg text-fd-muted-foreground">{data.description}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-fd-muted-foreground">
            {data.author && (
              <span>
                <span className="font-medium text-fd-foreground">Written by</span> {data.author}
              </span>
            )}
            {data.date && (
              <time dateTime={new Date(data.date).toISOString()}>
                <span className="font-medium text-fd-foreground">Published</span>{' '}
                {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>
        </header>

        <article className="prose prose-neutral min-w-0 max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-fd-foreground/90 prose-a:text-fd-foreground prose-a:underline prose-pre:bg-fd-secondary">
          <InlineTOC items={page.data.toc} />
          <Mdx components={getMDXComponents()} />
        </article>

        <footer className="mt-12 border-t border-fd-border pt-8">
          <Link
            href="/blog"
            className="text-sm text-fd-muted-foreground hover:text-fd-foreground"
          >
            ← Back to Blog
          </Link>
        </footer>
      </div>
    </main>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const title = page.data.title;
  const description = (page.data as { description?: string }).description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
