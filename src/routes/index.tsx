import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  Cuboid,
  Database,
  Grid2X2,
  MonitorCheck,
  Play,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  component: HomePage,
});

const terminalLines = [
  { kind: 'cmd', text: 'npx chroma download-extensions' },
  { kind: 'ok', text: 'polkadot-js   v0.62.6' },
  { kind: 'ok', text: 'talisman      v3.1.13' },
  { kind: 'ok', text: 'metamask      v13.28.0' },
  { kind: 'space', text: '' },
  { kind: 'cmd', text: 'npx playwright test' },
  { kind: 'dim', text: 'Running 3 tests using 1 worker' },
  { kind: 'ok', text: 'wallet connects and authorizes   2.4s' },
  { kind: 'ok', text: 'approves a transaction           3.1s' },
  { kind: 'ok', text: 'rejects a transaction            1.6s' },
  { kind: 'space', text: '' },
  { kind: 'pass', text: '3 passed (7.4s)' },
];

const codeExamples = {
  pjs: {
    label: 'polkadot-js',
    code: `import { createWalletTest } from '@avalix/chroma'

const test = createWalletTest({
  wallets: [{ type: 'polkadot-js' }],
})

test('connects and signs', async ({ page, wallets }) => {
  const pjs = wallets['polkadot-js']

  await pjs.importMnemonic({
    seed: 'bottom drive obey lake curtain smoke...',
  })

  await page.goto('http://localhost:3000')
  await pjs.authorize()
  await pjs.approveTx()
})`,
  },
  mm: {
    label: 'metamask',
    code: `import { createWalletTest } from '@avalix/chroma'

const test = createWalletTest({
  wallets: [{ type: 'metamask' }],
})

test('confirms an EVM flow', async ({ page, wallets }) => {
  const mm = wallets.metamask

  await mm.importSeedPhrase({
    seedPhrase: 'test test test ... junk',
  })
  await mm.unlock()

  await page.goto('http://localhost:3000')
  await mm.approve()
})`,
  },
  tal: {
    label: 'talisman',
    code: `import { createWalletTest } from '@avalix/chroma'

const test = createWalletTest({
  wallets: [{ type: 'talisman' }],
})

test('authorizes a substrate dApp', async ({ page, wallets }) => {
  const talisman = wallets.talisman

  await talisman.importPolkadotMnemonic({
    seed: 'bottom drive obey lake curtain...',
    name: 'Alice',
  })

  await page.goto('http://localhost:3000')
  await talisman.authorize()
  await talisman.approveTx()
})`,
  },
};

type CodeTab = keyof typeof codeExamples;

