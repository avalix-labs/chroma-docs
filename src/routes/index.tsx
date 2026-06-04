import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import chromaHomeCss from '@/styles/chroma-home.css?url';

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'stylesheet', href: chromaHomeCss }],
  }),
  component: HomePage,
});

const INSTALL_CMD = 'npm install @avalix/chroma @playwright/test';

type TermLine = { type: 'cmd' | 'out'; text: string; cls?: string; delay?: number };

const TERMINAL_LINES: TermLine[] = [
  { type: 'cmd', text: 'npx chroma download-extensions' },
  { type: 'out', text: '<span class="ok">✓</span> polkadot-js   <span class="dim">v0.62.6</span>', delay: 260 },
  { type: 'out', text: '<span class="ok">✓</span> talisman      <span class="dim">v3.1.13</span>', delay: 200 },
  { type: 'out', text: '<span class="ok">✓</span> metamask      <span class="dim">v13.28.0 (Flask)</span>', delay: 200 },
  { type: 'out', text: ' ', delay: 260 },
  { type: 'cmd', text: 'npx playwright test' },
  { type: 'out', text: '<span class="dim">Running 3 tests using 1 worker</span>', delay: 420 },
  { type: 'out', text: '<span class="ok">✓</span> wallet connects and authorizes   <span class="num">2.4s</span>', delay: 520 },
  { type: 'out', text: '<span class="ok">✓</span> approves a transaction           <span class="num">3.1s</span>', delay: 520 },
  { type: 'out', text: '<span class="ok">✓</span> rejects a transaction            <span class="num">1.6s</span>', delay: 520 },
  { type: 'out', text: ' ', delay: 260 },
  { type: 'out', text: '<span class="ok">✓</span> 3 passed <span class="dim">(7.4s)</span>', cls: 'pass', delay: 200 },
];

function lineHTML(line: TermLine, text: string) {
  const cls = 'tl' + (line.cls ? ' ' + line.cls : '');
  const pre = line.type === 'cmd' ? '<span class="tprompt">$</span> ' : '';
  return `<div class="${cls}">${pre}<span class="ttext">${text}</span></div>`;
}

const TERMINAL_FINAL_HTML = TERMINAL_LINES.map((l) => lineHTML(l, l.text)).join('');

/** Ports chroma.js's animated terminal: types commands char-by-char and reveals
 *  output lines, respecting prefers-reduced-motion. The terminal renders EMPTY on
 *  the server/first paint (no flash of the completed run); the client fills it in —
 *  animating it, or showing the final state instantly when motion is reduced. */
function useTerminal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const term = ref.current;
    if (!term) return;

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      term.innerHTML = TERMINAL_FINAL_HTML; // no animation: show the completed run
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const wait = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    term.innerHTML = '';
    let li = 0;

    function nextLine() {
      if (!term) return;
      if (li >= TERMINAL_LINES.length) {
        const cur = term.querySelector('.cursor');
        if (cur) cur.remove();
        return;
      }
      const l = TERMINAL_LINES[li];
      const div = document.createElement('div');
      div.className = 'tl' + (l.cls ? ' ' + l.cls : '');
      const pre = l.type === 'cmd' ? '<span class="tprompt">$</span> ' : '';
      div.innerHTML = pre + '<span class="ttext"></span><span class="cursor"></span>';
      term.appendChild(div);
      const span = div.querySelector('.ttext') as HTMLElement;
      const full = l.text || '';

      if (l.type === 'cmd') {
        let i = 0;
        const type = () => {
          span.textContent = full.slice(0, i);
          if (i <= full.length) {
            i++;
            wait(type, 26);
          } else {
            const c = div.querySelector('.cursor');
            if (c) c.remove();
            li++;
            wait(nextLine, 320);
          }
        };
        type();
      } else {
        span.innerHTML = full;
        const c = div.querySelector('.cursor');
        if (c) c.remove();
        li++;
        wait(nextLine, l.delay || 220);
      }
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      nextLine();
    };

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              start();
              io?.disconnect();
            }
          });
        },
        { threshold: 0.25 },
      );
      io.observe(term);
    }
    const fallback = setTimeout(start, 700);

    return () => {
      clearTimeout(fallback);
      timers.forEach((id) => clearTimeout(id));
      io?.disconnect();
    };
  }, [ref]);
}

