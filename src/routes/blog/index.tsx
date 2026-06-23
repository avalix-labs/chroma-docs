import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useMemo, useRef, useState } from 'react';
import { ChromaFooter, ChromaNav } from '@/components/chroma-chrome';
import {
  CATEGORIES,
  CATEGORY_LABEL,
  type CategoryKey,
  categorize,
} from '@/lib/blog-categories';
import { SITE_URL } from '@/lib/site';
import { blog } from '@/lib/source';
import chromaBlogCss from '@/styles/chroma-blog.css?url';
import chromaHomeCss from '@/styles/chroma-home.css?url';

const PAGE_SIZE = 9;
const BLOG_DESCRIPTION =
  'Releases, engineering deep-dives and practical guides from the team building Chroma.';
const BLOG_OG_IMAGE = `${SITE_URL}/og/blog`;

type BlogSearch = {
  page?: number;
  category?: CategoryKey;
};

const CATEGORY_KEYS = new Set<string>(CATEGORIES.map((c) => c.key));

function parseBlogSearch(search: Record<string, unknown>): BlogSearch {
  const result: BlogSearch = {};

  if (typeof search.page === 'string' || typeof search.page === 'number') {
    const parsed = Number(search.page);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed !== 1) {
      result.page = Math.floor(parsed);
    }
  }

  const categoryRaw = search.category;
  if (typeof categoryRaw === 'string' && CATEGORY_KEYS.has(categoryRaw)) {
    result.category = categoryRaw as CategoryKey;
  }

  return result;
}

function resolveBlogSearch(search: BlogSearch) {
  return {
    page: search.page ?? 1,
    category: (search.category ?? 'all') as 'all' | CategoryKey,
  };
}

function blogListSearch(category: 'all' | CategoryKey, page: number): BlogSearch {
  const result: BlogSearch = {};
  if (category !== 'all') result.category = category;
  if (page > 1) result.page = page;
  return result;
}

function blogListUrl(category: 'all' | CategoryKey, page: number) {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return `${SITE_URL}/blog${qs ? `?${qs}` : ''}`;
}

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
      const slug = post.slugs[0];
      return {
        slug,
        title: data.title,
        description: data.description,
        author: data.author,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        category: categorize(slug),
      };
    });
});

type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

export const Route = createFileRoute('/blog/')({
  validateSearch: parseBlogSearch,
  loader: () => getBlogPosts(),
  component: BlogPage,
  head: ({ match, loaderData }) => {
    const posts = loaderData ?? [];
    const { page, category } = resolveBlogSearch(match.search);
    const filteredCount =
      category === 'all' ? posts.length : posts.filter((p) => p.category === category).length;
    const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const titleParts = ['Blog'];
    if (category !== 'all') titleParts.unshift(CATEGORY_LABEL[category]);
    if (safePage > 1) titleParts.push(`Page ${safePage}`);
    const title = `${titleParts.join(' · ')} | @avalix/chroma`;

    const description =
      category === 'all'
        ? BLOG_DESCRIPTION
        : `${CATEGORY_LABEL[category]} posts from the Chroma blog — ${BLOG_DESCRIPTION.toLowerCase()}`;

    const url = blogListUrl(category, safePage);
    const prevPage = safePage > 1 ? safePage - 1 : undefined;
    const nextPage = safePage < totalPages ? safePage + 1 : undefined;

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title.replace(' | @avalix/chroma', '') },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
        { property: 'og:image', content: BLOG_OG_IMAGE },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'The Chroma blog — Notes from the test runner.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title.replace(' | @avalix/chroma', '') },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: BLOG_OG_IMAGE },
      ],
      links: [
        { rel: 'canonical', href: url },
        ...(prevPage ? [{ rel: 'prev', href: blogListUrl(category, prevPage) }] : []),
        ...(nextPage ? [{ rel: 'next', href: blogListUrl(category, nextPage) }] : []),
        { rel: 'stylesheet', href: chromaHomeCss },
        { rel: 'stylesheet', href: chromaBlogCss },
      ],
    };
  },
});

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Compact page list: 1 … (p-1) p (p+1) … last */
function pagerItems(pages: number, page: number): Array<number | '…'> {
  const out: Array<number | '…'> = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) out.push(i);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
}

