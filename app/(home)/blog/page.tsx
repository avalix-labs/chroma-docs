import Link from 'next/link';
import { blog } from '@/lib/source';

export default function BlogPage() {
  const posts = blog
    .getPages()
    .slice()
    .sort((a, b) => {
      const dateA = new Date((a.data as { date?: string | Date }).date ?? 0).getTime();
      const dateB = new Date((b.data as { date?: string | Date }).date ?? 0).getTime();
      return dateB - dateA;
    });

  return (
    <main className="flex-1 w-full min-h-0">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          Latest Blog Posts
        </h1>
        <p className="mt-2 text-fd-muted-foreground">
          Tutorials and updates from the Chroma team.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => {
            const data = post.data as { title: string; description?: string; author?: string; date?: string | Date };
            return (
              <Link
                key={post.url}
                href={post.url}
                className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-foreground/20 hover:bg-fd-secondary/50"
              >
                <h2 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-foreground/90">
                  {data.title}
                </h2>
                {data.description && (
                  <p className="mt-2 flex-1 text-sm text-fd-muted-foreground line-clamp-2">
                    {data.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-fd-muted-foreground">
                  {data.author && <span>{data.author}</span>}
                  {data.date && (
                    <>
                      {data.author && <span aria-hidden>·</span>}
                      <time dateTime={new Date(data.date).toISOString()}>
                        {new Date(data.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
