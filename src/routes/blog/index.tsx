import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { blog } from '@/lib/source';

const getBlogPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return blog
    .getPages()
    .slice()
    .sort((a, b) => {
      const dateA = new Date((a.data as { date?: string | Date }).date ?? 0).getTime();
      const dateB = new Date((b.data as { date?: string | Date }).date ?? 0).getTime();
      return dateB - dateA;
    })
    .map((post) => {
      const data = post.data as {
        title: string;
        description?: string;
        author?: string;
        date?: string | Date;
      };
      return {
        slug: post.slugs[0],
        title: data.title,
        description: data.description,
        author: data.author,
        date: data.date ? new Date(data.date).toISOString() : undefined,
      };
    });
});

export const Route = createFileRoute('/blog/')({
  loader: () => getBlogPosts(),
  component: BlogPage,
  head: () => ({
    meta: [
      { title: 'Blog | @avalix/chroma' },
      { name: 'description', content: 'Tutorials and updates from the Chroma team.' },
    ],
  }),
});

function BlogPage() {
  const posts = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()}>
      <main className="min-h-0 w-full flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
            Latest Blog Posts
          </h1>
          <p className="mt-2 text-fd-muted-foreground">Tutorials and updates from the Chroma team.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-foreground/20 hover:bg-fd-secondary/50"
                >
                  <h2 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-foreground/90">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-fd-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-fd-muted-foreground">
                    {post.author && <span>{post.author}</span>}
                    {post.date && (
                      <>
                        {post.author && <span aria-hidden>·</span>}
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </>
                    )}
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </main>
    </HomeLayout>
  );
}