function HomePage() {
  const termRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'pjs' | 'mm' | 'tal'>('pjs');
  const [copied, setCopied] = useState(false);
  useTerminal(termRef);

  const copyInstall = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="chroma-home">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <Link className="brand" to="/">
            Chroma<span className="dot">_</span>
          </Link>
          <div className="nav-links">
            <Link to="/docs/$" params={{ _splat: '' }}>
              Docs
            </Link>
            <Link to="/docs/$" params={{ _splat: 'quick-start' }}>
              Quick start
            </Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className="nav-right">
            <span className="nav-version">v1.0.1</span>
            <a
              className="icon-link"
              href="https://github.com/avalix-labs/chroma"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </a>
            <Link
              className="btn btn-primary"
              to="/docs/$"
              params={{ _splat: '' }}
              style={{ padding: '8px 15px' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">End-to-end wallet testing</p>
            <h1>
              Test real wallet flows
              <br />
              across <span className="spectrum">every chain</span>.
            </h1>
            <p className="lede">
              Chroma drives Polkadot, Ethereum &amp; Solana wallet extensions inside real Playwright
              tests — import seeds, authorize dApps, approve and reject transactions, all in code.
            </p>
            <div className="hero-cta">
              <span className="cmd">
                <span>
                  <span className="prompt">$</span> npm i @avalix/chroma
                </span>
                <button
                  type="button"
                  onClick={copyInstall}
                  className={copied ? 'copied' : undefined}
                  aria-label="Copy install command"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </span>
              <Link className="btn btn-ghost" to="/docs/$" params={{ _splat: '' }}>
                Read the docs →
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                Built on <strong style={{ color: 'var(--ink-2)' }}>Playwright</strong>
              </span>
              <div className="sep" />
              <div className="chains-inline">
                <span>
                  <i className="chain-dot" style={{ background: 'var(--polkadot)' }} />
                  Polkadot
                </span>
                <span>
                  <i className="chain-dot" style={{ background: 'var(--ethereum)' }} />
                  Ethereum
                </span>
                <span>
                  <i className="chain-dot" style={{ background: 'var(--solana)' }} />
                  Solana
                </span>
              </div>
            </div>
          </div>

          {/* Animated terminal */}
          <div className="term" aria-hidden="true">
            <div className="term-head">
              <div className="dots">
                <i />
                <i />
                <i />
              </div>
              <span className="ttitle">chroma — playwright test</span>
            </div>
            {/* Empty on first paint; useTerminal fills/animates it on the client. */}
            <div className="term-body" ref={termRef} />
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="band">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Why Chroma</p>
            <h2>Wallet automation that behaves like a user — not a mock.</h2>
            <p>
              No stubbed providers or injected globals. Chroma loads the real browser extensions and
              clicks through them, so your tests exercise the exact flows your users hit.
            </p>
          </div>
          <div className="feat-grid">
            <Feature
              icon={<IconBox />}
              title="Real extensions, real popups"
              body={
                <>
                  Polkadot-JS, Talisman and MetaMask run as actual Chromium extensions. Chroma finds
                  their popups and side panels and drives them like a person would.
                </>
              }
            />
            <Feature
              icon={<IconGrid />}
              title="Multi-wallet by design"
              body={
                <>
                  Configure one wallet or several in a single test. The <code>wallets</code> fixture
                  is fully typed — only the wallets you declare show up, with their own methods.
                </>
              }
            />
            <Feature
              icon={<IconGear />}
              title="Persistent profiles"
              body={
                <>
                  Import an account once and reuse it across the whole worker. Clone a prepared
                  profile per parallel worker for fast, isolated runs.
                </>
              }
            />
            <Feature
              icon={<IconCheck />}
              title="Drop-in Playwright"
              body={
                <>
                  It <em>is</em> Playwright. <code>createWalletTest()</code> returns a normal{' '}
                  <code>test</code> object, so every assertion, trace and reporter you already use
                  just works.
                </>
              }
            />
            <Feature
              icon={<IconDb />}
              title="One CLI for fixtures"
              body={
                <>
                  <code>npx chroma download-extensions</code> pulls pinned extension builds into{' '}
                  <code>.chroma/</code> — reproducible across machines and CI.
                </>
              }
            />
            <Feature
              icon={<IconImage />}
              title="Headless & Docker-ready"
              body={
                <>
                  Run headed locally to watch the flow, or headless in a container. A ready-made
                  Dockerfile runs the full matrix on CI.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* CODE SHOWCASE */}
      <section className="band soft">
        <div className="wrap show-grid">
          <div>
            <p className="eyebrow">From zero to signed tx</p>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,38px)', marginTop: 14 }}>
              A whole wallet flow, in a few lines.
            </h2>
            <p style={{ fontSize: 17, color: 'var(--ink-3)', marginTop: 14 }}>
              Declare the wallets you need, import an account, then walk the dApp exactly like a
              user.
            </p>
            <ul className="show-list">
              <li>
                <div className="n">1</div>
                <div>
                  <h4>Configure</h4>
                  <p>
                    Pass the wallets to <code>createWalletTest()</code> and get a typed{' '}
                    <code>test</code>.
                  </p>
                </div>
              </li>
              <li>
                <div className="n">2</div>
                <div>
                  <h4>Import</h4>
                  <p>Seed an account with a mnemonic — Chroma drives the extension's import flow.</p>
                </div>
              </li>
              <li>
                <div className="n">3</div>
                <div>
                  <h4>Authorize &amp; sign</h4>
                  <p>Connect to the dApp, then approve or reject the transaction popup.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="code-card">
            <div className="code-head">
              <div className="dots">
                <i />
                <i />
                <i />
              </div>
              <span className="fname">wallet.spec.ts</span>
              <div className="code-tabs">
                <button
                  type="button"
                  className={tab === 'pjs' ? 'active' : undefined}
                  onClick={() => setTab('pjs')}
                >
                  polkadot-js
                </button>
                <button
                  type="button"
                  className={tab === 'mm' ? 'active' : undefined}
                  onClick={() => setTab('mm')}
                >
                  metamask
                </button>
                <button
                  type="button"
                  className={tab === 'tal' ? 'active' : undefined}
                  onClick={() => setTab('tal')}
                >
                  talisman
                </button>
              </div>
            </div>
            {tab === 'pjs' && <PanelPolkadot />}
            {tab === 'mm' && <PanelMetamask />}
            {tab === 'tal' && <PanelTalisman />}
          </div>
        </div>
      </section>

      {/* SUPPORT MATRIX */}
      <section className="band">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Coverage</p>
            <h2>Wallets &amp; chains, accounted for.</h2>
            <p>
              The matrix grows with every release. Here's what ships in{' '}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>v1.0.1</span>.
            </p>
          </div>
          <div className="matrix">
            <div className="mtable">
              <div className="mh">Wallets</div>
              <div className="mrow">
                <span className="name">
                  <span className="mlogo" style={{ background: 'var(--polkadot)' }}>
                    P
                  </span>
                  Polkadot JS Extension
                </span>
                <span className="ver">
                  v0.62.6 · <span style={{ color: '#15803d' }}>supported</span>
                </span>
              </div>
              <div className="mrow">
                <span className="name">
                  <span className="mlogo" style={{ background: '#fd4848' }}>
                    T
                  </span>
                  Talisman
                </span>
                <span className="ver">
                  v3.1.13 · <span style={{ color: '#15803d' }}>supported</span>
                </span>
              </div>
              <div className="mrow">
                <span className="name">
                  <span className="mlogo" style={{ background: '#f6851b' }}>
                    M
                  </span>
                  MetaMask
                </span>
                <span className="ver">
                  v13.28.0 · <span style={{ color: '#15803d' }}>supported</span>
                </span>
              </div>
              <div className="mrow">
                <span className="name">
                  <span className="mlogo" style={{ background: '#7c4dff' }}>
                    S
                  </span>
                  SubWallet
                </span>
                <span className="ver">
                  <span style={{ color: 'var(--ink-4)' }}>planned</span>
                </span>
              </div>
            </div>
            <div className="mtable">
              <div className="mh">Chains</div>
              <div className="mrow">
                <span className="name">
                  <i
                    className="chain-dot"
                    style={{ background: 'var(--polkadot)', width: 11, height: 11 }}
                  />
                  Polkadot
                </span>
                <span className="badge ok">supported</span>
              </div>
              <div className="mrow">
                <span className="name">
                  <i
                    className="chain-dot"
                    style={{ background: 'var(--ethereum)', width: 11, height: 11 }}
                  />
                  Ethereum
                </span>
                <span className="badge ok">supported</span>
              </div>
              <div className="mrow">
                <span className="name">
                  <i
                    className="chain-dot"
                    style={{ background: 'var(--solana)', width: 11, height: 11 }}
                  />
                  Solana
                </span>
                <span className="badge ok">supported</span>
              </div>
              <div className="mrow" style={{ opacity: 0.6 }}>
                <span className="name">
                  <i
                    className="chain-dot"
                    style={{ background: 'var(--ink-4)', width: 11, height: 11 }}
                  />
                  More soon
                </span>
                <span className="badge soon">on the roadmap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band soft" style={{ background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="cta-band">
            <h2>Ship wallet features without the manual QA.</h2>
            <p>
              Install the package, download the extensions, write your first test in minutes.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary" to="/docs/$" params={{ _splat: '' }}>
                Get started
              </Link>
              <a
                className="btn btn-ghost"
                href="https://github.com/avalix-labs/chroma"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'transparent', color: '#fff', borderColor: '#44403c' }}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link className="brand" to="/">
              Chroma<span className="dot">_</span>
            </Link>
            <p>
              End-to-end testing for Polkadot, Ethereum &amp; Solana wallet interactions. Built on
              Playwright.
            </p>
          </div>
          <div>
            <h5>Docs</h5>
            <ul>
              <li>
                <Link to="/docs/$" params={{ _splat: '' }}>
                  Getting started
                </Link>
              </li>
              <li>
                <Link to="/docs/$" params={{ _splat: 'guides/testing-dapps' }}>
                  Writing tests
                </Link>
              </li>
              <li>
                <Link to="/docs/$" params={{ _splat: 'wallets/polkadot-js' }}>
                  Wallets
                </Link>
              </li>
              <li>
                <Link to="/docs/$" params={{ _splat: 'configuration' }}>
                  Configuration
                </Link>
              </li>
              <li>
                <Link to="/docs/$" params={{ _splat: 'quick-start' }}>
                  Quick start
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Project</h5>
            <ul>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <a href="https://github.com/avalix-labs/chroma" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/avalix-labs/chroma/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@avalix/chroma"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li>
                <a href="https://playwright.dev" target="_blank" rel="noopener noreferrer">
                  Playwright
                </a>
              </li>
              <li>
                <Link to="/docs/$" params={{ _splat: 'guides/docker' }}>
                  CI &amp; Docker
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/avalix-labs/chroma/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License (MIT)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Avalix Labs. Released under the MIT License.</span>
          <span className="mono">@avalix/chroma · v1.0.1</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="feat">
      <div className="ico">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/* ---------- Code panels ---------- */

