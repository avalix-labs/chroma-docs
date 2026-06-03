# Chroma Documentation

Official documentation website for [Chroma](https://github.com/avalix-labs/chroma) - an end-to-end (E2E) testing library for wallet interactions across multiple blockchain ecosystems.

## About Chroma

Chroma enables developers to write automated tests that interact with real wallet extensions, providing a comprehensive testing solution for decentralized applications (dApps).

Initially designed for the Polkadot ecosystem, Chroma is expanding to support EVM (Ethereum Virtual Machine) and SVM (Solana Virtual Machine) chains.

## Development

This documentation site is built with [TanStack Start](https://tanstack.com/start) and [Fumadocs](https://fumadocs.dev).

### Prerequisites

- Node.js 22+
- npm, pnpm, yarn, or bun

### Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

### Build

```bash
npm run build
npm run preview
```

### Deploy (Cloudflare Workers)

```bash
npm run deploy
```

Requires `wrangler login` once locally. The project uses `@cloudflare/vite-plugin` with `wrangler.jsonc` (not the Vercel/Nitro output).

## Project Structure

| Path | Description |
| --- | --- |
| `content/docs` | Documentation MDX files |
| `content/blog` | Blog MDX posts |
| `src/routes` | TanStack Start file-based routes |
| `src/lib/source.ts` | Content source adapter |

## Links

- [Chroma Repository](https://github.com/avalix-labs/chroma)
- [Chroma Examples](https://github.com/avalix-labs/chroma-examples)

## License

MIT
