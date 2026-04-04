//import {reactRouterDevTools} from 'react-router-devtools';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
      '@mswjs/data',
      'accept-language-parser',
      'date-fns',
      'i18next',
      'i18next-browser-languagedetector',
      'ky',
      'lodash',
      'msw',
      'msw/browser',
      'nanoid',
      'query-string',
      'react-i18next',
      'remix-auth',
      'remix-auth-form',
      'remix-i18next/client',
      'remix-i18next/middleware',
      'remix-toast',
      'sonner',
      'spark-md5',
      'tailwind-merge',
      'zod',
    ],
  },
  plugins: [
    /* reactRouterDevTools(),*/
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    open: true,
  },
  ssr: {
    noExternal: ['lodash', '@fortawesome/react-fontawesome'],
  },
});
