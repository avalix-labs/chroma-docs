import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Suspense } from 'react';
import browserCollections from 'collections/browser';
import { useMDXComponents } from '@/components/mdx';
import { baseOptions } from '@/lib/layout.shared';
import { blog } from '@/lib/source';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const data = await serverLoader({ data: params.slug });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} | @avalix/chroma` },
        { name: 'description', content: loaderData.description ?? '' },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.description ?? '' },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: loaderData.title },
        { name: 'twitter:description', content: loaderData.description ?? '' },
      ],
    };
  },
});

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const page = blog.getPage([slug]);
    if (!page) throw notFound();

    const data = page.data as {
      title: string;
      description?: string;
      author?: string;
      date?: string | Date;
    };

    return {
      path: page.path,
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
    };
  });

const clientLoader = browserCollections.blog.createClientLoader({
  component({ toc, default: MDX }) {
    return (
      <article className="prose prose-neutral dark:prose-invert min-w-0 max-w-none prose-headings:font-semibold prose-p:text-fd-foreground/90 prose-a:text-fd-foreground prose-a:underline prose-pre:bg-fd-secondary">
        <InlineTOC items={toc} />
        <MDX components={useMDXComponents()} />
      </article>
    );
  },
});

function BlogPostPage() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <HomeLayout {...baseOptions()}>
      <main className="min-h-0 w-full flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center text-sm text-fd-muted-foreground hover:text-fd-foreground"
          >
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
              {data.title}
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

          <Suspense>{clientLoader.useContent(data.path)}</Suspense>

          <footer className="mt-12 border-t border-fd-border pt-8">
            <Link
              to="/blog"
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground"
            >
              ← Back to Blog
            </Link>
          </footer>
        </div>
      </main>
    </HomeLayout>
  );
}
