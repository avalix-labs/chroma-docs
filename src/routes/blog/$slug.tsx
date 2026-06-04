import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import browserCollections from 'collections/browser';
import { ChromaFooter, ChromaNav } from '@/components/chroma-chrome';
import { useMDXComponents } from '@/components/mdx';
import { CATEGORY_LABEL, categorize } from '@/lib/blog-categories';
import { blog } from '@/lib/source';
import chromaBlogCss from '@/styles/chroma-blog.css?url';
import chromaHomeCss from '@/styles/chroma-home.css?url';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const data = await serverLoader({ data: params.slug });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | @avalix/chroma` },
          { name: 'description', content: loaderData.description ?? '' },
          { property: 'og:title', content: loaderData.title },
          { property: 'og:description', content: loaderData.description ?? '' },
          { property: 'og:type', content: 'article' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: loaderData.title },
          { name: 'twitter:description', content: loaderData.description ?? '' },
        ]
      : [],
    links: [
      { rel: 'stylesheet', href: chromaHomeCss },
      { rel: 'stylesheet', href: chromaBlogCss },
    ],
  }),
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
  component({ default: MDX }) {
    return <MDX components={useMDXComponents()} />;
  },
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const data = useFumadocsLoader(Route.useLoaderData());

  const dateLabel = data.date
    ? new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;
  const author = data.author ?? 'Chroma Team';
  const avatarLetter = (author.trim()[0] ?? 'C').toUpperCase();
  const category = categorize(slug);

  return (
    <div className="chroma-home">
      <ChromaNav active="blog" />

      <article className="article">
        <Link className="back" to="/blog">
          ← All posts
        </Link>

        <div className="a-meta">
          <span className="tag">{CATEGORY_LABEL[category]}</span>
          {dateLabel && <span className="post-date">{dateLabel}</span>}
        </div>

        <h1>{data.title}</h1>
        {data.description && <p className="a-lede">{data.description}</p>}

        <div className="a-byline">
          <div className="avatar" aria-hidden="true">
            {avatarLetter}
          </div>
          <div className="who">
            <b>{author}</b>
            <span>@avalix/chroma</span>
          </div>
        </div>

        <div className="body">
          <Suspense>{clientLoader.useContent(data.path)}</Suspense>
        </div>

        <hr className="a-end" />
        <div className="a-foot">
          <Link className="back" to="/blog">
            ← All posts
          </Link>
          <a
            className="back"
            href="https://github.com/avalix-labs/chroma"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub →
          </a>
        </div>
      </article>

      <ChromaFooter />
    </div>
  );
}
