import tailwindcss from '@tailwindcss/vite';
import {defineConfig, loadEnv} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({mode}) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [tailwindcss(), tsconfigPaths()],
    ssr: {
      noExternal: ['lodash', '@fortawesome/react-fontawesome'],
      optimizeDeps: {
        include: ['lodash'],
      },
    },
  };
});
