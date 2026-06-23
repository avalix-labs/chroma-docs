import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import browserCollections from 'collections/browser';
import { ChromaFooter, ChromaNav } from '@/components/chroma-chrome';
import { useMDXComponents } from '@/components/mdx';
import { CATEGORY_LABEL, categorize } from '@/lib/blog-categories';
import { SITE_URL } from '@/lib/site';
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
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [],
        links: [
          { rel: 'stylesheet', href: chromaHomeCss },
          { rel: 'stylesheet', href: chromaBlogCss },
        ],
      };
    }

    const url = `${SITE_URL}/blog/${params.slug}`;
    const ogImage = `${SITE_URL}/og/blog/${params.slug}`;
    const description = loaderData.description ?? '';
    const author = loaderData.author ?? 'Chroma Team';
    const published = loaderData.date ? new Date(loaderData.date).toISOString() : undefined;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: loaderData.title,
      description,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: ogImage,
      ...(published ? { datePublished: published, dateModified: published } : {}),
      author: {
        '@type': author.includes('Team') ? 'Organization' : 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: '@avalix/chroma',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
      },
    };

    return {
      meta: [
        { title: `${loaderData.title} | @avalix/chroma` },
        { name: 'description', content: description },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:image', content: ogImage },
        { property: 'article:author', content: author },
        ...(published ? [{ property: 'article:published_time', content: published }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: loaderData.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [
        { rel: 'canonical', href: url },
        { rel: 'stylesheet', href: chromaHomeCss },
        { rel: 'stylesheet', href: chromaBlogCss },
      ],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }],
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

    const category = categorize(slug);
    const related = blog
      .getPages()
      .map((p) => {
        const pSlug = p.slugs[0];
        const pData = p.data as { title: string; description?: string; date?: string | Date };
        return {
          slug: pSlug,
          title: pData.title,
          description: pData.description,
          date: pData.date ? new Date(pData.date).toISOString() : undefined,
          category: categorize(pSlug),
        };
      })
      .filter((p) => p.slug !== slug && p.category === category)
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
      .slice(0, 3);

    return {
      path: page.path,
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      related,
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

        {data.related && data.related.length > 0 && (
          <section className="related" aria-label="Related posts">
            <h2 className="related-title">Related posts</h2>
            <div className="post-grid">
              {data.related.map((post) => (
                <Link
                  key={post.slug}
                  className="pcard"
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                >
                  <div className="post-meta">
                    <span className="tag">{CATEGORY_LABEL[post.category]}</span>
                    {post.date && (
                      <>
                        <span>·</span>
                        <span className="post-date">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                  <h3>{post.title}</h3>
                  {post.description && <p>{post.description}</p>}
                  <span className="read">Read post →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

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
