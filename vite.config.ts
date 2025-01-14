import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    server: {
      proxy: isDevelopment
        ? {
            '/api': {
              target: 'http://127.0.0.1:3000',
              changeOrigin: true,
              secure: false,
            },
            '/socket': {
              target: 'ws://127.0.0.1:3001',
              ws: true,
              rewriteWsOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'esbuild',
    },
  };
});
