import Link from 'next/link';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { Calendar, ChevronRight } from 'lucide-react';

export default async function BlogPage(props: PageProps<'/blog/[[...slug]]'>) {
  const params = await props.params;
  const slug = params.slug;

  // Blog index: /blog
  if (!slug || slug.length === 0) {
    const posts = blogSource.getPages();

    return (
      <main className="flex flex-col min-h-[calc(100vh-64px)]">
        <section className="px-6 py-16 md:py-24 border-b border-fd-border">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Blog
            </h1>
            <p className="mt-4 text-lg text-fd-muted-foreground">
              Updates, guides, and insights from the Chroma team.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-3xl mx-auto">
            {posts.length === 0 ? (
              <p className="text-fd-muted-foreground">
                No posts yet. Check back soon!
              </p>
            ) : (
              <ul className="space-y-8">
                {posts.map((post) => {
                  const date = post.data.date;
                  const dateStr = formatDate(date);

                  return (
                    <li key={post.url}>
                      <Link
                        href={post.url}
                        className="group block p-6 rounded-xl border border-fd-border bg-fd-card hover:border-fd-foreground/20 hover:bg-fd-secondary/50 transition-all"
                      >
                        <div className="flex items-center gap-2 text-sm text-fd-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          <time
                            dateTime={
                              typeof date === 'string'
                                ? date
                                : date instanceof Date
                                  ? date.toISOString()
                                  : ''
                            }
                          >
                            {dateStr}
                          </time>
                          {post.data.author && (
                            <>
                              <span>·</span>
                              <span>{post.data.author}</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold group-hover:text-fd-foreground transition-colors">
                          {post.data.title}
                        </h2>
                        {post.data.description && (
                          <p className="mt-2 text-fd-muted-foreground line-clamp-2">
                            {post.data.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-fd-foreground group-hover:underline">
                          Read more
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
    );
  }

  // Blog post: /blog/[slug]
  const page = blogSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const date = page.data.date;
  const dateStr = formatDate(date);

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)]">
      <article className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-fd-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <time
                dateTime={
                  typeof date === 'string'
                    ? date
                    : date instanceof Date
                      ? date.toISOString()
                      : ''
                }
              >
                {dateStr}
              </time>
              {page.data.author && (
                <>
                  <span>·</span>
                  <span>{page.data.author}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {page.data.title}
            </h1>
            {page.data.description && (
              <p className="mt-4 text-xl text-fd-muted-foreground">
                {page.data.description}
              </p>
            )}
          </header>

          <div className="prose prose-fd dark:prose-invert max-w-none">
            <MDX components={getMDXComponents()} />
          </div>
        </div>
      </article>
    </main>
  );
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return '';
  return typeof date === 'string'
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : date instanceof Date
      ? date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';
}

export async function generateStaticParams() {
  const params = blogSource.generateParams();
  // Include root for blog index + all post slugs
  return [{ slug: [] }, ...params.filter((p) => p.slug && p.slug.length > 0)];
}

export async function generateMetadata(
  props: PageProps<'/blog/[[...slug]]'>
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  if (!slug || slug.length === 0) {
    return {
      title: 'Blog',
      description: 'Updates, guides, and insights from the Chroma team.',
    };
  }

  const page = blogSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