function BlogPage() {
  const posts = Route.useLoaderData();
  const { page, category: active } = resolveBlogSearch(Route.useSearch());
  const [query, setQuery] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const cat of CATEGORIES) c[cat.key] = 0;
    for (const p of posts) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchCat = active === 'all' || p.category === active;
      const matchQ = !q || `${p.title} ${p.description ?? ''}`.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [posts, active, query]);

  const featuredSlug = posts[0]?.slug;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const visible = filtered.slice(start, end);

  const scrollToToolbar = () => {
    const el = toolbarRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const countLabel = (() => {
    if (total === 0) return 'No posts';
    const q = query.trim();
    let label = `Showing ${start + 1}–${end} of ${total} ${total === 1 ? 'post' : 'posts'}`;
    if (q) label += ` matching “${q}”`;
    else if (active !== 'all') label += ` in ${CATEGORY_LABEL[active]}`;
    return label;
  })();

  return (
    <div className="chroma-home">
      <ChromaNav active="blog" />

      <header className="blog-hero">
        <div className="blog-wrap">
          <p className="eyebrow">The Chroma blog</p>
          <h1>Notes from the test runner.</h1>
          <p>{BLOG_DESCRIPTION}</p>
        </div>
      </header>

      <div className="blog-wrap">
        <div className="blog-toolbar" ref={toolbarRef}>
          <div className="filter-chips">
            <Link
              to="/blog"
              search={{}}
              className={active === 'all' ? 'chip active' : 'chip'}
            >
              All <span className="cnt">{counts.all}</span>
            </Link>
            {CATEGORIES.filter((cat) => counts[cat.key] > 0).map((cat) => (
              <Link
                key={cat.key}
                to="/blog"
                search={{ category: cat.key }}
                className={active === cat.key ? 'chip active' : 'chip'}
              >
                {cat.label} <span className="cnt">{counts[cat.key]}</span>
              </Link>
            ))}
          </div>
          <div className="search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={onSearch}
              placeholder="Search posts…"
              aria-label="Search posts"
            />
          </div>
        </div>

        <p className="result-count">{countLabel}</p>

        {total === 0 ? (
          <div className="no-results">
            <SearchIcon large />
            <b>No posts found</b>
            <span>Try a different category or search term.</span>
          </div>
        ) : (
          <div className="post-grid">
            {visible.map((post) =>
              post.slug === featuredSlug ? (
                <FeaturedCard key={post.slug} post={post} />
              ) : (
                <PostCard key={post.slug} post={post} />
              ),
            )}
          </div>
        )}

        {pages > 1 && !query.trim() && (
          <nav className="pager-nav" aria-label="Blog pages">
            {safePage > 1 ? (
              <Link
                to="/blog"
                search={blogListSearch(active, safePage - 1)}
                aria-label="Previous page"
                onClick={scrollToToolbar}
              >
                <ChevronLeft /> Prev
              </Link>
            ) : (
              <span className="pager-disabled" aria-hidden="true">
                <ChevronLeft /> Prev
              </span>
            )}
            {pagerItems(pages, safePage).map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="ellipsis">
                  …
                </span>
              ) : (
                <Link
                  key={n}
                  to="/blog"
                  search={blogListSearch(active, n)}
                  className={n === safePage ? 'active' : undefined}
                  aria-label={`Page ${n}`}
                  aria-current={n === safePage ? 'page' : undefined}
                  onClick={scrollToToolbar}
                >
                  {n}
                </Link>
              ),
            )}
            {safePage < pages ? (
              <Link
                to="/blog"
                search={blogListSearch(active, safePage + 1)}
                aria-label="Next page"
                onClick={scrollToToolbar}
              >
                Next <ChevronRight />
              </Link>
            ) : (
              <span className="pager-disabled" aria-hidden="true">
                Next <ChevronRight />
              </span>
            )}
          </nav>
        )}

        <div style={{ height: 64 }} />
      </div>

      <ChromaFooter />
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link className="pcard feat" to="/blog/$slug" params={{ slug: post.slug }}>
      <div className="ftxt">
        <div className="post-meta">
          <span className="tag">{CATEGORY_LABEL[post.category]}</span>
          <span>·</span>
          <span className="post-date">{formatDate(post.date)}</span>
        </div>
        <h3>{post.title}</h3>
        {post.description && <p>{post.description}</p>}
        <span className="read">Read the post →</span>
      </div>
      <div className="fart" aria-hidden="true">
        <div className="gloss">
          <code>
            <span style={{ color: '#fb923c' }}>$</span> npx playwright test
            <br />
            <span className="ok">✓</span> connect wallet{'  '}2.4s
            <br />
            <span className="ok">✓</span> approve tx{'     '}3.1s
            <br />
            <span className="ok">✓</span> 3 passed
          </code>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link className="pcard" to="/blog/$slug" params={{ slug: post.slug }}>
      <div className="post-meta">
        <span className="tag">{CATEGORY_LABEL[post.category]}</span>
        <span>·</span>
        <span className="post-date">{formatDate(post.date)}</span>
      </div>
      <h3>{post.title}</h3>
      {post.description && <p>{post.description}</p>}
      <span className="read">Read post →</span>
    </Link>
  );
}

function SearchIcon({ large }: { large?: boolean }) {
  const size = large ? 40 : 16;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={large ? 1.6 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
