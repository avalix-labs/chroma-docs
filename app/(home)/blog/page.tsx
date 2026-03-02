import Link from 'next/link';
import { blog } from '@/lib/source';

export default function BlogPage() {
  const posts = blog.getPages();

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="block bg-fd-secondary rounded-lg shadow-md overflow-hidden p-6 hover:bg-fd-secondary/80 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{post.data.title}</h2>
            <p className="text-fd-muted-foreground mb-4 line-clamp-2">
              {post.data.description}
            </p>
            <span className="text-sm text-fd-muted-foreground">
              {new Date(post.data.date).toLocaleDateString()}
              {post.data.author && ` · ${post.data.author}`}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
