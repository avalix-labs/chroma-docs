import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { redirect } from '@tanstack/react-router';
import { docsRoute } from '@/lib/shared';
import { slugsToMarkdownPath } from '@/lib/source';

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);

  if (
    url.pathname.startsWith(docsRoute) &&
    !url.pathname.endsWith('.md') &&
    isMarkdownPreferred(request)
  ) {
    const slugs = url.pathname
      .slice(docsRoute.length)
      .split('/')
      .filter((v) => v.length > 0);
    url.pathname = slugsToMarkdownPath(slugs).url;

    throw redirect({ href: `${url.pathname}${url.search}` });
  }

  return next();
});

// Server functions are same-origin RPC endpoints; protect them from cross-site
// requests. The filter scopes the CSRF check to server-fn handlers only, leaving
// normal router/document requests untouched.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [csrfMiddleware, llmMiddleware],
  };
});
