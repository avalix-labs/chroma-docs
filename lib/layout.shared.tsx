import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Chroma',
    },
    links: [
      {
        text: 'Documentation',
        url: '/docs',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/avalix-labs/chroma',
        external: true,
      },
    ],
  };
}
