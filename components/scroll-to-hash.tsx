'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls to the element matching the URL hash after the page (and MDX content) has rendered.
 * Fixes Fumadocs/Next.js not scrolling to #anchor on initial load or client navigation.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash || hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));

    function scrollToElement() {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    }

    // Try immediately (e.g. client nav where content is already there)
    if (scrollToElement()) return;

    // Otherwise wait for MDX/content to render: short delays then give up
    const delays = [50, 150, 350];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((ms) => {
      const t = setTimeout(() => {
        if (scrollToElement()) {
          timeouts.forEach(clearTimeout);
        }
      }, ms);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [pathname]);

  return null;
}
