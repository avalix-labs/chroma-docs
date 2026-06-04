/**
 * The blog frontmatter has no per-post category, so we derive an ecosystem
 * bucket from the slug. This mirrors the project's own positioning
 * (Polkadot · Ethereum · Solana) and powers the design's filter chips with live
 * counts. Order is priority order: chain-specific buckets win over the generic
 * "testing" fallback used for cross-cutting methodology posts.
 */
export const CATEGORIES = [
  { key: 'ethereum', label: 'Ethereum' },
  { key: 'polkadot', label: 'Polkadot' },
  { key: 'solana', label: 'Solana' },
  { key: 'testing', label: 'Testing' },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export const CATEGORY_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<CategoryKey, string>;

export function categorize(slug: string): CategoryKey {
  const s = slug.toLowerCase();
  const has = (kws: string[]) => kws.some((k) => s.includes(k));
  if (has(['solana', 'anchor', 'x402', 'simd', 'alpenglow', 'surfpool', 'litesvm'])) return 'solana';
  if (has(['polkadot', 'xcm', 'kusama', 'parachain', 'substrate'])) return 'polkadot';
  if (
    has([
      'eip', 'erc', 'evm', 'ethereum', 'metamask', 'foundry', 'hardhat', 'solidity', 'viem',
      'wagmi', 'anvil', 'glamsterdam', 'fusaka', 'defi', 'verkle', 'tempo',
    ])
  )
    return 'ethereum';
  return 'testing';
}
