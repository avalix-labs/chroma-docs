import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import browserCollections from 'collections/browser';
import { ScrollToHash } from '@/components/scroll-to-hash';
import { useMDXComponents } from '@/components/mdx';
import { baseOptions } from '@/lib/layout.shared';
import { getPageImage, slugsToMarkdownPath, source } from '@/lib/source';
import { gitConfig } from '@/lib/shared';
import { SITE_URL } from '@/lib/site';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} | @avalix/chroma` },
        { name: 'description', content: loaderData.description ?? '' },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.description ?? '' },
        { property: 'og:image', content: `${SITE_URL}${loaderData.ogImage}` },
      ],
    };
  },
});

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
      markdownUrl: slugsToMarkdownPath(page.slugs).url,
      ogImage: getPageImage(page).url,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    { markdownUrl, path }: { markdownUrl: string; path: string },
  ) {
    return (
      <DocsPage toc={toc} full={frontmatter.full}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription className="mb-0">{frontmatter.description}</DocsDescription>
        <div className="-mt-4 flex flex-row items-center gap-2 border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
          />
        </div>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const { path, pageTree, markdownUrl } = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions()} tree={pageTree}>
      <ScrollToHash />
      <Suspense>{clientLoader.useContent(path, { markdownUrl, path })}</Suspense>
    </DocsLayout>
  );
}
