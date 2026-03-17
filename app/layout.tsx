import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chroma.avalix.dev'),
  title: {
    default: '@avalix/chroma',
    template: '%s | @avalix/chroma',
  },
  description: 'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
  openGraph: {
    title: '@avalix/chroma',
    description: 'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
    url: '/',
    siteName: '@avalix/chroma',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '@avalix/chroma',
    description: 'End-to-end testing library for wallet interactions across multiple blockchain ecosystems',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
