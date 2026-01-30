import Link from 'next/link';
import { ArrowRight, Blocks, FlaskConical, Zap, Github, Terminal } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-fd-secondary border border-fd-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          Now supporting EVM chains
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl tracking-tight">
          E2E Testing for{' '}
          <span className="underline decoration-emerald-500 decoration-4 underline-offset-4">
            Wallet Interactions
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-fd-muted-foreground text-center max-w-2xl">
          Test your dApps with real wallet extensions. Built on Playwright for reliable, 
          automated testing across Polkadot, EVM, and more.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg bg-fd-foreground text-fd-background hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/avalix-labs/chroma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-fd-border bg-fd-background hover:bg-fd-secondary transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </Link>
        </div>

        {/* Code preview */}
        <div className="mt-16 w-full max-w-2xl">
          <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-fd-border bg-fd-secondary/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-fd-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-fd-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-fd-muted-foreground/30" />
              </div>
              <span className="text-xs text-fd-muted-foreground ml-2 font-mono">wallet.spec.ts</span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-fd-foreground font-mono">
                <span className="text-fd-muted-foreground">import</span> {'{'} test {'}'} <span className="text-fd-muted-foreground">from</span> <span className="text-emerald-600 dark:text-emerald-400">&apos;@avalix/chroma&apos;</span>{'\n\n'}
                <span className="text-fd-muted-foreground">test</span>(<span className="text-emerald-600 dark:text-emerald-400">&apos;connect wallet&apos;</span>, <span className="text-fd-muted-foreground">async</span> {'({'} page, wallets {'}'}) {'=>'} {'{\n'}
                {'  '}<span className="text-fd-muted-foreground">const</span> wallet = wallets[<span className="text-emerald-600 dark:text-emerald-400">&apos;polkadot-js&apos;</span>]{'\n\n'}
                {'  '}<span className="text-fd-muted-foreground">await</span> wallet.importMnemonic({'{ '}seed{'}'}){';\n'}
                {'  '}<span className="text-fd-muted-foreground">await</span> page.goto(<span className="text-emerald-600 dark:text-emerald-400">&apos;http://localhost:3000&apos;</span>){'\n'}
                {'  '}<span className="text-fd-muted-foreground">await</span> wallet.authorize(){'\n'}
                {'  '}<span className="text-fd-muted-foreground">await</span> wallet.approveTx(){'\n'}
                {'}'});
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t border-fd-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Chroma?
          </h2>
          <p className="text-fd-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Built specifically for Web3 developers who need reliable wallet testing
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FlaskConical className="w-6 h-6" />}
              title="Real Wallet Testing"
              description="Test with actual wallet extensions like Polkadot.js and Talisman. No mocks, no stubs."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Playwright Powered"
              description="Built on top of Playwright for reliable, fast, and maintainable browser automation."
            />
            <FeatureCard
              icon={<Blocks className="w-6 h-6" />}
              title="Multi-Chain Ready"
              description="Support for Polkadot ecosystem with EVM and SVM chains coming soon."
            />
          </div>
        </div>
      </section>

      {/* Install Section */}
      <section className="px-6 py-20 border-t border-fd-border bg-fd-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Seconds
          </h2>
          <p className="text-fd-muted-foreground mb-8">
            Install Chroma and start testing your dApp
          </p>

          <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-fd-border bg-fd-secondary/50">
              <Terminal className="w-4 h-4 text-fd-muted-foreground" />
              <span className="text-xs text-fd-muted-foreground font-mono">Terminal</span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-fd-foreground font-mono">
                <span className="text-fd-muted-foreground"># Install package</span>{'\n'}
                npm install @avalix/chroma{'\n\n'}
                <span className="text-fd-muted-foreground"># Download wallet extensions</span>{'\n'}
                npx chroma download-extensions{'\n\n'}
                <span className="text-fd-muted-foreground"># Run tests</span>{'\n'}
                npm test
              </code>
            </pre>
          </div>

          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-2 mt-8 text-fd-foreground hover:underline"
          >
            View full installation guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-fd-border mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-fd-muted-foreground">
            Built by{' '}
            <Link href="https://github.com/avalix-labs" target="_blank" rel="noopener noreferrer" className="text-fd-foreground hover:underline">
              Avalix Labs
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/docs" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
              Documentation
            </Link>
            <Link href="https://github.com/avalix-labs/chroma" target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
              GitHub
            </Link>
            <Link href="https://www.npmjs.com/package/@avalix/chroma" target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
              npm
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-fd-border bg-fd-card hover:border-fd-foreground/20 transition-colors">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-fd-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-fd-muted-foreground text-sm">{description}</p>
    </div>
  );
}
