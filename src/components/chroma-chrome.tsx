import { Link } from '@tanstack/react-router';

/** Which top-level section is active, so its nav link is highlighted. */
export type ChromaSection = 'home' | 'docs' | 'blog';

/**
 * Shared top navigation for the chroma-themed marketing surfaces (landing +
 * blog). Rendered inside a `.chroma-home` wrapper so it picks up the scoped
 * design tokens from chroma-home.css.
 */
export function ChromaNav({ active = 'home' }: { active?: ChromaSection }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">
          Chroma<span className="dot">_</span>
        </Link>
        <div className="nav-links">
          <Link to="/docs/$" params={{ _splat: '' }} className={active === 'docs' ? 'active' : undefined}>
            Docs
          </Link>
          <Link to="/docs/$" params={{ _splat: 'quick-start' }}>
            Quick start
          </Link>
          <Link to="/blog" search={{}} className={active === 'blog' ? 'active' : undefined}>
            Blog
          </Link>
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
  );
}

/** Shared site footer for the chroma-themed surfaces. */
export function ChromaFooter() {
  return (
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
              <Link to="/blog" search={{}}>Blog</Link>
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
  );
}

export function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.58 0-.29-.01-1.04-.02-2.05-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.64.24 2.86.12 3.16.77.83 1.23 1.88 1.23 3.17 0 4.53-2.8 5.52-5.48 5.81.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .33.21.7.83.58A12.3 12.3 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}
