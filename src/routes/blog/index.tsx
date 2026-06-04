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
import { blog } from '@/lib/source';
import chromaBlogCss from '@/styles/chroma-blog.css?url';
import chromaHomeCss from '@/styles/chroma-home.css?url';

const PAGE_SIZE = 9;

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
  loader: () => getBlogPosts(),
  component: BlogPage,
  head: () => ({
    meta: [
      { title: 'Blog | @avalix/chroma' },
      {
        name: 'description',
        content: 'Releases, engineering deep-dives and practical guides from the team building Chroma.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: chromaHomeCss },
      { rel: 'stylesheet', href: chromaBlogCss },
    ],
  }),
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
  const [active, setActive] = useState<'all' | CategoryKey>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
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

  const onFilter = (key: 'all' | CategoryKey) => {
    setActive(key);
    setPage(1);
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };
  const goTo = (p: number) => {
    setPage(p);
    const el = toolbarRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
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
          <p>Releases, engineering deep-dives and practical guides from the team building Chroma.</p>
        </div>
      </header>

      <div className="blog-wrap">
        {/* Toolbar: category filter + search */}
        <div className="blog-toolbar" ref={toolbarRef}>
          <div className="filter-chips">
            <button
              type="button"
              className={active === 'all' ? 'chip active' : 'chip'}
              onClick={() => onFilter('all')}
            >
              All <span className="cnt">{counts.all}</span>
            </button>
            {CATEGORIES.filter((cat) => counts[cat.key] > 0).map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={active === cat.key ? 'chip active' : 'chip'}
                onClick={() => onFilter(cat.key)}
              >
                {cat.label} <span className="cnt">{counts[cat.key]}</span>
              </button>
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

        {pages > 1 && (
          <nav className="pager-nav" aria-label="Blog pages">
            <button
              type="button"
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft /> Prev
            </button>
            {pagerItems(pages, safePage).map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="ellipsis">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={n}
                  className={n === safePage ? 'active' : undefined}
                  onClick={() => goTo(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === safePage ? 'page' : undefined}
                >
                  {n}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === pages}
              aria-label="Next page"
            >
              Next <ChevronRight />
            </button>
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