function HomePage() {
  const [copied, setCopied] = useState(false);
  const [activeCode, setActiveCode] = useState<CodeTab>('pjs');

  async function copyInstallCommand() {
    await navigator.clipboard?.writeText('npm install @avalix/chroma @playwright/test');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <HomeLayout {...baseOptions()}>
      <main className="chroma-landing">
        <section className="chroma-hero" aria-labelledby="chroma-hero-title">
          <div className="chroma-wrap chroma-hero-grid">
            <div className="chroma-hero-copy">
              <p className="chroma-eyebrow">End-to-end wallet testing</p>
              <h1 id="chroma-hero-title">
                Test real wallet flows across <span>every chain</span>.
              </h1>
              <p className="chroma-lede">
                Chroma drives Polkadot, Ethereum and Solana wallet extensions inside real
                Playwright tests. Import seeds, authorize dApps, approve or reject transactions,
                and keep the whole flow in code.
              </p>

              <div className="chroma-actions">
                <div className="chroma-install-command">
                  <span>
                    <b>$</b> npm i @avalix/chroma
                  </span>
                  <button type="button" onClick={copyInstallCommand} aria-label="Copy install command">
                    {copied ? <Check aria-hidden className="size-4" /> : <Clipboard aria-hidden className="size-4" />}
                  </button>
                </div>
                <Link to="/docs/$" params={{ _splat: 'installation' }} className="chroma-button chroma-button-secondary">
                  Read the docs
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>

              <div className="chroma-proof-row" aria-label="Supported chains">
                <span>Built on <strong>Playwright</strong></span>
                <i aria-hidden />
                <ChainDot color="pink" label="Polkadot" />
                <ChainDot color="blue" label="Ethereum" />
                <ChainDot color="green" label="Solana" />
              </div>
            </div>

            <TerminalShowcase />
          </div>
        </section>

        <section className="chroma-section chroma-section-light" aria-labelledby="why-chroma">
          <div className="chroma-wrap">
            <SectionHeader
              eyebrow="Why Chroma"
              title="Wallet automation that behaves like a user."
              description="No stubbed providers or injected globals. Chroma loads real browser extensions and drives their popups, side panels and confirmation screens."
            />

            <div className="chroma-feature-grid">
              <FeatureCard
                icon={<Cuboid aria-hidden />}
                title="Real extensions, real popups"
                description="Polkadot-JS, Talisman and MetaMask run as actual Chromium extensions in the same browser context your tests control."
              />
              <FeatureCard
                icon={<Grid2X2 aria-hidden />}
                title="Multi-wallet by design"
                description="Declare one wallet or several. The typed fixture exposes only the wallets you configure, with wallet-specific methods."
              />
              <FeatureCard
                icon={<Sparkles aria-hidden />}
                title="Persistent profiles"
                description="Import an account once, reuse it across the worker, and clone prepared profiles for fast isolated parallel runs."
              />
              <FeatureCard
                icon={<MonitorCheck aria-hidden />}
                title="Drop-in Playwright"
                description="createWalletTest() returns a familiar test object, so locators, assertions, traces and reporters keep working."
              />
              <FeatureCard
                icon={<Database aria-hidden />}
                title="One CLI for fixtures"
                description="npx chroma download-extensions pulls pinned wallet builds into .chroma for reproducible local and CI runs."
              />
              <FeatureCard
                icon={<Terminal aria-hidden />}
                title="Headless and Docker-ready"
                description="Run headed while developing, then ship the same suite headless in CI with the same wallet fixtures."
              />
            </div>
          </div>
        </section>

        <section className="chroma-section chroma-code-section" aria-labelledby="code-showcase">
          <div className="chroma-wrap chroma-show-grid">
            <div>
              <p className="chroma-eyebrow">From zero to signed tx</p>
              <h2 id="code-showcase">A whole wallet flow, in a few lines.</h2>
              <p className="chroma-section-copy">
                Configure the wallets you need, import an account, then walk the dApp exactly like
                a user. The browser trace tells the same story your product team sees on screen.
              </p>

              <ol className="chroma-steps">
                <Step number="1" title="Configure" description="Pass wallets to createWalletTest() and get a typed test fixture." />
                <Step number="2" title="Import" description="Seed an account through the real extension onboarding flow." />
                <Step number="3" title="Authorize and sign" description="Connect to the dApp, then approve or reject the transaction popup." />
              </ol>
            </div>

            <div className="chroma-code-card">
              <div className="chroma-card-head">
                <Dots />
                <span>wallet.spec.ts</span>
                <div className="chroma-code-tabs" role="tablist" aria-label="Wallet code examples">
                  {(Object.keys(codeExamples) as CodeTab[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={activeCode === key}
                      className={activeCode === key ? 'is-active' : ''}
                      onClick={() => setActiveCode(key)}
                    >
                      {codeExamples[key].label}
                    </button>
                  ))}
                </div>
              </div>
              <pre>
                <code>{codeExamples[activeCode].code}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="chroma-section chroma-section-light" aria-labelledby="coverage">
          <div className="chroma-wrap">
            <SectionHeader
              eyebrow="Coverage"
              title="Wallets and chains, accounted for."
              description="The matrix grows with every release. Here is the current surface area for real wallet automation."
            />

            <div className="chroma-matrix">
              <MatrixCard
                title="Wallets"
                rows={[
                  ['P', 'Polkadot JS Extension', 'v0.62.6', 'supported', 'pink'],
                  ['T', 'Talisman', 'v3.1.13', 'supported', 'red'],
                  ['M', 'MetaMask', 'v13.28.0', 'supported', 'orange'],
                  ['S', 'SubWallet', 'roadmap', 'planned', 'violet'],
                ]}
              />
              <MatrixCard
                title="Chains"
                rows={[
                  ['', 'Polkadot', 'substrate flows', 'supported', 'pink'],
                  ['', 'Ethereum', 'EVM flows', 'supported', 'blue'],
                  ['', 'Solana', 'SVM flows', 'supported', 'green'],
                  ['', 'More chains', 'roadmap', 'planned', 'stone'],
                ]}
              />
            </div>
          </div>
        </section>

        <section className="chroma-section chroma-final-cta" aria-labelledby="final-cta">
          <div className="chroma-wrap">
            <div className="chroma-cta-panel">
              <p className="chroma-eyebrow">Ready for CI</p>
              <h2 id="final-cta">Ship wallet features without the manual QA loop.</h2>
              <p>Install the package, download the extensions, and write your first test in minutes.</p>
              <div className="chroma-actions">
                <Link to="/docs/$" params={{ _splat: 'quick-start' }} className="chroma-button chroma-button-primary">
                  Get started
                  <Play aria-hidden className="size-4" />
                </Link>
                <a
                  href="https://github.com/avalix-labs/chroma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chroma-button chroma-button-secondary chroma-button-on-dark"
                >
                  <GitHubIcon className="size-4" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="chroma-footer">
          <div className="chroma-wrap chroma-footer-grid">
            <div>
              <Link to="/" className="chroma-wordmark">
                Chroma<span>_</span>
              </Link>
              <p>End-to-end testing for Polkadot, Ethereum and Solana wallet interactions.</p>
            </div>
            <nav aria-label="Footer navigation">
              <Link to="/docs/$" params={{ _splat: '' }}>Docs</Link>
              <Link to="/blog">Blog</Link>
              <a href="https://www.npmjs.com/package/@avalix/chroma" target="_blank" rel="noopener noreferrer">npm</a>
              <a href="https://github.com/avalix-labs/chroma" target="_blank" rel="noopener noreferrer">GitHub</a>
            </nav>
          </div>
        </footer>
      </main>
    </HomeLayout>
  );
}

