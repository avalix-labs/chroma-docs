import { ImageResponse, loadGoogleFont } from 'workers-og';

/** Brand wordmark shown on every generated social card. */
export const OG_BRAND = '@avalix/chroma';

/** Default accent, matching the Ethereum/brand purple used across the site. */
export const OG_DEFAULT_ACCENT = '#7c8cff';

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

/**
 * Render a 1200×630 social card (PNG) from an HTML string using satori + resvg.
 *
 * `glyphText` should contain every character the card renders so the Inter
 * fonts can be subset down to just those glyphs, keeping the payload small.
 */
export async function renderOgCard(html: string, glyphText: string): Promise<ImageResponse> {
  const [interBold, interRegular] = await Promise.all([
    loadGoogleFont({ family: 'Inter', weight: 700, text: glyphText }),
    loadGoogleFont({ family: 'Inter', weight: 400, text: glyphText }),
  ]);

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
    ],
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=31536000',
    },
  });
}

/**
 * Shared card layout: an eyebrow chip, a large title, and a meta line.
 * Used by both the blog and docs OG image routes.
 */
export function ogCardHtml({
  eyebrow,
  title,
  meta,
  accent = OG_DEFAULT_ACCENT,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  accent?: string;
}): { html: string; glyphText: string } {
  const html = `
    <div style="display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;padding:72px;background:#0b0d12;font-family:'Inter';">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;">
          <div style="display:flex;width:20px;height:20px;border-radius:6px;background:${accent};margin-right:16px;"></div>
          <div style="display:flex;font-size:30px;font-weight:700;color:#e8ecf4;">${escapeHtml(OG_BRAND)}</div>
        </div>
        <div style="display:flex;padding:10px 24px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid ${accent};color:${accent};font-size:26px;font-weight:600;">${escapeHtml(eyebrow)}</div>
      </div>
      <div style="display:flex;font-size:64px;line-height:1.12;font-weight:700;color:#f5f7fb;max-width:1056px;">${escapeHtml(title)}</div>
      <div style="display:flex;align-items:center;font-size:28px;color:#9aa6bd;">${meta ? escapeHtml(meta) : ''}</div>
    </div>
  `;
  const glyphText = `${title}${eyebrow}${meta ?? ''}${OG_BRAND}·`;
  return { html, glyphText };
}
