import { blog } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const data = page.data as { title: string };

  return new ImageResponse(
    <DefaultImage
      title={data.title}
      site="@avalix/chroma"
      primaryColor="rgba(255,255,255,0.12)"
      primaryTextColor="rgb(230,230,230)"
    />,
    { ...size },
  );
}
