import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { SITE_URL } from '@/lib/site';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: '@avalix/chroma',
      },
      {
        name: 'description',
        content:
          'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
      },
      { property: 'og:title', content: '@avalix/chroma' },
      {
        property: 'og:description',
        content:
          'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
      },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:site_name', content: '@avalix/chroma' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: '@avalix/chroma' },
      {
        name: 'twitter:description',
        content:
          'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
      },
      { name: 'google-site-verification', content: 'C-ECLejZY-mzsuDPXpkFB6AWB_ZohcmCha2G-6YmGyE' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="font-[family-name:var(--font-inter,Inter,sans-serif)]" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
