'use client';

import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Scrolls to the element matching the URL hash after the page (and MDX content) has rendered.
 */
export function ScrollToHash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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

    if (scrollToElement()) return;

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