function PanelPolkadot() {
  return (
    <pre className="code">
      <span className="k">import</span> {'{ createWalletTest }'} <span className="k">from</span>{' '}
      <span className="s">'@avalix/chroma'</span>
      {'\n\n'}
      <span className="k">const</span> <span className="f">test</span> <span className="d">=</span>{' '}
      <span className="f">createWalletTest</span>({'{'}
      {'\n  '}wallets: [{'{ '}type: <span className="s">'polkadot-js'</span>
      {' }'}],
      {'\n'}
      {'}'})
      {'\n\n'}
      <span className="f">test</span>(<span className="s">'connects and signs'</span>,{' '}
      <span className="k">async</span> ({'{ page, wallets }'}) <span className="d">=&gt;</span> {'{'}
      {'\n  '}
      <span className="k">const</span> pjs <span className="d">=</span> wallets[
      <span className="s">'polkadot-js'</span>]
      {'\n\n  '}
      <span className="k">await</span> pjs.<span className="f">importMnemonic</span>({'{'}
      {'\n    '}seed: <span className="s">'bottom drive obey lake curtain smoke...'</span>,
      {'\n  '}
      {'}'})
      {'\n\n  '}
      <span className="k">await</span> page.<span className="f">goto</span>(
      <span className="s">'http://localhost:3000'</span>)
      {'\n  '}
      <span className="k">await</span> pjs.<span className="f">authorize</span>(){'      '}
      <span className="c">// connect dApp</span>
      {'\n  '}
      <span className="k">await</span> pjs.<span className="f">approveTx</span>(){'      '}
      <span className="c">// sign the tx</span>
      {'\n'}
      {'}'})
    </pre>
  );
}

