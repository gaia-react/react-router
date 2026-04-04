import tailwindcss from '@tailwindcss/vite';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    ssr: {
      noExternal: ['lodash', '@fortawesome/react-fontawesome'],
      optimizeDeps: {
        include: ['lodash'],
      },
    },
  };
});
