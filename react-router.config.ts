import type {Config} from '@react-router/dev/config';

export default {
  future: {
    unstable_middleware: true, // 👈 Enable middleware
  },
  ssr: true,
} satisfies Config;
