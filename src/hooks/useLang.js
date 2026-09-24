import { useLocation } from 'react-router';
import { langFromPath } from '../config/site';

/**
 * Language is derived from the URL, not stored in state. A prerendered
 * /es/... page is Spanish on first paint with no client-side flip, and the
 * value stays correct across client-side navigation since useLocation
 * re-renders on every route change.
 */
export function useLang() {
  const { pathname } = useLocation();
  return langFromPath(pathname);
}
