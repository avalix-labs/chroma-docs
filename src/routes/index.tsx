import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, Blocks, FlaskConical, Terminal, Zap } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex min-h-[calc(100vh-64px)] flex-col">
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-32">
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
          />

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary px-4 py-1.5 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            Now supporting EVM chains
          </div>

          <h1 className="max-w-4xl text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            E2E Testing for{' '}
            <span className="underline decoration-4 decoration-emerald-500 underline-offset-4">
              Wallet Interactions
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-center text-lg text-fd-muted-foreground md:text-xl">
            Test your dApps with real wallet extensions. Built on Playwright for reliable, automated
            testing across Polkadot, EVM, and more.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/docs/$"
              params={{ _splat: '' }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-foreground px-6 py-3 text-base font-medium text-fd-background transition-opacity hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/avalix-labs/chroma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-base font-medium transition-colors hover:bg-fd-secondary"
            >
              <GitHubIcon className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <div className="mt-16 w-full max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-lg">
              <div className="flex items-center gap-2 border-b border-fd-border bg-fd-secondary/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-fd-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-fd-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-fd-muted-foreground/30" />
                </div>
                <span className="ml-2 font-mono text-xs text-fd-muted-foreground">wallet.spec.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code className="font-mono text-fd-foreground">
                  <span className="text-fd-muted-foreground">import</span> {'{'} test {'}'}{' '}
                  <span className="text-fd-muted-foreground">from</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;@avalix/chroma&apos;</span>
                  {'\n\n'}
                  <span className="text-fd-muted-foreground">test</span>(
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;connect wallet&apos;</span>,{' '}
                  <span className="text-fd-muted-foreground">async</span> {'({'} page, wallets {'}'}) {'=>'}{' '}
                  {'{\n'}
                  {'  '}
                  <span className="text-fd-muted-foreground">const</span> wallet = wallets[
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;polkadot-js&apos;</span>]
                  {'\n\n'}
                  {'  '}
                  <span className="text-fd-muted-foreground">await</span> wallet.importMnemonic({'{ '}seed
                  {'}'}){';\n'}
                  {'  '}
                  <span className="text-fd-muted-foreground">await</span> page.goto(
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;http://localhost:3000&apos;
                  </span>
                  ){'\n'}
                  {'  '}
                  <span className="text-fd-muted-foreground">await</span> wallet.authorize(){'\n'}
                  {'  '}
                  <span className="text-fd-muted-foreground">await</span> wallet.approveTx(){'\n'}
                  {'}'});
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section className="border-t border-fd-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Why Chroma?</h2>
            <p className="mx-auto mb-16 max-w-2xl text-center text-fd-muted-foreground">
              Built specifically for Web3 developers who need reliable wallet testing
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<FlaskConical className="h-6 w-6" />}
                title="Real Wallet Testing"
                description="Test with actual wallet extensions like Polkadot.js, Talisman, and MetaMask. No mocks, no stubs."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Playwright Powered"
                description="Built on top of Playwright for reliable, fast, and maintainable browser automation."
              />
              <FeatureCard
                icon={<Blocks className="h-6 w-6" />}
                title="Multi-Chain Ready"
                description="Support for Polkadot ecosystem, EVM (including MetaMask), and SVM chains coming soon."
              />
            </div>
          </div>
        </section>

        <section className="border-t border-fd-border bg-fd-secondary/30 px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Get Started in Seconds</h2>
            <p className="mb-8 text-fd-muted-foreground">Install Chroma and start testing your dApp</p>

            <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card text-left">
              <div className="flex items-center gap-2 border-b border-fd-border bg-fd-secondary/50 px-4 py-3">
                <Terminal className="h-4 w-4 text-fd-muted-foreground" />
                <span className="font-mono text-xs text-fd-muted-foreground">Terminal</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code className="font-mono text-fd-foreground">
                  <span className="text-fd-muted-foreground"># Install package</span>
                  {'\n'}
                  npm install @avalix/chroma{'\n\n'}
                  <span className="text-fd-muted-foreground"># Download wallet extensions</span>
                  {'\n'}
                  npx chroma download-extensions{'\n\n'}
                  <span className="text-fd-muted-foreground"># Run tests</span>
                  {'\n'}
                  npm test
                </code>
              </pre>
            </div>

            <Link
              to="/docs/$"
              params={{ _splat: 'installation' }}
              className="mt-8 inline-flex items-center gap-2 text-fd-foreground hover:underline"
            >
              View full installation guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-auto border-t border-fd-border px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-fd-muted-foreground">
              Built by{' '}
              <a
                href="https://github.com/avalix-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-foreground hover:underline"
              >
                Avalix Labs
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/docs/$" params={{ _splat: '' }} className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
                Documentation
              </Link>
              <a
                href="https://github.com/avalix-labs/chroma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/@avalix/chroma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                npm
              </a>
            </div>
          </div>
        </footer>
      </main>
    </HomeLayout>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-foreground/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-secondary">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}
