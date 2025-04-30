//import {reactRouterDevTools} from 'react-router-devtools';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
  },
  plugins: [
    /* reactRouterDevTools(),*/
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    open: true,
  },
  ssr: {
    noExternal: ['lodash'],
    optimizeDeps: {
      include: ['lodash'],
    },
  },
});