function TerminalShowcase() {
  return (
    <div className="chroma-terminal" aria-label="Chroma Playwright terminal output">
      <div className="chroma-card-head">
        <Dots />
        <span>chroma - playwright test</span>
        <Code2 aria-hidden className="ml-auto size-4" />
      </div>
      <div className="chroma-terminal-body">
        {terminalLines.map((line, index) => (
          <div
            key={`${line.text}-${index}`}
            className={`chroma-terminal-line is-${line.kind}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            {line.kind === 'cmd' && <span className="chroma-prompt">$</span>}
            {line.kind === 'ok' && <Check aria-hidden className="size-4" />}
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="chroma-section-head">
      <p className="chroma-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <article className="chroma-feature-card">
      <div className="chroma-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <li>
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </li>
  );
}

function MatrixCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string, string, string, string]>;
}) {
  return (
    <div className="chroma-matrix-card">
      <h3>{title}</h3>
      {rows.map(([initial, name, detail, status, color]) => (
        <div className="chroma-matrix-row" key={name}>
          <span className="chroma-matrix-name">
            {initial ? (
              <b className={`chroma-logo-mark is-${color}`}>{initial}</b>
            ) : (
              <i className={`chroma-chain-mark is-${color}`} aria-hidden />
            )}
            {name}
          </span>
          <span>{detail}</span>
          <em className={status === 'supported' ? 'is-supported' : 'is-planned'}>{status}</em>
        </div>
      ))}
    </div>
  );
}

function ChainDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="chroma-chain-label">
      <i className={`chroma-chain-mark is-${color}`} aria-hidden />
      {label}
    </span>
  );
}

function Dots() {
  return (
    <span className="chroma-dots" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