function PanelMetamask() {
  return (
    <pre className="code">
      <span className="k">import</span> {'{ createWalletTest }'} <span className="k">from</span>{' '}
      <span className="s">'@avalix/chroma'</span>
      {'\n\n'}
      <span className="k">const</span> <span className="f">test</span> <span className="d">=</span>{' '}
      <span className="f">createWalletTest</span>({'{'}
      {'\n  '}wallets: [{'{ '}type: <span className="s">'metamask'</span>
      {' }'}],
      {'\n'}
      {'}'})
      {'\n\n'}
      <span className="f">test</span>(<span className="s">'connects and signs'</span>,{' '}
      <span className="k">async</span> ({'{ page, wallets }'}) <span className="d">=&gt;</span> {'{'}
      {'\n  '}
      <span className="k">const</span> mm <span className="d">=</span> wallets.metamask
      {'\n\n  '}
      <span className="k">await</span> mm.<span className="f">importSeedPhrase</span>({'{'}
      {'\n    '}seedPhrase: <span className="s">'test test test ... junk'</span>,
      {'\n  '}
      {'}'})
      {'\n  '}
      <span className="k">await</span> mm.<span className="f">unlock</span>()
      {'\n\n  '}
      <span className="k">await</span> page.<span className="f">goto</span>(
      <span className="s">'http://localhost:3000'</span>)
      {'\n  '}
      <span className="k">await</span> mm.<span className="f">approve</span>(){'   '}
      <span className="c">// connect + confirm</span>
      {'\n'}
      {'}'})
    </pre>
  );
}

