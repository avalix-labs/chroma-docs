import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { blog } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <>
      <div className="w-full max-w-[1400px] mx-auto px-4 py-12 rounded-xl border border-fd-border md:px-8">
        <h1 className="mb-2 text-3xl font-bold">{page.data.title}</h1>
        {page.data.description && (
          <p className="mb-4 text-fd-muted-foreground">{page.data.description}</p>
        )}
        <Link href="/blog" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
          ← Back to Blog
        </Link>
      </div>
      <article className="w-full max-w-[1400px] mx-auto flex flex-col px-4 py-8">
        <div className="prose min-w-0">
          <InlineTOC items={page.data.toc} />
          <Mdx components={getMDXComponents()} />
        </div>
        <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-fd-border text-sm">
          <div>
            <p className="mb-1 text-fd-muted-foreground">Written by</p>
            <p className="font-medium">{page.data.author}</p>
          </div>
          <div>
            <p className="mb-1 text-fd-muted-foreground">Published</p>
            <p className="font-medium">
              {new Date(page.data.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </article>
    </>
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

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
