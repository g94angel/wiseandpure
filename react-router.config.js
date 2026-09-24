import { ALL_PATHS } from './src/config/site.js';

/**
 * The whole site is static marketing content -- no server-rendered data, no
 * server-only secrets in the page output -- so this ships as a fully static
 * build (ssr: false) with every route in ALL_PATHS pre-rendered to its own
 * HTML file. That's what makes each page (and each language) independently
 * indexable by search engines instead of living behind one client-rendered
 * shell.
 *
 * @type {import('@react-router/dev/config').Config}
 */
export default {
  appDirectory: 'src',
  ssr: false,
  prerender: ALL_PATHS,
  future: {
    v8_trailingSlashAwareDataRequests: true,
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
  },
};