function PanelTalisman() {
  return (
    <pre className="code">
      <span className="k">import</span> {'{ createWalletTest }'} <span className="k">from</span>{' '}
      <span className="s">'@avalix/chroma'</span>
      {'\n\n'}
      <span className="k">const</span> <span className="f">test</span> <span className="d">=</span>{' '}
      <span className="f">createWalletTest</span>({'{'}
      {'\n  '}wallets: [{'{ '}type: <span className="s">'talisman'</span>
      {' }'}],
      {'\n'}
      {'}'})
      {'\n\n'}
      <span className="f">test</span>(<span className="s">'connects and signs'</span>,{' '}
      <span className="k">async</span> ({'{ page, wallets }'}) <span className="d">=&gt;</span> {'{'}
      {'\n  '}
      <span className="k">const</span> tal <span className="d">=</span> wallets.talisman
      {'\n\n  '}
      <span className="k">await</span> tal.<span className="f">importPolkadotMnemonic</span>({'{'}
      {'\n    '}seed: <span className="s">'bottom drive obey lake curtain...'</span>,
      {'\n    '}name: <span className="s">'Alice'</span>,
      {'\n  '}
      {'}'})
      {'\n\n  '}
      <span className="k">await</span> page.<span className="f">goto</span>(
      <span className="s">'http://localhost:3000'</span>)
      {'\n  '}
      <span className="k">await</span> tal.<span className="f">authorize</span>()
      {'\n  '}
      <span className="k">await</span> tal.<span className="f">approveTx</span>()
      {'\n'}
      {'}'})
    </pre>
  );
}

/* ---------- Icons ---------- */

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.58 0-.29-.01-1.04-.02-2.05-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.64.24 2.86.12 3.16.77.83 1.23 1.88 1.23 3.17 0 4.53-2.8 5.52-5.48 5.81.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .33.21.7.83.58A12.3 12.3 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function IconDb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 3 0 0 0 18 0 9 3 0 0 0-18 0Z" />
      <path d="M3 5a9 3 0 0 0 18 0M3 12a9 3 0 0 0 18 0M3 5v14a9 3 0 0 0 18 0V5" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.4 14.5 16 10 4 20" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
    </svg>
  );
}
