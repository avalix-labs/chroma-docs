# Chroma Documentation

Official documentation website for [Chroma](https://github.com/avalix-labs/chroma) - an end-to-end (E2E) testing library for wallet interactions across multiple blockchain ecosystems.

## About Chroma

Chroma enables developers to write automated tests that interact with real wallet extensions, providing a comprehensive testing solution for decentralized applications (dApps).

Initially designed for the Polkadot ecosystem, Chroma is expanding to support EVM (Ethereum Virtual Machine) and SVM (Solana Virtual Machine) chains.

## Development

This documentation site is built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

### Prerequisites

- [Bun](https://bun.sh) 1.0+

### Getting Started

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun dev
```

Open http://localhost:3000 with your browser to see the result.

### Build

```bash
bun run build
```

## Project Structure

| Path | Description |
| --- | --- |
| `content/docs` | Documentation MDX files |
| `app/(home)` | Landing page |
| `app/docs` | Documentation layout and pages |
| `lib/source.ts` | Content source adapter |

## Links

- [Chroma Repository](https://github.com/avalix-labs/chroma)
- [Chroma Examples](https://github.com/avalix-labs/chroma-examples)

## License

MIT
